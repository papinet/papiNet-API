# Purchase Order Use Case

## Context

This use case is designed for _Paper and Board_ business.

> _Paper For Recycling_ and _Pulp_ are not included within our definition of _Paper and Board_, they are raw materials for _Paper and Board_.

## Simplification

For now, we only consider a simplified version of the business interactions between only two types of parties: the _customer_ and the _seller_, where the _customer_ will host the HTTP client calling the papiNet API endpoints implemented by the _seller_.

## Definitions

...

## Preconditions

## Notifications

...

## Processes

## Domain Name

## papiNet Stub Service

You can run locally the papiNet stub service using the following command:

```text
./mock/pact-stub-server --file ./mock/papiNet.PACT.json --port 3020 --provider-state-header-name X-Provider-State
```

## Authentication

## Scenarios

**Scenario A:** Purchase Order with 1 Line, Confirmed

1. An authenticated _customer_ creates a _purchase order_ with 1 _line_;
2. The _seller_ confirms the _line_, the _customer_ is notified (1) and gets the details of the confirmed _purchase order_.

**Scenario B:** Purchase Order with 1 Line, Rejected

1. An authenticated _customer_ creates a _purchase order_ with 1 _line_;
2. The _seller_ rejects the _line_, the _customer_ is notified and gets the details of the rejected _purchase order_.

**Scenario C:** Purchase Order with 2 Lines, Cancel 1 Line and Create 1 New Line, Both Confirmed

1. An authenticated _customer_ creates a _purchase order_ with 2 _lines_;
2. The _customer_ cancels the 2nd _line_ and creates a new _line_;
3. The _seller_ confirms the 1st _line_ and the newly created _line_, the _seller_ forgets the 2nd _line_ from the original _purchase order_ acknowledging its cancellation, the _customer_ is notified and gets the details of the confirmed _purchase order_.

**Scenario D:** Purchase Order with 1 Line, and 1 Quantity Change Confirmed

1. An authenticated _customer_ creates a _purchase order_ with 1 _line_;
2. The _seller_ confirms the _line_, the _customer_ is notified and gets the details of the confirmed _purchase order_.
3. The _customer_ requests a quantity change;
4. The _seller_ confirms the quantity change, the _customer_ is notified and and gets the details of the confirmed _purchase order_ with the quantity change.

**Scenario E:** Purchase Order with 1 Line, and 1 Quantity Change Immediately Rejected

1. An authenticated _customer_ creates a _purchase order_ with 1 _line_;
2. The _seller_ confirms the _line_, the _customer_ is notified and gets the details of the confirmed _purchase order_.
3. The _customer_ requests a quantity change, the _seller_ immediately rejects the quantity change and the _customer_ gets the details of the previously confirmed _purchase order_ without the quantity change.

**Scenario F:** Purchase Order with 1 Line, and 2 Changes (Delivery Date-Time and Ship-To) From Which 1 (at least) is Rejected

1. An authenticated _customer_ creates a _purchase order_ with 1 _line_;
2. The _seller_ confirms the _line_, the _customer_ is notified and gets the details of the confirmed _purchase order_.
3. The _customer_ requests a delivery date-time change and a ship-to change;
4. The _seller_ rejects the delivery date-time change and/or a ship-to change change, the _customer_ gets the details of previously confirmed _purchase order_ without any changes.

**Scenario G:** Purchase Order with 3 Lines, 1 Quantity Change on the 2nd Line Rejected, and 2 Changes (Delivery Date-Time and Ship-To) on the 3rd Line Confirmed

1. An authenticated _customer_ creates a _purchase order_ with 3 _lines_;
2. The _seller_ confirms the 3 _lines_, the _customer_ is notified and gets the details of the confirmed _purchase order_.
3. The _customer_ requests a quantity change in the 2nd _line_, and a delivery date-time change and a ship-to change in the 3rd line;
4. The _seller_ rejects the quantity change in the 2nd _line_, but confirms the delivery date-time change and the ship-to change in the 3rd line, the _customer_ is notified and gets the details of the confirmed _purchase order_ with the quantity change in the 2nd _line_, but without the delivery date-time change and the ship-to change in the 3rd line.

### Scenario A: Purchase Order with 1 Line, Confirmed

#### Interaction 0 of Scenario A (Authentication)

The authenticated _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --header 'X-Provider-State: Purchase_Order_Interaction_0_of_Scenario_A' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "accessToken": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

#### Interaction 1 of Scenario A (Create a Purchase Order)

The authenticated _customer_ sends an API request to the _seller_ in order to creates a _purchase order_ with 1 _line_:

```text
curl --request POST \
  --URL 'http://localhost:3020/purchase-orders' \
  --header 'X-Provider-Sate: Purchase_Order_Interaction_1_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderNumber": "ERP-PO-001", \
    "purchaseOrderTimestamp": "2022-02-01T09:00:00Z", \
    "purchaseOrderStatus": "Original", \
    "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
        "requestedDeliveryDateTime": "2022-02-11", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 12800, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 4, \
            "quantityUOM": "Reel" \
          } \
        ] \
      } \
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-001",
  "purchaseOrderTimestamp": "2022-02-01T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-010",
      "salesOrderTimestamp": "2022-02-01T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-11",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 2 of Scenario A (Get the Status of the Purchase Order)

The _seller_ confirms the _line_ and notifies the _customer_. Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_2_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-001",
  "purchaseOrderTimestamp": "2022-02-01T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-010",
      "salesOrderTimestamp": "2022-02-01T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-02T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-11",
      "confirmedDeliveryDateTime": "2022-02-11",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

### Scenario B: Purchase Order with 1 Line, Rejected

#### Interaction 0 of Scenario B (Authentication)

The authenticated _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --header 'X-Provider-State: Purchase_Order_Interaction_0_of_Scenario_B' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "accessToken": "b6b9430b-f552-43c9-a3cd-98c0fa46bcf7",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

#### Interaction 1 of Scenario B (Create a Purchase Order)

The authenticated _customer_ sends an API request to the _seller_ in order to creates a _purchase order_ with 1 _line_:

```text
curl --request POST \
  --URL 'http://localhost:3020/purchase-orders' \
  --header 'X-Provider-Sate: Purchase_Order_Interaction_1_of_Scenario_B' \
  --header 'Authorization: Bearer b6b9430b-f552-43c9-a3cd-98c0fa46bcf7' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderNumber": "ERP-PO-002", \
    "purchaseOrderTimestamp": "2022-02-02T09:00:00Z", \
    "purchaseOrderStatus": "Original", \
    "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
        "requestedDeliveryDateTime": "2022-02-12T11:30", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 12800, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 4, \
            "quantityUOM": "Reel" \
          } \
        ] \
      } \
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-002",
  "purchaseOrderTimestamp": "2022-02-02T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-020",
      "salesOrderTimestamp": "2022-02-02T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-12T11:30",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 2 of Scenario B (Get the Status of the Purchase Order)

The _seller_ rejects the _line_ and notifies the _customer_. Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_2_of_Scenario_B' \
  --header 'Authorization: Bearer b6b9430b-f552-43c9-a3cd-98c0fa46bcf7' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-002",
  "purchaseOrderTimestamp": "2022-02-02T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-020",
      "salesOrderTimestamp": "2022-02-02T09:00:05Z",
      "salesOrderStatus": "Rejected",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Rejected",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-12T11:30",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

### Scenario C: Purchase Order with 2 Lines, Cancel 1 Line and Create 1 New Line, Both Confirmed

#### Interaction 0 of Scenario C (Authentication)

The authenticated _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --header 'X-Provider-State: Purchase_Order_Interaction_0_of_Scenario_C' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "accessToken": "c5553526-3756-493b-9bdd-6d54e33329b8",
  "expiresIn": 86400, 
  "tokenType": "bearer"
}
```

#### Interaction 1 of Scenario C (Create a Purchase Order)

The authenticated _customer_ sends an API request to the _seller_ in order to creates a _purchase order_ with 2 _lines_:

```text
curl --request POST \
  --URL 'http://localhost:3020/purchase-orders' \
  --header 'X-Provider-State: Purchase_Order_Interaction_1_of_Scenario_C' \
  --header 'Authorization: Bearer c5553526-3756-493b-9bdd-6d54e33329b8' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderNumber": "ERP-PO-003", \
    "purchaseOrderTimestamp": "2022-02-03T09:00:00Z", \
    "purchaseOrderStatus": "Original", \
    "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
        "requestedDeliveryDateTime": "2022-02-14/2022-02-18", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 12800, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 4, \
            "quantityUOM": "Reel" \
          } \
        ] \
      }, \
      { \
        "purchaseOrderLineItemNumber": "2", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486" \
        }, \
        "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008", \
        "requestedDeliveryDateTime": "2022-02-14/2022-02-18", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 6000, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 2, \
            "quantityUOM": "Reel" \
          } \
        ] \
      } \
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-003",
  "purchaseOrderTimestamp": "2022-02-03T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-14/2022-02-18",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "2",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "20",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-14/2022-02-18",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 2 of Scenario C (Update the Purchase Order)

The autenticated _customer_ sends an API request to the _seller_ in order to cancel the 2nd _line_ and creates a new _line_:

```text
curl --request PATCH \
  --URL 'http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0' \
  --header 'X-Provider-State: Purchase_Order_Interaction_2_of_Scenario_C' \
  --header 'Authorization: Bearer c5553526-3756-493b-9bdd-6d54e33329b8' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderTimestamp": "2022-02-03T09:45:00Z", \
    "purchaseOrderStatus": "Amended", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Cancelled", \
      }, \
      { \
        "purchaseOrderLineItemNumber": "3", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/b4a28c7e-95d9-43a6-a82a-ed1c807124b9" \
        }, \
        "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008", \
        "requestedDeliveryDateTime": "2022-02-15T11:30:00", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 6000, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 2, \
            "quantityUOM": "Reel" \
          } \
        ] \
      } \
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-003",
  "purchaseOrderTimestamp": "2022-02-03T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-14/2022-02-18",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "2",
      "purchaseOrderLineItemStatus": "Cancelled",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "20",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-14/2022-02-18",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "3",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "30",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-14/2022-02-18",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 3 of Scenario C (Get the Status of the Purchase Order)

The _seller_ confirms the 1st _line_ and the newly created _line_, the _seller_ forgets the 2nd _line_ from the original _purchase order_ acknowledging its cancellation and finally notifies the _customer_. Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_3_of_Scenario_C' \
  --header 'Authorization: Bearer c5553526-3756-493b-9bdd-6d54e33329b8' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-003",
  "purchaseOrderTimestamp": "2022-02-03T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-04T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-14/2022-02-18",
      "confirmedDeliveryDateTime": "2022-02-14/2022-02-18",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "2",
      "purchaseOrderLineItemStatus": "Cancelled",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Cancelled",
      "salesOrderLineItemNumber": "20",
      "salesOrderLineItemStatus": "Cancelled",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-14/2022-02-18",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "3",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "30",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-04T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "confirmedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-14/2022-02-18",
      "confirmedDeliveryDateTime": "2022-02-14/2022-02-18",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

### Scenario D: Purchase Order with 1 Line, and 1 Quantity Change Confirmed

#### Interaction 0 of Scenario D (Authentication)

The authenticated _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --header 'X-Provider-State: Purchase_Order_Interaction_0_of_Scenario_D' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "accessToken": "d7c0d82e-5619-43cc-8459-9611371b2c1b",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

#### Interaction 1 of Scenario D (Create a Purchase Order)

The authenticated _customer_ sends an API request to the _seller_ in order to creates a _purchase order_ with 1 _line_:

```text
curl --request POST \
  --URL 'http://localhost:3020/purchase-orders' \
  --header 'X-Provider-State: Purchase_Order_Interaction_1_of_Scenario_D' \
  --header 'Authorization: Bearer d7c0d82e-5619-43cc-8459-9611371b2c1b' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderNumber": "ERP-PO-004", \
    "purchaseOrderTimestamp": "2022-02-04T09:00:00Z", \
    "purchaseOrderStatus": "Original", \
    "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
        "requestedDeliveryDateTime": "2022-02-14T11:30/18:30", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 12800, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 4, \
            "quantityUOM": "Reel" \
          } \
        ] \
      } \
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-004",
  "purchaseOrderTimestamp": "2022-02-04T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-040",
      "salesOrderTimestamp": "2022-02-04T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-14T11:30/18:30",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 2 of Scenario D (Get the Status of the Purchase Order)

The _seller_ confirms the _line_ and notifies the _customer_. Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_2_of_Scenario_D' \
  --header 'Authorization: Bearer d7c0d82e-5619-43cc-8459-9611371b2c1b' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-004",
  "purchaseOrderTimestamp": "2022-02-04T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-040",
      "salesOrderTimestamp": "2022-02-04T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-05T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-14T11:30/18:30",
      "confirmedDeliveryDateTime": "2022-02-14T11:30/18:30",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 3 of Scenario D (Update the Purchase Order)

The autenticated _customer_ sends an API request to the _seller_ in order to request a quantity change:

```text
curl --request PATCH \
  --URL 'http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0' \
  --header 'X-Provider-State: Purchase_Order_Interaction_3_of_Scenario_D' \
  --header 'Authorization: Bearer d7c0d82e-5619-43cc-8459-9611371b2c1b' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderTimestamp": "2022-02-03T09:45:00Z", \
    "purchaseOrderStatus": "Amended", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Amended", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 16000, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 5, \
            "quantityUOM": "Reel" \
          } \
        ] \
      } \
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-004",
  "purchaseOrderTimestamp": "2022-02-04T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-040",
      "salesOrderTimestamp": "2022-02-04T09:45:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-05T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-14T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-14T11:30:00",
      "quantities": [
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 16000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 5,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 4 of Scenario D (Get the Status of the Purchase Order)

The _seller_ confirms the quantity change and notifies the _customer_. Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_4_of_Scenario_D' \
  --header 'Authorization: Bearer d7c0d82e-5619-43cc-8459-9611371b2c1b' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-004",
  "purchaseOrderTimestamp": "2022-02-04T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-040",
      "salesOrderTimestamp": "2022-02-04T09:45:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-05T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-14T11:30/18:30",
      "confirmedDeliveryDateTime": "2022-02-14T11:30/18:30",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 16000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 5,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 16000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 5,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

### Scenario E: Purchase Order with 1 Line, and 1 Quantity Change Immediately Rejected

#### Interaction 0 of Scenario E (Authentication)

The authenticated _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --header 'X-Provider-State: Purchase_Order_Interaction_0_of_Scenario_E' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "accessToken": "e0601314-434f-4aac-b719-6dfb2c21d24f",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

#### Interaction 1 of Scenario E (Create a Purchase Order)

The authenticated _customer_ sends an API request to the _seller_ in order to creates a _purchase order_ with 1 _line_:

```text
curl --request POST \
  --URL 'http://localhost:3020/purchase-orders' \
  --header 'X-Provider-State: Purchase_Order_Interaction_1_of_Scenario_E' \
  --header 'Authorization: Bearer e0601314-434f-4aac-b719-6dfb2c21d24f' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderNumber": "ERP-PO-005", \
    "purchaseOrderTimestamp": "pOT:2022-02-05T09:00:00Z", \
    "purchaseOrderStatus": "Original", \
    "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
        "requestedDeliveryDateTime": "2022-02-15T11:30:00", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 12800, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 4, \
            "quantityUOM": "Reel" \
          } \
        ] \
      } \
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-005",
  "purchaseOrderTimestamp": "pOT:2022-02-05T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-050",
      "salesOrderTimestamp": "2022-02-05T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-06T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-15T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 2 of Scenario E (Get the Status of the Purchase Order)

The _seller_ confirms the _line_ and notifies the _customer_. Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_2_of_Scenario_E' \
  --header 'Authorization: Bearer d7c0d82e-5619-43cc-8459-9611371b2c1b' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-005",
  "purchaseOrderTimestamp": "pOT:2022-02-05T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-050",
      "salesOrderTimestamp": "2022-02-05T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-06T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-15T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-15T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 3 of Scenario  (Update the Purchase Order)

The autenticated _customer_ sends an API request to the _seller_ in order to request a quantity change:

```text
curl --request PATCH \
  --URL 'http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0' \
  --header 'X-Provider-State: Purchase_Order_Interaction_3_of_Scenario_E' \
  --header 'Authorization: Bearer d7c0d82e-5619-43cc-8459-9611371b2c1b' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderTimestamp": "2022-02-05T09:45:00Z", \
    "purchaseOrderStatus": "Amended", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Amended", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 16000, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 5, \
            "quantityUOM": "Reel" \
          } \
        ] \
      }
    ] \
  }'
```

but, this time, the _seller_ immediately rejects the quantity change and the _customer_ gets the details of the previously confirmed _purchase order_ without the quantity change:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-005",
  "purchaseOrderTimestamp": "2022-02-05T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-050",
      "salesOrderTimestamp": "2022-02-05T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-06T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-15T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-15T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 16000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 5,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

### Scenario F: Purchase Order with 1 Line, and 2 Changes (Delivery Date-Time and Ship-To) From Which 1 (at least) is Rejected

#### Interaction 0 of Scenario F (Authentication)

The authenticated _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --header 'X-Provider-State: Purchase_Order_Interaction_0_of_Scenario_F' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "accessToken": "f3c7e67a-6871-4b5c-ae68-5697b3f3c2e4",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

#### Interaction 1 of Scenario F (Create a Purchase Order)

The authenticated _customer_ sends an API request to the _seller_ in order to creates a _purchase order_ with 1 _line_:

```text
curl --request POST \
  --URL 'http://localhost:3020/purchase-orders' \
  --header 'X-Provider-State: Purchase_Order_Interaction_1_of_Scenario_F' \
  --header 'Authorization: Bearer f3c7e67a-6871-4b5c-ae68-5697b3f3c2e4' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderNumber": "ERP-PO-006", \
    "purchaseOrderTimestamp": "2022-02-06T09:00:00Z", \
    "purchaseOrderStatus": "Original", \
    "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
        "requestedDeliveryDateTime": "2022-02-16T11:30", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 12800, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 4, \
            "quantityUOM": "Reel" \
          } \
        ] \
      } \
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-006",
  "purchaseOrderTimestamp": "2022-02-06T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-060",
      "salesOrderTimestamp": "2022-02-06T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-16T11:30",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 2 of Scenario F (Get the Status of the Purchase Order)

The _seller_ confirms the _line_ and notifies the _customer_. Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_2_of_Scenario_F' \
  --header 'Authorization: Bearer f3c7e67a-6871-4b5c-ae68-5697b3f3c2e4' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-006",
  "purchaseOrderTimestamp": "2022-02-06T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-060",
      "salesOrderTimestamp": "2022-02-06T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-07T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-16T11:30",
      "confirmedDeliveryDateTime": "2022-02-16T11:30/12:30",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 3 of Scenario F (Update the Purchase Order)

The autenticated _customer_ sends an API request to the _seller_ in order to request a delivery date-time change and a ship-to change:

```text
curl --request PATCH \
  --URL 'http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0' \
  --header 'X-Provider-State: Purchase_Order_Interaction_3_of_Scenario_F' \
  --header 'Authorization: Bearer f3c7e67a-6871-4b5c-ae68-5697b3f3c2e4' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderTimestamp": "2022-02-06T09:45:00Z", \
    "purchaseOrderStatus": "Amended", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Amended", \
        "requestedShipTo": "/locations/0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd", \
        "requestedDeliveryDateTime": "2022-02-17T11:30:00",
      }
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-006",
  "purchaseOrderTimestamp": "2022-02-06T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-060",
      "salesOrderTimestamp": "2022-02-06T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-07T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-17T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-16T11:30/12:30",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 4 of Scenario F (Get the Status of the Purchase Order)

The _seller_ rejects the delivery date-time change and/or a ship-to change change and notifies the _customer_. Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_4_of_Scenario_F' \
  --header 'Authorization: Bearer f3c7e67a-6871-4b5c-ae68-5697b3f3c2e4' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-006",
  "purchaseOrderTimestamp": "2022-02-06T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-060",
      "salesOrderTimestamp": "2022-02-06T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-07T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-17T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-16T11:30/12:30",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

If the _customer_ is not satisfied with the rejection from the _seller_, he should probably call the _seller_ by phone.

### Scenario G: Purchase Order with 3 Lines, 1 Quantity Change on the 2nd Line Rejected, and 2 Changes (Delivery Date-Time and Ship-To) on the 3rd Line Confirmed

#### Interaction 0 of Scenario G (Authentication)

The authenticated _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --header 'X-Provider-State: Purchase_Order_Interaction_0_of_Scenario_G' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "accessToken": "60cb6ce4-3ab3-42c0-a5c2-e365750352c3",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

#### Interaction 1 of Scenario G (Create a Purchase Order)

The authenticated _customer_ sends an API request to the _seller_ in order to creates a _purchase order_ with 3 _lines_:

```text
curl --request POST \
  --URL 'http://localhost:3020/purchase-orders' \
  --header 'X-Provider-State: Purchase_Order_Interaction_1_of_Scenario_G' \
  --header 'Authorization: Bearer 60cb6ce4-3ab3-42c0-a5c2-e365750352c3' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderNumber": "ERP-PO-007", \
    "purchaseOrderTimestamp": "2022-02-07T09:00:00Z", \
    "purchaseOrderStatus": "Original", \
    "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
        "requestedDeliveryDateTime": "2022-02-17T11:30:00", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 12800, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 4, \
            "quantityUOM": "Reel" \
          } \
        ] \
      }, \
      { \
        "purchaseOrderLineItemNumber": "2", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486" \
        }, \
        "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008", \
        "requestedDeliveryDateTime": "2022-02-19T11:30:00", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 6000, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 2, \
            "quantityUOM": "Reel" \
          } \
        ] \
      }, \
      { \
        "purchaseOrderLineItemNumber": "3", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "/customer-articles/b4a28c7e-95d9-43a6-a82a-ed1c807124b9" \
        }, \
        "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008", \
        "requestedDeliveryDateTime": "2022-02-18T11:30:00", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 6000, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 2, \
            "quantityUOM": "Reel" \
          } \
        ] \
      } \
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-007",
  "purchaseOrderTimestamp": "2022-02-07T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-17T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "2",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "20",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-19T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "3",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "30",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-18T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 2 of Scenario G (Get the Status of the Purchase Order)

The _seller_ confirms the _line_ and notifies the _customer_. Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_2_of_Scenario_G' \
  --header 'Authorization: Bearer 60cb6ce4-3ab3-42c0-a5c2-e365750352c3' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-007",
  "purchaseOrderTimestamp": "2022-02-07T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-17T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-17T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "2",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "20",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "confirmedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-19T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-19T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "3",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "30",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "confirmedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-18T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-18T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 3 of Scenario G (Update the Purchase Order)

The autenticated _customer_ sends an API request to the _seller_ in order to request a quantity change in the 2nd _line_, and a delivery date-time change and a ship-to change change in the 3rd line:

```text
curl --request PATCH \
  --URL 'http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0' \
  --header 'X-Provider-State: Purchase_Order_Interaction_3_of_Scenario_G' \
  --header 'Authorization: Bearer 60cb6ce4-3ab3-42c0-a5c2-e365750352c3' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderTimestamp": "2022-02-07T09:45:00Z", \
    "purchaseOrderStatus": "Amended", \
    "purchaseOrderLineItems": [ \
      {
        "purchaseOrderLineItemNumber": "2", \
        "purchaseOrderLineItemStatus": "Amended", \
        "quantities": [ \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "GrossWeight", \
            "quantityValue": 16000, \
            "quantityUOM": "Kilogram" \
          }, \
          { \
            "quantityContext": "Ordered", \
            "quantityType": "Count", \
            "quantityValue": 5, \
            "quantityUOM": "Reel" \
          } \
        ] \
      }, \
      { \
        "purchaseOrderLineItemNumber": "3", \
        "purchaseOrderLineItemStatus": "Amended", \
        "requestedShipTo": "/locations/0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd", \
        "requestedDeliveryDateTime": "2022-02-20T11:30:00",
      }
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-007",
  "purchaseOrderTimestamp": "2022-02-07T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-17T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-17T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "2",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:45:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "20",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "confirmedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-19T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-19T11:30:00",
      "quantities": [
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 16000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 5,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "3",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:45:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "30",
      "salesOrderLineItemStatus": "Pending",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
      "confirmedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-20T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-18T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

#### Interaction 4 of Scenario G (Get the Status of the Purchase Order)

The _seller_ rejects the quantity change in the 2nd _line_, but confirms the delivery date-time change and the ship-to change change in the 3rd line, and then notifies the _customer_. Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_2_of_Scenario_G' \
  --header 'Authorization: Bearer 60cb6ce4-3ab3-42c0-a5c2-e365750352c3' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-007",
  "purchaseOrderTimestamp": "2022-02-07T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-17T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-17T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 12800,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 4,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "2",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:45:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "20",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "confirmedShipTo": "/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "requestedDeliveryDateTime": "2022-02-19T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-19T11:30:00",
      "quantities": [
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 16000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 5,
          "quantityUOM": "Reel"
        }
      ]
    },
    {
      "purchaseOrderLineItemNumber": "3",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:45:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "30",
      "salesOrderLineItemStatus": "Confirmed",
      "productionStatus": "NotStarted",
      "shipmentStatus": "NotStarted",
      "invoiceStatus": "NotStarted",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "/customer-articles/3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipTo": "/locations/0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
      "confirmedShipTo": "/locations/0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
      "requestedDeliveryDateTime": "2022-02-20T11:30:00",
      "confirmedDeliveryDateTime": "2022-02-20T11:30:00",
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Ordered",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 6000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    }
  ]
}
```

If the _customer_ is not satisfied with the rejection from the _seller_, he should probably call the _seller_ by phone.