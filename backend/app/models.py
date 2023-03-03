from app import db

## Platform
class Users(db.Model):
    __bind_key__ = 'platform'
    __tablename__ = 'Users'
    UserID = db.Column(db.Integer, primary_key=True) 
    Username = db.Column(db.Unicode(50))
    HashedPassword = db.Column(db.LargeBinary)
    IsAdmin = db.Column(db.Boolean)
    Description = db.Column(db.Unicode(50))

class ModelsMap(db.Model):
    __abstract__ = True
    ModelID = db.Column(db.Integer, primary_key=True)
    ModelState = db.Column(db.Integer)
    Software = db.Column(db.Unicode(50))
    Company = db.Column(db.Unicode(50))
    Division = db.Column(db.Unicode(50))
    Factory = db.Column(db.Unicode(50))
    Area = db.Column(db.Unicode(50))
    ProcessType = db.Column(db.Unicode(50))
    EquipmentID = db.Column(db.Unicode(50))
    EquipmentName = db.Column(db.Unicode(50))
    ModelType = db.Column(db.Unicode(50))
    ModelName = db.Column(db.Unicode(50))
    SoftStart = db.Column(db.Boolean)
    SoftStopReason = db.Column(db.Unicode(50))
    SoftOtherReason = db.Column(db.Unicode(50))
    SoftStartTime = db.Column(db.DateTime)
    SoftStartDays = db.Column(db.Integer)
    OAStart = db.Column(db.Boolean)
    OAStopReason = db.Column(db.Unicode(50))
    OAOtherReason = db.Column(db.Unicode(50))
class IEMModelsMap(ModelsMap):
    __bind_key__ = 'platform'
    __tablename__ = 'iEMModels'
class PRISMModelsMap(ModelsMap):
    __bind_key__ = 'platform'
    __tablename__ = 'PRiSMModels'
class NBPRISMModelsMap(ModelsMap):
    __bind_key__ = 'platform'
    __tablename__ = 'NBPRiSMModels'

class Reservations(db.Model):
    __abstract__ = True
    ReservationID = db.Column(db.Integer, primary_key=True)
    Type = db.Column(db.Unicode(50)) 
    Factory = db.Column(db.Unicode(50))
    ReservationModel = db.Column(db.Integer)
    ReservationTime = db.Column(db.DateTime)
class IEMReservations(Reservations):
    __bind_key__ = 'platform'
    __tablename__ = 'iEMReservations'
class PRISMReservations(Reservations):
    __bind_key__ = 'platform'
    __tablename__ = 'PRiSMReservations'
class NBPRISMReservations(Reservations):
    __bind_key__ = 'platform'
    __tablename__ = 'NBPRiSMReservations'

class Alarms(db.Model):
    __bind_key__ = 'platform'
    __tablename__ = 'Alarms'
    AlarmID = db.Column(db.Unicode(50), primary_key=True)
    Software = db.Column(db.Unicode(50), primary_key=True)
    ModelID = db.Column(db.Integer)
    AlarmTime = db.Column(db.DateTime)
    AlarmMessage = db.Column(db.Unicode(100))
    RelevantTag1 = db.Column(db.Unicode(100))
    RelevantTag2 = db.Column(db.Unicode(100))
    RelevantTag3 = db.Column(db.Unicode(100))
    AlarmSystemUrl = db.Column(db.Unicode(100))
    OtherUrl = db.Column(db.Unicode(100))
    ToERPTime = db.Column(db.DateTime)

## iEM
class IEMModels(db.Model):
    __bind_key__ = 'iem'
    __tablename__ = 'IEMModels'
    ModelID = db.Column(db.Integer, primary_key=True)
    ModelName = db.Column(db.Unicode(50))
    ModelDes = db.Column(db.Unicode(50))
    TreeNode = db.Column(db.Unicode(100))
    ModelType = db.Column(db.Unicode(50))
    RunMode = db.Column(db.Integer)

class IEMModelsState(db.Model):
    __bind_key__ = 'iem'
    __tablename__ = 'IEMModelsState'
    ModelStateID = db.Column(db.Integer, primary_key=True)
    ModelID = db.Column(db.Integer)
    ModelState = db.Column(db.Integer)

## PRiSM
class Project(db.Model):
    __bind_key__ = 'prism'
    __tablename__ = 'Projects'
    ProjectID = db.Column(db.Integer, primary_key=True)
    AssetID = db.Column(db.Integer)
    Name = db.Column(db.Unicode(50))
    DeployedProfileID = db.Column(db.Integer)
    LastDeployDate = db.Column(db.DateTime)

class ProjectPoints(db.Model):
    __bind_key__ = 'prism'
    __tablename__ = 'ProjectPoints'
    ProjectPointID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.Unicode(50))
    Description = db.Column(db.Unicode(100))

class AlarmProjectSummary(db.Model):
    __bind_key__ = 'prism'
    __tablename__ = 'AlarmProjectSummary'
    ProjectID = db.Column(db.Integer, primary_key=True)
    AlarmStateID = db.Column(db.Integer)
    WarningStateID = db.Column(db.Integer)  

class AlarmPointSummary(db.Model):
    __bind_key__ = 'prism'
    __tablename__ = 'AlarmPointSummary'
    ProjectPointID = db.Column(db.Integer, primary_key=True)
    ProjectID = db.Column(db.Integer)
    AlarmStateID = db.Column(db.Integer)
    AlarmTriggerValue = db.Column(db.Float)
    AlarmEntered = db.Column(db.DateTime)
    AlarmLatest = db.Column(db.DateTime)
    AlarmTotal = db.Column(db.Integer)

## ERP
class Equipment(db.Model):
    __bind_key__ = 'oracle_tw'
    __tablename__ = 'V4BKPME3'
    EQNO = db.Column(db.Unicode(50), primary_key=True)
    PMFCT = db.Column(db.Unicode(50))
    EQNM = db.Column(db.Unicode(50))
    MPZNM = db.Column(db.Unicode(50))

class ERPAlarmList(db.Model):
    __abstract__ = True
    CO = db.Column(db.Unicode(50))
    PMFCT = db.Column(db.Unicode(50))
    EQNO = db.Column(db.Unicode(50))
    ALMSOUR = db.Column(db.Unicode(50))
    ALMTM = db.Column(db.Integer)
    EQNM = db.Column(db.Unicode(50))
    ALMNO = db.Column(db.Unicode(50), primary_key=True)
    ALMMSG = db.Column(db.Unicode(100))
    ISPPT1 = db.Column(db.Unicode(100))
    ISPPT2 = db.Column(db.Unicode(100))
    ISPPT3 = db.Column(db.Unicode(100))
    ALMSYSURL = db.Column(db.Unicode(100))
    OTHURL = db.Column(db.Unicode(100))
class TWERPAlarmList(ERPAlarmList):
    __bind_key__ = 'oracle_tw'
    __tablename__ = 'T0NKPMGP'