from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func, distinct, or_
from datetime import datetime

from app import db
from . import api
from ..models import Users, IEMModelsMap, IEMReservations, PRISMModelsMap, PRISMReservations, NBPRISMModelsMap, NBPRISMReservations

@api.route("/model_summary/<area>/<software>", methods=["GET"])
@jwt_required()
def model_summary(area, software):
    if area == 'tw':
        factory_map = {
            '化一部': ['ARO1', 'ARO2', 'ARO3'],
            '化二部': ['SM麥寮', 'PHENOL', 'SM海豐'],
            '化三部': ['麥寮PTA', 'HAC', '龍德PTA'],
            '塑膠部': ['PP', 'PC', '麥寮PABS', '新港PABS'],
            '工務部': ['新港公用', '龍德公用'],
        }
        if software == 'iEM':
            model = IEMModelsMap
            reservations = IEMReservations
        else:
            model = PRISMModelsMap
            reservations = PRISMReservations

    elif area == 'nb':
        factory_map = {
            '化一部': ['寧波MX廠'],
            '化二部': ['寧波苯酚廠'],
            '塑膠部': ['寧波PABS廠'],
            '工務部': ['寧波熱電廠'],
        }
        if software == 'iEM':
            pass
        else:
            model = NBPRISMModelsMap
            reservations = NBPRISMReservations

    username = get_jwt_identity()
    user = Users.query.filter(Users.Username==username).first()

    if user.IsAdmin:
        factory_map = factory_map
    else:
        factory_map = {user.Description: factory_map[user.Description]}

    result = {
        "data": [],
        "total": {
            '預定': 0,
            '實際': 0,
            '預完日': '2000/1/1',
            '軟體啟動': 0,
            '修模': 0,
            '定檢': 0,
            '配合產銷': 0,
            '異常檢修': 0,
            '保全/PI系統問題': 0,
            '其他': 0,
            '軟體未啟動原因': 0,
            '軟體未啟動原因未選擇': 0,
            'OA啟動': 0,
            '軟體未啟動': 0,
            '建模完成驗證中': 0,
            'OA其他': 0,
            'OA未啟動原因': 0,
            'OA未啟動原因未選擇': 0,
        },
    }

    for divsion, factories in factory_map.items():
        temp = []
        result['data'].append(
            {
                'division': divsion,
                'modelShowNumber': 0,
                'factories': [
                    {
                        'factory': factory,
                        'modolsShow': False,
                        'models': [
                            {
                                'type': "靜態模",
                            },
                            {
                                'type': "轉機模",
                            },
                            {
                                'type': "電儀模",
                            },
                            {
                                'type': "製程模",
                            },
                        ]
                    } for factory in factories
                ]
            }
        )

    for d in result['data']:
        for f in d['factories']:
            f['預定'] = reservations.query.filter(reservations.Type == 'model', reservations.Factory == f['factory']).first().ReservationModel
            result['total']['預定'] += f['預定'] 
            f['預完日'] = datetime.strftime(reservations.query.filter(reservations.Factory == f['factory']).first().ReservationTime, '%Y/%m/%d')
            if datetime.strptime(f['預完日'], "%Y/%m/%d") > datetime.strptime(result['total']['預完日'], "%Y/%m/%d"):
                result['total']['預完日'] = f['預完日']
            f.update({
                '實際': 0,
                '軟體啟動': 0,
                '修模': 0,
                '定檢': 0,
                '配合產銷': 0,
                '異常檢修': 0,
                '保全/PI系統問題': 0,
                '其他': 0,
                '軟體未啟動原因': 0,
                '軟體未啟動原因未選擇': 0,
                'OA啟動': 0,
                '軟體未啟動': 0,
                '建模完成驗證中': 0,
                'OA其他': 0,
                'OA未啟動原因': 0,
                'OA未啟動原因未選擇': 0
            })
            for row in model.query.filter(model.Factory==f['factory']).filter(or_(model.ModelType==None, model.ModelType=='')).all():
                f['實際'] += 1
                result['total']['實際'] += 1
                if row.SoftStart:
                    f['軟體啟動'] += 1
                    result['total']['軟體啟動'] += 1 
                else:
                    try:
                        f[row.SoftStopReason] += 1
                        result['total'][row.SoftStopReason] += 1
                        result['total']['軟體未啟動原因'] += 1
                    except:
                        f['軟體未啟動原因未選擇'] += 1
                        result['total']['軟體未啟動原因未選擇'] += 1
                        result['total']['軟體未啟動原因'] += 1
                if row.OAStart:
                    f['OA啟動'] += 1
                    result['total']['OA啟動'] += 1 
                else:
                    try:
                        if row.OAStopReason == '其他':
                            f['OA其他'] += 1
                            result['total']['OA其他'] += 1
                        else:
                            f[row.OAStopReason] += 1
                            result['total'][row.OAStopReason] += 1
                        result['total']['OA未啟動原因'] += 1
                    except:
                        f['OA未啟動原因未選擇'] += 1
                        result['total']['OA未啟動原因未選擇'] += 1
                        result['total']['OA未啟動原因'] += 1

            for m in f['models']:
                m.update({
                    '軟體啟動': 0,
                    '修模': 0,
                    '定檢': 0,
                    '配合產銷': 0,
                    '異常檢修': 0,
                    '保全/PI系統問題': 0,
                    '其他': 0,
                    '軟體未啟動原因': 0,
                    '軟體未啟動原因未選擇': 0,
                    'OA啟動': 0,
                    '軟體未啟動': 0,
                    '建模完成驗證中': 0,
                    'OA其他': 0,
                    'OA未啟動原因': 0,
                    'OA未啟動原因未選擇': 0
                }) 
                for row in model.query.filter(model.Factory==f['factory'], model.ModelType==m['type']).all():
                    f['實際'] += 1
                    result['total']['實際'] += 1
                    if row.SoftStart:
                        f['軟體啟動'] += 1
                        m['軟體啟動'] += 1
                        result['total']['軟體啟動'] += 1 
                    else:
                        try:
                            f[row.SoftStopReason] += 1
                            m[row.SoftStopReason] += 1
                            result['total'][row.SoftStopReason] += 1
                            result['total']['軟體未啟動原因'] += 1
                        except:
                            f['軟體未啟動原因未選擇'] += 1
                            m['軟體未啟動原因未選擇'] += 1
                            result['total']['軟體未啟動原因未選擇'] += 1
                            result['total']['軟體未啟動原因'] += 1
                    if row.OAStart:
                        f['OA啟動'] += 1
                        m['OA啟動'] += 1
                        result['total']['OA啟動'] += 1 
                    else:
                        try:
                            if row.OAStopReason == '其他':
                                f['OA其他'] += 1
                                m['OA其他'] += 1
                                result['total']['OA其他'] += 1
                            else:
                                f[row.OAStopReason] += 1
                                m[row.OAStopReason] += 1
                                result['total'][row.OAStopReason] += 1
                            result['total']['OA未啟動原因'] += 1
                        except:
                            f['OA未啟動原因未選擇'] += 1
                            m['OA未啟動原因未選擇'] += 1
                            result['total']['OA未啟動原因未選擇'] += 1
                            result['total']['OA未啟動原因'] += 1
   
    return jsonify(result)

@api.route("/equipment_summary/<area>/<software>", methods=["GET"])
@jwt_required()
def equipment_summary(area, software):
    if area == 'tw':
        factory_map = {
            '化一部': ['ARO1', 'ARO2', 'ARO3'],
            '化二部': ['SM麥寮', 'PHENOL', 'SM海豐'],
            '化三部': ['麥寮PTA', 'HAC', '龍德PTA'],
            '塑膠部': ['PP', 'PC', '麥寮PABS', '新港PABS'],
            '工務部': ['新港公用', '龍德公用'],
        }
        if software == 'iEM':
            model = IEMModelsMap
            reservations = IEMReservations
        else:
            model = PRISMModelsMap
            reservations = PRISMReservations
    elif area == 'nb':
        factory_map = {
            '化一部': ['寧波MX廠'],
            '化二部': ['寧波苯酚廠'],
            '塑膠部': ['寧波PABS廠'],
            '工務部': ['寧波熱電廠'],
        }
        if software == 'iEM':
            model = NBIEMModelsMap
            reservations = NBIEMReservations
        else:
            model = NBPRISMModelsMap
            reservations = NBPRISMReservations

    username = get_jwt_identity()
    user = Users.query.filter(Users.Username==username).first()

    if user.IsAdmin:
        factory_map = factory_map
    else:
        factory_map = {user.Description: factory_map[user.Description]}

    result = {
        "data": [],
        "total": {
            '預定': 0,
            '實際': 0,
            '預完日': '2000/1/1',
            '軟體啟動': 0,
            '修模': 0,
            '定檢': 0,
            '配合產銷': 0,
            '異常檢修': 0,
            '保全/PI系統問題': 0,
            '其他': 0,
            '軟體未啟動原因': 0,
            '軟體未啟動原因未選擇': 0,
            'OA啟動': 0,
            '軟體未啟動': 0,
            '建模完成驗證中': 0,
            'OA其他': 0,
            'OA未啟動原因': 0,
            'OA未啟動原因未選擇': 0,
        },
    }

    for divsion, factories in factory_map.items():
        temp = []
        result['data'].append(
            {
                'division': divsion,
                'modelShowNumber': 0,
                'factories': [
                    {
                        'factory': factory,
                        'modolsShow': False,
                        'models': [
                            {
                                'type': "靜態模",
                            },
                            {
                                'type': "轉機模",
                            },
                            {
                                'type': "電儀模",
                            },
                            {
                                'type': "製程模",
                            },
                        ]
                    } for factory in factories
                ]
            }
        )

    for d in result['data']:
        for f in d['factories']:
            f['預定'] = reservations.query.filter(reservations.Type == 'equipment', reservations.Factory == f['factory']).first().ReservationModel
            result['total']['預定'] += f['預定'] 
            f['預完日'] = datetime.strftime(reservations.query.filter(reservations.Factory == f['factory']).first().ReservationTime, '%Y/%m/%d')
            if datetime.strptime(f['預完日'], "%Y/%m/%d") > datetime.strptime(result['total']['預完日'], "%Y/%m/%d"):
                result['total']['預完日'] = f['預完日']
            f.update({
                '實際': 0,
                '軟體啟動': 0,
                '修模': 0,
                '定檢': 0,
                '配合產銷': 0,
                '異常檢修': 0,
                '保全/PI系統問題': 0,
                '其他': 0,
                '軟體未啟動原因': 0,
                '軟體未啟動原因未選擇': 0,
                'OA啟動': 0,
                '軟體未啟動': 0,
                '建模完成驗證中': 0,
                'OA其他': 0,
                'OA未啟動原因': 0,
                'OA未啟動原因未選擇': 0
            })
            equipment_id_temp = ''
            for row in model.query.filter(model.Factory==f['factory']).filter(or_(model.ModelType==None, model.ModelType=='')).order_by(model.EquipmentID.desc(), model.SoftStart.desc(), model.SoftStopReason.desc(), model.OAStart.desc(), model.OAStopReason.desc()).all():
                if row.EquipmentID != equipment_id_temp:
                    equipment_id_temp = row.EquipmentID
                    f['實際'] += 1
                    result['total']['實際'] += 1
                    if row.SoftStart:
                        f['軟體啟動'] += 1
                        result['total']['軟體啟動'] += 1 
                    else:
                        try:
                            f[row.SoftStopReason] += 1
                            result['total'][row.SoftStopReason] += 1
                            result['total']['軟體未啟動原因'] += 1
                        except:
                            f['軟體未啟動原因未選擇'] += 1
                            result['total']['軟體未啟動原因未選擇'] += 1
                            result['total']['軟體未啟動原因'] += 1
                    if row.OAStart:
                        f['OA啟動'] += 1
                        result['total']['OA啟動'] += 1 
                    else:
                        try:
                            if row.OAStopReason == '其他':
                                f['OA其他'] += 1
                                result['total']['OA其他'] += 1
                            else:
                                f[row.OAStopReason] += 1
                                result['total'][row.OAStopReason] += 1
                            result['total']['OA未啟動原因'] += 1
                        except:
                            f['OA未啟動原因未選擇'] += 1
                            result['total']['OA未啟動原因未選擇'] += 1
                            result['total']['OA未啟動原因'] += 1

            for m in f['models']:
                m.update({
                    '軟體啟動': 0,
                    '修模': 0,
                    '定檢': 0,
                    '配合產銷': 0,
                    '異常檢修': 0,
                    '保全/PI系統問題': 0,
                    '其他': 0,
                    '軟體未啟動原因': 0,
                    '軟體未啟動原因未選擇': 0,
                    'OA啟動': 0,
                    '軟體未啟動': 0,
                    '建模完成驗證中': 0,
                    'OA其他': 0,
                    'OA未啟動原因': 0,
                    'OA未啟動原因未選擇': 0
                })
                equipment_id_temp = ''
                for row in model.query.filter(model.Factory==f['factory'], model.ModelType==m['type']).order_by(model.EquipmentID.desc(), model.SoftStart.desc(), model.SoftStopReason.desc(), model.OAStart.desc(), model.OAStopReason.desc()).all():
                    if row.EquipmentID != equipment_id_temp:
                        equipment_id_temp = row.EquipmentID
                        f['實際'] += 1
                        result['total']['實際'] += 1
                        if row.SoftStart:
                            f['軟體啟動'] += 1
                            m['軟體啟動'] += 1
                            result['total']['軟體啟動'] += 1 
                        else:
                            try:
                                f[row.SoftStopReason] += 1
                                m[row.SoftStopReason] += 1
                                result['total'][row.SoftStopReason] += 1
                                result['total']['軟體未啟動原因'] += 1
                            except:
                                f['軟體未啟動原因未選擇'] += 1
                                m['軟體未啟動原因未選擇'] += 1
                                result['total']['軟體未啟動原因未選擇'] += 1
                                result['total']['軟體未啟動原因'] += 1
                        if row.OAStart:
                            f['OA啟動'] += 1
                            m['OA啟動'] += 1
                            result['total']['OA啟動'] += 1 
                        else:
                            try:
                                if row.OAStopReason == '其他':
                                    f['OA其他'] += 1
                                    m['OA其他'] += 1
                                    result['total']['OA其他'] += 1
                                else:
                                    f[row.OAStopReason] += 1
                                    m[row.OAStopReason] += 1
                                    result['total'][row.OAStopReason] += 1
                                result['total']['OA未啟動原因'] += 1
                            except:
                                f['OA未啟動原因未選擇'] += 1
                                m['OA未啟動原因未選擇'] += 1
                                result['total']['OA未啟動原因未選擇'] += 1
                                result['total']['OA未啟動原因'] += 1
   
    return jsonify(result)

@api.route("/reservations/<area>/<software>/<type>", methods=["PATCH"])
@jwt_required()
def reservations(area, software, type):
    if area == 'tw':
        if software == 'iEM':
            reservations = IEMReservations
        else:
            reservations = PRISMReservations
    elif area == 'nb':
        if software == 'iEM':
            pass
        else:
            reservations = NBPRISMReservations
    for d in request.json:
        for f in d['factories']:
            query = reservations.query.filter(reservations.Type==type, reservations.Factory==f['factory']).first()
            query.ReservationModel = f['預定']
            query.ReservationTime = f['預完日']
    db.session.commit()
    return 'success'
