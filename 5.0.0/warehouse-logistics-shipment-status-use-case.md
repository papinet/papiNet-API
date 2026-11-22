Copyright 2000 - 2026 the Confederation of European Paper Industries AISBL ("papiNet") the "Copyright Owner". All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign. For support, more information, or to report implementation bugs, please contact papiNet at https://github.com/papinet.


# Logistics Shipment Use Case

## Context

This use case is designed for _Paper_, _Board_ and _Pulp_ businesses. 
The purpose of this use case is to standardize communication between the _supplier_ and _logistics suppliers_ involved in freight forwarding and warehousing.

Endpoints used in this use case
 
* `PUT /logistics-shipments/{logisticsShipmentId}`
* `GET /logistics-shipments`
* `GET /logistics-shipments/{logisticsShipmentId}`

General assumptions

- Masterdata is defined by _supplier_. 
- _Supplier_ is hosting the server, while _logistics supplier_ is hosting the client.
- _Supplier_ is acting as message hub between several logistics suppliers

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

This use case covers shipment visibility using _logistics shipment_.


**Scenario A:** Forwarding as a _supplier_

_Supplier_ is responinsible for freight forwarding of the products having the business role _Forwarder_ and has obligation to provide status update to the _logistics supplier_. 
_Logistics supplier_ endpoints
  * `GET /logistics-shipments`
  * `GET /logistics-shipments/{logisticsShipmentId}`

**Scenario B:** Forwarding as a _logistics supplier_

_Logistics supplier_ is responsible only for freight forwarding of the products having the business role _Forwarder_ and has an obligation to provide status update to the _supplier_. 
_Logistics supplier_ endpoints
  * `PUT /logistics-shipments/{logisticsShipmentId}`

**Scenario C:** Forwarding as an additional _logistics supplier_

_Logistics supplier_ is responsible for only a ship to warehouse. _Logistics supplier_ can request logistics-shipments from the _supplier_. The _supplier_ has received logistics-shipments from the _logistics supplier_ responsible for distributing the product.
_Logistics supplier_ endpoints
  * `GET /logistics-shipments`
  * `GET /logistics-shipments/{logisticsShipmentId}`

---

## Scenario A: Forwarding as an additional _logistics supplier_

#### UC3_Interaction 0 of Scenario A (Authentication)
The logistics supplier sends an API request to the supplier in order to be authenticated, and gets an access token:

```text
curl --request POST \
  --url 'http://localhost:3040/tokens' \
  --header 'X-Provider-State: UC3_Interaction_0_of_Scenario_A' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```
If all goes well, the _logistics supplier_ will receive a response like this:

```text
{
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "token_type": "bearer",
  "expires_in": 86400
}
```

#### UC3_Interaction 1 of Scenario A
_Supplier_ is responinsible for freight forwarding of the products having the business role _Forwarder_ and has obligation to provide status update to the _logistics supplier_. 

```text
curl --request GET \
  --url 'http://localhost:3040/logistics-shipments?isActive=true' \
  --header 'X-Provider-State: UC3_Interaction_1_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Accept: application/json'

```

If all goes well, the _logistics supplier_ will receive a response like this:


```text
{
  "count": 1,
  "items": [
    {
      "id": "899de6f8-8a10-493f-9700-bff702710a13",
      "number": "String",
      "timestamp": "2026-11-12T09:30:47.0",
      "isCancelled": false,
      "isActive": true,
      "supplierParty": {
        "identifierBySupplier": "MILL",
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
      "logisticsSupplierParty": {
        "identifierBySupplier": "TERM",
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
      "shipFromLocation": {
        "type": "Terminal",
        "identifierBySupplier": "TERM",
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
        "type": "Terminal",
        "identifierBySupplier": "WAREHOUSE1",
        "nameLines": [
          "Warehouse1Name"
        ],
        "address": {
          "addressLines": [
            "Warehouse Road 2"
          ],
          "city": "CITY 3",
          "postalCode": "34787",
          "countryCode": "SE"
        }
      },
      "references": [
        {
      "type": "DeliveryNote",
      "number": "LDN3800",
      "assignedBy": "Forwarder",
      "assigningPartyIdentifierBySupplier": "TERM"
        }
      ]
    }
  ]
}
```

There is one active logistics-shipment available for the _logistics supplier_ to GET. The _logistics supplier_ request the details of Delivery Note LDN3800.

```text
curl --request GET \
  --url 'http://localhost:3040/logistics-shipments-id?isActive=true&DeliveryNote=LDN3800' \
  --header 'X-Provider-State: UC3_Interaction_1_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Accept: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:


```text
{
  "id": "899de6f8-8a10-493f-9700-bff702710a13",
  "number": "LDN3800",
  "timestamp": "2026-11-12T09:35:51.0",
  "isActive": true,
  "isCancelled": false,
  "supplierParty": {
    "identifierBySupplier": "MILL",
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
  "logisticsSupplierParty": {
    "identifierBySupplier": "TERM",
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
  "shipFromLocation": {
    "type": "Terminal",
    "identifierBySupplier": "TERM",
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
    "type": "Terminal",
    "identifierBySupplier": "WAREHOUSE1",
    "nameLines": [
      "Warehouse1Name"
    ],
    "address": {
      "addressLines": [
        "Warehouse Road 2"
      ],
      "city": "CITY 3",
      "postalCode": "34787",
      "countryCode": "SE"
    }
  },
  "mainCarrierParty": {
    "identifierBySupplier": "CARRIER2",
    "nameLines": [
      "CARRIER2"
    ]
  },
  "references": [
    {
    "type": "DeliveryNote",
    "number": "LDN3800",
    "assignedBy": "Forwarder",
    "assigningPartyIdentifierBySupplier": "TERM"
    }
  ],
  "statusArrivalShipFromLocation": "Delayed",
  "scheduledDateTimeOfArrivalShipFromLocation": "2024-11-14T12:00",
  "estimatedDateTimeOfArrivalShipFromLocation": "2024-11-15T03:00",
  "eventType": "OnRouteToShipFromLocation",
  "eventTimestamp": "2026-11-12T09:29:13.0",
  "eventLocation": {
    "name": "Waypoint",
    "coordinatesWGS84": {
      "latitude": 62.523785,
      "longitude": 17.471277
    }
  },
  "transport": {
    "modeType": "Road",
    "vehicle": {
      "type": "Truck",
      "identifier": {
        "type": "LicencePlateNumber",
        "value": "ABC12D",
        "countryCode": "SE"
      }
    },
    "characteristics": {
      "safetyAndEnvironmentDetails": [
        {
          "type": "CarbonDioxide(CO2)Emission",
          "quantity": {
            "context": "Predicted",
            "type": "NominalWeight",
            "value": 915.0,
            "uom": "KilogramCO2e"
          }
        }
      ]
    }
  }
}
```

---

## Scenario B: Forwarding as a _logistics supplier_

#### UC3_Interaction 0 of Scenario B (Authentication)
The logistics supplier sends an API request to the supplier in order to be authenticated, and gets an access token:

```text
curl --request POST \
  --url 'http://localhost:3040/tokens' \
  --header 'X-Provider-State: UC3_Interaction_0_of_Scenario_B' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```
If all goes well, the _logistics supplier_ will receive a response like this:

```text
{
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "token_type": "bearer",
  "expires_in": 86400
}
```

#### UC3_Interaction 1 of Scenario B
_Logistics supplier_ is responsible only for distributing the products. _Logistics supplier_ provides a status update to the _supplier_ on where the transport is and if any delays are expected.

```text
curl --request PUT --verbose \
  --url 'http://localhost:3040/logistics-shipments-id' \
  --header 'X-Provider-State: UC1_Interaction_1_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data '{
  "id": "241119a4-d32d-4c5d-83c7-253211b0530f",
  "number": "SS6789",
  "timestamp": "2024-05-24T06:30:47.0",
  "isActive": true,
  "isCancelled": false,
  "supplierParty": {
    "identifierBySupplier": "MILL",
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
  "LogisticsSupplierParty": {
    "identifierBySupplier": "TERM",
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
  "shipFromLocation": {
    "type": "Terminal",
    "identifierBySupplier": "TERM",
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
    "type": "CustomerFacility",
    "identifierBySupplier": "DEST1",
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
  "MainCarrierParty": {
    "identifierBySupplier": "CARRIER",
    "nameLines": [
      "CARRIER"
    ]
  },
  "references": [
    {
      "type": "DeliveryNote",
      "number": "LDN6789",
      "assignedBy": "Forwarder",
      "assigningPartyIdentifierBySupplier": "TERM"
    }
  ],
  "statusArrivalShipToLocation": "OnTime",
  "scheduledDateTimeOfArrivalShipToLocation": "2024-05-24T10:00",
  "estimatedDateTimeOfArrivalShipToLocation": "2024-05-24T09:42",
  "eventType": "OnRouteToShipToLocation",
  "eventTimestamp": "2026-11-09T06:25:23.0",
  "eventLocation": {
    "name": "Waypoint 23",
    "coordinatesWGS84": {
      "latitude": 51.080703,
      "longitude": 5.449962
    }
  },
  "transport": {
    "modeType": "Road",
    "vehicle": {
      "type": "Truck",
      "identifier": {
        "type": "LicencePlateNumber",
        "value": "XX-XXX-XX",
        "countryCode": "SE"
      }
    }
  }
}
```

---

## Scenario C: Forwarding as an additional _logistics supplier_

#### UC3_Interaction 0 of Scenario C (Authentication)
The logistics supplier sends an API request to the supplier in order to be authenticated, and gets an access token:

```text
curl --request POST \
  --url 'http://localhost:3040/tokens' \
  --header 'X-Provider-State: UC3_Interaction_0_of_Scenario_C' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```
If all goes well, the _logistics supplier_ will receive a response like this:

```text
{
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "token_type": "bearer",
  "expires_in": 86400
}
```

#### UC3_Interaction 1 of Scenario C
The _logistics supplier_ is responsible for warehousing and is requesting logistics shipments from the _supplier_. The _supplier_ has received logistics-shipments information from the _logistics supplier_ responsible for freight forwarding. The _logistics supplier_ requests all active logistics shipments on route to the ship to warehouse. 

```text
curl --request GET \
  --url 'http://localhost:3040/logistics-shipments?isActive=true' \
  --header 'X-Provider-State: UC3_Interaction_1_of_Scenario_C' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Accept: application/json'

```

If all goes well, the _logistics supplier_ will receive a response like this:


```text
{
  "count": 1,
  "items": [
    {
      "id": "899de6f8-8a10-493f-9700-bff702710a13",
      "number": "String",
      "timestamp": "2026-11-12T09:30:47.0",
      "isCancelled": false,
      "isActive": true,
      "supplierParty": {
        "identifierBySupplier": "MILL",
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
      "logisticsSupplierParty": {
        "identifierBySupplier": "TERM",
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
      "shipFromLocation": {
        "type": "Terminal",
        "identifierBySupplier": "TERM",
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
        "type": "Terminal",
        "identifierBySupplier": "WAREHOUSE1",
        "nameLines": [
          "Warehouse1Name"
        ],
        "address": {
          "addressLines": [
            "Warehouse Road 2"
          ],
          "city": "CITY 3",
          "postalCode": "34787",
          "countryCode": "SE"
        }
      },
      "references": [
        {
      "type": "DeliveryNote",
      "number": "LDN3800",
      "assignedBy": "Forwarder",
      "assigningPartyIdentifierBySupplier": "TERM"
        }
      ]
    }
  ]
}
```

There is one active logistics-shipment available for the _logistics supplier_ to GET. The _logistics supplier_ request the details of Delivery Note LDN3800.

```text
curl --request GET \
  --url 'http://localhost:3040/logistics-shipments-id?isActive=true&DeliveryNote=LDN3800' \
  --header 'X-Provider-State: UC3_Interaction_1_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26' \
  --header 'Accept: application/json'
```

If all goes well, the _logistics supplier_ will receive a response like this:


```text
{
  "id": "899de6f8-8a10-493f-9700-bff702710a13",
  "number": "LDN3800",
  "timestamp": "2026-11-12T09:35:51.0",
  "isActive": true,
  "isCancelled": false,
  "supplierParty": {
    "identifierBySupplier": "MILL",
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
  "logisticsSupplierParty": {
    "identifierBySupplier": "TERM",
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
  "shipFromLocation": {
    "type": "Terminal",
    "identifierBySupplier": "TERM",
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
    "type": "Terminal",
    "identifierBySupplier": "WAREHOUSE1",
    "nameLines": [
      "Warehouse1Name"
    ],
    "address": {
      "addressLines": [
        "Warehouse Road 2"
      ],
      "city": "CITY 3",
      "postalCode": "34787",
      "countryCode": "SE"
    }
  },
  "mainCarrierParty": {
    "identifierBySupplier": "CARRIER2",
    "nameLines": [
      "CARRIER2"
    ]
  },
  "references": [
    {
    "type": "DeliveryNote",
    "number": "LDN3800",
    "assignedBy": "Forwarder",
    "assigningPartyIdentifierBySupplier": "TERM"
    }
  ],
  "statusArrivalShipFromLocation": "Delayed",
  "scheduledDateTimeOfArrivalShipFromLocation": "2024-11-14T12:00",
  "estimatedDateTimeOfArrivalShipFromLocation": "2024-11-15T03:00",
  "eventType": "OnRouteToShipFromLocation",
  "eventTimestamp": "2026-11-12T09:29:13.0",
  "eventLocation": {
    "name": "Waypoint",
    "coordinatesWGS84": {
      "latitude": 62.523785,
      "longitude": 17.471277
    }
  },
  "transport": {
    "modeType": "Road",
    "vehicle": {
      "type": "Truck",
      "identifier": {
        "type": "LicencePlateNumber",
        "value": "ABC12D",
        "countryCode": "SE"
      }
    },
    "characteristics": {
      "safetyAndEnvironmentDetails": [
        {
          "type": "CarbonDioxide(CO2)Emission",
          "quantity": {
            "context": "Predicted",
            "type": "NominalWeight",
            "value": 915.0,
            "uom": "KilogramCO2e"
          }
        }
      ]
    }
  }
}
```

---
