# Shipment Status Use Case

## Context

This use case is designed for Pulp and Paper business.

### Preconditions

An _Order Issuer_ has sent _orders_ to the _Supplier_.
The _Supplier_ has sent delivery instruction(s) to the _Forwarder_.
The _Forwarder_ is responsible to book transports with one or multiple _Carriers_.

### Process

The _Order Issuer_ can track expected _shipments_, related to the _orders_, from the _Supplier_.
The _Supplier_ is tracking the expected _shipments_, related to the delivery instruction(s), from the _Forwarder_.
The _Forwarder_ is tracking the expected _shipments_, related to the transport bookings, from the _Carrier(s)_.

Within the logistic supply chain, a _Supplier_ buys transport services from a _Forwarder_. Then, the  _Forwarder_ buys transports to fulfil the transport services from one or multiple _Carriers_. A company may play both _Forwarder_ and _Carrier_ roles. A company may play both _Supplier_ and _Forwarder_ roles, or even the three roles.

## Domain Name

We suggest that _Suppliers_, _Forwarder_ and _Carrier_ expose their papiNet API endpoints using the domain name of their respective corporate web sides with the prefix `papinet.*`. For instance, if the _Supplier_ is the company **ACME** using `acme.com` for its corporate web site, they should then expose their papiNet API endpoints on the domain name `papinet.acme.com`.

The _**papiNet Mock Service**_ is exposing the papiNet API endpoints on different domain names based on different fictional company names used to simulate different business roles:

| Name | Domain Name             | Business Role(s) |
| ---- | ----------------------- | ---------------- |
| Pulp | papinet.pulp.papinet.io | _Supplier_       |
| Fast | papinet.fast.papinet.io | _Forwarder_      |
| Road | papinet.road.papinet.io | _Carrier_        |
| Corp | papinet.corp.papinet.io | _Order Issuer_   |

## Authentication

We recommend secure the access to the papiNet API endpoints using the [OAuth 2.0](https://tools.ietf.org/html/rfc6749#section-4.4) standard, with the _client credentials_ authorization grant.

## Scenarios

* Scenario A - The company **Fast**, a _Forwarder_, requests to the company **Road**, a _Carrier_, the status of one or multiple of its _shipments_. The _Forwarder_ has earlier booked the transport from the _Carrier_.
* Scenario B - The company **Pulp**, a _Supplier_, requests to the company **Fast**, a _Forwarder_, the status of one or multiple of its _shipments_. The _Supplier_ has earlier sent delivery instruction(s) to the _Forwarder_.
* Scenario C - The company **Corp**, being the _Order Issuer_, requests to the company **Pulp**, a _Supplier_, the status of one or multiple of its expected _shipments_. The _Order Issuer_ has earlier sent the related orders to the _Supplier_, for the _End User_ to receive ordered products.

![Diagram 1 - Shipment Status Scenarios](shipment-status.png)

### Scenario A

The company **Fast**, a _Forwarder_, requests to the company **Road**, a _Carrier_, the status of one or multiple of its _shipments_. The _Forwarder_ has earlier booked the transport from the _Carrier_.

#### Interaction 1 of Scenario A - Authentication

The company **Fast**, being a _Forwarder_, sends an API request to the company **Road**, being a _Carrier_, in order to be authenticated, and gets an _access token_:

```text
$ curl --request POST \
  --URL https://papinet.road.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request POST \
  --URL http://localhost:3002/tokens \
  --header 'Host: papinet.road.papinet.io' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the company **Fast** will receive a response like this:

```json
{ 
  "access_token": "efe30794-3f53-40c4-a5dc-77c475a8561d",
  "token_type": "bearer", 
  "expires_in": 3600
}
```

In order to re-use the value of the `access_token` in subsequent API requests, it is convenient to save it into an environment variable:

```text
$ export ACCESS_TOKEN=$(curl --request POST \
  --URL https://papinet.road.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

or, if you use locally the docker container of the papiNet mock server:

```$ export ACCESS_TOKEN=$(curl --request POST \
  --URL http://localhost:3002/tokens \
  --header 'Host: papinet.road.papinet.io' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

You can easily verify the value of the `ACCESS_TOKEN` environment variable using:

```text
$ echo $ACCESS_TOKEN
9b875e37-42ec-4fb0-bced-0fb6724d4767
```

#### Interaction 2 of Scenario A - List of Shipments

The company **Fast**, being a _Forwarder_, sends an API request to the company **Road**, being a _Carrier_, in order to get the list of all its _Active shipments_:

```text
$ curl --request GET \
  --URL https://papinet.road.papinet.io/shipments?shipmentStatus=Active \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments?shipmentStatus=Active \
  --header 'Host: papinet.road.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Fast** will receive a response like this:

<!-- FILE: shipment-use-case.A.step-2.json -->
```json
{
  "numberOfShipments": 6,
  "shipments": [
    {
      "id": "c51d8903-01d1-485c-96ce-51a9be192207",
      "shipmentNumber": "1001",
      "shipmentReferences": [
        {
          "type": "ShipmentNumber",
          "assignedBy": "Forwarder",
          "value": "SHP001"
        }
      ],
      "shipmentStatus": "Active",
      "shipmentArrivalStatus": "OnTime",
      "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
      "estimatedDateTimeOfArrival": "2021-04-24T09:00:00Z",
      "link": "/shipments/c51d8903-01d1-485c-96ce-51a9be192207"
    },
    {
      "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
      "supplierShipmentNumber": "1002",
      "shipmentReferences": [
        {
          "type": "ShipmentNumber",
          "assignedBy": "Forwarder",
          "value": "SHP002"
        }
      ],
      "shipmentStatus": "Active",
      "shipmentArrivalStatus": "Delayed",
      "scheduledDateTimeOfArrival": "2021-04-24T09:54:00Z",
      "estimatedDateTimeOfArrival": "2021-04-24T13:56:00Z",
      "link": "/shipments/778fe5cb-f7ac-4493-b492-25fe98df67c4"
    }
  ],
  "links": {
    "self": {
      "href": "/shipments?shipmentStatus=Active&offset=0&limit=2"
    },
    "next": {
      "href": "/shipments?shipmentStatus=Active&offset=2&limit=2"
    }
  }
}
```

> You can see that the _Carrier_ has **6** _Active shipments_. The response only contains summary information, to get the details of the _shipment_ the `link` properties contains a prepared API endpoint giving direct access to the full _shipment_. You can also notice that the response only gives 2 _Active shipments_ out of the 6. This is because of the pagination mechanism.
The values `SHP001` and `SHP002` is coming from the _Forwarder_ when it has earlier booked the transports from the _Carrier_.

#### Interaction 3 of Scenario A - The Shipment is being Loaded

The company **Fast**, being a _Forwarder_, sends an API request to the company **Road**, being a _Carrier_, in order to get the details of the first _shipment_ `c51d8903-01d1-485c-96ce-51a9be192207`:

```text
$ curl --request GET \
  --URL https://papinet.road.papinet.io/shipments/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Host: papinet.road.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Fast** will receive a response like this:

<!-- FILE: shipment-use-case.A.step-3.json -->
```json
{
  "id": "c51d8903-01d1-485c-96ce-51a9be192207",
  "shipmentNumber": "1001",
  "shipmentReferences": [
    {
      "type": "ShipmentNumber",
      "assignedBy": "Forwarder",
      "value": "SHP001"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "OnTime",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "estimatedDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "latestEvent": {
    "id": "7af38a28-068f-496e-97f3-e7035edc5445",
    "type": "LoadingStarted",
    "dateTime": "2021-03-23T13:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 4 of Scenario A - The Shipment has Left

The step 4 of the scenario A will simulate the situation in which the company **Road**, being a _Carrier_, reports that the shipment has left the _Supplier_'s location. Then, the company **Fast**, being a _Forwarder_, sends another similar API request to the company **Road** in order to get the details of the first _shipment_ `c51d8903-01d1-485c-96ce-51a9be192207`:

```text
$ curl --request GET \
  --URL https://papinet.road.papinet.io/shipments/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Host: papinet.road.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Fast** will receive a response like this:

<!-- FILE: shipment-use-case.A.step-4.json -->
```json
{
  "id": "c51d8903-01d1-485c-96ce-51a9be192207",
  "shipmentNumber": "1001",
  "shipmentReferences": [
    {
      "type": "ShipmentNumber",
      "assignedBy": "Forwarder",
      "value": "SHP001"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "OnTime",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "estimatedDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "latestEvent": {
    "id": "3fadd366-e438-4901-bd3f-a8d10f8c85a2",
    "type": "Departed",
    "dateTime": "2021-03-23T13:30:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 5 of Scenario A - There is a Traffic Jam

The step 5 of the scenario A will simulate the situation in which the company **Road**, being a _Carrier_, reports that the shipment arrival is getting delayed because of a traffic jam. Then, the company **Fast**, being a _Forwarder_, sends another similar API request to the company **Road** in order to get the details of the first _shipment_ `c51d8903-01d1-485c-96ce-51a9be192207`:

```text
$ curl --request GET \
  --URL https://papinet.road.papinet.io/shipments/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Host: papinet.road.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Fast** will receive a response like this:

<!-- FILE: shipment-use-case.A.step-5.json -->
```json
{
  "id": "c51d8903-01d1-485c-96ce-51a9be192207",
  "shipmentNumber": "1001",
  "shipmentReferences": [
    {
      "type": "ShipmentNumber",
      "assignedBy": "Forwarder",
      "value": "SHP001"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "Delayed",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "estimatedDateTimeOfArrival": "2021-04-24T10:00:00Z",
  "latestEvent": {
    "id": "275a18a7-69a6-4d4f-a890-b6055611b63b",
    "type": "TrafficJam",
    "dateTime": "2021-03-23T18:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 6 of Scenario A - The Shipment has Arrived

The step 6 of the scenario A will simulate the situation in which the company **Road**, being a _Carrier_, reports that the shipment has arrived at the time estimated after the traffic jam was reported. Then, the company **Fast**, being a _Forwarder_, sends another similar API request to the company **Road** in order to get the details of the first _shipment_ `c51d8903-01d1-485c-96ce-51a9be192207`:

```text
$ curl --request GET \
  --URL https://papinet.road.papinet.io/shipments/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Host: papinet.road.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Fast** will receive a response like this:

<!-- FILE: shipment-use-case.A.step-6.json -->
```json
{
  "id": "c51d8903-01d1-485c-96ce-51a9be192207",
  "shipmentNumber": "1001",
  "shipmentReferences": [
    {
      "type": "ShipmentNumber",
      "assignedBy": "Forwarder",
      "value": "SHP001"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "Delayed",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "actualDateTimeOfArrival": "2021-04-24T10:00:00Z",
  "latestEvent": {
    "id": "842a10d3-0845-49e8-a5bc-ab18fb0b01bc",
    "type": "Arrived",
    "dateTime": "2021-04-24T10:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

> As the shipment is actually arrived, we have an "actualDateTimeOfArrival" and not "estimatedDateTimeOfArrival" anymore.

#### Interaction 7 of Scenario A - The Shipment is Completed

The step 7 of the scenario A will simulate the situation in which the company **Road**, being a _Carrier_, reports that the shipment is completed. Then, the company **Fast**, being a _Forwarder_, sends another similar API request to the company **Road** in order to get the details of the first _shipment_ `c51d8903-01d1-485c-96ce-51a9be192207`:

```text
$ curl --request GET \
  --URL https://papinet.road.papinet.io/shipments/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Host: papinet.road.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Fast** will receive a response like this:

<!-- FILE: shipment-use-case.A.step-7.json -->
```json
{
  "id": "c51d8903-01d1-485c-96ce-51a9be192207",
  "shipmentNumber": "1001",
  "shipmentReferences": [
    {
      "type": "ShipmentNumber",
      "assignedBy": "Forwarder",
      "value": "SHP001"
    }
  ],
  "shipmentStatus": "Completed",
  "shipmentArrivalStatus": "Delayed",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "actualDateTimeOfArrival": "2021-04-24T10:00:00Z",
  "latestEvent": {
    "id": "a7eadf12-dd54-4ee2-98b4-29fabb6a10e9",
    "type": "Completed",
    "dateTime": "2021-04-24T11:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

### Scenario B

The company **Pulp**, a _Supplier_, requests to the company **Fast**, a _Forwarder_, the status of one or multiple of its _shipments_. The _Supplier_ has earlier sent delivery instruction(s) to the _Forwarder_.

#### Interaction 1 of Scenario B - Authentication

The company **Pulp**, being a _Supplier_, sends an API request to the company **Fast**, being a _Forwarder_, in order to be authenticated, and gets an _access token_:

```text
$ curl --request POST \
  --URL https://papinet.fast.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request POST \
  --URL http://localhost:3002/tokens \
  --header 'Host: papinet.fast.papinet.io' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the company **Pulp** will receive a response like this:

```json
{ 
  "access_token": "1d3c4294-4624-4cec-a769-fa345c8235bc",
  "token_type": "bearer", 
  "expires_in": 3600
}
```

In order to re-use the value of the `access_token` in subsequent API requests, it is convenient to save it into an environment variable:

```text
$ export ACCESS_TOKEN=$(curl --request POST \
  --URL https://papinet.fast.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

or, if you use locally the docker container of the papiNet mock server:

```$ export ACCESS_TOKEN=$(curl --request POST \
  --URL http://localhost:3002/tokens \
  --header 'Host: papinet.fast.papinet.io' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

You can easily verify the value of the `ACCESS_TOKEN` environment variable using:

```text
$ echo $ACCESS_TOKEN
e7e32320-7ec4-4d94-ba30-dfdaae6ef686
```

#### Interaction 2 of Scenario B - List of Shipments

The company **Pulp**, being a _Supplier_, sends an API request to the company **Fast**, being a _Forwarder_, in order to get the list of all its _Active shipments_:

```text
$ curl --request GET \
  --URL https://papinet.fast.papinet.io/shipments?shipmentStatus=Active \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments?shipmentStatus=Active \
  --header 'Host: papinet.fast.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Pulp** will receive a response like this:

<!-- FILE: shipment-use-case.B.step-2.json -->
```json
{
  "numberOfShipments": 6,
  "shipments": [
    {
      "id": "3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
      "shipmentNumber": "SHP001",
      "shipmentReferences": [
        {
          "type": "DeliveryInstructionNumber",
          "assignedBy": "Supplier",
          "value": "DEL001"
        },
        {
          "type": "DeliveryInstructionSequenceNumber",
          "assignedBy": "Supplier",
          "value": "1"
        }
      ],
      "shipmentStatus": "Active",
      "shipmentArrivalStatus": "OnTime",
      "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
      "estimatedDateTimeOfArrival": "2021-04-24T09:00:00Z",
      "link": "/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede"
    },
    {
      "id": "678df9d5-ebc5-4f41-a4ab-2cdf1d991deb",
      "shipmentNumber": "SHP002",
      "shipmentReferences": [
        {
          "type": "DeliveryInstructionNumber",
          "assignedBy": "Supplier",
          "value": "DEL002"
        },
        {
          "type": "DeliveryInstructionSequenceNumber",
          "assignedBy": "Supplier",
          "value": "1"
        }
      ],
      "shipmentStatus": "Active",
      "shipmentArrivalStatus": "Delayed",
      "scheduledDateTimeOfArrival": "2021-04-24T09:54:00Z",
      "estimatedDateTimeOfArrival": "2021-04-24T13:56:00Z",
      "link": "/shipments/678df9d5-ebc5-4f41-a4ab-2cdf1d991deb"
    }
  ],
  "links": {
    "self": {
      "href": "/shipments?shipmentStatus=Active&offset=0&limit=2"
    },
    "next": {
      "href": "/shipments?shipmentStatus=Active&offset=2&limit=2"
    }
  }
}
```

#### Interaction 3 of Scenario B - The Shipment is being Loaded

The company **Pulp**, being a _Supplier_, sends an API request to the company **Fast**, being a _Forwarder_, in order to get the details of the first _shipment_ `3a9108d5-f7f0-42ae-9a29-eb302bdb8ede`:

```text
$ curl --request GET \
  --URL https://papinet.fast.papinet.io/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede \
  --header 'Host: papinet.fast.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Pulp** will receive a response like this:

<!-- FILE: shipment-use-case.B.step-3.json -->
```json
{
  "id": "3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
  "shipmentNumber": "SHP001",
  "shipmentReferences": [
    {
      "type": "DeliveryInstructionNumber",
      "assignedBy": "Supplier",
      "value": "DEL001"
    },
    {
      "type": "DeliveryInstructionSequenceNumber",
      "assignedBy": "Supplier",
      "value": "1"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "OnTime",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "estimatedDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "latestEvent": {
    "id": "7af38a28-068f-496e-97f3-e7035edc5445",
    "type": "LoadingStarted",
    "dateTime": "2021-03-23T13:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 4 of Scenario B - The Shipment has Left

The step 4 of the scenario B will simulate the situation in which the company **Fast**, being a _Forwarder_, reports that the shipment has left the _Supplier_'s location. Then, the company **Pulp**, being a _Supplier_, sends another similar API request to the company **Fast** in order to get the details of the first _shipment_ `3a9108d5-f7f0-42ae-9a29-eb302bdb8ede`:

```text
$ curl --request GET \
  --URL https://papinet.fast.papinet.io/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede \
  --header 'Host: papinet.fast.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Pulp** will receive a response like this:

<!-- FILE: shipment-use-case.B.step-4.json -->
```json
{
  "id": "3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
  "shipmentNumber": "SHP001",
  "shipmentReferences": [
    {
      "type": "DeliveryInstructionNumber",
      "assignedBy": "Supplier",
      "value": "DEL001"
    },
    {
      "type": "DeliveryInstructionSequenceNumber",
      "assignedBy": "Supplier",
      "value": "1"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "OnTime",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "estimatedDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "latestEvent": {
    "id": "3fadd366-e438-4901-bd3f-a8d10f8c85a2",
    "type": "Departed",
    "dateTime": "2021-03-23T13:30:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 5 of Scenario B - There is a Traffic Jam

The step 5 of the scenario B will simulate the situation in which the company **Fast**, being a _Forwarder_, reports that the shipment arrival is getting delayed because of a traffic jam. Then, the company **Pulp**, being a _Supplier_, sends another similar API request to the company **Fast** in order to get the details of the first _shipment_ `3a9108d5-f7f0-42ae-9a29-eb302bdb8ede`:

```text
$ curl --request GET \
  --URL https://papinet.fast.papinet.io/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede \
  --header 'Host: papinet.fast.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Pulp** will receive a response like this:

<!-- FILE: shipment-use-case.B.step-5.json -->
```json
{
  "id": "3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
  "shipmentNumber": "SHP001",
  "shipmentReferences": [
    {
      "type": "DeliveryInstructionNumber",
      "assignedBy": "Supplier",
      "value": "DEL001"
    },
    {
      "type": "DeliveryInstructionSequenceNumber",
      "assignedBy": "Supplier",
      "value": "1"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "Delayed",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "estimatedDateTimeOfArrival": "2021-04-24T10:00:00Z",
  "latestEvent": {
    "id": "275a18a7-69a6-4d4f-a890-b6055611b63b",
    "type": "TrafficJam",
    "dateTime": "2021-03-23T18:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 6 of Scenario B - The Shipment has Arrived

The step 6 of the scenario B will simulate the situation in which the company **Fast**, being a _Forwarder_, reports that the shipment has arrived at the time estimated after the traffic jam was reported. Then, the company **Pulp**, being a _Supplier_, sends another similar API request to the company **Fast** in order to get the details of the first _shipment_ `3a9108d5-f7f0-42ae-9a29-eb302bdb8ede`:

```text
$ curl --request GET \
  --URL https://papinet.fast.papinet.io/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede \
  --header 'Host: papinet.fast.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Pulp** will receive a response like this:

<!-- FILE: shipment-use-case.B.step-6.json -->
```json
{
  "id": "3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
  "shipmentNumber": "SHP001",
  "shipmentReferences": [
    {
      "type": "DeliveryInstructionNumber",
      "assignedBy": "Supplier",
      "value": "DEL001"
    },
    {
      "type": "DeliveryInstructionSequenceNumber",
      "assignedBy": "Supplier",
      "value": "1"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "Delayed",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "actualDateTimeOfArrival": "2021-04-24T10:00:00Z",
  "latestEvent": {
    "id": "842a10d3-0845-49e8-a5bc-ab18fb0b01bc",
    "type": "Arrived",
    "dateTime": "2021-04-24T10:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 7 of Scenario B - The Shipment is Completed

The step 7 of the scenario B will simulate the situation in which the company **Fast**, being a _Forwarder_, reports that the shipment is completed. Then, the company **Pulp**, being a _Supplier_, sends another similar API request to the company **Fast** in order to get the details of the first _shipment_ `3a9108d5-f7f0-42ae-9a29-eb302bdb8ede`:

```text
$ curl --request GET \
  --URL https://papinet.fast.papinet.io/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/3a9108d5-f7f0-42ae-9a29-eb302bdb8ede \
  --header 'Host: papinet.fast.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Pulp** will receive a response like this:

<!-- FILE: shipment-use-case.B.step-7.json -->
```json
{
  "id": "3a9108d5-f7f0-42ae-9a29-eb302bdb8ede",
  "shipmentNumber": "SHP001",
  "shipmentReferences": [
    {
      "type": "DeliveryInstructionNumber",
      "assignedBy": "Supplier",
      "value": "DEL001"
    },
    {
      "type": "DeliveryInstructionSequenceNumber",
      "assignedBy": "Supplier",
      "value": "1"
    }
  ],
  "shipmentStatus": "Completed",
  "shipmentArrivalStatus": "Delayed",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "actualDateTimeOfArrival": "2021-04-24T10:00:00Z",
  "latestEvent": {
    "id": "a7eadf12-dd54-4ee2-98b4-29fabb6a10e9",
    "type": "Completed",
    "dateTime": "2021-04-24T11:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

### Scenario C

The company **Corp**, being the _Order Issuer_, requests to the company **Pulp**, a _Supplier_, the status of one or multiple of its expected _shipments_. The _Order Issuer_ has earlier sent the related orders to the _Supplier_, for the _End User_ to receive ordered products.

#### Interaction 1 of Scenario C - Authentication

The company **Corp**, being an _Order Issuer_, sends an API request to the company **Pulp**, being a _Supplier_, in order to be authenticated, and gets an _access token_:

```text
$ curl --request POST \
  --URL https://papinet.pulp.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request POST \
  --URL http://localhost:3002/tokens \
  --header 'Host: papinet.pulp.papinet.io' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the company **Corp** will receive a response like this:

```json
{ 
  "access_token": "fe69f78b-a2fd-4e8d-99c1-2f9672846a9a",
  "token_type": "bearer", 
  "expires_in": 3600
}
```

In order to re-use the value of the `access_token` in subsequent API requests, it is convenient to save it into an environment variable:

```text
$ export ACCESS_TOKEN=$(curl --request POST \
  --URL https://papinet.pulp.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

or, if you use locally the docker container of the papiNet mock server:

```$ export ACCESS_TOKEN=$(curl --request POST \
  --URL http://localhost:3002/tokens \
  --header 'Host: papinet.pulp.papinet.io' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

You can easily verify the value of the `ACCESS_TOKEN` environment variable using:

```text
$ echo $ACCESS_TOKEN
4da15489-edd6-434e-96fe-830fc8beba2d
```

#### Interaction 2 of Scenario C - List of Shipments

The company **Corp**, being an _Order Issuer_, sends an API request to the company **Pulp**, being a _Supplier_, in order to get the list of all its _Active shipments_:

```text
$ curl --request GET \
  --URL https://papinet.pulp.papinet.io/shipments?shipmentStatus=Active \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments?shipmentStatus=Active \
  --header 'Host: papinet.pulp.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Corp** will receive a response like this:

<!-- FILE: shipment-use-case.C.step-2.json -->
```json
{
  "numberOfShipments": 6,
  "shipments": [
    {
      "id": "d4fd1f2c-642f-4df8-a7b3-139cf9d63d17",
      "shipmentNumber": "SU001SHP001",
      "shipmentReferences": [
        {
          "type": "OrderNumber",
          "assignedBy": "OrderIssuer",
          "value": "ORD001"
        },
        {
          "type": "OrderLineItemNumber",
          "assignedBy": "OrderIssuer",
          "value": "1"
        }
      ],
      "shipmentStatus": "Active",
      "shipmentArrivalStatus": "OnTime",
      "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
      "estimatedDateTimeOfArrival": "2021-04-24T09:00:00Z",
      "link": "/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17"
    },
    {
      "id": "55cdad30-51df-4bfb-96ad-34e756ce7ba0",
      "shipmentNumber": "SU002SHP002",
      "shipmentReferences": [
        {
          "type": "OrderNumber",
          "assignedBy": "OrderIssuer",
          "value": "ORD002"
        },
        {
          "type": "OrderLineItemNumber",
          "assignedBy": "OrderIssuer",
          "value": "1"
        }
      ],
      "shipmentStatus": "Active",
      "shipmentArrivalStatus": "Delayed",
      "scheduledDateTimeOfArrival": "2021-04-24T09:54:00Z",
      "estimatedDateTimeOfArrival": "2021-04-24T13:56:00Z",
      "link": "/shipments/55cdad30-51df-4bfb-96ad-34e756ce7ba0"
    }
  ],
  "links": {
    "self": {
      "href": "/shipments?shipmentStatus=Active&offset=0&limit=2"
    },
    "next": {
      "href": "/shipments?shipmentStatus=Active&offset=2&limit=2"
    }
  }
}
```

#### Interaction 3 of Scenario C - The Shipment is being Loaded

The company **Corp**, being an _Order Issuer_, sends an API request to the company **Pulp**, being a _Supplier_, in order to get the details of the first _shipment_ `d4fd1f2c-642f-4df8-a7b3-139cf9d63d17`:

```text
$ curl --request GET \
  --URL https://papinet.pulp.papinet.io/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17 \
  --header 'Host: papinet.pulp.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Corp** will receive a response like this:

<!-- FILE: shipment-use-case.C.step-3.json -->
```json
{
  "id": "d4fd1f2c-642f-4df8-a7b3-139cf9d63d17",
  "shipmentNumber": "SU001SHP001",
  "shipmentReferences": [
    {
      "type": "OrderNumber",
      "assignedBy": "OrderIssuer",
      "value": "ORD001"
    },
    {
      "type": "OrderLineItemNumber",
      "assignedBy": "OrderIssuer",
      "value": "1"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "OnTime",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "estimatedDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "latestEvent": {
    "id": "7af38a28-068f-496e-97f3-e7035edc5445",
    "type": "LoadingStarted",
    "dateTime": "2021-03-23T13:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 4 of Scenario C - The Shipment has Left

The step 4 of the scenario C will simulate the situation in which the company **Pulp**, being a _Supplier_, reports that the shipment has left the _Supplier_'s location. Then, the company **Corp**, being an _Order Issuer__, sends another similar API request to the company **Pulp** in order to get the details of the first _shipment_ `d4fd1f2c-642f-4df8-a7b3-139cf9d63d17`:

```text
$ curl --request GET \
  --URL https://papinet.pulp.papinet.io/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17 \
  --header 'Host: papinet.pulp.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Corp** will receive a response like this:

<!-- FILE: shipment-use-case.C.step-4.json -->
```json
{
  "id": "d4fd1f2c-642f-4df8-a7b3-139cf9d63d17",
  "shipmentNumber": "SU001SHP001",
  "shipmentReferences": [
    {
      "type": "OrderNumber",
      "assignedBy": "OrderIssuer",
      "value": "ORD001"
    },
    {
      "type": "OrderLineItemNumber",
      "assignedBy": "OrderIssuer",
      "value": "1"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "OnTime",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "estimatedDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "latestEvent": {
    "id": "3fadd366-e438-4901-bd3f-a8d10f8c85a2",
    "type": "Departed",
    "dateTime": "2021-03-23T13:30:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 5 of Scenario C - There is a Traffic Jam

The step 5 of the scenario C will simulate the situation in which the company **Pulp**, being a _Supplier_, reports that the shipment arrival is getting delayed because of a traffic jam. Then, the company **Corp**, being an _Order Issuer__, sends another similar API request to the company **Pulp** in order to get the details of the first _shipment_ `d4fd1f2c-642f-4df8-a7b3-139cf9d63d17`:

```text
$ curl --request GET \
  --URL https://papinet.pulp.papinet.io/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17 \
  --header 'Host: papinet.pulp.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Corp** will receive a response like this:

<!-- FILE: shipment-use-case.C.step-5.json -->
```json
{
  "id": "d4fd1f2c-642f-4df8-a7b3-139cf9d63d17",
  "shipmentNumber": "SU001SHP001",
  "shipmentReferences": [
    {
      "type": "OrderNumber",
      "assignedBy": "OrderIssuer",
      "value": "ORD001"
    },
    {
      "type": "OrderLineItemNumber",
      "assignedBy": "OrderIssuer",
      "value": "1"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "Delayed",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "estimatedDateTimeOfArrival": "2021-04-24T10:00:00Z",
  "latestEvent": {
    "id": "275a18a7-69a6-4d4f-a890-b6055611b63b",
    "type": "TrafficJam",
    "dateTime": "2021-03-23T18:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 6 of Scenario C - The Shipment has Arrived

The step 6 of the scenario C will simulate the situation in which the company **Pulp**, being a _Supplier_, reports that the shipment has arrived at the time estimated after the traffic jam was reported. Then, the company **Corp**, being an _Order Issuer__, sends another similar API request to the company **Pulp** in order to get the details of the first _shipment_ `d4fd1f2c-642f-4df8-a7b3-139cf9d63d17`:

```text
$ curl --request GET \
  --URL https://papinet.pulp.papinet.io/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17 \
  --header 'Host: papinet.pulp.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Corp** will receive a response like this:

<!-- FILE: shipment-use-case.C.step-6.json -->
```json
{
  "id": "d4fd1f2c-642f-4df8-a7b3-139cf9d63d17",
  "shipmentNumber": "SU001SHP001",
  "shipmentReferences": [
    {
      "type": "OrderNumber",
      "assignedBy": "OrderIssuer",
      "value": "ORD001"
    },
    {
      "type": "OrderLineItemNumber",
      "assignedBy": "OrderIssuer",
      "value": "1"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "Delayed",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "actualDateTimeOfArrival": "2021-04-24T10:00:00Z",
  "latestEvent": {
    "id": "842a10d3-0845-49e8-a5bc-ab18fb0b01bc",
    "type": "Arrived",
    "dateTime": "2021-04-24T10:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Interaction 7 of Scenario C - The Shipment is Completed

The step 7 of the scenario C will simulate the situation in which the company **Pulp**, being a _Supplier_, reports that the shipment is completed. Then, the company **Corp**, being an _Order Issuer__, sends another similar API request to the company **Pulp** in order to get the details of the first _shipment_ `d4fd1f2c-642f-4df8-a7b3-139cf9d63d17`:

```text
$ curl --request GET \
  --URL https://papinet.pulp.papinet.io/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3002/shipments/d4fd1f2c-642f-4df8-a7b3-139cf9d63d17 \
  --header 'Host: papinet.pulp.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the company **Corp** will receive a response like this:

<!-- FILE: shipment-use-case.C.step-7.json -->
```json
{
  "id": "d4fd1f2c-642f-4df8-a7b3-139cf9d63d17",
  "shipmentNumber": "SU001SHP001",
  "shipmentReferences": [
    {
      "type": "OrderNumber",
      "assignedBy": "OrderIssuer",
      "value": "ORD001"
    },
    {
      "type": "OrderLineItemNumber",
      "assignedBy": "OrderIssuer",
      "value": "1"
    }
  ],
  "shipmentStatus": "Completed",
  "shipmentArrivalStatus": "Delayed",
  "scheduledDateTimeOfArrival": "2021-04-24T09:00:00Z",
  "actualDateTimeOfArrival": "2021-04-24T10:00:00Z",
  "latestEvent": {
    "id": "a7eadf12-dd54-4ee2-98b4-29fabb6a10e9",
    "type": "Completed",
    "dateTime": "2021-04-24T11:00:00Z",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```
