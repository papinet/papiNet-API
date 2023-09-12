# Purchase Order Use Case

## Context

This use case is designed for _Paper and Board_ business.

> _Paper For Recycling_ and _Pulp_ are not included within our definition of _Paper and Board_, they are raw materials for _Paper and Board_.

## Simplification

For now, we only consider a simplified version of the business interactions between only two types of parties: the _customer_ and the _seller_, where the _customer_ will host the HTTP client calling the papiNet API endpoints implemented by the _seller_.

## Definitions

N/A.

## Preconditions

N/A.

## Notifications

When the _seller_ needs to notify the _customer_, we recommend to use the CloudEvents specification putting directly the URL that the _customer_ should call within the `source` property and the value `org.papinet.notification` within the `type` property.

## Processes

## Domain Name

We suggest that the _seller_ exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _seller_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

## papiNet Stub Service

You can run locally the papiNet stub service using the following command:

```text
./mock/pact-stub-server --file ./mock/papiNet.PACT.json --port 3020 --provider-state-header-name X-Provider-State
```

## Authentication

For authenticating the _customer_, we recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _customer_ sends an API request to create a session, and gets its associated _access token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "access_token": "1a27ae3f-02f3-4355-8a70-9ed547d0ccf8",
  "token_type": "bearer",
  "expires_in_": 86400
}
```

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

**Scenario H:** Retrieve the UUID of a Purchase Order based on its `purchaseOrderNumber`

1. An authenticated _customer_ retrieves the UUID of a Purchase Order based on its `purchaseOrderNumber`.

### Scenario A: Purchase Order with 1 Line, Confirmed

#### Interaction 0 of Scenario A (Authentication)

The _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access token_:

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
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "token_type": "bearer",
  "expires_in": 86400
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
    "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-001",
  "purchaseOrderTimestamp": "2022-02-01T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-010",
      "salesOrderTimestamp": "2022-02-01T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

The _seller_ confirms the _line_ and notifies the _customer_ by sending an event:

```json
{
    "specversion" : "1.0",
    "id" : "7bb555e2-3217-4c65-9d28-26b2c71ef5a3",
    "source" : "http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
    "type" : "org.papinet.notification",
    "time" : "2022-02-01T09:00:05Z"
}
```

Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-001",
  "purchaseOrderTimestamp": "2022-02-01T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-010",
      "salesOrderTimestamp": "2022-02-01T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-02T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

See [above](#interaction-0-of-scenario-a-authentication).

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
    "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-002",
  "purchaseOrderTimestamp": "2022-02-02T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-020",
      "salesOrderTimestamp": "2022-02-02T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

The _seller_ rejects the _line_ and notifies the _customer_ by sending an event:

```json
{
    "specversion" : "1.0",
    "id" : "370a0fc8-8219-4c9f-8f4f-53769b57beac",
    "source" : "http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
    "type" : "org.papinet.notification",
    "time" : "2022-02-02T09:00:05Z"
}
```

Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-002",
  "purchaseOrderTimestamp": "2022-02-02T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-020",
      "salesOrderTimestamp": "2022-02-02T09:00:05Z",
      "salesOrderStatus": "Rejected",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Rejected",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

See [above](#interaction-0-of-scenario-a-authentication).

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
    "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
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
        "customerArticle": { \
          "id": "3b034825-6908-4bef-8c43-e7a424a2c486" \
        }, \
        "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008", \
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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-003",
  "purchaseOrderTimestamp": "2022-02-03T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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
          "id": "b4a28c7e-95d9-43a6-a82a-ed1c807124b9" \
        }, \
        "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008", \
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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-003",
  "purchaseOrderTimestamp": "2022-02-03T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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

The _seller_ confirms the 1st _line_ and the newly created _line_, the _seller_ forgets the 2nd _line_ from the original _purchase order_ acknowledging its cancellation and finally notifies the _customer_ by sending an event:

```json
{
    "specversion" : "1.0",
    "id" : "0bec2c63-8966-486c-9020-7627c99efe7e",
    "source" : "http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
    "type" : "org.papinet.notification",
    "time" : "2022-02-03T09:00:05Z"
}
```

Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-003",
  "purchaseOrderTimestamp": "2022-02-03T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-030",
      "salesOrderTimestamp": "2022-02-03T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-04T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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
      "latestAllowedDateTimeForChange": "2022-02-04T10:00:00",
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "confirmedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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

See [above](#interaction-0-of-scenario-a-authentication).

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
    "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-004",
  "purchaseOrderTimestamp": "2022-02-04T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-040",
      "salesOrderTimestamp": "2022-02-04T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

The _seller_ confirms the _line_ and notifies the _customer_ by sending an event:

```json
{
    "specversion" : "1.0",
    "id" : "1065daa9-c703-4501-8e42-28d96df37a1d",
    "source" : "http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
    "type" : "org.papinet.notification",
    "time" : "2022-02-04T09:00:05Z"
}
```

Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-004",
  "purchaseOrderTimestamp": "2022-02-04T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-040",
      "salesOrderTimestamp": "2022-02-04T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-05T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-004",
  "purchaseOrderTimestamp": "2022-02-04T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-040",
      "salesOrderTimestamp": "2022-02-04T09:45:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "latestAllowedDateTimeForChange": "2022-02-05T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

The _seller_ confirms the quantity change and notifies the _customer_ by sending an event:

```json
{
    "specversion" : "1.0",
    "id" : "2eef4e87-7610-45a5-9caa-30fb7e7dad32",
    "source" : "http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
    "type" : "org.papinet.notification",
    "time" : "2022-02-04T09:45:05Z"
}
```

Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-004",
  "purchaseOrderTimestamp": "2022-02-04T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-040",
      "salesOrderTimestamp": "2022-02-04T09:45:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-05T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

See [above](#interaction-0-of-scenario-a-authentication).

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
    "purchaseOrderTimestamp": "2022-02-05T09:00:00Z", \
    "purchaseOrderStatus": "Original", \
    "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-005",
  "purchaseOrderTimestamp": "2022-02-05T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-050",
      "salesOrderTimestamp": "2022-02-05T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "latestAllowedDateTimeForChange": "2022-02-06T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

The _seller_ confirms the _line_ and notifies the _customer_ by sending an event:

```json
{
    "specversion" : "1.0",
    "id" : "cf3bd488-29ca-49e8-a686-f6948bee2dc5",
    "source" : "http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
    "type" : "org.papinet.notification",
    "time" : "2022-02-05T09:00:05Z"
}
```

 Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_2_of_Scenario_E' \
  --header 'Authorization: Bearer e0601314-434f-4aac-b719-6dfb2c21d24f' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-005",
  "purchaseOrderTimestamp": "2022-02-05T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-050",
      "salesOrderTimestamp": "2022-02-05T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-06T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

#### Interaction 3 of Scenario E (Update the Purchase Order)

The autenticated _customer_ sends an API request to the _seller_ in order to request a quantity change:

```text
curl --request PATCH \
  --URL 'http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0' \
  --header 'X-Provider-State: Purchase_Order_Interaction_3_of_Scenario_E' \
  --header 'Authorization: Bearer e0601314-434f-4aac-b719-6dfb2c21d24f' \
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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-005",
  "purchaseOrderTimestamp": "2022-02-05T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-050",
      "salesOrderTimestamp": "2022-02-05T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-06T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

See [above](#interaction-0-of-scenario-a-authentication).

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
    "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-006",
  "purchaseOrderTimestamp": "2022-02-06T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-060",
      "salesOrderTimestamp": "2022-02-06T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

The _seller_ confirms the _line_ and notifies the _customer_ by sending an event:

```json
{
    "specversion" : "1.0",
    "id" : "99ce6b70-1e6e-49e7-be00-f1f2bc3308b5",
    "source" : "http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
    "type" : "org.papinet.notification",
    "time" : "2022-02-06T09:00:05Z"
}
```

Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-006",
  "purchaseOrderTimestamp": "2022-02-06T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-060",
      "salesOrderTimestamp": "2022-02-06T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-07T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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
        "requestedShipToLocation": "0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd", \
        "requestedDeliveryDateTime": "2022-02-17T11:30:00",
      }
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-006",
  "purchaseOrderTimestamp": "2022-02-06T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-060",
      "salesOrderTimestamp": "2022-02-06T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "latestAllowedDateTimeForChange": "2022-02-07T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

The _seller_ rejects the delivery date-time change and/or a ship-to change change and notifies the _customer_ by sending an event:

```json
{
    "specversion" : "1.0",
    "id" : "2f0e03d4-abf7-4845-bc4c-c1217b2d09ba",
    "source" : "http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
    "type" : "org.papinet.notification",
    "time" : "2022-02-06T09:00:05Z"
}
```

Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-006",
  "purchaseOrderTimestamp": "2022-02-06T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Amended",
      "salesOrderNumber": "SU-XYZ-060",
      "salesOrderTimestamp": "2022-02-06T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-07T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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

See [above](#interaction-0-of-scenario-a-authentication).

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
    "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904", \
    "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65", \
    "purchaseOrderLineItems": [ \
      { \
        "purchaseOrderLineItemNumber": "1", \
        "purchaseOrderLineItemStatus": "Original", \
        "customerArticle": { \
          "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971" \
        }, \
        "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
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
        "customerArticle": { \
          "id": "3b034825-6908-4bef-8c43-e7a424a2c486" \
        }, \
        "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008", \
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
        "customerArticle": { \
          "id": "b4a28c7e-95d9-43a6-a82a-ed1c807124b9" \
        }, \
        "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008", \
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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-007",
  "purchaseOrderTimestamp": "2022-02-07T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:00:05Z",
      "salesOrderStatus": "Pending",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Pending",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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

The _seller_ confirms the _line_ and notifies the _customer_ by sending an event:

```json
{
    "specversion" : "1.0",
    "id" : "ffc19d5e-0596-4789-a771-f7f54f6754ec",
    "source" : "http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
    "type" : "org.papinet.notification",
    "time" : "2022-02-07T09:00:05Z"
}
```

Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

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
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-007",
  "purchaseOrderTimestamp": "2022-02-07T09:00:00Z",
  "purchaseOrderStatus": "Original",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "confirmedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "confirmedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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
        "requestedShipToLocation": "0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd", \
        "requestedDeliveryDateTime": "2022-02-20T11:30:00",
      }
    ] \
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-007",
  "purchaseOrderTimestamp": "2022-02-07T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "confirmedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
      "confirmedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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

The _seller_ rejects the quantity change in the 2nd _line_, but confirms the delivery date-time change and the ship-to change change in the 3rd line, and then notifies the _customer_ by sending an event:

```json
{
    "specversion" : "1.0",
    "id" : "517f8636-e792-44a1-926b-d586ae082717",
    "source" : "http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
    "type" : "org.papinet.notification",
    "time" : "2022-02-07T09:00:05Z"
}
```
 Then, the authenticated _customer_ sends an API request to the _seller_ in order to get the details of the _purchase order_ `ffe7552a-19c5-409c-9d9f-a00a9bf095f0`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3020/purchase-orders/ffe7552a-19c5-409c-9d9f-a00a9bf095f0 \
  --header 'X-Provider-State: Purchase_Order_Interaction_4_of_Scenario_G' \
  --header 'Authorization: Bearer 60cb6ce4-3ab3-42c0-a5c2-e365750352c3' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
  "purchaseOrderNumber": "ERP-PO-007",
  "purchaseOrderTimestamp": "2022-02-07T09:45:00Z",
  "purchaseOrderStatus": "Amended",
  "active": true,
  "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "salesOrderNumber": "SU-XYZ-070",
      "salesOrderTimestamp": "2022-02-07T09:00:05Z",
      "salesOrderStatus": "Confirmed",
      "salesOrderLineItemNumber": "10",
      "salesOrderLineItemStatus": "Confirmed",
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "requestedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "confirmedShipToLocation": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
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
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "confirmedShipToLocation": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
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
      "latestAllowedDateTimeForChange": "2022-02-08T10:00:00",
      "customerArticle": {
        "id": "3b034825-6908-4bef-8c43-e7a424a2c486"
      },
      "requestedShipToLocation": "0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
      "confirmedShipToLocation": "0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
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

### Scenario H: Retrieve the UUID of a Purchase Order based on its `purchaseOrderNumber`

#### Interaction 0 of Scenario H (Authentication)

See [above](#interaction-0-of-scenario-a-authentication).

#### Interaction 1 of Scenario H (Retreive the UUID)

The authenticated _customer_ sends an API request in order to retreive the UUID of a _customer-article_ based on its `customerArticleNumber`:

```text
curl --request GET \
  --URL http://localhost:3020/purchase-orders?purchaseOrderNumber=ERP-PO-001 \
  --header 'X-Provider-Sate: Master_Data_Interaction_1_of_Scenario_H' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfPurchaseOrders": 1,
  "purchaseOrders": [
    {
      "id": "ffe7552a-19c5-409c-9d9f-a00a9bf095f0",
      "purchaseOrderNumber": "ERP-PO-001",
      "purchaseOrderTimestamp": "2022-02-01T09:00:00Z",
      "purchaseOrderStatus": "Original",
      "active": true,
      "buyerParty": "3b76fbc6-8324-4d7d-a230-da9398bb2904",
      "billToParty": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
      "numberOfLines": 1
    }
  ],
  "links": {
    "self": {
      "href": "/purchase-orders?purchaseOrderNumber=ERP-PO-001"
    },
    "next": {}
  }

}
```
