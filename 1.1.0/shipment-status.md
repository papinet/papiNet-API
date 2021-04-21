# Shipment Status Use Case

## Context

### Preconditions

An _Order Issuer_ has sent _orders_ to the _Supplier_.
The _Supplier_ has sent delivery instruction(s) to the _Forwarder_.
The _Forwarder_ is responsible to book the transport with the _Carrier_.

### Process

The _Order Issuer_ and/or the _End User_ can track expected _shipments_, related to the _orders_, from the _Supplier_.
The _Supplier_ is tracking the expected _shipments_, related to the delivery instruction(s), from the _Forwarder_.
The _Forwarder_ is tracking the expected _shipments_, related to the transport bookings, from the _Carrier_.

Within the logistic supply chain, a _Supplier_ buys transport services from a _Forwarder_. Then, the  _Forwarder_ buys transports to fulfil the transport services from one or multiple _Carriers_. A company may play both _Forwarder_ and _Carrier_ roles. A company may play both _Supplier_ and _Forwarder_ roles, or even the three roles.

## Scenarios

* Scenario A - A _Forwarder_ requests to a _Carrier_ the status of one or multiple of its _shipments_. The _Forwarder_ has earlier booked the transport from the _Carrier_.
* Scenario B - A _Supplier_ requests to a _Forwarder_ the status of one or multiple of its _shipments_. The _Supplier_ has earlier sent delivery instruction(s) to the _Forwarder_.
* Scenario C - An _End User_ requests to a _Supplier_ the status of one or multiple of its expected _shipments_. An _Order Issuer_ has earlier sent the related orders to the _Supplier_, for the _End User_ to receive ordered products.
* Scenario D - An _Order Issuer_ requests to a _Supplier_ the status of one or multiple of its _shipments_. The _Order Issuer_ has earlier sent the related orders to the _Supplier_.

### Scenario A

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/shipments?orderStatus=Active \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer 0b732cd6-210b-4ae7-9e95-04938c7e862e'
```