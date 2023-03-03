from flask import request, jsonify
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

from app import db
from . import api
from ..models import *
from ..schemas import models_schema

@api.route("/models", methods=["POST"])
@jwt_required()
def models():
    username = get_jwt_identity()
    user = Users.query.filter(Users.Username==username).first()
    try:
        print(request.json)
        area = request.json['area']
        if area == 'tw':
            all_divsion = ['化一部', '化二部', '化三部', '塑膠部', '工務部']
            all_factory = {
                'all': ['ARO1', 'ARO2', 'ARO3', 'SM麥寮', 'PHENOL', 'SM海豐', '麥寮PTA', 'HAC', '龍德PTA', 'PP', 'PC', '麥寮PABS', '新港PABS', '新港公用', '龍德公用'],
                '化一部': ['ARO1', 'ARO2', 'ARO3'], 
                '化二部': ['SM麥寮', 'PHENOL', 'SM海豐'], 
                '化三部': ['麥寮PTA', 'HAC', '龍德PTA'],
                '塑膠部': ['PP', 'PC', '麥寮PABS', '新港PABS'],
                '工務部': ['新港公用', '龍德公用'], 
            }
        elif area == 'nb':
            all_divsion = ['化一部', '化二部', '塑膠部', '工務部']
            all_factory = {
                'all': ['寧波MX廠', '寧波苯酚廠', '寧波PABS廠', '寧波熱電廠'],
                '化一部': ['寧波MX廠'], 
                '化二部': ['寧波苯酚廠'], 
                '塑膠部': ['寧波PABS廠'],
                '工務部': ['寧波熱電廠'], 
            }

        software = request.json['software']

        if user.IsAdmin:
            division = request.json['division']
        else:
            division = user.Description
        factory = request.json['factory']

        model_type = request.json['modelType']

        if request.json['softStart'] == 'pass':
            soft_start = 'pass'
        elif request.json['softStart'] == 'true':
            soft_start = True
        else:
            soft_start = False

        soft_stop_reason = request.json['softStopReason']

        if request.json['oaStart'] == 'true':
            oa_start = True
        else:
            oa_start = False

        oa_stop_reason = request.json['oaStopReason']

    except:
        pass

    if software == 'all':
        if area == 'tw':
            iem_models_filter = IEMModelsMap.query
            prism_models_filter = PRISMModelsMap.query
            try:
                if division == 'all':
                    iem_models_filter = iem_models_filter.filter(IEMModelsMap.Division.in_(all_divsion))
                    prism_models_filter = prism_models_filter.filter(PRISMModelsMap.Division.in_(all_divsion))
                else: 
                    iem_models_filter = iem_models_filter.filter(IEMModelsMap.Division==division)
                    prism_models_filter = prism_models_filter.filter(PRISMModelsMap.Division==division)
                
                if factory == 'all':
                    iem_models_filter = iem_models_filter.filter(IEMModelsMap.Factory.in_(all_factory[division]))
                    prism_models_filter = prism_models_filter.filter(PRISMModelsMap.Factory.in_(all_factory[division]))
                else: 
                    iem_models_filter = iem_models_filter.filter(IEMModelsMap.Factory==factory)
                    prism_models_filter = prism_models_filter.filter(PRISMModelsMap.Factory==factory)
            except:
                pass
            finally:
                iem_models = iem_models_filter.all()
                prism_models = prism_models_filter.all()
                models = models_schema.dump(iem_models) + models_schema.dump(prism_models)

        elif area == 'nb':
            prism_models_filter = NBPRISMModelsMap.query
            try:
                if division == 'all':
                    prism_models_filter = prism_models_filter.filter(NBPRISMModelsMap.Division.in_(all_divsion))
                else: 
                    prism_models_filter = prism_models_filter.filter(NBPRISMModelsMap.Division==division)
                
                if factory == 'all':
                    prism_models_filter = prism_models_filter.filter(NBPRISMModelsMap.Factory.in_(all_factory[division]))
                else: 
                    prism_models_filter = prism_models_filter.filter(NBPRISMModelsMap.Factory==factory)
            except:
                pass
            finally:
                prism_models = prism_models_filter.all()
                models = models_schema.dump(prism_models)

    else:
        if software == 'iEM':
            if area == 'tw':
                model_map = IEMModelsMap
            elif area == 'nb':
                pass
            models_filter = model_map.query
        elif software == 'PRiSM':
            if area == 'tw':
                model_map = PRISMModelsMap
            elif area == 'nb':
                model_map = NBPRISMModelsMap
            models_filter = model_map.query
        try:
            if division == 'all':
                models_filter = models_filter.filter(model_map.Division.in_(all_divsion))
            else:
                models_filter = models_filter.filter(model_map.Division==division)

            if factory == 'all':
                models_filter = models_filter.filter(model_map.Factory.in_(all_factory[division]))
            elif factory == 'pass':
                pass
            else:
                models_filter = models_filter.filter(model_map.Factory==factory)
            
            if model_type == 'all':
                models_filter = models_filter.filter(model_map.ModelType.in_(['靜態模', '轉機模', '電儀模', '製程模']))
            elif model_type == 'pass':
                pass
            else:
                models_filter = models_filter.filter(model_map.ModelType==model_type)
            
            if soft_start == 'pass':
                pass
            else:
                models_filter = models_filter.filter(model_map.SoftStart==soft_start)

            if soft_stop_reason == ' ':
                models_filter = models_filter.filter(or_(model_map.SoftStopReason==None, model_map.SoftStopReason==''))
            elif soft_stop_reason == 'pass':
                pass
            else:
                models_filter = models_filter.filter(model_map.SoftStopReason==soft_stop_reason)

            models_filter = models_filter.filter(model_map.OAStart==oa_start)

            if oa_stop_reason == ' ':
                models_filter = models_filter.filter(or_(model_map.OAStopReason==None, model_map.OAStopReason==''))
            else:
                models_filter = models_filter.filter(model_map.OAStopReason==oa_stop_reason)

        except:
            pass
        finally:
            models = models_filter.all()
            models = models_schema.dump(models)

    oa_num = 0
    oa_start_num = 0
    oa_stop_num = 0
    for model in models:
        model['id'] = model['ModelID']
        oa_num += 1
        if model['OAStart']:
            oa_start_num += 1
        else:
            oa_stop_num += 1

    return jsonify({'models': models, 'oaNum': oa_num, 'oaStartNum': oa_start_num, 'oaStopNum': oa_stop_num})

@api.route("/models/<area>/<model_id>", methods=["PATCH"])
@jwt_required()
def model_update(area, model_id):
    if area == 'tw':
        if request.json['Software'] == 'iEM':
            model_map = IEMModelsMap.query.get_or_404(model_id)
            if request.json['OAStart']:
                oa_start = True
                if request.json['ModelType'] == '製程模':
                    oa_start = False
            else:
                oa_start = False
        else:
            model_map = PRISMModelsMap.query.get_or_404(model_id)
            oa_start = request.json['OAStart']
            if request.json['OAStart'] == '製程模':
                oa_start = False
    elif area == 'nb':
        model_map = NBPRISMModelsMap.query.get_or_404(model_id)
    model_map.EquipmentID = request.json['EquipmentID']
    model_map.ModelType = request.json['ModelType']
    model_map.SoftStopReason = request.json['SoftStopReason']
    model_map.SoftOtherReason = request.json['SoftOtherReason']
    model_map.OAStart = oa_start
    model_map.OAStopReason = request.json['OAStopReason']
    model_map.OAOtherReason = request.json['OAOtherReason']
    db.session.commit()
    return model_id