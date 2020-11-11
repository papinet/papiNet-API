# Order Status Use Case

## Context

A _Buyer_ requests to a _Supplier_ the status of one or multiple of its _orders_.

## Base URL

We suggest that the _Supplier_ exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _Supplier_ is the company **ACME** using `acme.com` for its corporate web site, they should then expose the papiNet API endpoints on the domain `papinet.acme.com`.

The _**papiNet Mock Service**_ is exposing the papiNet API endpoints on the domain `api.papinet.io`.

## Scenario A

The _Buyer_ sends an API request to get the list of all its _pending orders_:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders?orderStatus=Pending \
  --header 'Content-Type: application/json'
```

If all goes well, the _Buyer_ will receive a response like this:

```json
{
  "numberOfOrders": 5,
  "orders": [
    {
      "id": "c634e000-4ba1-45b0-94d3-80c319c942ce",
      "orderNumber": "1002",
      "orderStatus": "Pending",
      "numberOfLineItems": 5,
      "link": "/orders/c634e000-4ba1-45b0-94d3-80c319c942ce"
    },
    {
      "id": "3cb9cd15-1358-443b-b140-756ea9b812f2",
      "orderNumber": "1003",
      "orderStatus": "Pending",
      "numberOfLineItems": 7,
      "link": "/orders/3cb9cd15-1358-443b-b140-756ea9b812f2"
    }
  ],
  "links": {
    "self": {
      "href": "/orders?orderStatus=Pending&offset=0&limit=2"
    },
    "next": {
      "href": "/orders?orderStatus=Pending&offset=2&limit=2"
    }
  }
}
```

You can see that the _Buyer_ has **5**  _pending orders_. The response only contains the header information, to get the details of the order, including the order lines, you can see the `link` properties that contains a prepared API endpoint giving direct access to the full order. You can also notice that the response only gives 2 _pending orders_ out of the 5. This is because of the pagination mechanism.