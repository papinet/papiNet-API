<!-- papiNet materials are covered by the following copyright statements Copyright 2021-2024 papiNet G.I.E (papiNet). All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign. -->

# Supplier Order Use case

## Context
This use case is designed for _Paper, Pulp and Board_ business.

## Simplification
For now, we only consider a simplified version of the business interactions between only two types of parties: the _logistics supplier_ and the _supplier_ where the _supplier_ will host the client calling the papiNet API endpoints implemented by the _supplier_.

## Definitions
N/A

## Preconditions
_Logistics supplier_ is supposed to call the API frequently as required in each business case, e.g. every 5 minutes in order to ensure that _logistics supplier_ have updated order data.

## Domain Name
We suggest that the _supplier_ exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _supplier_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

## papiNet Stub Service

You can run locally the papiNet stub service using the following command:

```text
./mock/pact-stub-server --file ./mock/papiNet.PACT.json --port 3020 --provider-state-header-name X-Provider-State
```

## Authentication

For authenticating the _logistic supplier_, we recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _logistic supplier_ sends an API request to create a session, and gets its associated _access token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _logistic supplier_ will receive a response like this:

```json
{ 
  "access_token": "1a27ae3f-02f3-4355-8a70-9ed547d0ccf8",
  "token_type": "bearer",
  "expires_in_": 86400
}
```


## Scenarios

**Scenario A:** Supplier Order

1. An authenticated _logistics supplier_ requests the list of all active _supplier-orders_.
2. An authenticated _logistics supplier_ requests the details of a specific _supplier-order_.

### Scenario A: 

#### Interaction 0 of Scenario A (Authentication)
The _logistics supplier_ sends an API request to the _supplier_ in order to be authenticated, and gets an _access token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --header 'X-Provider-State: Supplier_Order_Interaction_0_of_Scenario_A' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _logistics supplier_ will receive a response like this:

```json
{
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "token_type": "bearer",
  "expires_in": 86400
}
```

#### Interaction 1 of Scenario A (Get the list of Supplier Orders)
```text
curl --request GET \
  --URL 'http://localhost:3020/supplier-orders? active=true \ 
  --header 'X-Provider-State: Supplier_Order_Interaction_1_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```
If all goes well, the _logistic supplier_ will receive a response like this:

```json
{
  "numberOfSupplierOrders": 1,
  "supplierOrders": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "supplierOrderNumber": "string",
      "supplierOrderTimestamp": "2024-01-05T10:13:56.814Z",
      "supplierOrderStatus": "Original",
      "active": true,
      "supplierParty": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "partyIdentifiers": [
          {
            "value": "string",
            "assignedBy": "Supplier"
          }
        ]
      },
      "customerParty": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "partyIdentifiers": [
          {
            "value": "string",
            "assignedBy": "Supplier"
          }
        ]
      },
      "buyerParty": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "partyIdentifiers": [
          {
            "value": "string",
            "assignedBy": "Supplier"
          }
        ]
      },
      "purchaseOrderNumber": "string",
      "numberOfLineItems": 1
    }
  ],
  "links": {
    "first": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    },
    "next": {
      "href": "string"
    },
    "last": {
      "href": "string"
    }
  }
}
```
You can see that the _supplier_ has 1 active order. The response only contains part of the header information, to get the details of the order, including the order lines, you can see the link properties that contains a prepared API endpoint giving direct access to the full order info.


### Interaction 2 of Scenario A (Get a Supplier Order details)

The step 2 of the scenario A will simulate the situation in which the _logistics supplier_ requests to get the full order information. The _logistics supplier_ sends an API get request to the _supplier_ in order to get the details of the order 3fa85f64-5717-4562-b3fc-2c963f66afa6

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/supplier-orders/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
or, if you use locally the docker container of the papiNet mock server:

$ curl --request GET \
  --URL http://localhost:3002/supplier-orders/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
If all goes well, the logistics supplier will receive a response like this:
```

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "supplierOrderNumber": "string",
  "supplierOrderTimestamp": "2024-01-05T10:09:19.691Z",
  "supplierOrderStatus": "Original",
  "active": true,
  "supplierParty": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "partyIdentifiers": [
      {
        "value": "string",
        "assignedBy": "Supplier"
      }
    ]
  },
  "customerParty": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "partyIdentifiers": [
      {
        "value": "string",
        "assignedBy": "Supplier"
      }
    ]
  },
  "buyerParty": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "partyIdentifiers": [
      {
        "value": "string",
        "assignedBy": "Supplier"
      }
    ]
  },
  "purchaseOrderNumber": "string",
  "supplierOrderLineItems": [
    {
      "supplierOrderLineItemNumber": "string",
      "supplierOrderLineItemStatus": "Original",
      "salesOrderNumber": "string",
      "confirmedShipToLocation": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "locationIdentifiers": [
          {
            "value": "string",
            "assignedBy": "Supplier"
          }
        ]
      },
      "sellerProduct": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "brandName": {
          "value": "string",
          "assignedBy": "Supplier"
        },
        "gradeCode": {
          "value": "string",
          "assignedBy": "Supplier"
        },
        "gradeCodeName": {
          "value": "string",
          "assignedBy": "Supplier"
        },
        "paper": {
          "coatingTop": "Acrylic",
          "coatingBottom": "Acrylic",
          "finishType": "Dull",
          "printType": "ColdsetOffset",
          "basisWeight": {
            "sizeType": "24x36",
            "value": 0,
            "unitOfMeasure": "GramsPerSquareMeter"
          },
          "bulk": {
            "value": 0,
            "unitOfMeasure": "CubicCentimeterPerGram"
          },
          "caliper": {
            "value": 0,
            "unitOfMeasure": "Micron"
          },
          "colourShade": {
            "value": "string",
            "assignedBy": "Buyer"
          },
          "colourDescription": "string",
          "recycledContent": {
            "value": 100,
            "unitOfMeasure": "Percentage"
          },
          "format": "Reel",
          "width": {
            "value": 0,
            "unitOfMeasure": "Centimeter"
          },
          "length": {
            "value": 0,
            "unitOfMeasure": "Centimeter"
          },
          "windingDirection": "WireSideIn",
          "reelMakeToConstraint": "Length",
          "reelDiameter": {
            "value": 0,
            "unitOfMeasure": "Centimeter"
          },
          "coreEndType": "Adaptor",
          "coreMaterialType": "Aluminium",
          "coreDiameterInside": {
            "value": 0,
            "unitOfMeasure": "Centimeter"
          },
          "coreStrengthCode": {
            "value": "string",
            "assignedBy": "Buyer"
          },
          "grainDirection": "Long"
        }
      },
      "customerArticleReference": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "articleNumber": {
          "value": "string",
          "assignedBy": "Supplier"
        },
        "articleName": {
          "value": "string",
          "assignedBy": "Supplier"
        }
      },
      "warehouseOperatorParty": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "partyIdentifiers": [
          {
            "value": "string",
            "assignedBy": "Supplier"
          }
        ]
      },
      "routeLegs": [
        {
          "fromLocation": {
            "type": "Mill",
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "locationIdentifiers": [
              {
                "value": "string",
                "assignedBy": "Supplier"
              }
            ]
          },
          "toLocation": {
            "type": "Mill",
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "locationIdentifiers": [
              {
                "value": "string",
                "assignedBy": "Supplier"
              }
            ]
          },
          "loadingDateTime": "string",
          "departureDateTime": "string",
          "arrivalDateTime": "string",
          "transport": {
            "modeType": "InlandWaterway",
            "unitType": "Barge"
          }
        }
      ],
      "quantities": [
        {
          "context": "Ordered",
          "type": "Area",
          "value": 0,
          "unitOfMeasure": "Bale"
        }
      ]
    }
  ]
}
```

