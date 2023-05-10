# Purcahse Order Use Case

## Context

This use case is designed for _Paper and Board_ business.

> _Paper For Recycling_ and _Pulp_ are not included within our definition of _Paper and Board_, they are raw materials for _Paper and Board_.

## Simplification

For now, we only consider a simplified version of the business interactions between only two types of parties: the _customer_ and the _seller_, where the _customer_ will host the HTTP client calling the papiNet API endpoints implemented by the _seller_.

## Definitions

...

## Preconditions

## Processes

## Domain Name

## papiNet Stub Service

You can run locally the papiNet stub service using the following command:

```text
./mock/pact-stub-server --file ./mock/papiNet.PACT.json --port 3020 --provider-state-header-name X-Provider-State
```

## Authentication

## Scenarios

### Scenario A: Purchase Order



#### Interaction 1 of Scenario A (Authentication)

The authenticated _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

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
  "accessToken": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

In order to re-use the value of the `access_token` in subsequent API requests, it is convenient to save it into an environment variable:

```text
ACCESS_TOKEN=$(curl --request POST \
  --URL http://localhost:3020/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

You can easily verify the value of the `ACCESS_TOKEN` environment variable using:

```text
echo $ACCESS_TOKEN
a4f071c3-fe1f-4a45-9eae-07ddcb5bed26
```

#### Interaction 2 of Scenario A (Create a Purchase Order)

```text
curl --request POST \
  --URL 'http://localhost:3020/purchase-orders' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json' \
  --data-raw '{ \
    "purchaseOrderNumber": "ERP-PO-001", \
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
        "shipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73", \
        "requestedDeliveryDateTime": "2022-02-06T22:00:00Z/2022-02-07T21:59:59Z", \
        "Quantities": [ \
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
  "purchaseOrderTimestamp": "2022-02-02T09:00:00Z",
  "supplierOrderTimestamp": "2022-02-02T09:00:05Z",
  "purchaseOrderStatus": "Original",
  "supplierOrderStatus": "Pending",
  "productionStatus": "NotStarted",
  "shipmentStatus": "NotStarted",
  "invoiceStatus": "NotStarted",
  "buyer": "/parties/3b76fbc6-8324-4d7d-a230-da9398bb2904",
  "billTo": "/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "purchaseOrderLineItems": [
    {
      "purchaseOrderLineItemNumber": "1",
      "purchaseOrderLineItemStatus": "Original",
      "supplierOrderNumber": "SU-XYZ-456",
      "supplierOrderLineItemNumber": "10",
      "supplierOrderLineItemStatus": "Pending",
      "lastDateTimeForChange": "2022-02-02T15:00:00Z",
      "customerArticle": {
        "id": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
      },
      "shipTo": "/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "requestedDeliveryDateTime": "2022-02-06T22:00:00Z/2022-02-07T21:59:59Z",
      "Quantities": [
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

#### Interaction 3 of Scenario A (Get the Status of the Purchase Order)
