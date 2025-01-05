
@echo off
yq -o=json "." schema-with.yaml > schema-with.json
yq -o=json "." schema-without.yaml > schema-without.json

@echo off
echo [SHOULD be VALID]
call ajv validate -s schema-with.json -d instance-1.json --spec=draft2019
echo [SHOULD be INDVALID]
call ajv validate -s schema-with.json -d instance-2.json --spec=draft2019
echo [SHOULD be VALID]
call ajv validate -s schema-without.json -d instance-1.json --spec=draft2019
echo [SHOULD be VALID]
call ajv validate -s schema-without.json -d instance-2.json --spec=draft2019