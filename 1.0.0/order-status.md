# Order Status Use Case

## Context

An _Order Issuer_ requests to a _Supplier_ the status of one or multiple of its _orders_. The _Order Issuer_ has earlier sent the orders to the Supplier. 
This use case is designed for Pulp and Paper business.

## Base URL

We suggest that the _Supplier_ exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _Supplier_ is the company **ACME** using `acme.com` for its corporate web site, they should then expose the papiNet API endpoints on the domain `papinet.acme.com`.

The _**papiNet Mock Service**_ is exposing the papiNet API endpoints on the domain `api.papinet.io`.

## Authentication

We recommend secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _Order Issuer_ sends an API request to create a session, and gets its associated _access token_:

```text
$ curl --request POST \
  --URL http://localhost:3001/tokens \
  --header 'Content-Type: application/json' \
  --data '{
    "partnerId": "public:36297346-e4d0-4214-b298-dd129c6ed82b",
    "partnerSecret": "private:ce2d3cf4-68f9-4202-acbf-8a73c3801195"
  }'
```

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{ 
  "accessToken": "d08305d0-4645-4e05-baf4-2253703f89b5",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

## Scenarios

* Scenario A - One Production and One Shipment
* Scenario B - Multiple Productions and One Shipment
* Scenario C - One Production and Multiple Shipments
* Scenario D - Multiple Productions and Multiple Shipments
* Scenario E - Under Shipment
* Scenario F - Over Shipment

### Scenario A

The _Order Issuer_ sends an API request to get the list of all its _pending orders_:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders?orderStatus=Pending \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer d08305d0-4645-4e05-baf4-2253703f89b5'
```

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "numberOfOrders": 6,
  "orders": [
    {
      "id": "c51d8903-01d1-485c-96ce-51a9be192207",
      "orderNumber": "1001",
      "orderStatus": "Pending",
      "numberOfLineItems": 1,
      "link": "/orders/c51d8903-01d1-485c-96ce-51a9be192207"
    },
    {
      "id": "6a0d16db-546f-4c19-b288-ddd2a250f064",
      "orderNumber": "1002",
      "orderStatus": "Pending",
      "numberOfLineItems": 1,
      "link": "/orders/6a0d16db-546f-4c19-b288-ddd2a250f064"
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

> You can see that the _Order Issuer_ has **5**  _pending orders_. The response only contains the header information, to get the details of the order, including the order lines, you can see the `link` properties that contains a prepared API endpoint giving direct access to the full order. You can also notice that the response only gives 2 _pending orders_ out of the 6. This is because of the pagination mechanism.

#### Step 1

The step 1 of the scenario A will simulate the situation in which the (unique) line is `Pending` and can still be changed (`"changeable": true`). Then, the _Order Issuer_ sends an API request to get the details of the first order `6a0d16db-546f-4c19-b288-ddd2a250f064`:

```text
$ curl --request GET \
  --URL https://api.papinet.io//orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer d08305d0-4645-4e05-baf4-2253703f89b5'
```

And, if all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "c51d8903-01d1-485c-96ce-51a9be192207",
  "orderNumber": "1001",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "e436266b-d831-47a1-9fef-3f749c955673",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Pending",
      "changeable": true,
      "quantities": [
        {
        "quantityContext": "Ordered",
        "quantityType": "GrossWeight",
        "quantityValue": 10000,
        "quantityUOM": "Kilogram"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the order `1001` has been well received by the _Supplier_, is still `Pending` and can still be changed (`"changeable": true`).

#### Step 2

Let's consider that, after some time, the _Supplier_ have processed the order and confirmed the ordered quantities. Then, the _Order Issuer_ sends another similar API request to get the details of the first order `6a0d16db-546f-4c19-b288-ddd2a250f064`:

```text
$ curl --request GET \
  --URL https://api.papinet.io//orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Content-Type: application/json'
```

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "c51d8903-01d1-485c-96ce-51a9be192207",
  "orderNumber": "1001",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "e436266b-d831-47a1-9fef-3f749c955673",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": true,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram",
          "quantityType": "GrossWeight"
        },
        {
          "quantityContext": "Confirmed",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram",
          "quantityType": "GrossWeight"
        },
        {
          "quantityContext": "Confirmed",
          "quantityValue": 3,
          "quantityUOM": "Reel",
          "quantityType": "Count"
        }
      ]
    }
  ],
  "links": {}
}
```
