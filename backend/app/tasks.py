
import os
from datetime import datetime, timedelta
import requests

from app import db, scheduler
from .models import *

factory_code_map = {
    'ARO1': 'H1',
    'ARO2': 'H2',
    'ARO3': 'H3',
    'SM麥寮': 'PM',
    'PHENOL': 'PH',
    'SM海豐': 'PN',
    '麥寮PTA': '82',
    'HAC': '11',
    '龍德PTA': '81',
    'PP': 'AP',
    'PC': 'B1',
    '麥寮PABS': 'A3',
    '新港PABS': 'A2',
    '新港公用': '45',
    '龍德公用': '44'
}

@scheduler.task('cron', id='iem_data_to_sql', hour='8, 12, 17')
def iem_data_to_sql():
    with scheduler.app.app_context():
        iem_models_map = IEMModelsMap.query.all()
        for iem_model_map in iem_models_map:
            iem_model = IEMModels.query.filter(IEMModels.ModelID == iem_model_map.ModelID).first()
            if iem_model is None or "TEST" in iem_model.ModelDes or "Test" in iem_model.ModelDes or "test" in iem_model.ModelDes:
                db.session.delete(iem_model_map)
        db.session.commit()
        iem_models = IEMModels.query.filter(IEMModels.ModelType == 'Model', IEMModels.TreeNode.like("AHM.%"), IEMModels.ModelDes.notlike("%TEST%"), IEMModels.ModelDes.notlike("%Test%"), IEMModels.ModelDes.notlike("%test%")).all()
        for iem_model in iem_models:
            model_state = IEMModelsState.query.filter(IEMModelsState.ModelID==iem_model.ModelID).first().ModelState
            tree_node = iem_model.TreeNode.split('.')
            try:
                division = tree_node[1]
                factory = tree_node[2]
                if division in ['化一部', '化二部', '化三部', '塑膠部', '工務部'] and factory in ['HM00', 'SM麥寮', 'PHENOL', 'SM海豐', '麥寮PTA', 'HAC', '龍德PTA', 'PP', 'PC', '麥寮PABS', '新港PABS', '新港公用', '龍德公用']:
                    if factory == 'HM00':
                        if tree_node[3] == 'H11':
                            factory = 'ARO1'
                        elif tree_node[3] == 'H21':
                            factory = 'ARO2'
                        elif tree_node[3] == 'H31':
                            factory = 'ARO3'
                    if factory == '寧波苯酚' or factory == '寧波PTA':
                        company = 'LD'
                    elif factory == 'HAC':
                        company = 'RV'
                    elif factory == '寧波熱電':
                        company = 'LC'
                    elif factory == '仁澤公用':
                        company = 'LE'
                    else:
                        company = '03'
                    if factory == '寧波苯酚' or factory == '寧波PTA' or factory == '寧波熱電':
                        area = '寧波'
                    elif factory == '新港PABS' or factory == '新港公用':
                        area = '新港'
                    elif factory == '龍德PTA' or factory == '龍德公用': 
                        area = '龍德'
                    elif factory == '仁澤公用':
                        area = '仁澤'
                    elif factory == 'ARO2' or factory == 'ARO3' or factory == 'SM海豐' or factory == 'PHENOL' or factory == 'PP':
                        area = '海豐'
                    else:
                        area = '麥寮'
                    if iem_model.RunMode == 2:
                        iem_model_map = IEMModelsMap(ModelID=iem_model.ModelID, ModelState=model_state, Software='iEM', Company=company, Division=division, Factory=factory, Area=area, EquipmentID=iem_model.ModelDes, ModelName=iem_model.ModelName, SoftStart=True, SoftStopReason='')
                        db.session.merge(iem_model_map)
                        iem_model_map = IEMModelsMap.query.filter(IEMModelsMap.ModelID == iem_model.ModelID).first()
                        if iem_model_map.SoftStartTime == datetime(1900, 1, 1) or iem_model_map.SoftStartTime is None:
                            iem_model_map.SoftStartTime = datetime.now()
                            iem_model_map.OAStart = True
                            iem_model_map.OAStopReason = ''
                    else:
                        iem_model_map = IEMModelsMap(ModelID=iem_model.ModelID, ModelState=model_state, Software='iEM', Company=company, Division=division, Factory=factory, Area=area, EquipmentID=iem_model.ModelDes, ModelName=iem_model.ModelName, SoftStart=False, SoftStartTime='', OAStart=False, OAStopReason='軟體未啟動')
                        db.session.merge(iem_model_map)
            except:
                continue
        db.session.commit()
        print(datetime.now(), ' iem_data_to_sql')
    return

def prism_data_to_sql():
    with scheduler.app.app_context():
        prism_models = PRISMModelsMap.query.all()
        for prism_model in prism_models:
            if Project.query.filter(Project.ProjectID == prism_model.ModelID).first() is None or Project.query.filter(Project.ProjectID == prism_model.ModelID).first().DeployedProfileID is None:
                db.session.delete(prism_model)
        db.session.commit()

        items = [
            {   
                'Factory': 'ARO1',
                'AssetID': [132, 146],
                'Company': '03',
                'Division': '化一部',
                'Area': '麥寮',
            },
            {   
                'Factory': 'ARO2',
                'AssetID': [120, 122, 121],
                'Company': '03',
                'Division': '化一部',
                'Area': '海豐',
            },
            {   
                'Factory': 'ARO3',
                'AssetID': [119, 116, 115],
                'Company': '03',
                'Division': '化一部',
                'Area': '海豐',
            },
            {   
                'Factory': 'SM麥寮',
                'AssetID': [137],
                'Company': '03',
                'Division': '化二部',
                'Area': '麥寮',
            },
            {   
                'Factory': 'PHENOL',
                'AssetID': [138],
                'Company': '03',
                'Division': '化二部',
                'Area': '海豐',
            },
            {   
                'Factory': 'SM海豐',
                'AssetID': [136],
                'Company': '03',
                'Division': '化二部',
                'Area': '海豐',
            },
            {   
                'Factory': '龍德PTA',
                'AssetID': [142, 141, 107],
                'Company': '03',
                'Division': '化三部',
                'Area': '龍德',
            },
            {   
                'Factory': '麥寮PTA',
                'AssetID': [143, 144, 117],
                'Company': '03',
                'Division': '化三部',
                'Area': '麥寮',
            },
            {   
                'Factory': 'PP',
                'AssetID': [109, 110],
                'Company': '03',
                'Division': '塑膠部',
                'Area': '海豐',
            },
        ]

        for item in items:
            projects = Project.query.filter(Project.AssetID.in_(item['AssetID'])).all()
            for project in projects:
                alarm_project_summary = AlarmProjectSummary.query.filter(AlarmProjectSummary.ProjectID==project.ProjectID).first()
                if alarm_project_summary is None:
                    model_state = 4
                else:
                    if alarm_project_summary.AlarmStateID == 1:
                        model_state = 5
                    elif alarm_project_summary.WarningStateID == 1:
                        model_state = 2
                    else:
                        model_state = 4
                
                if project.DeployedProfileID:
                    soft_start = True
                    soft_stop_reason = ''
                    soft_start_days = (datetime.now() - project.LastDeployDate).days
                    if soft_start_days >= 90:
                        oa_start = True
                    else:
                        oa_start = False
                    prism_model = PRISMModelsMap(ModelID=project.ProjectID, ModelState=model_state, Software='PRiSM', Company=item['Company'], Division=item['Division'], Factory=item['Factory'], Area=item['Area'], ModelType='', ModelName=project.Name, SoftStart=soft_start, SoftStopReason=soft_stop_reason, SoftStartTime=project.LastDeployDate, SoftStartDays=soft_start_days, OAStart=oa_start)
                    db.session.merge(prism_model)

        db.session.commit()
        print(datetime.now(), ' prism_data_to_sql')
    return

def get_equipment_name_and_process_type():
    with scheduler.app.app_context():
        models = IEMModelsMap.query.all()
        for model in models:
            try:
                equipment = Equipment.query.filter(Equipment.EQNO == model.EquipmentID, Equipment.PMFCT == factory_code_map[model.Factory]).first()
                model.ProcessType = equipment.MPZNM
                model.EquipmentName = equipment.EQNM
            except:
                # print(model.EquipmentID + ' pass')
                continue
        models = PRISMModelsMap.query.all()
        for model in models:
            try:
                equipment = Equipment.query.filter(Equipment.EQNO == model.EquipmentID, Equipment.PMFCT == factory_code_map[model.Factory]).first()
                model.ProcessType = equipment.MPZNM
                model.EquipmentName = equipment.EQNM
            except:
                continue
        db.session.commit()
        print(datetime.now(), ' get_equipment_name_and_process_type')
    return

def model_start_days_calculate():
    with scheduler.app.app_context():
        models = IEMModelsMap.query.all()
        for model in models:
            days = (datetime.now() - model.SoftStartTime).days
            if model.ModelType == "製程模":
                model.OAStart = False
                model.OAStopReason = '其他'
                model.OAOtherReason = '屬製程模'
            elif days >= 90:
                model.OAStart = True
                model.OAStopReason = ''
                model.OAOtherReason = ''
            if model.SoftStart:
                model.SoftStartDays = days
            else:
                model.SoftStartDays = None
                model.OAStart = False
                model.OAStopReason = '軟體未啟動'
            
        models = PRISMModelsMap.query.all()
        for model in models:
            days = (datetime.now() - model.SoftStartTime).days
            if model.ModelType == "製程模":
                model.OAStart = False
                model.OAStopReason = '其他'
                model.OAOtherReason = '屬製程模'
            elif days >= 90:
                model.OAStart = True
                model.OAStopReason = ''
                model.OAOtherReason = ''
            if model.SoftStart:
                model.SoftStartDays = days
            else:
                model.SoftStartDays = None
                model.OAStart = False
                model.OAStopReason = '軟體未啟動'
        db.session.commit()
        print(datetime.now(), ' model_start_days_calculate')
    return

def iem_alarm_to_sql():
    with scheduler.app.app_context():
        iem_ip = os.getenv('IEM_IP')
        now = datetime.now()
        today = datetime(now.year, now.month, now.day)
        yesterday = today - timedelta(days=1)
        alarms = requests.get(f"http://{iem_ip}/iemWebAPI/IEMeWarnings?startTime={yesterday.strftime('%Y/%m/%d')}&timeSort=asc").json()
        for alarm in alarms:
            uid = alarm['UID']
            model_id = alarm['AssetID']
            alarm_id = alarm['EWID']
            alarm_time = alarm['StartTime']
            base_hpi = requests.get(f"http://{iem_ip}/iemwebapi/IEMAssets/{model_id}/Details").json()['AssetHPIThr']
            alarm_details = requests.get(f"http://{iem_ip}/iemwebapi/IEMeWarnings/{uid}/Details").json()
            alarm_hpi = alarm_details['HPI']
            alarm_message = f"健康度值: {alarm_hpi}，健康度基準值: {base_hpi}，請確認設備是否異常徵兆"
            relevant_tags = []
            for index, relevant in enumerate(alarm_details['Relevants']):
                tag_id = relevant['TagID']
                tag_name = relevant['TagName']
                tag_data = requests.get(f"http://{iem_ip}/iemwebapi/IEMTags/{tag_id}/Value?time={alarm_time.replace(' ', '%20')}").json()
                try:
                    relevant_tags.append(f"關聯點tag{index+1}: {tag_name}，實測值: {tag_data['Actual']}，預測值: {tag_data['Expected']}")
                except:
                    relevant_tags.append(f"關聯點tag{index+1}: {tag_name}，實測值: Null，預測值: Null")

            url1 = f"http://10.110.59.126/iem/IEMModleState.aspx?modelid={model_id}"
            url2 = f"http://10.110.59.126/iem/IEMModelTreatment.aspx?modelid={model_id}&modelResultID={uid}"

            db.session.merge(Alarms(Software='iEM', AlarmID=alarm_id, ModelID=model_id, AlarmTime=datetime.strptime(alarm_time, '%Y-%m-%d %H:%M:%S'), 
                                    AlarmMessage=alarm_message, RelevantTag1=relevant_tags[0], RelevantTag2=relevant_tags[1], RelevantTag3=relevant_tags[2], 
                                    AlarmSystemUrl=url1, OtherUrl=url2))
        db.session.commit()
        print(datetime.now(), ' iem_alarm_to_sql')
    return

def prism_alarm_to_sql():
    with scheduler.app.app_context():
        now = datetime.now()
        today = datetime(now.year, now.month, now.day)
        yesterday = today - timedelta(days=1)
        aps = AlarmPointSummary.query.filter(AlarmPointSummary.AlarmEntered >= yesterday).all()
        for ap in aps:
            pjp = ProjectPoints.query.filter(ProjectPoints.ProjectPointID == ap.ProjectPointID, ProjectPoints.Name.like("%OMR")).first()
            if pjp is not None:
                model_id = ap.ProjectID
                alarm_id = f"{model_id}-{ap.AlarmTotal}"
                alarm_time = ap.AlarmEntered + timedelta(hours=8)
                alarm_message = f"{pjp.Description} = {ap.AlarmTriggerValue}, {alarm_time}"
                url = f"http://10.110.59.135/trending.html?projectids={model_id}#!/"
                db.session.merge(Alarms(Software='PRiSM', AlarmID=alarm_id, ModelID=model_id, AlarmTime=alarm_time, AlarmMessage=alarm_message, AlarmSystemUrl=url))
            else:
                continue
        db.session.commit()
        print(datetime.now(), ' prism_alarm_to_sql')
    return

def alarm_sql_to_erp():
    with scheduler.app.app_context():
        now = datetime.now()
        today = datetime(now.year, now.month, now.day)
        yesterday = today - timedelta(days=1)
        alarms = Alarms.query.filter(Alarms.AlarmTime >= yesterday).all()
        for alarm in alarms:
            if alarm.Software == 'iEM':
                model_map = IEMModelsMap.query.filter(IEMModelsMap.ModelID == alarm.ModelID).first()
            elif alarm.Software == 'PRiSM':
                model_map = PRISMModelsMap.query.filter(PRISMModelsMap.ModelID == alarm.ModelID).first()
            if model_map is not None and model_map.OAStart and model_map.EquipmentName is not None and model_map.EquipmentName != '':
                if TWERPAlarmList.query.filter(TWERPAlarmList.ALMNO == alarm.AlarmID).first() is None:
                    erp_alarm_time = int(alarm.AlarmTime.strftime("%Y%m%d%H%M%S")) - 19110000000000
                    db.session.merge(TWERPAlarmList(CO=model_map.Company, PMFCT=factory_code_map[model_map.Factory], EQNO=model_map.EquipmentID, ALMSOUR=f"{alarm.Software}-{alarm.ModelID}", 
                                                    ALMTM=erp_alarm_time, EQNM=model_map.EquipmentName, ALMNO=alarm.AlarmID, ALMMSG=alarm.AlarmMessage,
                                                    ISPPT1=alarm.RelevantTag1, ISPPT2=alarm.RelevantTag2, ISPPT3=alarm.RelevantTag3, 
                                                    ALMSYSURL=alarm.AlarmSystemUrl, OTHURL=alarm.OtherUrl))
                    alarm.ToERPTime = now
            else:
                continue
        db.session.commit()
        print(datetime.now(), ' alarm_sql_to_erp')
    return

@scheduler.task('cron', id='run_all', hour='0')
def run_all():
    iem_data_to_sql()
    prism_data_to_sql()
    get_equipment_name_and_process_type()
    model_start_days_calculate()
    iem_alarm_to_sql()
    prism_alarm_to_sql()
    alarm_sql_to_erp()
    return

iem_alarm_to_sql()
prism_alarm_to_sql()