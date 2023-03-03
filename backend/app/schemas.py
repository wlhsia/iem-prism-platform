from app import ma

class UserSchema(ma.Schema):
    class Meta:
        fields = (
            "Username",
            "IsAdmin",
            "Description",
        )

class ModelSchema(ma.Schema):
    class Meta:
        fields = (
        "ModelID",
        "ModelState",
        "Software",
        "Company",
        "Division",
        "Factory",
        "Area",
        "ProcessType",
        "EquipmentID",
        "EquipmentName",
        "ModelType",
        "ModelName",
        "SoftStart",
        "SoftStopReason",
        "SoftOtherReason",
        "SoftStartTime",
        "SoftStartDays",
        "OAStart",
        "OAStopReason",
        "OAOtherReason",
        )

user_schema = UserSchema()
model_schema = ModelSchema()
models_schema = ModelSchema(many=True)