# Shipment Status Use Case

## Context

### Preconditions

An _Order Issuer_ has sent _orders_ to the _Supplier_.
The _Supplier_ has sent delivery instruction(s) to the _Forwarder_.
The _Forwarder_ is responsible to book the transport with one or multiple _Carriers_.

### Process

The _Order Issuer_ and/or the _End User_ can track expected _shipments_, related to the _orders_, from the _Supplier_.
The _Supplier_ is tracking the expected _shipments_, related to the delivery instruction(s), from the _Forwarder_.
The _Forwarder_ is tracking the expected _shipments_, related to the transport bookings, from the _Carrier(s)_.

Within the logistic supply chain, a _Supplier_ buys transport services from a _Forwarder_. Then, the  _Forwarder_ buys transports to fulfil the transport services from one or multiple _Carriers_. A company may play both _Forwarder_ and _Carrier_ roles. A company may play both _Supplier_ and _Forwarder_ roles, or even the three roles.

## Domain Name

We suggest that _Suppliers_, _Forwarder_ and _Carrier_ expose their papiNet API endpoints using the domain name of their respective corporate web sides with the prefix `papinet.*`. For instance, if the _Supplier_ is the company **ACME** using `acme.com` for its corporate web site, they should then expose their papiNet API endpoints on the domain name `papinet.acme.com`.

The _**papiNet Mock Service**_ is exposing the papiNet API endpoints on different domain names based on different fictional company names used to simulate different business roles:

| Name | Domain Name             | Business Role(s)            |
| ---- | ----------------------- | --------------------------- |
| Pulp | papinet.pulp.papinet.io | _Supplier_                  |
| Fast | papinet.fast.papinet.io | _Forwarder_                 |
| Road | papinet.road.papinet.io | _Carrier_                   |
| Corp | papinet.corp.papinet.io | _Order Issuer_ & _End User_ |

## Authentication

We recommend secure the access to the papiNet API endpoints using the [OAuth 2.0](https://tools.ietf.org/html/rfc6749#section-4.4) standard, with the _client credentials_ authorization grant.

## Scenarios

* Scenario A - A _Forwarder_ requests to a _Carrier_ the status of one or multiple of its _shipments_. The _Forwarder_ has earlier booked the transport from the _Carrier_.
* Scenario B - A _Supplier_ requests to a _Forwarder_ the status of one or multiple of its _shipments_. The _Supplier_ has earlier sent delivery instruction(s) to the _Forwarder_.
* Scenario C - An _End User_ requests to a _Supplier_ the status of one or multiple of its expected _shipments_. An _Order Issuer_ has earlier sent the related orders to the _Supplier_, for the _End User_ to receive ordered products.
* Scenario D - An _Order Issuer_ requests to a _Supplier_ the status of one or multiple of its _shipments_. The _Order Issuer_ has earlier sent the related orders to the _Supplier_.

### Scenario A

A _Forwarder_ requests to a _Carrier_ the status of one or multiple of its _shipments_. The _Forwarder_ has earlier booked the transport from the _Carrier_.

#### Step 1 of Scenario A - Authentication

The _Forwarder_ sends an API request to the _Carrier_ in order to be authenticated, and gets an _access token_:

```text
$ curl --request POST \
  --URL https://papinet.road.papinet.io/token \
  --user 'public-36297346:private-ce2d3cf4'
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _Forwarder_ will receive a response like this:

```json
{ 
  "access_token": "2YotnFZFEjr1zCsicMWpAA",
  "token_type": "bearer", 
  "expires_in":3600
}
```

#### Step 2 of Scenario A

The _Forwarder_ sends an API request to the _Carrier_ in order to get the list of all its _Active shipments_:

```text
$ curl --request GET \
  --URL https://papinet.road.papinet.io/shipments?shipmentStatus=Active \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer 2YotnFZFEjr1zCsicMWpAA'
```

If all goes well, the _Forwarder_ will receive from the _Carrier_ a response like this:

```json
{
  "numberOfShipments": 6,
  "shipments": [
    {
      "id": "c51d8903-01d1-485c-96ce-51a9be192207",
      "shipmentNumber": "1001",
      "shipmentReferences": [
        {
          "type": "shipmentNumber",
          "assignedBy": "Forwarder",
          "value": "ABC01"
        }
      ],
      "shipmentStatus": "Active",
      "shipmentArrivalStatus": "OnTime",
      "scheduledDateTimeOfArrival": "2021-04-24T09:54:00",
      "estimatedDateTimeOfArrival": "2021-04-24T13:56:00",
      "link": "/shipments/c51d8903-01d1-485c-96ce-51a9be192207"
    },
    {
      "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
      "supplierShipmentNumber": "1002",
      "shipmentReferences": [
        {
          "type": "shipmentNumber",
          "assignedBy": "Forwarder",
          "value": "ABC02"
        }
      ],
      "shipmentStatus": "Active",
      "shipmentArrivalStatus": "OnTime",
      "scheduledDateTimeOfArrival": "2021-04-24T09:54:00",
      "estimatedDateTimeOfArrival": "2021-04-24T13:56:00",
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

#### Step 3 of Scenario A

The _Forwarder_ sends an API request to the _Carrier_ in order to get the details of the first _shipment_ `c51d8903-01d1-485c-96ce-51a9be192207`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/shimpents/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer 2YotnFZFEjr1zCsicMWpAA'
```

If all goes well, the _Forwarder_ will receive a response like this:

```json
{
  "id": "c51d8903-01d1-485c-96ce-51a9be192207",
  "shipmentNumber": "1001",
  "shipmentReferences": [
    {
      "type": "shipmentNumber",
      "assignedBy": "Forwarder",
      "value": "ABC01"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "OnTime",
  "scheduledDateTimeOfArrival": "2021-04-24T09:54:00",
  "estimatedDateTimeOfArrival": "2021-04-24T09:53:36",
  "latestEvent": {
    "id": "7af38a28-068f-496e-97f3-e7035edc5445",
    "type": "LoadingStarted",
    "dateTime": "2021-03-23T13:56:00",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

#### Step [At Arrival] of Scenario A

```json
{
  "id": "c51d8903-01d1-485c-96ce-51a9be192207",
  "shipmentNumber": "1001",
  "shipmentReferences": [
    {
      "type": "shipmentNumber",
      "assignedBy": "Forwarder",
      "value": "ABC01"
    }
  ],
  "shipmentStatus": "Active",
  "shipmentArrivalStatus": "OnTime",
  "scheduledDateTimeOfArrival": "2021-04-24T09:54:00",
  "actualDateTimeOfArrival": "2021-04-24T13:56:00",
  "latestEvent": {
    "id": "842a10d3-0845-49e8-a5bc-ab18fb0b01bc",
    "type": "Arrived",
    "dateTime": "2021-04-24T14:15:00",
    "location" : {
      "latitude" : 37.4224764,
      "longitude" : -122.0842499
    }
  }
}
```

> As the shipment is actually arrived, we have an "actualDateTimeOfArrival" and not "estimatedDateTimeOfArrival" anymore.
