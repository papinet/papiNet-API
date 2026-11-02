Copyright 2000 - 2026 the Confederation of European Paper Industries AISBL ("papiNet") the "Copyright Owner".
All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign.

# UC3 Logistics Shipment Status

## Context

This document describes logistics integration use cases supported by papiNet API version 5.0.0.

The use cases are designed primarily for:

- Forest Products
- Wood Supply
- Bioproducts
- Pulp
- Paper
- Board

The purpose of these use cases is to standardize communication between _suppliers_ and _logistics suppliers_ involved in transportation, warehousing and inventory management.

## Simplification

For readability, the use cases only describe the key interactions between business parties.

The following assumptions are used:

- The _supplier_ is the owner of the goods.
- _Logistics supplier_ are responsible for transportation, warehousing, or both.
- API communication occurs between a _logistics supplier_ and the _supplier_.
- Authentication is assumed to use OAuth 2.0 Client Credentials.
- PATCH operations are not used.
- The _supplier_ remains the master owner of shared business transactions.

## Domain Name

papiNet suggests that the _supplier_ (as well as the _logistics supplier_ if it uses the notification mechanism) exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _supplier_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

## Notifications

In order to get updated information on _shipment status_ the _logistics suppliers_ have to call API endpoints of the _supplier_. As the _logistics suppliers_ do not know when these informations are getting updated, they should normally poll these API endpoints on a regular basis.

This polling mechanism is not optimal from an IT resources point of view, that's why papiNet recommends the usage of notifications from the _logistics suppliers_ to the _supplier_. However, as the usage of these notifications would require additional investment on the _logistics supplier_ side, they remain an optional optimization.

For the implementation of these notifications, papiNet recommends to use the [CloudEvents](https://cloudevents.io/) specification, which is a vendor-neutral specification for defining the format of event data. In order to ensure the decoupling between this notification mechanism and the papiNet API, papiNet will use the CloudEvents specification following the **_thin event_** pattern. (...)

## papiNet Stub Service

A Standalone Pact Stub Server can be downloaded from [Standalone Pact Stub Server](https://github.com/pact-foundation/pact-stub-server).
You can run locally the papiNet stub service using the following command:

```text
pact-stub-server --file ./stub/papiNet.PACT.json --port 3040 --provider-state-header-name X-Provider-State
```

## Authentication

For authenticating the _logistics supplier_, papiNet recommends to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _logistics supplier_ sends an API request to create a session, and gets its associated _access token_:

```text
curl --request POST \
  --url 'http://localhost:3040/tokens' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _logistics supplier_ will receive a response like this:

```json
{ 
  "access_token": "3e36bcb1-248b-436b-bdf1-4ff735f03000",
  "token_type": "bearer",
  "expires_in_": 86400
}
```

## Scenarios 

This use case covers shipment visibility and shipment status reporting.

**Scenario A:**  _Logistics supplier_ is responsible only for distributing the products.
_Logistics supplier_ endpoints
  * `PUT /logistics-shipments/{logisticsShipmentId}`

**Scenario B:**  _Logistics supplier_ is responsible for only a warehouse. _Logistics supplier_ can request logistics-shipments from the _supplier_. The _supplier_ has received logistics-shipments from the _logistics supplier_ responsible for distributing the product.
_Logistics supplier_ endpoints
  * `GET /logistics-shipments`
  * `GET /logistics-shipments/{logisticsShipmentId}`

**Scenario C:**  _Logistics supplier_ is responsible for both distributing the products and the warehouse.
_Logistics supplier_ endpoints
  * `PUT /logistics-shipments/{logisticsShipmentId}`


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
