Copyright 2000 - 2026 the Confederation of European Paper Industries AISBL ("papiNet") the "Copyright Owner". All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign. For support, more information, or to report implementation bugs, please contact papiNet at https://github.com/papinet.

# Warehouse Logistics Inventory Change Use Case

## Context

This use case is designed for _Paper_, _Board_ and _Pulp_ businesses.

Endpoints used in this use case
 
* `GET /logistics-inventory-changes`
* `GET /logistics-inventory-changes/{logisticsInventoryChangeId}`
* `POST /logistics-inventory-changes`

## Simplification

For now, papiNet only consider a simplified version of the business interactions between only two types of parties: the _logistics supplier_ and the _supplier_, where the _logistics supplier_ will host the client calling the papiNet API endpoints implemented by the _supplier_.

## Domain Name

papiNet suggest that the _supplier_ (as well as the _logistics supplier_ if it uses the notification mechanism) exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _supplier_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

## Notifications

In order to get updated information on _inventory changes_ the _logistics suppliers_ have to call API endpoints of the _supplier_. As the _logistics suppliers_ do not know when these informations are getting updated, they should normally poll these API endpoints on a regular basis.

This polling mechanism is not optimal from an IT resources point of view, that's why papiNet recommend the usage of notifications from the _logistics suppliers_ to the _supplier_. However, as the usage of these notifications would require additional investment on the _logistics supplier_ side, they remain an optional optimization.

For the implementation of these notifications, papiNet recommend to use the [CloudEvents](https://cloudevents.io/) specification, which is a vendor-neutral specification for defining the format of event data. In order to ensure the decoupling between this notification mechanism and the papiNet API, papiNet will use the CloudEvents specification following the **_thin event_** pattern. (...)

## papiNet Stub Service

A Standalone Pact Stub Server can be downloaded from [Standalone Pact Stub Server](https://github.com/pact-foundation/pact-stub-server).
You can run locally the papiNet stub service using the following command:

```text
pact-stub-server --file ./stub/papiNet.PACT.json --port 3040 --provider-state-header-name X-Provider-State
```

## Authentication

For authenticating the _logistics supplier_, papiNet recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

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

**Scenario A:** Blocking due to downgrading

This should illustrate the information exchange between _logistics supplier_ and the _supplier_, process starts when goods are dispatched towards the _logistics supplier_ and end when goods are dispatched towards the customer of the _supplier_. 
The goods have been downgraded and blocked by the _supplier_ while in store at the _logistics supplier_ warehouse. The downgraded goods should be separated in the _logistics supplier_ warehouse and is not allowed to be loaded until a new _inventory changes_ is processed and releasing the block. 

1. _Logistics supplier_ **requests** to get all active _inventory changes_ from _supplier_.
_Logistics supplier_ **receives** a list of all active _inventory changes_.
In this scenario, there is 1 _inventory change_.

2. _Logistics supplier_ **requests** to get details of the one specific active _inventory change_ from _supplier_.
_Logistics supplier_ **receives** details of this _inventory change_, including the various statuses.
In this scenario, the status is dispatchStop. 


**Scenario B:** Damage reporting

This should illustrate the process when reporting the damage of a paper reel. In this scenario 2 paper reels has been damaged during handling at the _logistics supplier_ as well as the follow up of the damage and outcome of decision how the damage should be handled. 
The _logistics supplier_ should always report the damage place, type and cause. In this scenario the _Logistics supplier_ is able to repair the reel and should update the _supplier_ by posting an _inventory changes_ with refurbished status change and the new weight.

1. _Logistics supplier_ **post** the _inventory changes_ to the _supplier_ to inform about damages.

2. _Logistics supplier_ **post** the _inventory changes_ to the _supplier_ to inform about refurbishment.



### Scenario A: Blocking due to downgrading

#### UC2_Interaction 0 of Scenario A (Authentication)

The _logistics supplier_ sends an API request to the _supplier_ in order to be authenticated, and gets an _access token_:

```text
curl --request POST \
  --url 'http://localhost:3040/tokens' \
  --header 'X-Provider-State: UC2_Interaction_0_of_Scenario_A' \
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





#### UC2_Interaction 1 of Scenario A (Get all active inventory changes)

The authenticated _logistics supplier_ sends an API request to the _supplier_ in order to receive all active _inventory changes_ according to the query parameters:

```text
curl --request GET \
  --url 'http://localhost:3040/inventory-changes?isActive=true' \
  --header 'X-Provider-State: UC2_Interaction_1_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Accept: application/json'
```


If all goes well, the logistics supplier will receive a response like this:
```json
{
  "count": 1,
  "items": [
    {
      "id": "bc6effb4-26f4-4932-b556-7fde22f31902",
      "number": "LIC789101",
      "timestamp": "2026-01-13T18:33:55Z",
      "isActive": true,
  "logisticsSupplierParty": {
    "identifiers": [
      {
        "value": "LOGSUP",
        "assignedBy": "Supplier"
      }
    ],
    "nameLines": [
      "LogSupName"
    ],
    "address": {
      "addressLines": [
        "Term Road 1"
      ],
      "city": "City 1",
      "postalCode": "78567",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
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
      "city": "City 2",
      "postalCode": "39655",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
  "storageLocation": {
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
      "city": "City 1",
      "postalCode": "78567",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
      "supplierOrderNumber": "ABCD-476433",
      "supplierOrderLineItemNumber": 1
    }
  ]
}
```

You can see that the _supplier_ has 1 active _inventory change_. The response only contains part of the header information, to get the details of the _inventory change_, including the _inventory change_ packages.


#### UC2_Interaction 2 of Scenario A (Get details of the inventory change)

The step 2 of the scenario A will simulate the situation in which the _logistics supplier_ requests to get the _inventory changes_ detail. The _logistics supplier_ sends an API get request to the _supplier_ in order to get the details of the _inventory change_ bc6effb4-26f4-4932-b556-7fde22f31902:

```text
curl --request GET \
  --url 'http://localhost:3040/logistics-inventory-changes/bc6effb4-26f4-4932-b556-7fde22f31902' \
  --header 'X-Provider-State: UC2_Interaction_2_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Accept: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:

```json
{
  "id": "bc6effb4-26f4-4932-b556-7fde22f31902",
  "number": "LIC789101",
  "timestamp": "2026-01-13T19:00:47Z",
  "isActive": true,
  "logisticsSupplierParty": {
    "identifiers": [
      {
        "value": "LOGSUP",
        "assignedBy": "Supplier"
      }
    ],
    "nameLines": [
      "LogSupName"
    ],
    "address": {
      "addressLines": [
        "Term Road 1"
      ],
      "city": "City 1",
      "postalCode": "78567",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
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
      "city": "City 2",
      "postalCode": "39655",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
  "storageLocation": {
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
      "city": "City 1",
      "postalCode": "78567",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
  "supplierOrderNumber": "ABCD-476433",
  "supplierOrderLineItemNumber": 1,
  "packages": [
    {
      "type": "ReelPackage",
      "changeType": "Change",
      "identifiers": [
        {
          "role": "Secondary",
          "type": "Barcode",
          "codeType": "UIC14",
          "value": "14780102877814"
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
          "context": "Stored",
          "type": "GrossWeight",
          "value": 1955,
          "uom": "Kilogram"
        },
        {
          "context": "Stored",
          "type": "NetNetWeight",
          "value": 1700,
          "uom": "Kilogram"
        },
        {
          "context": "Stored",
          "type": "Length",
          "value": 4080,
          "uom": "Meter"
        },
        {
          "context": "Stored",
          "type": "Area",
          "value": 3500,
          "uom": "SquareMeter"
        }
      ],
      "classification": {
        "qualityGrade": "Second",
        "isDamaged": false,
        "isRejected": false,
        "isRefurbished": false,
        "isDispatchStop": true
      }
    }
  ]
}
```



### Scenario B: Damage Reporting

#### UC2_Interaction 0 of Scenario B (Authentication)

The _logistics supplier_ sends an API request to the _supplier_ in order to be authenticated, and gets an _access token_:

```text
curl --request POST \
  --url 'http://localhost:3040/tokens' \
  --header 'X-Provider-State: UC2_Interaction_0_of_Scenario_A' \
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



#### UC2_Interaction 1 of Scenario B (Report damage)

The _logistics supplier_ post an _inventory change_ API to the _supplier_ reporting damage status:

```json
curl --request POST --verbose \
  --url 'http://localhost:3040/logistics-inventory-changes' \
  --header 'X-Provider-State: UC2_Interaction_1_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
  "id": "3a562400-da0e-48ef-986c-3e83dfe02063",
  "number": "I25534",
  "timestamp": "2026-01-21T14:32:11Z",
  "isActive": true,
  "logisticsSupplierParty": {
    "identifiers": [
      {
        "value": "LOGSUP",
        "assignedBy": "Supplier"
      }
    ],
    "nameLines": [
      "LogSupName"
    ],
    "address": {
      "addressLines": [
        "Term Road 1"
      ],
      "city": "City 1",
      "postalCode": "78567",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
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
      "city": "City 2",
      "postalCode": "39655",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
  "storageLocation": {
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
      "city": "City 1",
      "postalCode": "78567",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
  "supplierOrderNumber": "ABCD-386788",
  "supplierOrderLineItemNumber": 2,
  "packages": [
    {
      "type": "ReelPackage",
      "changeType": "Change",
      "identifiers": [
        {
          "role": "Secondary",
          "type": "Barcode",
          "codeType": "UIC14",
          "value": "14780104633814"
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
          "context": "Stored",
          "type": "GrossWeight",
          "value": 1500,
          "uom": "Kilogram"
        },
        {
          "context": "Stored",
          "type": "NetNetWeight",
          "value": 1450,
          "uom": "Kilogram"
        },
        {
          "context": "Stored",
          "type": "Length",
          "value": 4000,
          "uom": "Meter"
        },
        {
          "context": "Stored",
          "type": "Area",
          "value": 3500,
          "uom": "SquareMeter"
        }
      ],
      "classification": {
        "qualityGrade": "Prime",
        "isDamaged": true,
        "damages": [
          {
            "typeOfDamage": "CoreDamage",
            "placeOfDamage": "AtPlaceOfInspection",
            "causeOfDamage": "Condensation"
          }
        ],
        "isRejected": false,
        "isRefurbished": false,
        "isDispatchStop": true
      }
    },
    {
      "type": "ReelPackage",
      "changeType": "Change",
      "identifiers": [
        {
          "role": "Secondary",
          "type": "Barcode",
          "codeType": "UIC14",
          "value": "14780104634814"
        },
        {
          "role": "Primary",
          "type": "Number",
          "codeType": "Supplier",
          "value": "00013"
        }
      ],
      "quantities": [
        {
          "context": "Stored",
          "type": "GrossWeight",
          "value": 1550,
          "uom": "Kilogram"
        },
        {
          "context": "Stored",
          "type": "NetNetWeight",
          "value": 1500,
          "uom": "Kilogram"
        },
        {
          "context": "Stored",
          "type": "Length",
          "value": 4080,
          "uom": "Meter"
        },
        {
          "context": "Stored",
          "type": "Area",
          "value": 3500,
          "uom": "SquareMeter"
        }
      ],
      "classification": {
        "qualityGrade": "Prime",
        "isDamaged": true,
        "damages": [
          {
            "typeOfDamage": "SideDamage",
            "placeOfDamage": "AtPlaceOfInspection",
            "causeOfDamage": "Handling"
          }
        ],
        "isRejected": false,
        "isRefurbished": false,
        "isDispatchStop": true
      }
    }
  ] 
}'
```



#### UC2_Interaction 2 of Scenario B (Report refurbishment)

The _logistics supplier_ post an _inventory change_ API to the _supplier_ reporting 1 package as refurbished with new weight:

```json
curl --request POST --verbose \
  --url 'http://localhost:3040/logistics-inventory-changes' \
  --header 'X-Provider-State: UC2_Interaction_2_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
  "id": "56f514f5-a21f-417c-8620-a891a12d7182",
  "number": "I25134",
  "timestamp": "2026-01-26T08:17:13Z",
  "isActive": true,
  "logisticsSupplierParty": {
    "identifiers": [
      {
        "value": "LOGSUP",
        "assignedBy": "Supplier"
      }
    ],
    "nameLines": [
      "LogSupName"
    ],
    "address": {
      "addressLines": [
        "Term Road 1"
      ],
      "city": "City 1",
      "postalCode": "78567",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
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
      "city": "City 2",
      "postalCode": "39655",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
  "storageLocation": {
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
      "city": "City 1",
      "postalCode": "78567",
      "county": "Sweden",
      "countryCode": "SE"
    }
  },
  "supplierOrderNumber": "ABCD-386788",
  "supplierOrderLineItemNumber": 2,
  "packages": [
    {
      "type": "ReelPackage",
      "changeType": "Change",
      "identifiers": [
        {
          "role": "Secondary",
          "type": "Barcode",
          "codeType": "UIC14",
          "value": "14780104633814"
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
          "context": "Stored",
          "type": "GrossWeight",
          "value": 1450,
          "uom": "Kilogram"
        },
        {
          "context": "Stored",
          "type": "NetNetWeight",
          "value": 1400,
          "uom": "Kilogram"
        },
        {
          "context": "Stored",
          "type": "Length",
          "value": 3800,
          "uom": "Meter"
        },
        {
          "context": "Stored",
          "type": "Area",
          "value": 3400,
          "uom": "SquareMeter"
        }
      ],
      "classification": {
        "qualityGrade": "Prime",
        "isDamaged": false,
        "isRejected": false,
        "isRefurbished": true,
        "isDispatchStop": false
      }
    }
  ]
}'
```