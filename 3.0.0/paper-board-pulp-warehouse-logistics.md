<!-- Copyright 2000-2024 Papinet SNC ("papiNet") the "Copyright Owner". All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign. For support, more information, or to report implementation bugs, please contact papiNet at https://github.com/papinet. -->

# Paper, Board and Pulp Warehouse Logistics Use case

## Context

This use case is designed for _Paper_, _Board_ and _Pulp_ businesses.

## Simplification

For now, we only consider a simplified version of the business interactions between only two types of parties: the _logistics supplier_ and the _supplier_, where the _logistics supplier_ will host the client calling the papiNet API endpoints implemented by the _supplier_.

## Domain Name

We suggest that the _supplier_ (as well as the _logistics supplier_ if it uses the notification mechanism) exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _supplier_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

## Notifications

In order to get updated information on _suppier-orders_, _logistics delivery notes_ and _delivery instructions_ the _logistics suppliers_ have to call API endpoints of the _supplier_. As the _logistics suplliers_ do not know when these informations are getting updated, they should normally poll these API endpoints on a regular basis.

This polling mechanism is not optimal from an IT resources point of view, that's why we recommend the usage of notifications from the _logistics suppliers_ to the _supplier_. However, as the usage of these notifications would require additional investment on the _logistics supplier_ side, they remain an optional optimization.

For the implementation of these notifications, we recommend to use the [CloudEvents](https://cloudevents.io/) specification, which is a vendor-neutral specification for defining the format of event data. In order to ensure the decoupling between this notification mechanism and the papiNet API, we will use the CloudEvents specification following the **_thin event_** pattern. (...)

## papiNet Stub Service

You can run locally the papiNet stub service using the following command:

```text
pact-stub-server --file ./mock/papiNet.PACT.json --port 3030 --provider-state-header-name X-Provider-State
```

## Authentication

For authenticating the _logistics supplier_, we recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _logistics supplier_ sends an API request to create a session, and gets its associated _access token_:

```text
curl --request POST \
  --url 'http://localhost:3030/tokens' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _logistics supplier_ will receive a response like this:

```json
{ 
  "access_token": "1a27ae3f-02f3-4355-8a70-9ed547d0ccf8",
  "token_type": "bearer",
  "expires_in_": 86400
}
```

## Scenarios 

**Scenario A:** Good Weather Flow

This should illustrate the information exchange between logistics supplier and the supplier, process start when goods is produced by the supplier and end when goods are dispatched towards the suppliers customer. Inbound delivery note, inloading as well as delivery instruction and outbound delivery note from the logistics supplier are covered in the scenario.

1. _Logistics supplier_ **requests** to get all active _supplier-orders_ from _supplier_.
_Logistics supplier_ **receives** a list of all active _supplier-orders_.
In this scenario, there is 1 _supplier-order_.

2. _Logistics supplier_ **requests** to get details of the one specific active _supplier-order_ from _supplier_.
_Logistics supplier_ **receives** details of this _supplier-order_, including the number of _reels_.
In this scenario, there are 10 _reels_.

3. _Logistics supplier_ **requests** to get all departed _delivery-notes_ from the _supplier_.
_Logistics supplier_ **receives** a list of all departed _delivery-notes_.
In this scenario, there is 1 _delivery-note_.

4. _Logistics supplier_ **requests** to get details of the one specific departed _delivery-note_ from _supplier_.
_Logistics supplier_ **receives** details of this _delivery-note_.
In this scenario, there are 10 _packages_ loaded on this _delivery-note_.

5. _Logistics supplier_ completes the inload of the delivery described in the _delivery-note_ and **posts** a _goods-receipt_ to the _supplier_.

6. _Logistics supplier_ **requests** to get all active _delivery-instructions_ from _supplier_.
_Logistics supplier_ **receives** a list of all active _delivery-instructions_.
In this scenario, there is 1 _delivery-instruction_.

7. _Logistics supplier_ **requests** to get details of the one specific active _delivery-instruction_ from _supplier_.
_Logistics supplier_ **receives** details of this _delivery-instruction_, including the quantities planned to be delivered.

8. _Logistics supplier_ completes the loading of the delivery described in the _delivery-instruction_ and **posts** a _delivery-note_, including 10 loaded _packages_, to the _supplier_.

**Scenario B:** Bad Weather Flow

This should illustrate the same information exchange as in Scenario A – Good Weather flow, but in addition some common supply chain discrepancies have been added such as shortlanded reporting (package not received) as well as incorrect outbound delivery note reporting from the logistics supplier.   

1. _Logistics supplier_ **requests** to get all active _supplier-orders_ from _supplier_.
_Logistics supplier_ **receives** a list of all active _supplier-orders_.
In this scenario, there is 1 _supplier-order_.

2. _Logistics supplier_ **requests** to get details of the one specific active _supplier-order_ from _supplier_.
_Logistics supplier_ **receives** details of this _supplier-order_, including the number of _packages_.
In this scenario, there are 10 _packages_.

3. _Logistics supplier_ **requests** to get all departed _delivery-notes_ from the _supplier_.
_Logistics supplier_ **receives** a list of all departed _delivery-notes_.
In this scenario, there is 1 _delivery-note_.

4. _Logistics supplier_ **requests** to get details of the one specific departed _delivery-note_ from _supplier_.
_Logistics supplier_ **receives** details of this _delivery-note_.
In this scenario, there are 10 _packages_ loaded on this _delivery-note_.

5. _Logistics supplier_ completes the inload of the delivery described in the _delivery-note_ and **posts** a _goods-receipt_ to the _supplier_.

6. _Logistics supplier_ realises that one _package_ is missing and **puts/updates** the _goods-receipt_ to the _supplier_ with the package no. 3 indicated with variance "Not Received", while indicating all the other _packages_ as "AsSpecified".

7. _Logistics supplier_ **requests** to get all active _delivery-instructions_ from _supplier_.
_Logistics supplier_ **receives** a list of all active _delivery-instructions_.
In this scenario, there is 1 _delivery-instruction_.

8. _Logistics supplier_ **requests** to get details of the one specific active _delivery-instruction_ from _supplier_.
_Logistics supplier_ **receives** details of this _delivery-instruction_, including the quantities planned to be delivered.

9. _Logistics supplier_ completes the loading of the delivery described in the _delivery-instruction_ and **posts** a _delivery-note_, including 9 loaded _packages_, to the _supplier_. However, this _delivery_note_ wrongly reports the package no. 3 as loaded, althought it should have been the package no. 10.

10. _Logistics supplier_ updates the loading of the delivery instruction and **puts/updates** the delivery note correcting the loading replacing _package_ no. 3 with package no. 10 to _supplier_.

### Scenario A: Good Weather Flow

#### Interaction 0 of Scenario A (Authentication)

The _logistics supplier_ sends an API request to the _supplier_ in order to be authenticated, and gets an _access token_:

```text
curl --request POST \
  --url 'http://localhost:3030/tokens' \
  --header 'X-Provider-State: Interaction_0_of_Scenario_A' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW00&BW00.post-tokens.response.json -->
```json
{
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "token_type": "bearer",
  "expires_in": 86400
}
```

#### Interaction 1 of Scenario A (Get all active orders)

The authenticated _logistics supplier_ sends an API request to the _supplier_ in order to receive all active _supplier-orders_ according to the query parameters:

```text
curl --request GET \
  --url 'http://localhost:3030/supplier-orders?active=true' \
  --header 'X-Provider-State: Interaction_1_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW01&BW01.get-supplier-orders.response.json -->
```json
{
  "count": 1,
  "items": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "number": "ABCD-476408",
      "timestamp": "2024-05-16T19:32:59.962Z",
      "cancelled": false,
      "active": true,
      "lineItemCount": 1
    }
  ]
}
```

You can see that the _supplier_ has 1 active order. The response only contains part of the header information, to get the details of the order, including the order lines, you can see the link properties that contains a prepared API endpoint giving direct access to the full order info.
  
  We have prepared the scenario A on the order 3fa85f64-5717-4562-b3fc-2c963f66afa6.

#### Interaction 2 of Scenario A

The step 2 of the scenario A will simulate the situation in which the _logistics supplier_ requests to get the full order information. The _logistics supplier_ sends an API get request to the supplier in order to get the details of the order 3fa85f64-5717-4562-b3fc-2c963f66afa6:

```text
curl --request GET \
  --url 'http://localhost:3030/supplier-orders/3fa85f64-5717-4562-b3fc-2c963f66afa6' \
  --header 'X-Provider-State: Interaction_2_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW02&BW02.get-supplier-orders-supplierOrderId.response.json -->
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "number": "ABCD-476408",
  "timestamp": "2024-05-16T19:32:59.962Z",
  "cancelled": false,
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
      "cancelled": false,
      "purchaseOrderNumber": "924942493",
      "purchaseOrderLineItemNumber": 1,
      "sellerProduct": {
        "gradeCode": "string",
        "brandName": "string",
        "paperAndBoard": {
          "basisWeight": {
            "value": 550,
            "uom": "GramsPerSquareMeter"
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
            "value": 875,
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
          "estimatedLoadingDateTime": "2024-05-16T12:00",
          "estimatedArrivalDateTime": "2024-05-18T17:00",
          "transport": {
            "modeType": "Road"
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

In step 3 of the scenario A the _logistics supplier_ request to get all departed delivery notes from the _supplier_.:

```text
curl --request GET \
  --url 'http://localhost:3030/delivery-notes?shipmentStatus=Departed' \
  --header 'X-Provider-State: Interaction_3_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW03&BW03.get-logistic-delivery-notes.response.json -->
```json
{
  "count": 1,
  "items": [
    {
      "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
      "number": "LDN12345",
      "timestamp": "2024-05-16T11:46:39Z",
      "cancelled": false,
      "active": true,
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

In step 4 of the scenario A the _logistics supplier_ request to get details of the departed delivery note from _supplier_. _Logistics supplier_ receives details of the 10 packages loaded on the delivery note.:

```text
curl --request GET \
  --url 'http://localhost:3030/logistics-delivery-note/fc190dd0-d239-40db-8196-ea72ae5b4841' \
  --header 'X-Provider-State: Interaction_4_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW04&BW04.get-logistic-delivery-notes-logisticDeliveryNoteId.response.json -->
```json
{
  "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
  "number": "LDN12345",
  "timestamp": "2024-05-16T11:46:39Z",
  "cancelled": false,
  "active": true,
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
      "estimatedArrivalDateTime": "2024-05-18T12:45",
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
      "supplierOrderNumber": "ABCD-476408",
      "supplierOrderLineItemNumber": 1,
      "customerReferenceNumber": "924942493",
      "sellerProduct": {
        "gradeCode": "string",
        "brandName": "string",
        "classifications": [
        	{
        		"type": "ExportHarmonisedSystemCode",
        		"value": "4505 94 80",
            "countryCode": "SE"
        	}
        ],
        "paperAndBoard": {
          "basisWeight": {
            "value": 550,
            "uom": "GramsPerSquareMeter"
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
            "value": 875,
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
          "type": "Standing",
          "labelOrientation": "BackEndSide"
        }
      ],
      "unloadingCharacteristics": [
        {
          "text": "unloading from back of vehicle"
        }
      ],
      "quantities": [
        {
          "context": "Shipped",
          "type": "Count",
          "value": 10,
          "uom": "ReelPackage"
        },
        {
          "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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

In step 5 of scenario A _Logistics supplier_ completes the inload of the delivery note and post logistic goods receipts towards the _supplier_.

<!-- request-file: ../3.0.0/mock/GW05&BW05.post-logistic-goods-receipts.request.json -->
```text
curl --request POST \
  -url 'http://localhost:3030/logistics-goods-receipts' \
  --header 'X-Provider-State: Interaction_5_of_Scenario_A' \
  --header 'Content-Type: application/json'
  --data '{ \
    "id": "3aa556bb-7198-4107-8dd9-450845eb365a", \
    "number": "GRIWMS-20240506-090833", \
    "timestamp": "2024-05-18T11:10:04Z", \
    "cancelled": false, \
    "active": true, \
    "acceptance": "AsSpecified", \
    "isComplete": true, \
    "deliveryNoteNumber": "LDN12345", \
    "deliveryNoteTimestamp": "2024-05-16T11:46:39Z", \
    "arrivalDateTime": "2024-05-18T11:08:36", \
    "unloadingDateTime": "2024-05-18T11:10:04" \
  }
```

#### Interaction 6 of Scenario A

In step 6 of scenario A _logistics supplier_ request to get all active delivery instructions from _supplier_.

```text
curl --request GET \
  --url 'http://localhost:3030/delivery-instructions?active=true' \
  --header 'X-Provider-State: Interaction_6_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW06&BW07.get-delivery-instructions.response.json -->
```json
{
    "count": 1,
    "items": [
      {
        "id": "52c5caed-57c6-4a68-97ff-b2745a514af6",
        "number": "123456SE",
        "timestamp": "2024-05-19T11:47:41Z",
        "cancelled": false,
        "active": true,
        "sequenceCount": 1
      }
    ]
  }
```

#### Interaction 7 of Scenario A

In step 7 of scenario A _logistics supplier_ request to get details of the active delivery instruction from _supplier_. _Logistics supplier_ receives details of the quantities planned to be delivered.

```text
curl --request GET \
  --url 'http://localhost:3030/delivery-instruction/52c5caed-57c6-4a68-97ff-b2745a514af6' \
  --header 'X-Provider-State: Interaction_7_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW07.get-delivery-instructions-deliveryInstructionId.response.json -->
```json
{
  "id": "52c5caed-57c6-4a68-97ff-b2745a514af6",
  "number": "123456SE",
  "timestamp": "2024-05-19T11:47:41Z",
  "cancelled": false,
  "active": true,
  "sequences": [
    {
      "number": 1,
      "cancelled": false,
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
          "requestedArrivalDateTime": "2024-05-24T10:00",
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
              "type": "Standing",
              "labelOrientation": "BackEndSide"
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

In step 8 of scenario A _logistics supplier_ confirms the loading of the delivery instruction and post the delivery note with 10 loaded packages towards the _supplier_.

<!-- request-file: ../3.0.0/mock/GW08.post-logistic-delivery-notes.request.json -->
```text
curl --request 'POST' \
  'http://localhost:3030/logistics-delivery-notes' \
  --header 'X-Provider-State: Interaction_!_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
    "number": "LDN6789",
    "timestamp": "2024-05-23T12:26:16Z",
    "cancelled": false,
    "active": true,
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
        "supplierOrderNumber": "ABCD-476408",
        "supplierOrderLineItemNumber": 1,
        "callOffNumber": "123456SE",
        "callOffLineItemNumber": 1,
        "quantities": [
          {
            "context": "Shipped",
            "type": "Count",
            "value": 10,
            "uom": "ReelPackage"
          },
          {
            "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetNetWeight",
                "value": 1925,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetNetWeight",
                "value": 1925,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetNetWeight",
                "value": 1925,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetNetWeight",
                "value": 1925,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetNetWeight",
                "value": 1925,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetNetWeight",
                "value": 1925,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetNetWeight",
                "value": 1925,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetNetWeight",
                "value": 1925,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetNetWeight",
                "value": 1925,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetNetWeight",
                "value": 1925,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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

The _logistics supplier_ sends an API request to the _supplier_ in order to be authenticated, and gets an _access token_:

```text
curl --request POST \
  --url 'http://localhost:3030/tokens' \
  --header 'X-Provider-State: Interaction_0_of_Scenario_B' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW00&BW00.post-tokens.response.json -->
```json
{
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "token_type": "bearer",
  "expires_in": 86400
}
```

#### Interaction 1 of Scenario B (Get all active orders)

The authenticated _logistics supplier_ sends an API request to the _supplier_ in order to receive all active orders according to the query parameters and orders containing logistics supplier location code within delivery leg:

```text
curl --request GET \
  --url 'http://localhost:3030/supplier-orders?active=true' \
  --header 'X-Provider-State: Interaction_1_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW01&BW01.get-supplier-orders.response.json -->
```json
{
  "count": 1,
  "items": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "number": "ABCD-476408",
      "timestamp": "2024-05-16T19:32:59.962Z",
      "cancelled": false,
      "active": true,
      "lineItemCount": 1
    }
  ]
}
```

You can see that the _supplier_ has 1 active order. The response only contains part of the header information, to get the details of the order, including the order lines, you can see the link properties that contains a prepared API endpoint giving direct access to the full order info.

We have prepared the scenario B on the order 3fa85f64-5717-4562-b3fc-2c963f66afa6.

#### Interaction 2 of Scenario B

The step 2 of the scenario B will simulate the situation in which the _logistics supplier_ requests to get the full order information. The _logistics supplier_ sends an API get request to the supplier in order to get the details of the order 3fa85f64-5717-4562-b3fc-2c963f66afa6:

```text
curl --request GET \
  --url 'http://localhost:3030/supplier-orders/3fa85f64-5717-4562-b3fc-2c963f66afa6' \
  --header 'X-Provider-State: Interaction_2_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW02&BW02.get-supplier-orders-supplierOrderId.response.json -->
```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "number": "ABCD-476408",
  "timestamp": "2024-05-16T19:32:59.962Z",
  "cancelled": false,
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
      "cancelled": false,
      "purchaseOrderNumber": "924942493",
      "purchaseOrderLineItemNumber": 1,
      "sellerProduct": {
        "gradeCode": "string",
        "brandName": "string",
        "paperAndBoard": {
          "basisWeight": {
            "value": 550,
            "uom": "GramsPerSquareMeter"
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
            "value": 875,
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
          "estimatedLoadingDateTime": "2024-05-16T12:00",
          "estimatedArrivalDateTime": "2024-05-18T17:00",
          "transport": {
            "modeType": "Road"
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

In step 3 of the scenario B the _logistics supplier_ request to get all departed delivery notes from the _supplier_.:

```text
curl --request GET \
  --url 'http://localhost:3030/delivery-notes?shipmentStatus=Departed' \
  --header 'X-Provider-State: Interaction_3_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW03&BW03.get-logistic-delivery-notes.response.json -->
```json
{
  "count": 1,
  "items": [
    {
      "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
      "number": "LDN12345",
      "timestamp": "2024-05-16T11:46:39Z",
      "cancelled": false,
      "active": true,
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

In step 4 of the scenario B the _logistics supplier_ request to get details of the departed delivery note from _supplier_. _Logistics supplier_ receives details of the 10 packages loaded on the delivery note.:

```text
curl --request GET \
  --url 'http://localhost:3030/logistics-delivery-note/fc190dd0-d239-40db-8196-ea72ae5b4841' \
  --header 'X-Provider-State: Interaction_4_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW04&BW04.get-logistic-delivery-notes-logisticDeliveryNoteId.response.json -->
```json
{
  "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
  "number": "LDN12345",
  "timestamp": "2024-05-16T11:46:39Z",
  "cancelled": false,
  "active": true,
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
      "estimatedArrivalDateTime": "2024-05-18T12:45",
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
      "supplierOrderNumber": "ABCD-476408",
      "supplierOrderLineItemNumber": 1,
      "customerReferenceNumber": "924942493",
      "sellerProduct": {
        "gradeCode": "string",
        "brandName": "string",
        "classifications": [
        	{
        		"type": "ExportHarmonisedSystemCode",
        		"value": "4505 94 80",
            "countryCode": "SE"
        	}
        ],
        "paperAndBoard": {
          "basisWeight": {
            "value": 550,
            "uom": "GramsPerSquareMeter"
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
            "value": 875,
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
          "type": "Standing",
          "labelOrientation": "BackEndSide"
        }
      ],
      "unloadingCharacteristics": [
        {
          "text": "unloading from back of vehicle"
        }
      ],
      "quantities": [
        {
          "context": "Shipped",
          "type": "Count",
          "value": 10,
          "uom": "ReelPackage"
        },
        {
          "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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
              "context": "Shipped",
              "type": "GrossWeight",
              "value": 2000,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "NetNetWeight",
              "value": 1925,
              "uom": "Kilogram"
            },
            {
              "context": "Shipped",
              "type": "Length",
              "value": 4000,
              "uom": "Meter"
            },
            {
              "context": "Shipped",
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

In step 5 of scenario B _Logistics supplier_ completes the inload of the delivery note and post logistic goods receipts towards the _supplier_.

<!-- request-file: ../3.0.0/mock/GW05&BW05.post-logistic-goods-receipts.request.json -->
```text
curl --request POST \
  'http://localhost:3030/logistics-goods-receipts' \
  --header 'accept: */*' \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "3aa556bb-7198-4107-8dd9-450845eb365a",
    "number": "GRIWMS-20240506-090833",
    "timestamp": "2024-05-18T11:10:04Z",
    "cancelled": false,
    "active": true,
    "acceptance": "AsSpecified",
    "isComplete": true,
    "deliveryNoteNumber": "LDN12345",
    "deliveryNoteTimestamp": "2024-05-16T11:46:39Z",
    "arrivalDateTime": "2024-05-18T11:08:36",
    "unloadingDateTime": "2024-05-18T11:10:04"
  }
```

#### Interaction 6 of Scenario B

In step 6 of scenario B _logistics supplier_ updates the inload of the delivery note and put logistic goods receipts towards the _supplier_ with one package indicated with variance = "Not Received", package no. 3.

<!-- request-file: ../3.0.0/mock/BW06.put-logistic-goods-receipts-logisticGoodReceiptId.request.json -->
```text
curl --request PUT \
  'http://localhost:3030/logistics-goods-receipts' \
  --header 'accept: */*' \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "3aa556bb-7198-4107-8dd9-450845eb365b",
    "number": "GRIWMS-20240506-090833",
    "timestamp": "2024-05-18T11:16:49Z",
    "cancelled": false,
    "active": true,
    "acceptance": "WithVariance",
    "isComplete": true,
    "deliveryNoteNumber": "LDN12345",
    "deliveryNoteTimestamp": "2024-05-16T11:46:39Z",
    "arrivalDateTime": "2024-05-18T11:08:36",
    "unloadingDateTime": "2024-05-18T11:10:04",
    "lineItems": [
      {
        "number": 1,
        "acceptance": "WithVariance",
        "deliveryNoteLineItemNumber": 1,
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

In step 7 of scenario B _logistics supplier_ request to get all active delivery instructions from _supplier_.

```text
curl --request GET \
  --url 'http://localhost:3030/delivery-instructions?active=true' \
  --header 'X-Provider-State: Interaction_7_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/GW06&BW07.get-delivery-instructions.response.json -->
```json
{
    "count": 1,
    "items": [
      {
        "id": "52c5caed-57c6-4a68-97ff-b2745a514af6",
        "number": "123456SE",
        "timestamp": "2024-05-19T11:47:41Z",
        "cancelled": false,
        "active": true,
        "sequenceCount": 1
      }
    ]
  }
```

#### Interaction 8 of Scenario B

In step 8 of scenario B _logistics supplier_ request to get details of the active delivery instruction from _supplier_. _Logistics supplier_ receives details of the quantities planned to be delivered. The _logistics supplier_ is requested to load 9 packages. 

```text
curl --request GET \
  --url 'http://localhost:3030/delivery-instruction/52c5caed-57c6-4a68-97ff-b2745a514af6' \
  --header 'X-Provider-State: Interaction_8_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Host: papinet.papinet.io' \
  --header 'Content-Type: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

<!-- file: ../3.0.0/mock/BW08.get-delivery-instructions-deliveryInstructionId.response.json -->
```json
{
  "id": "52c5caed-57c6-4a68-97ff-b2745a514af6",
  "number": "123456SE",
  "timestamp": "2024-05-19T11:47:41Z",
  "cancelled": false,
  "active": true,
  "sequences": [
    {
      "number": 1,
      "cancelled": false,
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
          "requestedArrivalDateTime": "2024-05-24T10:00",
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
              "type": "Standing",
              "labelOrientation": "BackEndSide"
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

In step 9 of scenario B _logistics supplier_ confirms the loading of the delivery instruction and post the delivery note with 9 loaded packages towards the _supplier_.

<!-- request-file: ../3.0.0/mock/BW09.post-logistic-delivery-notes.request.json -->
```text
curl --request 'POST' \
  'http://localhost:3030/logistics-delivery-notes' \
  --header 'accept: */*' \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
    "number": "LDN6789",
    "timestamp": "2024-05-23T12:26:16Z",
    "cancelled": false,
    "active": true,
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
        "cancelled": false,
        "supplierOrderNumber": "ABCD-476408",
        "supplierOrderLineItemNumber": 1,
        "callOffNumber": "123456SE",
        "callOffLineItemNumber": 1,
        "quantities": [
          {
            "context": "Shipped",
            "type": "Count",
            "value": 9,
            "uom": "ReelPackage"
          },
          {
            "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
                "type": "Area",
                "value": 3500,
                "uom": "SquareMeter"
              }
            ]
          }
        ]
      }
    ]
  }'
```

#### Interaction 10 of Scenario B

In step 10 of scenario B the _logistics supplier_ updates the loading of the delivery instruction and put the delivery note towards the _supplier_ correcting loading, replacing package no. 3 (which has previously been reported as "NotReceived") with package no. 10.

<!-- request-file: ../3.0.0/mock/BW10.put-logistic-delivery-notes-logisticDeliveryNoteId.request.json -->
```text
curl -request 'POST' \
  'http://localhost:3030/logistics-delivery-notes' \
  --header 'accept: */*' \
  --header 'Content-Type: application/json' \
  --data '{
    "id": "fc190dd0-d239-40db-8196-ea72ae5b4841",
    "number": "LDN6789",
    "timestamp": "2024-05-23T12:26:16Z",
    "cancelled": false,
    "active": true,
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
        "cancelled": false,
        "supplierOrderNumber": "ABCD-476408",
        "supplierOrderLineItemNumber": 1,
        "callOffNumber": "123456SE",
        "callOffLineItemNumber": 1,
        "quantities": [
          {
            "context": "Shipped",
            "type": "Count",
            "value": 9,
            "uom": "ReelPackage"
          },
          {
            "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
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
                "context": "Shipped",
                "type": "GrossWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "NetWeight",
                "value": 2000,
                "uom": "Kilogram"
              },
              {
                "context": "Shipped",
                "type": "Length",
                "value": 4000,
                "uom": "Meter"
              },
              {
                "context": "Shipped",
                "type": "Area",
                "value": 3500,
                "uom": "SquareMeter"
              }
            ]
          }
        ]
      }
    ]
  }'
```
