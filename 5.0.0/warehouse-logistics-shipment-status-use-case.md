Copyright 2000 - 2026 the Confederation of European Paper Industries AISBL ("papiNet") the "Copyright Owner".
All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign.

# Logistics API Use Cases Version 5.0.0

## Context

This document describes logistics integration use cases supported by papiNet API version 5.0.0.

The use cases are designed primarily for:

- Forest Products
- Wood Supply
- Bioproducts
- Pulp
- Paper
- Board

The purpose of these use cases is to standardize communication between Suppliers and Logistics Suppliers involved in transportation, warehousing and inventory management.

## Simplification

For readability, the use cases only describe the key interactions between business parties.

The following assumptions are used:

- The Supplier is the owner of the goods.
- Logistics Suppliers are responsible for transportation, warehousing, or both.
- API communication occurs between a Logistics Supplier and the Supplier.
- Authentication is assumed to use OAuth 2.0 Client Credentials.
- PUT operations create new versions of business transactions.
- PATCH operations are not used.
- The Supplier remains the master owner of shared business transactions.

## Domain Name

papiNet recommends exposing API endpoints using:

```text
https://papinet.company.com
```

For example:

```text
https://papinet.acme.com
```

## Authentication

For authenticating Logistics Suppliers, papiNet recommends OAuth 2.0 with the Client Credentials grant.

Example:

```bash
POST /tokens
```

The response returns an access token used for subsequent API requests.

---

# UC1 Logistics Shipment Status

## Context

This use case covers shipment visibility and shipment status reporting.

Shipment information can be exchanged between Suppliers and Logistics Suppliers regardless of warehousing responsibilities.

## Common Business Rules

- PATCH shall not be used.
- PUT shall be used for shipment updates.
- The server stores all versions of the shipment transaction.
- Shipment identifiers remain stable throughout the shipment lifecycle.

---

## Scenario A: Logistics Supplier Responsible Only for Distribution

### Business Context

The Logistics Supplier is responsible only for transport execution.

The Supplier remains responsible for warehouse operations.

### Logistics Supplier Endpoints

```text
PUT /logistics-shipments/{logisticsShipmentId}
```

### Flow

1. A shipment is planned by the Supplier.
2. Transportation is executed by the Logistics Supplier.
3. Shipment status changes occur during transportation.
4. The Logistics Supplier updates shipment status.
5. The Supplier receives the updated shipment information.
6. Historical versions remain available.

### Typical Statuses

- Planned
- Confirmed
- Loaded
- Departed
- In Transit
- Arrived
- Delivered
- Cancelled

---

## Scenario B: Warehouse Logistics Supplier Requests Shipment Information

### Business Context

The Logistics Supplier is responsible only for warehousing.

Transportation is performed by another Logistics Supplier.

The Supplier receives transportation updates and makes them available to the warehouse operator.

### Logistics Supplier Endpoints

```text
GET /logistics-shipments
GET /logistics-shipments/{logisticsShipmentId}
```

### Flow

1. Transportation status updates are received by the Supplier.
2. Warehouse operators request shipment information.
3. Shipment status information is returned.
4. Warehouse planning activities are executed using available transport information.

---

## Scenario C: Logistics Supplier Responsible for Warehouse and Distribution

### Business Context

The same Logistics Supplier manages both transportation and warehousing.

### Logistics Supplier Endpoints

```text
PUT /logistics-shipments/{logisticsShipmentId}
```

### Flow

1. Goods are received into warehouse.
2. Shipment planning is performed.
3. Transportation is executed.
4. Shipment status changes are reported.
5. Updated shipment information remains available to the Supplier.

---

# UC2 Logistics Movement of Goods to a Logistics Warehouse

## Context

This use case covers movement of goods into warehouse locations.

The destination is always a warehouse operated by a Logistics Supplier.

---

## Scenario A: Mill to Logistics Warehouse

### Business Context

The Supplier is responsible for distribution.

Goods move from a mill to a warehouse.

This scenario originates from version 4.0.0.

### Endpoints

```text
GET /supplier-orders
GET /supplier-orders/{supplierOrderId}
GET /logistics-delivery-notes
GET /logistics-delivery-notes/{logisticsDeliveryNoteId}
PUT /logistics-goods-receipts/{logisticsGoodsReceiptId}
```

Shipment-related requests are covered in UC3.

### Flow

1. Warehouse operator requests active supplier orders.
2. Warehouse operator obtains order details.
3. Warehouse operator retrieves delivery notes.
4. Goods arrive at warehouse.
5. Warehouse operator performs unloading.
6. Goods receipt is created.
7. Variances are reported if applicable.
8. Inventory becomes available in warehouse.

---

## Scenario B: Warehouse to Warehouse (Two Logistics Suppliers)

### Business Context

Goods are transferred between two logistics warehouses.

#### Logistics Supplier A

Responsible for:

- Ship-from warehouse
- Transportation execution

#### Logistics Supplier B

Responsible for:

- Ship-to warehouse

### Logistics Supplier A Endpoints

```text
GET /logistics-delivery-instructions
GET /logistics-delivery-instructions/{logisticsDeliveryInstructionId}
PUT /logistics-delivery-notes/{logisticsDeliveryNoteId}
```

Shipment updates are covered by UC1.

### Logistics Supplier B Endpoints

```text
GET /supplier-orders
GET /supplier-orders/{supplierOrderId}
GET /logistics-delivery-notes
GET /logistics-delivery-notes/{logisticsDeliveryNoteId}
PUT /logistics-goods-receipts/{logisticsGoodsReceiptId}
```

Shipment requests are covered by UC1.

### Flow

1. Supplier issues delivery instruction.
2. Logistics Supplier A receives instruction.
3. Goods are loaded.
4. Delivery note is reported.
5. Shipment status is continuously updated.
6. Goods arrive at destination warehouse.
7. Logistics Supplier B receives delivery information.
8. Goods receipt is reported.
9. Inventory is updated.

---

## Scenario C: Warehouse to Warehouse (Three Logistics Suppliers)

### Business Context

Three logistics providers participate.

#### Logistics Supplier A

Responsible for transportation.

#### Logistics Supplier B

Responsible for ship-from warehouse.

#### Logistics Supplier C

Responsible for ship-to warehouse.

### Logistics Supplier A Endpoints

```text
GET /logistics-delivery-instructions
GET /logistics-delivery-instructions/{logisticsDeliveryInstructionId}
PUT /logistics-loading-instructions/{logisticsLoadingInstructionId}
GET /logistics-delivery-notes
GET /logistics-delivery-notes/{logisticsDeliveryNoteId}
```

### Logistics Supplier B Endpoints

```text
GET /logistics-loading-instructions
GET /logistics-loading-instructions/{logisticsLoadingInstructionId}
PUT /logistics-delivery-notes/{logisticsDeliveryNoteId}
```

### Logistics Supplier C Endpoints

```text
GET /supplier-orders
GET /supplier-orders/{supplierOrderId}
GET /logistics-delivery-notes
GET /logistics-delivery-notes/{logisticsDeliveryNoteId}
PUT /logistics-goods-receipts/{logisticsGoodsReceiptId}
```

### Flow

1. Supplier issues transportation requirement.
2. Logistics Supplier A coordinates transport.
3. Logistics Supplier B prepares loading.
4. Loading instruction is exchanged.
5. Delivery note is generated.
6. Shipment status is updated.
7. Logistics Supplier C receives shipment.
8. Goods receipt is reported.
9. Inventory becomes available in destination warehouse.

---

# UC3 Logistics Movement of Goods to a Logistics Ship-To Location

## Context

This use case covers outbound logistics from warehouse to final receiving locations.

The destination is a customer facility or other designated ship-to location.

---

## Scenario A: Single Logistics Supplier

### Business Context

The Logistics Supplier is responsible for both transportation and warehousing.

This scenario exists in version 4.0.0.

### Endpoints

```text
GET /logistics-delivery-instructions
GET /logistics-delivery-instructions/{logisticsDeliveryInstructionId}
PUT /logistics-delivery-notes/{logisticsDeliveryNoteId}
```

Shipment updates are covered by UC1.

### Flow

1. Delivery instruction is received.
2. Goods are picked from warehouse.
3. Loading is completed.
4. Delivery note is issued.
5. Shipment status is maintained.
6. Goods are delivered to final destination.

---

## Scenario B: Separate Transportation and Warehouse Providers

### Business Context

Two Logistics Suppliers participate.

#### Logistics Supplier A

Responsible for transportation.

#### Logistics Supplier B

Responsible for warehouse operations.

### Logistics Supplier A Endpoints

```text
GET /logistics-delivery-instructions
GET /logistics-delivery-instructions/{logisticsDeliveryInstructionId}
PUT /logistics-loading-instructions/{logisticsLoadingInstructionId}
GET /logistics-delivery-notes
GET /logistics-delivery-notes/{logisticsDeliveryNoteId}
```

### Logistics Supplier B Endpoints

```text
GET /logistics-loading-instructions
GET /logistics-loading-instructions/{logisticsLoadingInstructionId}
PUT /logistics-delivery-notes/{logisticsDeliveryNoteId}
```

### Flow

1. Delivery instruction is issued.
2. Warehouse operator prepares order.
3. Loading instruction is exchanged.
4. Goods are loaded.
5. Delivery note is generated.
6. Transportation provider executes delivery.
7. Shipment status is updated.
8. Goods reach final destination.

---

# Use Cases with Several Logistics Suppliers

## Context

All transactions are exchanged between the Supplier and individual Logistics Suppliers.

When information generated by one Logistics Supplier is required by another Logistics Supplier:

1. The Supplier receives the transaction.
2. The Supplier transforms the transaction.
3. The Supplier creates a new UUID.
4. The Supplier creates a new Supplier-assigned transaction number.
5. References to original transactions may be maintained.
6. End-to-end traceability remains possible.

## Example

A shipment created by Logistics Supplier A may be required by Logistics Supplier B.

The Supplier:

- Creates a new shipment transaction.
- Assigns a new UUID.
- Assigns a new business number.
- Maintains references to the originating shipment.

This enables tracking of a shipment throughout the entire supply chain.

---

# Transport Modes

The following transport modes should be supported:

- Road
- Rail
- Sea

Additional transport modes may be added where required.

---

# Open Questions

1. Are Road, Rail and Sea sufficient for version 5.0.0?
2. Are any additional transport modes required?
3. Are additional logistics scenarios required?
4. Are all practical logistics processes covered through combinations of UC2, UC3, UC4 and UC5?