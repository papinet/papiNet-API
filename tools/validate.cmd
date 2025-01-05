@echo off

rem -------------------------------------------------------------------
rem GW01&BW01.get-supplier-orders.response.json ~ ListOfSupplierOrders

yq "{ \"components\": { \"schemas\": { \"PaginationLinks\": .components.schemas.PaginationLinks, \"PaperAndBoard\": .components.schemas.PaperAndBoard, \"Pulp\": .components.schemas.Pulp } } }" "..\3.0.0\papiNet-API.yaml" > ListOfSupplierOrders.schema.yaml

yq ".components.schemas.ListOfSupplierOrders" "..\3.0.0\papiNet-API.yaml" >> ListOfSupplierOrders.schema.yaml

PowerShell -Command "(Get-Content ListOfSupplierOrders.schema.yaml) -replace '#/components/schemas/ListOfSupplierOrders/', '#/' | Out-File ListOfSupplierOrders.schema.yaml"

yq -o=json "." ListOfSupplierOrders.schema.yaml > ListOfSupplierOrders.schema.json

call ajv validate -s ListOfSupplierOrders.schema.json -d "..\3.0.0\mock\GW01&BW01.get-supplier-orders.response.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem GW02&BW02.get-supplier-orders-supplierOrderId.response.json ~ SupplierOrderById

yq "{ \"components\": { \"schemas\": { \"PaginationLinks\": .components.schemas.PaginationLinks, \"PaperAndBoard\": .components.schemas.PaperAndBoard, \"Pulp\": .components.schemas.Pulp } } }" "..\3.0.0\papiNet-API.yaml" > SupplierOrderById.schema.yaml

yq ".components.schemas.SupplierOrderById" "..\3.0.0\papiNet-API.yaml" >> SupplierOrderById.schema.yaml

PowerShell -Command "(Get-Content SupplierOrderById.schema.yaml) -replace '#/components/schemas/SupplierOrderById/', '#/' | Out-File SupplierOrderById.schema.yaml"

yq -o=json "." SupplierOrderById.schema.yaml > SupplierOrderById.schema.json

call ajv validate -s SupplierOrderById.schema.json -d "..\3.0.0\mock\GW02&BW02.get-supplier-orders-supplierOrderId.response.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem GW03&BW03.get-logistic-delivery-notes.response.json ~ ListOfLogisticsDeliveryNotes

yq "{ \"components\": { \"schemas\": { \"PaginationLinks\": .components.schemas.PaginationLinks, \"PaperAndBoard\": .components.schemas.PaperAndBoard, \"Pulp\": .components.schemas.Pulp } } }" "..\3.0.0\papiNet-API.yaml" > ListOfLogisticsDeliveryNotes.schema.yaml

yq ".components.schemas.ListOfLogisticsDeliveryNotes" "..\3.0.0\papiNet-API.yaml" >> ListOfLogisticsDeliveryNotes.schema.yaml

PowerShell -Command "(Get-Content ListOfLogisticsDeliveryNotes.schema.yaml) -replace '#/components/schemas/ListOfLogisticsDeliveryNotes/', '#/' | Out-File ListOfLogisticsDeliveryNotes.schema.yaml"

yq -o=json "." ListOfLogisticsDeliveryNotes.schema.yaml > ListOfLogisticsDeliveryNotes.schema.json

call ajv validate -s ListOfLogisticsDeliveryNotes.schema.json -d "..\3.0.0\mock\GW03&BW03.get-logistic-delivery-notes.response.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem GW04&BW04.get-logistic-delivery-notes-logisticDeliveryNoteId.response.json ~ LogisticsDeliveryNoteById

yq "{ \"components\": { \"schemas\": { \"PaginationLinks\": .components.schemas.PaginationLinks, \"PaperAndBoard\": .components.schemas.PaperAndBoard, \"Pulp\": .components.schemas.Pulp } } }" "..\3.0.0\papiNet-API.yaml" > LogisticsDeliveryNoteById.schema.yaml

yq ".components.schemas.LogisticsDeliveryNoteById" "..\3.0.0\papiNet-API.yaml" >> LogisticsDeliveryNoteById.schema.yaml

PowerShell -Command "(Get-Content LogisticsDeliveryNoteById.schema.yaml) -replace '#/components/schemas/LogisticsDeliveryNoteById/', '#/' | Out-File LogisticsDeliveryNoteById.schema.yaml"

yq -o=json "." LogisticsDeliveryNoteById.schema.yaml > LogisticsDeliveryNoteById.schema.json

call ajv validate -s LogisticsDeliveryNoteById.schema.json -d "..\3.0.0\mock\GW04&BW04.get-logistic-delivery-notes-logisticDeliveryNoteId.response.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem GW05&BW05.post-logistic-goods-receipts.request.json ~ LogisticsGoodsReceiptById

yq "{ \"components\": { \"schemas\": { \"PaginationLinks\": .components.schemas.PaginationLinks, \"PaperAndBoard\": .components.schemas.PaperAndBoard, \"Pulp\": .components.schemas.Pulp } } }" "..\3.0.0\papiNet-API.yaml" > LogisticsGoodsReceiptById.schema.yaml

yq ".components.schemas.LogisticsGoodsReceiptById" "..\3.0.0\papiNet-API.yaml" >> LogisticsGoodsReceiptById.schema.yaml

PowerShell -Command "(Get-Content LogisticsGoodsReceiptById.schema.yaml) -replace '#/components/schemas/LogisticsGoodsReceiptById/', '#/' | Out-File LogisticsGoodsReceiptById.schema.yaml"

yq -o=json "." LogisticsGoodsReceiptById.schema.yaml > LogisticsGoodsReceiptById.schema.json

call ajv validate -s LogisticsGoodsReceiptById.schema.json -d "..\3.0.0\mock\GW05&BW05.post-logistic-goods-receipts.request.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem BW06.put-logistic-goods-receipts-logisticGoodReceiptId.request.json ~ LogisticsGoodsReceiptById

call ajv validate -s LogisticsGoodsReceiptById.schema.json -d "..\3.0.0\mock\BW06.put-logistic-goods-receipts-logisticGoodReceiptId.request.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem GW06&BW07.get-delivery-instructions.response.json ~ ListOfDeliveryInstructions

yq "{ \"components\": { \"schemas\": { \"PaginationLinks\": .components.schemas.PaginationLinks, \"PaperAndBoard\": .components.schemas.PaperAndBoard, \"Pulp\": .components.schemas.Pulp } } }" "..\3.0.0\papiNet-API.yaml" > ListOfDeliveryInstructions.schema.yaml

yq ".components.schemas.ListOfDeliveryInstructions" "..\3.0.0\papiNet-API.yaml" >> ListOfDeliveryInstructions.schema.yaml

PowerShell -Command "(Get-Content ListOfDeliveryInstructions.schema.yaml) -replace '#/components/schemas/ListOfDeliveryInstructions/', '#/' | Out-File ListOfDeliveryInstructions.schema.yaml"

yq -o=json "." ListOfDeliveryInstructions.schema.yaml > ListOfDeliveryInstructions.schema.json

call ajv validate -s ListOfDeliveryInstructions.schema.json -d "..\3.0.0\mock\GW06&BW07.get-delivery-instructions.response.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem GW07.get-delivery-instructions-deliveryInstructionId.response.json ~ DeliveryInstructionById

yq "{ \"components\": { \"schemas\": { \"PaginationLinks\": .components.schemas.PaginationLinks, \"PaperAndBoard\": .components.schemas.PaperAndBoard, \"Pulp\": .components.schemas.Pulp } } }" "..\3.0.0\papiNet-API.yaml" > DeliveryInstructionById.schema.yaml

yq ".components.schemas.DeliveryInstructionById" "..\3.0.0\papiNet-API.yaml" >> DeliveryInstructionById.schema.yaml

PowerShell -Command "(Get-Content DeliveryInstructionById.schema.yaml) -replace '#/components/schemas/DeliveryInstructionById/', '#/' | Out-File DeliveryInstructionById.schema.yaml"

yq -o=json "." DeliveryInstructionById.schema.yaml > DeliveryInstructionById.schema.json

call ajv validate -s DeliveryInstructionById.schema.json -d "..\3.0.0\mock\GW07.get-delivery-instructions-deliveryInstructionId.response.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem BW08.get-delivery-instructions-deliveryInstructionId.response.json ~ DeliveryInstructionById

call ajv validate -s DeliveryInstructionById.schema.json -d "..\3.0.0\mock\BW08.get-delivery-instructions-deliveryInstructionId.response.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem GW08.post-logistic-delivery-notes.request.json ~ DeliveryInstructionById

call ajv validate -s LogisticsDeliveryNoteById.schema.json -d "..\3.0.0\mock\GW08.post-logistic-delivery-notes.request.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem BW09.post-logistic-delivery-notes.request.json ~ DeliveryInstructionById

call ajv validate -s LogisticsDeliveryNoteById.schema.json -d "..\3.0.0\mock\BW09.post-logistic-delivery-notes.request.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off

rem -------------------------------------------------------------------
rem BW10.put-logistic-delivery-notes-logisticDeliveryNoteId.request.json ~ DeliveryInstructionById

call ajv validate -s LogisticsDeliveryNoteById.schema.json -d "..\3.0.0\mock\BW10.put-logistic-delivery-notes-logisticDeliveryNoteId.request.json" --strict=false -c ajv-formats --verbose --spec=draft2019
@echo on
@echo off
