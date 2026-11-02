Copyright 2000 - 2026 the Confederation of European Paper Industries AISBL ("papiNet") the "Copyright Owner".
All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign.

# UC5 Logistics movement of goods to a logistics ship to location

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
- The _logistics_supplier_ is responsible for distributing the products
- _Logistics supplier_ is responsible for the ship to warehouse.
- API communication occurs between a _logistics supplier_ and the _supplier_.
- Authentication is assumed to use OAuth 2.0 Client Credentials.
- PATCH operations are not used.
- The _supplier_ remains the master owner of shared business transactions.

## Domain Name

papiNet suggests that the _supplier_ (as well as the _logistics supplier_ if it uses the notification mechanism) exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _supplier_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

## Notifications

In order to get updated information on _supplier orders_, _logistics delivery notes_, _logistics_loading_instructions_ and _logistics_delivery_instructions_ the _logistics suppliers_ have to call API endpoints of the _supplier_. As the _logistics suppliers_ do not know when these informations are getting updated, they should normally poll these API endpoints on a regular basis.

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


**Scenario A:** _Logistics supplier_ is responsible for the ship to warehouse and distribution of the products.

_Logistics supplier_ endpoints

  * `GET /logistics-delivery-instructions`
  * `GET /logistics-delivery-instructions/{logisticsDeliveryInstructionId}`
  * `PUT /logistics-delivery-notes/{logisticsDeliveryNoteId}`
  * `PUT /logistics-shipments/{logisticsShipmentId}`

**Scenario B:**  _Logistics supplier_ A is responsible for distributing the products.
_Logistics supplier_ B is responsible for the warehouse.


_Logistics supplier_ A endpoints
  * `GET /logistics-delivery-instructions`
  * `GET /logistics-delivery-instructions/{logisticsDeliveryInstructionId}`
  * `PUT /logistics-loading-instructions/{logisticsLoadingInstructionId}`
  * `GET /logistics-delivery-notes`
  * `GET /logistics-delivery-notes/{logisticsDeliveryNoteId}`

_Logistics supplier_ B endpoints
  * `GET /logistics-loading-instructions`
  * `GET /logistics-loading-instructions/{logisticsLoadingInstructionId}`
  * `PUT /logistics-delivery-notes/{logisticsDeliveryNoteId}`

---

## Scenario A: _Logistics supplier_ is responsible for the ship to warehouse and distribution of the products.

### Business Context

_Logistics supplier_ is responsible for the ship to warehouse and distribution of the products.

### _Logistics supplier_ endpoints

```text
`GET /logistics-delivery-instructions`
`GET /logistics-delivery-instructions/{logisticsDeliveryInstructionId}`
`PUT /logistics-delivery-notes/{logisticsDeliveryNoteId}`
`PUT /logistics-shipments/{logisticsShipmentId}`
```

### Flow



### Typical Statuses



---

## Scenario B: _Logistics supplier_ A is responsible for distributing the products. _Logistics supplier_ B is responsible for the warehouse.

### Business Context

_Logistics supplier_ A is responsible for distributing the products.
_Logistics supplier_ B is responsible for the warehouse.

### _Logistics Supplier_ A endpoints

```text
`GET /logistics-delivery-instructions`
`GET /logistics-delivery-instructions/{logisticsDeliveryInstructionId}`
`PUT /logistics-loading-instructions/{logisticsLoadingInstructionId}`
`GET /logistics-delivery-notes`
`GET /logistics-delivery-notes/{logisticsDeliveryNoteId}`
```

### _Logistics Supplier_ B endpoints

```text
`GET /logistics-loading-instructions`
`GET /logistics-loading-instructions/{logisticsLoadingInstructionId}`
`PUT /logistics-delivery-notes/{logisticsDeliveryNoteId}`
```

### Flow



---

