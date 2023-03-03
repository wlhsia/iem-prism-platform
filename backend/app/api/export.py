from flask import request
import pandas as pd

from . import api

@api.route('/export', methods=['POST'])
def export():
    df = pd.DataFrame(request.json)
    df = df.drop(['SoftStartTime', 'id'], axis=1)
    df.rename(columns = {'ModelState':'狀態', 'Software':'軟體別', 'Company':'公司', 'Division':'事業部', 'Factory':'生產廠', 'Area':'廠區別', 'ProcessType':'製程別' 
     , 'EquipmentID':'設備編號', 'EquipmentName':'設備名稱', 'ModelType':'模型類別', 'ModelName':'模型名稱', 'ModelID':'模型序號', 'SoftStart':'軟體啟動', 'SoftStopReason':'軟體未啟動原因'
     , 'SoftOtherReason':'其他說明', 'OAStart':'OA啟動', 'OAStopReason':'OA未啟動原因', 'OAOtherReason':'OA其他說明', 'SoftStartDays':'軟體啟動天數'}, inplace = True)
    temp = pd.DataFrame(columns=['狀態', '軟體別', '公司', '事業部', '生產廠', '廠區別', '製程別', '設備編號', '設備名稱', '模型類別', '模型名稱', '模型序號', '軟體啟動', '軟體未啟動原因', '其他說明', 'OA啟動', 'OA未啟動原因', 'OA其他說明', '軟體啟動天數'])
    df = pd.concat([temp, df], axis=0)
    df.to_csv('export.csv', index=False, encoding="utf_8_sig")
    f = open('export.csv', 'rb')
    return f.read()