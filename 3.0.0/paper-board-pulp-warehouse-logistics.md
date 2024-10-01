<!-- papiNet materials are covered by the following copyright statements Copyright 2021-2024 papiNet G.I.E (papiNet). All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign. -->

# Paper, Board and Pulp Warehouse Logistics Use case

## Context

This use case is designed for _Paper, Board and Pulp_ business.

## Simplification

For now, we only consider a simplified version of the business interactions between only two types of parties: the _logistics supplier_ and the _supplier_ where the _supplier_ will host the client calling the papiNet API endpoints implemented by the _supplier_.

## Definitions

N/A

## Domain Name

We suggest that the _supplier_ (as well as the _logistics supplier_ if it uses the notification mechanism) exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _supplier_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

## Notifications

In order to get updated information on _suppier-orders_, _logistics delivery notes_ and _delivery instructions_ the _logistic suppliers_ have to call API endpoints of the _supplier_. As the _logistics suplliers_ do not know when these informations are getting updated, they should normally poll these API endpoints on a regular basis.

This polling mechanism is not optimal from an IT resources point of view, that's why we recommend the usage of notifications from the _logistics suppliers_ to the _supplier_. However, as the usage of these notifications would require additional investment on the _logistic supplier_ side, they remain an optional optimization.

For the implementation of these notifications, we recommend to use the [CloudEvents](https://cloudevents.io/) specification, which is a vendor-neutral specification for defining the format of event data. In order to ensure the decoupling between this notification mechanism and the papiNet API, we will use the CloudEvents specification following the **_thin event_** pattern. (...)

## papiNet Stub Service

You can run locally the papiNet stub service using the following command:

```text
./mock/pact-stub-server --file ./mock/papiNet.PACT.json --port 3030 --provider-state-header-name X-Provider-State
```

## Authentication

For authenticating the _logistic supplier_, we recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _logistic supplier_ sends an API request to create a session, and gets its associated _access token_:

```text
curl --request POST \
  --URL 'http://localhost:3020/tokens' \
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

**Scenario A:** Good Weather Flow

1. _Logistic supplier_ request to get all open supplier orders from _supplier_. _Logistic supplier_ receives a list of all open supplier orders, in our scenario = 1. 
2. _Logistic supplier_ request to get details of the open supplier order from _supplier_. _Logistic supplier_ receives details of the 10 packages associated with supplier order.
3. _Logistic supplier_ request to get all departed delivery notes from the _supplier_. _Logistic supplier_ receives a list of all departed delivery notes, in our scenario = 1. 
4. _Logistic supplier_ request to get details of the departed delivery note from _supplier_. _Logistic supplier_ receives details of the 10 packages loaded on the delivery note.
5. _Logistic supplier_ completes the inload of the delivery note and post logistic goods receipts towards the _supplier_.
6. _Logistic supplier_ request to get all open delivery instructions from _supplier_. _Logistic supplier_ receives a list of all open delivery instructions, in our scenario = 1.
7. _Logistic supplier_ request to get details of the open delivery instruction from _supplier_. _Logistic supplier_ receives details of the quantities planned to be delivered.
8. _Logistic supplier_ confirms the loading of the delivery instruction and post the delivery note with 10 loaded packages towards the _supplier_.

**Scenario B:** Bad Weather Flow

1. _Logistic supplier_ request to get all open supplier orders from _supplier_. _Logistic supplier_ receives a list of all open supplier orders, in our scenario = 1. 
2. _Logistic supplier_ request to get details of the open supplier order from _supplier_. _Logistic supplier_ receives details of the 10 packages associated with supplier order.
3. _Logistic supplier_ request to get all departed delivery notes from _supplier_. _Logistic supplier_ receives a list of all departed delivery notes, in our scenario = 1. 
4. _Logistic supplier_ request to get details of the departed delivery note from _supplier_. _Logistic supplier_ receives details of the 10 packages loaded on the delivery note.
5. _Logistic supplier_ completes the inload of the delivery note and post logistic goods receipts towards the _supplier_.
6. _Logistic supplier_ updates the inload of the delivery note and put logistic goods receipts towards the _supplier_ with one package indicated with variance = "Not Received", package no. 3.
7. _Logistic supplier_ request to get all open delivery instructions from _supplier_. _Logistic supplier_ receives a list of all open delivery instructions, in our scenario = 1.
8. _Logistic supplier_ request to get details of the open delivery instruction from _supplier_. _Logistic supplier_ receives details of the quantiies planned to be delivered.
9. _Logistic supplier_ confirms the loading of the delivery instruction and post the delivery note with 9 loaded packages towards the _supplier_.
10. _Logistic supplier_ updates the loading of the delivery instruction and put the delivery note correcting loading replacing package no. 3 with package no. 10 towards _supplier_.

### Scenario A: Good Weather Flow

#### Interaction 0 of Scenario A (Authentication)

The _logistic supplier_ sends an API request to the _supplier_ in order to be authenticated, and gets an _access token_:

<!-- Interaction: State_for_Interaction_0_of_Scenario_A_of_Logistics -->
```text
curl --request POST \
  --URL 'http://localhost:3020/tokens' \
  --header 'X-Provider-State: Good_Weather_Flow' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _logistic supplier_ will receive a response like this:

```json
{
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "token_type": "bearer",
  "expires_in": 86400
}
```

#### Interaction 1 of Scenario A (Get all active orders)

The authenticated _logistic supplier_ sends an API request to the _supplier_ in order to receive all active orders according to the query parameters and orders containing logistics supplier location code within delivery leg:

```text
curl --request GET \
  --URL 'http://localhost:3020/supplier-orders? active=true' \ 
  --header 'X-Provider-State: Good_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/01.get-supplier-orders.response.json -->
```json
{
  "count": 1,
  "items": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "number": "ABCD-476408",
      "timestamp": "2024-05-16T19:32:59.962Z",
      "status": "Original",
      "active": true,
      "lineItemCount": 1
    }
  ]
}
```

You can see that the _supplier_ has 1 active order. The response only contains part of the header information, to get the details of the order, including the order lines, you can see the link properties that contains a prepared API endpoint giving direct access to the full order info.
  
  We have prepared the scenario A on the order 3fa85f64-5717-4562-b3fc-2c963f66afa6.
  
#### Interaction 2 of Scenario A

The step 2 of the scenario A will simulate the situation in which the _logistic supplier_ requests to get the full order information. The _logistic supplier_ sends an API get request to the supplier in order to get the details of the order 3fa85f64-5717-4562-b3fc-2c963f66afa6:

```text
curl --request GET \
  --URL 'http://localhost:3020/supplier-orders/3fa85f64-5717-4562-b3fc-2c963f66afa6' \ 
  --header 'X-Provider-State: Good_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/02.get-supplier-orders-supplierOrderId.response.json -->
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "number": "ABCD-476408",
  "timestamp": "2024-05-16T19:32:59.962Z",
  "status": "Original",
  "active": true,
  "supplierParty": {
    "identifiers": [
      {
        "value": "MILL",
        "assignedBy": "Supplier"
      }
    ],
    "nameLines": [
      "MillName"
    ],
    "address": {
      "addressLines": [
        "Mill Road 1"
      ],
      "city": "CITY",
      "postalCode": "12345",
      "countryCode": "SE"
    }
  },
  "customerParty": {
    "identifiers": [
      {
        "value": "CUSTOMER",
        "assignedBy": "Supplier"
      }
    ],
    "nameLines": [
      "CustomerName"
    ],
    "address": {
      "addressLines": [
        "Customer Road 1"
      ],
      "city": "CITY",
      "postalCode": "23456",
      "countryCode": "BE"
    }
  },
  "buyerParty": {
    "identifiers": [
      {
        "value": "CUSTOMER",
        "assignedBy": "Supplier"
      }
    ],
    "nameLines": [
      "CustomerName"
    ],
    "address": {
      "addressLines": [
        "Customer Road 1"
      ],
      "city": "CITY",
      "postalCode": "23456",
      "countryCode": "BE"
    }
  },
  "lineItems": [
    {
      "number": 1,
      "status": "Amended",
      "purchaseOrderNumber": "924942493",
      "purchaseOrderLineItemNumber": 1,
      "sellerProduct": {
        "gradeCode": "string",
        "brandName": "string",
        "paper": {
          "basisWeight": {
            "value": 370,
            "uom": "GramsPerSquareMeter",
            "sizeType": "24x36"
          },
          "bulk": {
            "value": 1,
            "uom": "CubicCentimeterPerGram"
          },
          "caliper": {
            "value": 1,
            "uom": "Micron"
          },
          "format": "Reel",
          "width": {
            "value": 787,
            "uom": "Millimeter"
          },
          "reelDiameter": {
            "value": 1500,
            "uom": "Millimeter"
          }
        }
      },
      "millParty": {
        "identifiers": [
          {
            "value": "MILL",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
            "MillName"
        ],
        "address": {
            "addressLines": [
            "Mill Road 1"
            ],
            "city": "CITY",
            "postalCode": "12345",
            "countryCode": "SE"
        }
      },
      "deliveryLegs": [
        {
          "number": 1,
          "shipFromLocation": {
            "type": "Mill",
            "identifiers": [
              {
                "value": "MILL",
                "assignedBy": "Supplier"
              }
            ],
            "nameLines": [
              "MillName"
            ],
            "address": {
              "addressLines": [
                "Mill Road 1"
              ],
              "city": "CITY",
              "postalCode": "12345",
              "countryCode": "SE"
            }
          },
          "shipToLocation": {
            "type": "Terminal",
            "identifiers": [
              {
                "value": "TERM",
                "assignedBy": "Supplier"
              }
            ],
            "nameLines": [
              "TermName"
            ],
            "address": {
              "addressLines": [
                "Term Road 1"
              ],
              "city": "CITY2",
              "postalCode": "34567",
              "countryCode": "SE"
            }
          },
          "estimatedLoadingDateTime": "2024-05-16T12:00:00Z",
          "estimatedArrivalDateTime": "2024-05-18T17:00:00Z",
          "transport": {
            "modeType": "Road",
            "units": [
              {
                "type": "Trailer",
                "identifier": {
                  "type": "LicencePlateNumber",
                  "value": "NotAllocated",
                  "countryCode": "SE"
                }
              }
            ]
          }
        }
      ],
      "quantities": [
        {
          "context": "Confirmed",
          "type": "Count",
          "value": 10,
          "uom": "Reel"
        }
      ]
    }
  ]
}
```
#### Interaction 3 of Scenario A

In step 3 of the scenario A the _logistic supplier_ request to get all departed delivery notes from the _supplier_.:

```text
curl --request GET \
  --URL 'http://localhost:3020/delivery-notes? shipmentStatus=Departed' \ 
  --header 'X-Provider-State: Good_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/03.get-logistic-delivery-notes.response.json -->
```json
{
  "count": 1,
  "items": [
    {
      "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
      "number": "LDN12345",
      "timestamp": "2024-05-16T11:46:39Z",
      "status": "Original",
      "shipmentStatus": "Departed",
      "shipFromLocation": {
        "identifiers": [
          {
            "value": "MILL",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "MillName"
        ],
        "address": {
          "addressLines": [
            "Mill Road 1"
          ],
          "city": "CITY",
          "postalCode": "12345",
          "countryCode": "SE"
        }
      },
      "shipToLocation": {
        "identifiers": [
          {
            "value": "TERM",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "TermName"
        ],
        "address": {
          "addressLines": [
            "Term Road 1"
          ],
          "city": "CITY2",
          "postalCode": "34567",
          "countryCode": "SE"
        }
      },
      "lineItemCount": 1
    }
  ]
}
```

#### Interaction 4 of Scenario A

In step 4 of the scenario A the _logistic supplier_ request to get details of the departed delivery note from _supplier_. _Logistic supplier_ receives details of the 10 packages loaded on the delivery note.:

```text
curl --request GET \
  --URL 'http://localhost:3020/logistics-delivery-note/fc190dd0-d239-40db-8196-ea72ae5b4841' \ 
  --header 'X-Provider-State: Good_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/04.get-logistic-delivery-notes-logisticDeliveryNoteId.response.json -->
```json
{
  "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
  "number": "LDN12345",
  "timestamp": "2024-05-16T11:46:39Z",
  "status": "Original",
  "shipmentStatus": "Departed",
  "deliveryLegs": [
    {
      "number": 1,
      "shipFromLocation": {
        "identifiers": [
          {
            "value": "MILL",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "MillName"
        ],
        "address": {
          "addressLines": [
            "Mill Road 1"
          ],
          "city": "CITY",
          "postalCode": "12345",
          "countryCode": "SE"
        }
      },
      "shipToLocation": {
        "identifiers": [
          {
            "value": "TERM",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "TermName"
        ],
        "address": {
          "addressLines": [
            "Term Road 1"
          ],
          "city": "CITY2",
          "postalCode": "34567",
          "countryCode": "SE"
        }
      },
      "mainCarrierParty": {
        "identifiers": [
          {
            "value": "CARRIER",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "Transport Company 1"
        ],
        "address": {
          "addressLines": [
            "Transport Road 1",
            "Box 12"
          ],
          "city": "CITY3",
          "postalCode": "45678",
          "countryCode": "SE"
        }
      },
      "actualLoadingDateTime": "2024-05-16T12:45:00",
      "estimatedArrivalDateTime": "2024-05-18T12:45:00",
      "transport": {
        "modeType": "Road",
        "units": [
          {
            "type": "Trailer",
            "identifier": {
              "type": "LicencePlateNumber",
              "value": "ABC123",
              "countryCode": "SE"
            }
          }
        ]
      }
    }
  ],
  "lineItems": [
    {
      "number": 1,
      "status": "Original",
      "supplierOrderNumber": "ABCD-476408",
      "supplierOrderLineItemNumber": 1,
      "customerReferenceNumber": "924942493",
      "sellerProduct": {
        "gradeCode": "string",
        "brandName": "string",
        "classifications": [
        	{
        		"type": "ExportHarmonisedSystemCode",
        		"value": "4505 94 80"
        	}
        ],
        "paper": {
          "basisWeight": {
            "value": 370,
            "uom": "GramsPerSquareMeter",
            "sizeType": "24x36"
          },
          "bulk": {
            "value": 1,
            "uom": "CubicCentimeterPerGram"
          },
          "caliper": {
            "value": 1,
            "uom": "Micron"
          },
          "format": "Reel",
          "width": {
            "value": 787,
            "uom": "Millimeter"
          },
          "reelDiameter": {
            "value": 1500,
            "uom": "Millimeter"
          }
        }
      },
      "loadingCharacteristics": [
        {
          "text": "reels on end (cheese)"
        }
      ],
      "unloadingCharacteristics": [
        {
          "text": "unloading from back of vehicle"
        }
      ],
      "quantities": [
        {
          "context": "Loaded",
          "type": "Count",
          "value": 10,
          "uom": "ReelPackage"
        },
        {
          "context": "Loaded",
          "type": "GrossWeight",
          "value": 20000,
          "uom": "Kilogram"
        }
      ],
      "packages": [
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780100131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00001"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780200131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00002"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780300131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00003"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780400131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00004"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780500131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00005"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780600131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00006"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780700131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00007"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780800131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00008"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780900131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00009"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14781000131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00010"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Interaction 5 of Scenario A

In step 5 of scenario A _Logistic supplier_ completes the inload of the delivery note and post logistic goods receipts towards the _supplier_.

```text
curl -X 'POST' \
  'http://localhost:3020/logistics-goods-receipts' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "3aa556bb-7198-4107-8dd9-450845eb365a",
  "number": "GRIWMS-20240506-090833",
  "timestamp": "2024-05-18T11:10:04Z",
  "status": "Original",
  "acceptance": "AsSpecified",
  "isComplete": true,
  "deliveryNoteNumber": "LDN12345",
  "arrivalDateTime": "2024-05-18T11:08:36",
  "unloadingDateTime": "2024-05-18T11:10:04"
}
```

#### Interaction 6 of Scenario A

In step 6 of scenario A _logistic supplier_ request to get all open delivery instructions from _supplier_.

```text
curl --request GET \
  --URL 'http://localhost:3020/delivery-instructions? active=true' \ 
  --header 'X-Provider-State: Good_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/07.get-delivery-instructions.response.json -->
```json
{
    "count": 1,
    "items": [
      {
        "id": "52c5caed-57c6-4a68-97ff-b2745a514af6",
        "number": "123456SE",
        "timestamp": "2024-05-19T11:47:41Z",
        "status": "Original",
        "active": true,
        "sequenceCount": 1
      }
    ]
  }
```

#### Interaction 7 of Scenario A

In step 7 of scenario A _logistic supplier_ request to get details of the open delivery instruction from _supplier_. _Logistic supplier_ receives details of the quantities planned to be delivered.

```text
curl --request GET \
  --URL 'http://localhost:3020/delivery-instruction/52c5caed-57c6-4a68-97ff-b2745a514af6' \ 
  --header 'X-Provider-State: Good_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/08.get-delivery-instructions-deliveryInstructionId.response.json -->
```json
{
  "id": "52c5caed-57c6-4a68-97ff-b2745a514af6",
  "number": "123456SE",
  "timestamp": "2024-05-19T11:47:41Z",
  "status": "Original",
  "active": true,
  "sequences": [
    {
      "number": 1,
      "status": "New",
      "supplierParty": {
        "identifiers": [
          {
            "value": "AB",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "Company",
          "MillName"
        ],
        "address": {
          "addressLines": [
            "Mill Road 1"
          ],
          "city": "CITY",
          "postalCode": "12345",
          "countryCode": "SE"
        }
      },
      "buyerParty": {
        "identifiers": [
          {
            "value": "CUSTOMER",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "CustomerName"
        ],
        "address": {
          "addressLines": [
            "Customer Road 1"
          ],
          "city": "CITY",
          "postalCode": "23456",
          "countryCode": "BE"
        }
      },
      "deliveryLegs": [
        {
          "number": 1,
          "shipFromLocation": {
            "identifiers": [
              {
                "value": "TERM",
                "assignedBy": "Supplier"
              }
            ],
            "nameLines": [
              "TermName"
            ],
            "address": {
              "addressLines": [
                "Term Road 1"
              ],
              "city": "CITY 2",
              "postalCode": "34567",
              "countryCode": "SE"
            }
          },
          "shipToLocation": {
            "identifiers": [
              {
                "value": "DEST1",
                "assignedBy": "Supplier"
              }
            ],
            "nameLines": [
              "CustomerName"
            ],
            "address": {
              "addressLines": [
                "Customer Road 1"
              ],
              "city": "CITY",
              "postalCode": "23456",
              "countryCode": "BE"
            }
          },
          "termsOfDelivery": {
            "incoterms": {
              "location": "DEST1",
              "code": "DAP",
              "version": "2020"
            }
          },
          "mainCarrierParty": {
            "identifiers": [
              {
                "value": "TERM",
                "assignedBy": "Supplier"
              }
            ]
          },
          "requestedArrivalDateTime": "2024-05-24T10:00:00",
          "transport": {
            "modeType": "Road"
          }
        }
      ],
      "lineItems": [
        {
          "number": 1,
          "supplierOrderNumber": "ABCD-476408",
          "supplierOrderLineItemNumber": 1,
          "callOffNumber": "123456SE",
          "callOffLineItemNumber": 1,
          "quantities": [
            {
              "context": "Instructed",
              "type": "Count",
              "value": 10,
              "uom": "ReelPackage"
            },
            {
              "context": "Instructed",
              "type": "GrossWeight",
              "value": 20000,
              "uom": "Kilogram"
            }
          ],
          "loadingCharacteristics": [
            {
              "text": "GBONENDS*reels on end (cheese)"
            }
          ],
          "unloadingCharacteristics": [
            {
              "text": "GBUNREAR*unloading from back of vehicle Book in - 72h before delivery"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Interaction 8 of Scenario A

In step 8 of scenario A _logistic supplier_ confirms the loading of the delivery instruction and post the delivery note with 10 loaded packages towards the _supplier_.

```text
curl -X 'POST' \
  'http://localhost:3020/logistics-delivery-notes' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
  "number": "LDN6789",
  "timestamp": "2024-05-23T12:26:16Z",
  "status": "Original",
  "shipmentStatus": "Departed",
  "deliveryLegs": [
    {
      "number": 1,
      "shipFromLocation": {
        "identifiers": [
          {
            "value": "TERM",
            "assignedBy": "Supplier"
          }
        ]
      },
      "shipToLocation": {
        "identifiers": [
          {
            "value": "DEST1",
            "assignedBy": "Supplier"
          }
        ]
      },
      "mainCarrierParty": {
        "identifiers": [
          {
            "value": "TERM",
            "assignedBy": "Supplier"
          }
        ]
      },
      "actualDepartureDateTime": "2024-05-23T12:24:00",
      "transport": {
        "modeType": "Road",
        "units": [
          {
            "type": "Trailer",
            "identifier": {
              "type": "LicencePlateNumber",
              "value": "XX-XXX-XX",
              "countryCode": "SE"
            }
          }
        ]
      }
    }
  ],
  "lineItems": [
    {
      "number": 1,
      "status": "Original",
      "supplierOrderNumber": "ABCD-476408",
      "supplierOrderLineItemNumber": 1,
      "callOffNumber": "123456SE",
      "callOffLineItemNumber": 1,
      "quantities": [
        {
          "context": "Loaded",
          "type": "Count",
          "value": 9,
          "uom": "ReelPackage"
        },
        {
          "context": "Loaded",
          "type": "GrossWeight",
          "value": 18000,
          "uom": "Kilogram"
        }
      ],
      "packages": [
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780100131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00001"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780200131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00002"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780300131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00003"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780400131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00004"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780500131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00005"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780600131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00006"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780700131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00007"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780800131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00008"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780900131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00009"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        }
      ]
    }
  ]
}
```

### Scenario B: Bad Weather Flow

#### Interaction 0 of Scenario B (Authentication)

The _logistic supplier_ sends an API request to the _supplier_ in order to be authenticated, and gets an _access token_:

```text
curl --request POST \
  --URL 'http://localhost:3020/tokens' \
  --header 'X-Provider-State: Bad_Weather_Flow' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _logistic supplier_ will receive a response like this:

```json
{
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "token_type": "bearer",
  "expires_in": 86400
}
```

#### Interaction 1 of Scenario B (Get all active orders)

The authenticated _logistic supplier_ sends an API request to the _supplier_ in order to receive all active orders according to the query parameters and orders containing logistics supplier location code within delivery leg:

```text
curl --request GET \
  --URL 'http://localhost:3020/supplier-orders? active=true' \ 
  --header 'X-Provider-State: Bad_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/01.get-supplier-orders.response.json -->
```json
{
  "count": 1,
  "items": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "number": "ABCD-476408",
      "timestamp": "2024-05-16T19:32:59.962Z",
      "status": "Original",
      "active": true,
      "lineItemCount": 1
    }
  ]
}
```

You can see that the _supplier_ has 1 active order. The response only contains part of the header information, to get the details of the order, including the order lines, you can see the link properties that contains a prepared API endpoint giving direct access to the full order info.

We have prepared the scenario B on the order 3fa85f64-5717-4562-b3fc-2c963f66afa6.

#### Interaction 2 of Scenario B

The step 2 of the scenario B will simulate the situation in which the _logistic supplier_ requests to get the full order information. The _logistic supplier_ sends an API get request to the supplier in order to get the details of the order 3fa85f64-5717-4562-b3fc-2c963f66afa6:

```text
curl --request GET \
  --URL 'http://localhost:3020/supplier-orders/3fa85f64-5717-4562-b3fc-2c963f66afa6' \ 
  --header 'X-Provider-State: Bad_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/02.get-supplier-orders-supplierOrderId.response.json -->
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "number": "ABCD-476408",
  "timestamp": "2024-05-16T19:32:59.962Z",
  "status": "Original",
  "active": true,
  "supplierParty": {
    "identifiers": [
      {
        "value": "MILL",
        "assignedBy": "Supplier"
      }
    ],
    "nameLines": [
      "MillName"
    ],
    "address": {
      "addressLines": [
        "Mill Road 1"
      ],
      "city": "CITY",
      "postalCode": "12345",
      "countryCode": "SE"
    }
  },
  "customerParty": {
    "identifiers": [
      {
        "value": "CUSTOMER",
        "assignedBy": "Supplier"
      }
    ],
    "nameLines": [
      "CustomerName"
    ],
    "address": {
      "addressLines": [
        "Customer Road 1"
      ],
      "city": "CITY",
      "postalCode": "23456",
      "countryCode": "BE"
    }
  },
  "buyerParty": {
    "identifiers": [
      {
        "value": "CUSTOMER",
        "assignedBy": "Supplier"
      }
    ],
    "nameLines": [
      "CustomerName"
    ],
    "address": {
      "addressLines": [
        "Customer Road 1"
      ],
      "city": "CITY",
      "postalCode": "23456",
      "countryCode": "BE"
    }
  },
  "lineItems": [
    {
      "number": 1,
      "status": "Amended",
      "purchaseOrderNumber": "924942493",
      "purchaseOrderLineItemNumber": 1,
      "sellerProduct": {
        "gradeCode": "string",
        "brandName": "string",
        "paper": {
          "basisWeight": {
            "value": 370,
            "uom": "GramsPerSquareMeter",
            "sizeType": "24x36"
          },
          "bulk": {
            "value": 1,
            "uom": "CubicCentimeterPerGram"
          },
          "caliper": {
            "value": 1,
            "uom": "Micron"
          },
          "format": "Reel",
          "width": {
            "value": 787,
            "uom": "Millimeter"
          },
          "reelDiameter": {
            "value": 1500,
            "uom": "Millimeter"
          }
        }
      },
      "millParty": {
        "identifiers": [
          {
            "value": "MILL",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
            "MillName"
        ],
        "address": {
            "addressLines": [
            "Mill Road 1"
            ],
            "city": "CITY",
            "postalCode": "12345",
            "countryCode": "SE"
        }
      },
      "deliveryLegs": [
        {
          "number": 1,
          "shipFromLocation": {
            "type": "Mill",
            "identifiers": [
              {
                "value": "MILL",
                "assignedBy": "Supplier"
              }
            ],
            "nameLines": [
              "MillName"
            ],
            "address": {
              "addressLines": [
                "Mill Road 1"
              ],
              "city": "CITY",
              "postalCode": "12345",
              "countryCode": "SE"
            }
          },
          "shipToLocation": {
            "type": "Terminal",
            "identifiers": [
              {
                "value": "TERM",
                "assignedBy": "Supplier"
              }
            ],
            "nameLines": [
              "TermName"
            ],
            "address": {
              "addressLines": [
                "Term Road 1"
              ],
              "city": "CITY2",
              "postalCode": "34567",
              "countryCode": "SE"
            }
          },
          "estimatedLoadingDateTime": "2024-05-16T12:00:00Z",
          "estimatedArrivalDateTime": "2024-05-18T17:00:00Z",
          "transport": {
            "modeType": "Road",
            "units": [
              {
                "type": "Trailer",
                "identifier": {
                  "type": "LicencePlateNumber",
                  "value": "NotAllocated",
                  "countryCode": "SE"
                }
              }
            ]
          }
        }
      ],
      "quantities": [
        {
          "context": "Confirmed",
          "type": "Count",
          "value": 10,
          "uom": "Reel"
        }
      ]
    }
  ]
}
```
#### Interaction 3 of Scenario B

In step 3 of the scenario B the _logistic supplier_ request to get all departed delivery notes from the _supplier_.:

```text
curl --request GET \
  --URL 'http://localhost:3020/delivery-notes? shipmentStatus=Departed' \ 
  --header 'X-Provider-State: Bad_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/03.get-logistic-delivery-notes.response.json -->
```json
{
  "count": 1,
  "items": [
    {
      "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
      "number": "LDN12345",
      "timestamp": "2024-05-16T11:46:39Z",
      "status": "Original",
      "shipmentStatus": "Departed",
      "shipFromLocation": {
        "identifiers": [
          {
            "value": "MILL",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "MillName"
        ],
        "address": {
          "addressLines": [
            "Mill Road 1"
          ],
          "city": "CITY",
          "postalCode": "12345",
          "countryCode": "SE"
        }
      },
      "shipToLocation": {
        "identifiers": [
          {
            "value": "TERM",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "TermName"
        ],
        "address": {
          "addressLines": [
            "Term Road 1"
          ],
          "city": "CITY2",
          "postalCode": "34567",
          "countryCode": "SE"
        }
      },
      "lineItemCount": 1
    }
  ]
}
```

#### Interaction 4 of Scenario B

In step 4 of the scenario B the _logistic supplier_ request to get details of the departed delivery note from _supplier_. _Logistic supplier_ receives details of the 10 packages loaded on the delivery note.:

```text
curl --request GET \
  --URL 'http://localhost:3020/logistics-delivery-note/fc190dd0-d239-40db-8196-ea72ae5b4841' \ 
  --header 'X-Provider-State: Bad_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/04.get-logistic-delivery-notes-logisticDeliveryNoteId.response.json -->
```json
{
  "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
  "number": "LDN12345",
  "timestamp": "2024-05-16T11:46:39Z",
  "status": "Original",
  "shipmentStatus": "Departed",
  "deliveryLegs": [
    {
      "number": 1,
      "shipFromLocation": {
        "identifiers": [
          {
            "value": "MILL",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "MillName"
        ],
        "address": {
          "addressLines": [
            "Mill Road 1"
          ],
          "city": "CITY",
          "postalCode": "12345",
          "countryCode": "SE"
        }
      },
      "shipToLocation": {
        "identifiers": [
          {
            "value": "TERM",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "TermName"
        ],
        "address": {
          "addressLines": [
            "Term Road 1"
          ],
          "city": "CITY2",
          "postalCode": "34567",
          "countryCode": "SE"
        }
      },
      "mainCarrierParty": {
        "identifiers": [
          {
            "value": "CARRIER",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "Transport Company 1"
        ],
        "address": {
          "addressLines": [
            "Transport Road 1",
            "Box 12"
          ],
          "city": "CITY3",
          "postalCode": "45678",
          "countryCode": "SE"
        }
      },
      "actualLoadingDateTime": "2024-05-16T12:45:00",
      "estimatedArrivalDateTime": "2024-05-18T12:45:00",
      "transport": {
        "modeType": "Road",
        "units": [
          {
            "type": "Trailer",
            "identifier": {
              "type": "LicencePlateNumber",
              "value": "ABC123",
              "countryCode": "SE"
            }
          }
        ]
      }
    }
  ],
  "lineItems": [
    {
      "number": 1,
      "status": "Original",
      "supplierOrderNumber": "ABCD-476408",
      "supplierOrderLineItemNumber": 1,
      "customerReferenceNumber": "924942493",
      "sellerProduct": {
        "gradeCode": "string",
        "brandName": "string",
        "classifications": [
        	{
        		"type": "ExportHarmonisedSystemCode",
        		"value": "4505 94 80"
        	}
        ],
        "paper": {
          "basisWeight": {
            "value": 370,
            "uom": "GramsPerSquareMeter",
            "sizeType": "24x36"
          },
          "bulk": {
            "value": 1,
            "uom": "CubicCentimeterPerGram"
          },
          "caliper": {
            "value": 1,
            "uom": "Micron"
          },
          "format": "Reel",
          "width": {
            "value": 787,
            "uom": "Millimeter"
          },
          "reelDiameter": {
            "value": 1500,
            "uom": "Millimeter"
          }
        }
      },
      "loadingCharacteristics": [
        {
          "text": "reels on end (cheese)"
        }
      ],
      "unloadingCharacteristics": [
        {
          "text": "unloading from back of vehicle"
        }
      ],
      "quantities": [
        {
          "context": "Loaded",
          "type": "Count",
          "value": 10,
          "uom": "ReelPackage"
        },
        {
          "context": "Loaded",
          "type": "GrossWeight",
          "value": 20000,
          "uom": "Kilogram"
        }
      ],
      "packages": [
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780100131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00001"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780200131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00002"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780300131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00003"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780400131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00004"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780500131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00005"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780600131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00006"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780700131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00007"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780800131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00008"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780900131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00009"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14781000131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00010"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Interaction 5 of Scenario B

In step 5 of scenario B _Logistic supplier_ completes the inload of the delivery note and post logistic goods receipts towards the _supplier_.

```text
curl -X 'POST' \
  'http://localhost:3020/logistics-goods-receipts' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "3aa556bb-7198-4107-8dd9-450845eb365a",
  "number": "GRIWMS-20240506-090833",
  "timestamp": "2024-05-18T11:10:04Z",
  "status": "Original",
  "acceptance": "AsSpecified",
  "isComplete": true,
  "deliveryNoteNumber": "LDN12345",
  "arrivalDateTime": "2024-05-18T11:08:36",
  "unloadingDateTime": "2024-05-18T11:10:04"
}
```

#### Interaction 6 of Scenario B

In step 6 of scenario B _logistic supplier_ updates the inload of the delivery note and put logistic goods receipts towards the _supplier_ with one package indicated with variance = "Not Received", package no. 3.

```text
curl -X 'POST' \
  'http://localhost:3020/logistics-goods-receipts' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
 "id": "3aa556bb-7198-4107-8dd9-450845eb365b",
  "number": "GRIWMS-20240506-090833",
  "timestamp": "2024-05-18T11:16:49Z",
  "status": "Replaced",
  "acceptance": "WithVariance",
  "isComplete": true,
  "deliveryNoteNumber": "LDN12345",
  "arrivalDateTime": "2024-05-18T11:08:36",
  "unloadingDateTime": "2024-05-18T11:10:04",
  "lineItems": [
    {
      "number": 1,
      "acceptance": "WithVariance",
      "supplierOrderNumber": "ABCD-476408",
      "supplierOrderLineItemNumber": 1,
      "packages": [
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780100131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00001"
            }
          ],
          "acceptance": "AsSpecified"
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780200131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00002"
            }
          ],
          "acceptance": "AsSpecified"
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780300131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00003"
            }
          ],
          "acceptance": "WithVariance",
          "varianceType": "NotReceived"
        },  
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780400131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00004"
            }
          ],
          "acceptance": "AsSpecified"
        },  
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780500131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00005"
            }
          ],
          "acceptance": "AsSpecified"
        },  
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780600131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00006"
            }
          ],
          "acceptance": "AsSpecified"
        },  
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780700131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00007"
            }
          ],
          "acceptance": "AsSpecified"
        },  
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780800131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00008"
            }
          ],
          "acceptance": "AsSpecified"
        },  
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780900131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00009"
            }
          ],
          "acceptance": "AsSpecified"
        },  
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14781000131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00010"
            }
          ],
          "acceptance": "AsSpecified"
        }  
      ]
    }
  ]
}
```
#### Interaction 7 of Scenario B

In step 7 of scenario B _logistic supplier_ request to get all open delivery instructions from _supplier_.

```text
curl --request GET \
  --URL 'http://localhost:3020/delivery-instructions? active=true' \ 
  --header 'X-Provider-State: Bad_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/07.get-delivery-instructions.response.json -->
```json
{
    "count": 1,
    "items": [
      {
        "id": "52c5caed-57c6-4a68-97ff-b2745a514af6",
        "number": "123456SE",
        "timestamp": "2024-05-19T11:47:41Z",
        "status": "Original",
        "active": true,
        "sequenceCount": 1
      }
    ]
  }
```

#### Interaction 8 of Scenario B

In step 8 of scenario B _logistic supplier_ request to get details of the open delivery instruction from _supplier_. _Logistic supplier_ receives details of the quantities planned to be delivered. The _logistic supplier_ is requested to load 9 packages. 

```text
curl --request GET \
  --URL 'http://localhost:3020/delivery-instruction/52c5caed-57c6-4a68-97ff-b2745a514af6' \ 
  --header 'X-Provider-State: Good_Weather_Flow' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json' \
```

If all goes well, the _logistic supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/08.get-delivery-instructions-deliveryInstructionId.response.json -->
```json
{
  "id": "52c5caed-57c6-4a68-97ff-b2745a514af6",
  "number": "123456SE",
  "timestamp": "2024-05-19T11:47:41Z",
  "status": "Original",
  "active": true,
  "sequences": [
    {
      "number": 1,
      "status": "New",
      "supplierParty": {
        "identifiers": [
          {
            "value": "AB",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "Company",
          "MillName"
        ],
        "address": {
          "addressLines": [
            "Mill Road 1"
          ],
          "city": "CITY",
          "postalCode": "12345",
          "countryCode": "SE"
        }
      },
      "buyerParty": {
        "identifiers": [
          {
            "value": "CUSTOMER",
            "assignedBy": "Supplier"
          }
        ],
        "nameLines": [
          "CustomerName"
        ],
        "address": {
          "addressLines": [
            "Customer Road 1"
          ],
          "city": "CITY",
          "postalCode": "23456",
          "countryCode": "BE"
        }
      },
      "deliveryLegs": [
        {
          "number": 1,
          "shipFromLocation": {
            "identifiers": [
              {
                "value": "TERM",
                "assignedBy": "Supplier"
              }
            ],
            "nameLines": [
              "TermName"
            ],
            "address": {
              "addressLines": [
                "Term Road 1"
              ],
              "city": "CITY 2",
              "postalCode": "34567",
              "countryCode": "SE"
            }
          },
          "shipToLocation": {
            "identifiers": [
              {
                "value": "DEST1",
                "assignedBy": "Supplier"
              }
            ],
            "nameLines": [
              "CustomerName"
            ],
            "address": {
              "addressLines": [
                "Customer Road 1"
              ],
              "city": "CITY",
              "postalCode": "23456",
              "countryCode": "BE"
            }
          },
          "termsOfDelivery": {
            "incoterms": {
              "location": "DEST1",
              "code": "DAP",
              "version": "2020"
            }
          },
          "mainCarrierParty": {
            "identifiers": [
              {
                "value": "TERM",
                "assignedBy": "Supplier"
              }
            ]
          },
          "requestedArrivalDateTime": "2024-05-24T10:00:00",
          "transport": {
            "modeType": "Road"
          }
        }
      ],
      "lineItems": [
        {
          "number": 1,
          "supplierOrderNumber": "ABCD-476408",
          "supplierOrderLineItemNumber": 1,
          "callOffNumber": "123456SE",
          "callOffLineItemNumber": 1,
          "quantities": [
            {
              "context": "Instructed",
              "type": "Count",
              "value": 9,
              "uom": "ReelPackage"
            },
            {
              "context": "Instructed",
              "type": "GrossWeight",
              "value": 18000,
              "uom": "Kilogram"
            }
          ],
          "loadingCharacteristics": [
            {
              "text": "GBONENDS*reels on end (cheese)"
            }
          ],
          "unloadingCharacteristics": [
            {
              "text": "GBUNREAR*unloading from back of vehicle Book in - 72h before delivery"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Interaction 9 of Scenario B

In step 9 of scenario B _logistic supplier_ confirms the loading of the delivery instruction and post the delivery note with 9 loaded packages towards the _supplier_.

```text
curl -X 'POST' \
  'http://localhost:3020/logistics-delivery-notes' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
  "number": "LDN6789",
  "timestamp": "2024-05-23T12:26:16Z",
  "status": "Original",
  "shipmentStatus": "Departed",
  "deliveryLegs": [
    {
      "number": 1,
      "shipFromLocation": {
        "identifiers": [
          {
            "value": "TERM",
            "assignedBy": "Supplier"
          }
        ]
      },
      "shipToLocation": {
        "identifiers": [
          {
            "value": "DEST1",
            "assignedBy": "Supplier"
          }
        ]
      },
      "mainCarrierParty": {
        "identifiers": [
          {
            "value": "TERM",
            "assignedBy": "Supplier"
          }
        ]
      },
      "actualDepartureDateTime": "2024-05-23T12:24:00",
      "transport": {
        "modeType": "Road",
        "units": [
          {
            "type": "Trailer",
            "identifier": {
              "type": "LicencePlateNumber",
              "value": "XX-XXX-XX",
              "countryCode": "SE"
            }
          }
        ]
      }
    }
  ],
  "lineItems": [
    {
      "number": 1,
      "status": "Original",
      "supplierOrderNumber": "ABCD-476408",
      "supplierOrderLineItemNumber": 1,
      "callOffNumber": "123456SE",
      "callOffLineItemNumber": 1,
      "quantities": [
        {
          "context": "Loaded",
          "type": "Count",
          "value": 9,
          "uom": "ReelPackage"
        },
        {
          "context": "Loaded",
          "type": "GrossWeight",
          "value": 18000,
          "uom": "Kilogram"
        }
      ],
      "packages": [
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780100131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00001"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780200131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00002"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780300131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00003"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780400131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00004"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780500131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00005"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780600131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00006"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780700131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00007"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780800131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00008"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780900131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00009"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Interaction 10 of Scenario B

In step 10 of scenario B the _logistic supplier_ updates the loading of the delivery instruction and put the delivery note towards the _supplier_ correcting loading, replacing package no. 3 (which has previously been reported as "NotReceived") with package no. 10.

```text
curl -X 'POST' \
  'http://localhost:3020/logistics-delivery-notes' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
  "number": "LDN6789",
  "timestamp": "2024-05-23T12:26:16Z",
  "status": "Replaced",
  "shipmentStatus": "Departed",
  "deliveryLegs": [
    {
      "number": 1,
      "shipFromLocation": {
        "identifiers": [
          {
            "value": "TERM",
            "assignedBy": "Supplier"
          }
        ]
      },
      "shipToLocation": {
        "identifiers": [
          {
            "value": "DEST1",
            "assignedBy": "Supplier"
          }
        ]
      },
      "mainCarrierParty": {
        "identifiers": [
          {
            "value": "TERM",
            "assignedBy": "Supplier"
          }
        ]
      },
      "actualDepartureDateTime": "2024-05-23T12:24:00",
      "transport": {
        "modeType": "Road",
        "units": [
          {
            "type": "Trailer",
            "identifier": {
              "type": "LicencePlateNumber",
              "value": "XX-XXX-XX",
              "countryCode": "SE"
            }
          }
        ]
      }
    }
  ],
  "lineItems": [
    {
      "number": 1,
      "status": "Original",
      "supplierOrderNumber": "ABCD-476408",
      "supplierOrderLineItemNumber": 1,
      "callOffNumber": "123456SE",
      "callOffLineItemNumber": 1,
      "quantities": [
        {
          "context": "Loaded",
          "type": "Count",
          "value": 9,
          "uom": "ReelPackage"
        },
        {
          "context": "Loaded",
          "type": "GrossWeight",
          "value": 18000,
          "uom": "Kilogram"
        }
      ],
      "packages": [
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780100131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00001"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780200131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00002"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14781000131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00010"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780400131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00004"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780500131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00005"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780600131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00006"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780700131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00007"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780800131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00008"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        },
        {
          "type": "ReelPackage",
          "identifiers": [
            {
              "role": "Secondary",
              "type": "Barcode",
              "codeType": "UIC14",
              "value": "14780900131814"
            },
            {
              "role": "Primary",
              "type": "Number",
              "codeType": "Supplier",
              "value": "00009"
            }
          ],
          "quantities": [
            {
              "context": "Loaded",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "NetWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Loaded",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Loaded",
              "type": "Area",
              "value": 3500,
              "uom": "SquareMeter"
            }
          ]
        }
      ]
    }
  ]
}
```
