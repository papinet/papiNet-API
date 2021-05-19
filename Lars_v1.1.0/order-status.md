# Order Status Use Case

## Context

An _Order Issuer_ requests to a _Supplier_ the status of one or multiple of its _orders_. The _Order Issuer_ has earlier sent the orders to the Supplier. 
This use case is designed for Pulp and Paper business and only for orders with direct shipments from the _Supplier_ site to the customer ship-to location(s).

## Domain Name

We suggest that _Suppliers_ expose their papiNet API endpoints using the domain name of their respective corporate web sides with the prefix `papinet.*`. For instance, if the _Supplier_ is the company **ACME** using `acme.com` for its corporate web site, they should then expose their papiNet API endpoints on the domain name `papinet.acme.com`.

The _**papiNet Mock Service**_ is exposing the papiNet API endpoints on the domain `papinet.papinet.io`.

## Authentication

We recommend secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _Order Issuer_ sends an API request to create a session, and gets its associated _access token_:

```text
$ curl --request POST \
  --URL https://papinet.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request POST \
  --URL http://localhost:3001/tokens \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{ 
  "access_token": "ef1bee66-8607-4f32-854c-76ff44763ab7",
  "token_type": "bearer", 
  "expires_in": 3600
}
```

## Scenarios

* Scenario A - One Production and One Shipment
* Scenario B - Multiple Productions and One Shipment
* Scenario C - One Production and Multiple Shipments
* Scenario D - Multiple Productions and Multiple Shipments
* Scenario E - Under Shipment

### Scenario A - One Production and One Shipment

The _Order Issuer_ sends an API request to the _Supplier_ in order to get the list of all its _Active orders_:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders?orderStatus=Active \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders?orderStatus=Active \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "numberOfOrders": 6,
  "orders": [
    {
      "id": "c51d8903-01d1-485c-96ce-51a9be192207",
      "orderNumber": "1001",
      "orderStatus": "Active",
      "numberOfLineItems": 1,
      "link": "/orders/c51d8903-01d1-485c-96ce-51a9be192207"
    },
    {
      "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
      "orderNumber": "1002",
      "orderStatus": "Active",
      "numberOfLineItems": 1,
      "link": "/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4"
    }
  ],
  "links": {
    "self": {
      "href": "/orders?orderStatus=Active&offset=0&limit=2"
    },
    "next": {
      "href": "/orders?orderStatus=Active&offset=2&limit=2"
    }
  }
}
```

> You can see that the _Order Issuer_ has **6**  _Active orders_. The response only contains the header information, to get the details of the order, including the order lines, you can see the `link` properties that contains a prepared API endpoint giving direct access to the full order. You can also notice that the response only gives 2 _Active orders_ out of the 6. This is because of the pagination mechanism.

We have prepared the scenario A on the order `1001`.

#### Step 1 of Scenario A

The step 1 of the scenario A will simulate the situation in which the (unique) line is `Pending` and can still be changed (`"changeable": true`). Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the first order `6a0d16db-546f-4c19-b288-ddd2a250f064`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
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

It shows that the order `1001` has been well received by the _Supplier_ and is _Active_. Its first (and unique) line is still `Pending` and can still be changed (`"changeable": true`).

#### Step 2 of Scenario A

The step 2 of the scenario A will simulate the situation in which the _Supplier_ has processed the order and confirmed the ordered quantities. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `6a0d16db-546f-4c19-b288-ddd2a250f064`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

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
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is now `Confirmed`, but can still be changed (`"changeable": true`), as the quantities have been _Confirmed_.

#### Step 3 of Scenario A

The step 3 of the scenario A will simulate the situation in which the _Supplier_ has started the production (or conversion) process for the order line, meaning that it can't be changed anymore (`"changeable": false`). Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `6a0d16db-546f-4c19-b288-ddd2a250f064`:

```text
$ curl --request GET \
  --URL https://api.papinet.io//orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "1804bcfb-15ae-476a-bc8b-f31bc9f4de62",
  "orderNumber": "1006",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "fc890c7d-39e5-4181-8040-affde22edf89",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": false,
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

It shows that the first (and unique) line is still `Confirmed`, but cannot be changed anymore (`"changeable": false`).

#### Step 4 of Scenario A

The step 4 of the scenario A will simulate the situation in which the _Supplier_ has completed the production (or conversion) process for the order line. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `6a0d16db-546f-4c19-b288-ddd2a250f064`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

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
      "orderLineItemStatus": "ProductionCompleted",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line has now reached the status `ProductionCompleted`. The quantities have been updated accordingly, using the context `Produced`.

#### Step 5 of Scenario A

The step 5 of the scenario A will simulate the situation in which the _Supplier_ has completed the shipment for the order line. It means that the products have left the _Supplier_ location.  Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `6a0d16db-546f-4c19-b288-ddd2a250f064`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

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
      "orderLineItemStatus": "ShipmentCompleted",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line has now reached the status `ShipmentCompleted`. The quantities have been updated accordingly, using the context `Shipped`.

#### Step 6 of Scenario A

The step 6 of the scenario A will simulate the situation in which the _Supplier_ has sent an invoice referring to the order line.  Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `6a0d16db-546f-4c19-b288-ddd2a250f064`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c51d8903-01d1-485c-96ce-51a9be192207 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "c51d8903-01d1-485c-96ce-51a9be192207",
  "orderNumber": "1001",
  "orderStatus": "Completed",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "e436266b-d831-47a1-9fef-3f749c955673",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Completed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Invoiced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line, as well as the order `1001`, has now reached the status `Completed`. The quantities have been updated accordingly, using the context `Invoiced`. Notice that only the quantity of type `Count` is not relevant in the context `Invoiced`.

### Scenario B - Multiple Productions and One Shipment

The _Order Issuer_ sends an API request to the _Supplier_ in order to get the list of all its _Active orders_:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders?orderStatus=Active \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders?orderStatus=Active \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "numberOfOrders": 6,
  "orders": [
    {
      "id": "c51d8903-01d1-485c-96ce-51a9be192207",
      "orderNumber": "1001",
      "orderStatus": "Active",
      "numberOfLineItems": 1,
      "link": "/orders/c51d8903-01d1-485c-96ce-51a9be192207"
    },
    {
      "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
      "orderNumber": "1002",
      "orderStatus": "Active",
      "numberOfLineItems": 1,
      "link": "/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4"
    }
  ],
  "links": {
    "self": {
      "href": "/orders?orderStatus=Active&offset=0&limit=2"
    },
    "next": {
      "href": "/orders?orderStatus=Active&offset=2&limit=2"
    }
  }
}
```

We have prepared the scenario B on the order `1002`.

#### Step 1 of Scenario B

The step 1 of the scenario B will simulate the situation in which the (unique) line is `Pending` and can still be changed (`"changeable": true`). Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `778fe5cb-f7ac-4493-b492-25fe98df67c4`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'


If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
  "orderNumber": "1002",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "6a0d16db-546f-4c19-b288-ddd2a250f064",
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

It shows that the order `1002` has been well received by the _Supplier_ and is _Active_. Its first (and unique) line is still `Pending` and can still be changed (`"changeable": true`).

#### Step 2 of Scenario B

The step 2 of the scenario B will simulate the situation in which the _Supplier_ has processed the order and confirmed the ordered quantities. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `778fe5cb-f7ac-4493-b492-25fe98df67c4`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
  "orderNumber": "1002",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "6a0d16db-546f-4c19-b288-ddd2a250f064",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": true,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is now `Confirmed`, but can still be changed (`"changeable": true`), as the quantities have been _Confirmed_.

#### Step 3 of Scenario B

The step 3 of the scenario B will simulate the situation in which the _Supplier_ has started the production (or conversion) process for the order line, meaning that it can't be changed anymore (`"changeable": false`). Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `778fe5cb-f7ac-4493-b492-25fe98df67c4`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
  "orderNumber": "1002",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "6a0d16db-546f-4c19-b288-ddd2a250f064",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is still `Confirmed`, but cannot be changed anymore (`"changeable": false`).

#### Step 4 of Scenario B

The step 4 of the scenario B will simulate the situation in which the _Supplier_ has partially completed the production (or conversion) process for one reel of the the order line. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `778fe5cb-f7ac-4493-b492-25fe98df67c4`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
  "orderNumber": "1002",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "6a0d16db-546f-4c19-b288-ddd2a250f064",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 3300,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 1,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is still on the status `Confirmed`, while quantities have been updated, using the context `Produced`.

#### Step 5 of Scenario B

The step 5 of the scenario B will simulate the situation in which the _Supplier_ has continued to partially completed the production (or conversion) process for a second reel of the the order line. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `778fe5cb-f7ac-4493-b492-25fe98df67c4`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
  "orderNumber": "1002",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "6a0d16db-546f-4c19-b288-ddd2a250f064",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 6600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is still on the status `Confirmed`, while quantities have been updated, using the context `Produced`.

#### Step 6 of Scenario B

The step 6 of the scenario A will simulate the situation in which the _Supplier_ has finally completed the production (or conversion) process for the order line. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `778fe5cb-f7ac-4493-b492-25fe98df67c4`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
  "orderNumber": "1002",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "6a0d16db-546f-4c19-b288-ddd2a250f064",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "ProductionCompleted",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line has now reached the status `ProductionCompleted`. The quantities have been updated accordingly, using the context `Produced`.

#### Step 7 of Scenario B

The step 7 of the scenario A will simulate the situation in which the _Supplier_ has completed the shipment for the order line. It means that the products have left the _Supplier_ location. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `778fe5cb-f7ac-4493-b492-25fe98df67c4`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
  "orderNumber": "1002",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "6a0d16db-546f-4c19-b288-ddd2a250f064",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "ShipmentCompleted",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line has now reached the status `ShipmentCompleted`. The quantities have been updated accordingly, using the context `Shipped`.

#### Step 8 of Scenario B

The step 8 of the scenario A will simulate the situation in which the _Supplier_ has sent an invoice referring to the order line. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `778fe5cb-f7ac-4493-b492-25fe98df67c4`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
  "orderNumber": "1002",
  "orderStatus": "Completed",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "6a0d16db-546f-4c19-b288-ddd2a250f064",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Completed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 10000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Invoiced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line, as well as the order `1002`, has now reached the status `Completed`. The quantities have been updated accordingly, using the context `Invoiced`. Notice that only the quantity of type `Count` is not relevant in the context `Invoiced`.

### Scenario C - One Production and Multiple Shipments

The _Order Issuer_ sends an API request to the _Supplier_ in order to get the list of all its _Active orders_:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders?orderStatus=Active \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders?orderStatus=Active \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "numberOfOrders": 6,
  "orders": [
    {
      "id": "c51d8903-01d1-485c-96ce-51a9be192207",
      "orderNumber": "1001",
      "orderStatus": "Active",
      "numberOfLineItems": 1,
      "link": "/orders/c51d8903-01d1-485c-96ce-51a9be192207"
    },
    {
      "id": "778fe5cb-f7ac-4493-b492-25fe98df67c4",
      "orderNumber": "1002",
      "orderStatus": "Active",
      "numberOfLineItems": 1,
      "link": "/orders/778fe5cb-f7ac-4493-b492-25fe98df67c4"
    }
  ],
  "links": {
    "self": {
      "href": "/orders?orderStatus=Active&offset=0&limit=2"
    },
    "next": {
      "href": "/orders?orderStatus=Active&offset=2&limit=2"
    }
  }
}
```

We have prepared the scenario A on the order `1003`, so we need to get the "next page" in order to find the UUID of the order. We can directly use the path provided within `links.next.href` property.

```text
$ curl --request GET \
  --URL 'https://papinet.papinet.io/orders?orderStatus=Active&offset=2&limit=2' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders?orderStatus=Active&offset=2&limit=2 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "numberOfOrders": 6,
  "orders": [
    {
      "id": "c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
      "orderNumber": "1003",
      "orderStatus": "Active",
      "numberOfLineItems": 1,
      "link": "/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e"
    },
    {
      "id": "fb441640-e40b-4d91-8930-61ebf981da63",
      "orderNumber": "1004",
      "orderStatus": "Active",
      "numberOfLineItems": 1,
      "link": "/orders/fb441640-e40b-4d91-8930-61ebf981da63"
    }
  ],
  "links": {
    "self": {
      "href": "/orders?orderStatus=Active&offset=2&limit=2"
    },
    "next": {
      "href": "/orders?orderStatus=Active&offset=4&limit=2"
    }
  }
}
```

#### Step 1 of Scenario C

The step 1 of the scenario C will simulate the situation in which the (unique) line is `Pending` and can still be changed (`"changeable": true`). Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `c898aa54-8ebb-40ab-a0b9-3d979e082a9e`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
  "orderNumber": "1003",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "29868f71-46a0-4757-981e-1ad26a4cb3c1",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Pending",
      "changeable": true,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 35,
          "quantityUOM": "MetricTon"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the order `1003` has been well received by the _Supplier_ and is _Active_. Its first (and unique) line is still `Pending` and can still be changed (`"changeable": true`).

#### Step 2 of Scenario C

The step 2 of the scenario C will simulate the situation in which the _Supplier_ has processed the order and confirmed the ordered quantities. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `c898aa54-8ebb-40ab-a0b9-3d979e082a9e`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
  "orderNumber": "1003",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "29868f71-46a0-4757-981e-1ad26a4cb3c1",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": true,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 35,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is now `Confirmed`, but can still be changed (`"changeable": true`), as the quantities have been _Confirmed_.

#### Step 3 of Scenario C

The step 3 of the scenario C will simulate the situation in which the _Supplier_ has started the production (or conversion) process for the order line, meaning that it can't be changed anymore (`"changeable": false`). Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `c898aa54-8ebb-40ab-a0b9-3d979e082a9e`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
  "orderNumber": "1003",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "29868f71-46a0-4757-981e-1ad26a4cb3c1",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 35,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is still `Confirmed`, but cannot be changed anymore (`"changeable": false`).

#### Step 4 of Scenario C

The step 4 of the scenario C will simulate the situation in which the _Supplier_ has completed the production (or conversion) process for the order line. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `c898aa54-8ebb-40ab-a0b9-3d979e082a9e`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
  "orderNumber": "1003",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "29868f71-46a0-4757-981e-1ad26a4cb3c1",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "ProductionCompleted",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 35,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line has now reached the status `ProductionCompleted`. The quantities have been updated accordingly, using the context `Produced`.

#### Step 5 of Scenario C

The step 5 of the scenario C will simulate the situation in which the _Supplier_ has partially completed the shipment for the order line. It means that a part of the products have left the _Supplier_ location. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `c898aa54-8ebb-40ab-a0b9-3d979e082a9e`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
  "orderNumber": "1003",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "29868f71-46a0-4757-981e-1ad26a4cb3c1",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "ProductionCompleted",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 35,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 24000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 24,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is still on the status `ProductionCompleted`, while quantities have been updated, using the context `Shipped`.

#### Step 6 of Scenario C

The step 6 of the scenario C will simulate the situation in which the _Supplier_ has completed the shipment for the order line. It means that all the products have left the _Supplier_ location. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `c898aa54-8ebb-40ab-a0b9-3d979e082a9e`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
  "orderNumber": "1003",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "29868f71-46a0-4757-981e-1ad26a4cb3c1",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "ShipmentCompleted",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 35,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line has now reached the status `ShipmentCompleted`. The quantities have been updated accordingly, using the context `Shipped`.

#### Step 7 of Scenario C

The step 7 of the scenario C will simulate the situation in which the _Supplier_ has sent an invoice referring to the order line. Then, the _Order Issuer_ sends an API request to the _Supplier_ in order to get the details of the second order `c898aa54-8ebb-40ab-a0b9-3d979e082a9e`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/c898aa54-8ebb-40ab-a0b9-3d979e082a9e \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "c898aa54-8ebb-40ab-a0b9-3d979e082a9e",
  "orderNumber": "1003",
  "orderStatus": "Completed",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "29868f71-46a0-4757-981e-1ad26a4cb3c1",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Completed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 35,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 35,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Invoiced",
          "quantityType": "GrossWeight",
          "quantityValue": 35000,
          "quantityUOM": "Kilogram"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line, as well as the order `1003`, has now reached the status `Completed`. The quantities have been updated accordingly, using the context `Invoiced`. Notice that only the quantity of type `Count` is not relevant in the context `Invoiced`.

### Scenario D - Multiple Productions and Multiple Shipments

#### Step 1 of Scenario D

The step 1 of the scenario D will simulate the situation in which the (unique) line is `Pending` and can still be changed (`"changeable": true`). Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `fb441640-e40b-4d91-8930-61ebf981da63`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "fb441640-e40b-4d91-8930-61ebf981da63",
  "orderNumber": "1004",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1c9192cb-10d4-4e2e-a3d0-bcb4d67eb605",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Pending",
      "changeable": true,
      "quantities": [
        {
          "quantityType": "GrossWeight",
          "quantityContext": "Ordered",
          "quantityValue": 70,
          "quantityUOM": "MetricTon"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the order `1004` has been well received by the _Supplier_ and is _Active_. Its first (and unique) line is still `Pending` and can still be changed (`"changeable": true`).

#### Step 2 of Scenario D

The step 2 of the scenario D will simulate the situation in which the _Supplier_ has processed the order and confirmed the ordered quantities. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `fb441640-e40b-4d91-8930-61ebf981da63`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "fb441640-e40b-4d91-8930-61ebf981da63",
  "orderNumber": "1004",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1c9192cb-10d4-4e2e-a3d0-bcb4d67eb605",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": true,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 70,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is now `Confirmed`, but can still be changed (`"changeable": true`), as the quantities have been _Confirmed_.

#### Step 3 of Scenario D

The step 3 of the scenario D will simulate the situation in which the _Supplier_ has started the production (or conversion) process for the order line, meaning that it can't be changed anymore (`"changeable": false`). Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `fb441640-e40b-4d91-8930-61ebf981da63`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "fb441640-e40b-4d91-8930-61ebf981da63",
  "orderNumber": "1004",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1c9192cb-10d4-4e2e-a3d0-bcb4d67eb605",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 70,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is still `Confirmed`, but cannot be changed anymore (`"changeable": false`).

#### Step 4 of Scenario D

The step 4 of the scenario D will simulate the situation in which the _Supplier_ has partially completed the production (or conversion) process for some reels of the the order line. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `fb441640-e40b-4d91-8930-61ebf981da63`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "fb441640-e40b-4d91-8930-61ebf981da63",
  "orderNumber": "1004",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1c9192cb-10d4-4e2e-a3d0-bcb4d67eb605",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 70,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 20000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 20,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is still on the status `Confirmed`, while quantities have been updated, using the context `Produced`.

#### Step 5 of Scenario D

The step 5 of the scenario D will simulate the situation in which the _Supplier_ has partially completed the shipment for the order line, while partially completed the production (or conversion) process for some reels of the the order line. It means that a part of the products have left the _Supplier_ location. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `fb441640-e40b-4d91-8930-61ebf981da63`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "fb441640-e40b-4d91-8930-61ebf981da63",
  "orderNumber": "1004",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1c9192cb-10d4-4e2e-a3d0-bcb4d67eb605",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 70,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 40000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 40,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 20000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 20,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is still on the status `Confirmed`, while quantities have been updated, using the contexts `Produced`and `Shipped`.

#### Step 6 of Scenario D

The step 6 of the scenario D will simulate the situation in which the _Supplier_ has completed the production (or conversion) process for the order line, while partially completed the shipment for the order line. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `fb441640-e40b-4d91-8930-61ebf981da63`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "fb441640-e40b-4d91-8930-61ebf981da63",
  "orderNumber": "1004",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1c9192cb-10d4-4e2e-a3d0-bcb4d67eb605",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "ProductionCompleted",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 70,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 40000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 40,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line has now reached the status `ProductionCompleted`, while quantities have been updated, using the contexts `Produced`and `Shipped`.

#### Step 7 of Scenario D

The step 7 of the scenario D will simulate the situation in which the _Supplier_ has completed the production (or conversion) process for the order line, while still partially completed the shipment for the order line. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `fb441640-e40b-4d91-8930-61ebf981da63`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "fb441640-e40b-4d91-8930-61ebf981da63",
  "orderNumber": "1004",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1c9192cb-10d4-4e2e-a3d0-bcb4d67eb605",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "ProductionCompleted",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 70,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 60000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 60,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is still on the status `ProductionCompleted`, while quantities have been updated, using the context `Shipped`.

#### Step 8 of Scenario D

The step 8 of the scenario D will simulate the situation in which the _Supplier_ has completed the shipment for the order line. It means that all the products have left the _Supplier_ location. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `fb441640-e40b-4d91-8930-61ebf981da63`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "fb441640-e40b-4d91-8930-61ebf981da63",
  "orderNumber": "1004",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1c9192cb-10d4-4e2e-a3d0-bcb4d67eb605",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "ShipmentCompleted",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 70,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line has now reached the status `ShipmentCompleted`. The quantities have been updated accordingly, using the context `Shipped`.

#### Step 9 of Scenario D

The step 9 of the scenario D will simulate the situation in which the _Supplier_ has sent an invoice referring to the order line. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `fb441640-e40b-4d91-8930-61ebf981da63`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/fb441640-e40b-4d91-8930-61ebf981da63 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "fb441640-e40b-4d91-8930-61ebf981da63",
  "orderNumber": "1004",
  "orderStatus": "Completed",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1c9192cb-10d4-4e2e-a3d0-bcb4d67eb605",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Completed",
      "changeable": false,
      "quantities": [
        {
          "quantityContext": "Ordered",
          "quantityType": "GrossWeight",
          "quantityValue": 70,
          "quantityUOM": "MetricTon"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 70,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Invoiced",
          "quantityType": "GrossWeight",
          "quantityValue": 70000,
          "quantityUOM": "Kilogram"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line, as well as the order `1004`, has now reached the status `Completed`. The quantities have been updated accordingly, using the context `Invoiced`. Notice that only the quantity of type `Count` is not relevant in the context `Invoiced`.

### Scenario E - Under Shipment

#### Step 1 of Scenario E

The step 1 of the scenario E will simulate the situation in which the (unique) line is `Pending` and can still be changed (`"changeable": true`). Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `12e8667f-14ed-49e6-9610-dc58dee95560`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "12e8667f-14ed-49e6-9610-dc58dee95560",
  "orderNumber": "1005",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1deca55f-2d03-4c18-93d0-c60362b891a5",
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

It shows that the order `1005` has been well received by the _Supplier_ and is _Active_. Its first (and unique) line is still `Pending` and can still be changed (`"changeable": true`).

#### Step 2 of Scenario E

The step 2 of the scenario E will simulate the situation in which the _Supplier_ has processed the order and confirmed the ordered quantities. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `12e8667f-14ed-49e6-9610-dc58dee95560`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "12e8667f-14ed-49e6-9610-dc58dee95560",
  "orderNumber": "1005",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1deca55f-2d03-4c18-93d0-c60362b891a5",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": true,
      "quantities": [
        {
        "quantityContext": "Ordered",
        "quantityType": "GrossWeight",
        "quantityValue": 10000,
        "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is now `Confirmed`, but can still be changed (`"changeable": true`), as the quantities have been _Confirmed_.

#### Step 3 of Scenario E

The step 3 of the scenario E will simulate the situation in which the _Supplier_ has started the production (or conversion) process for the order line, meaning that it can't be changed anymore (`"changeable": false`). Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `12e8667f-14ed-49e6-9610-dc58dee95560`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "12e8667f-14ed-49e6-9610-dc58dee95560",
  "orderNumber": "1005",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1deca55f-2d03-4c18-93d0-c60362b891a5",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Confirmed",
      "changeable": false,
      "quantities": [
        {
        "quantityContext": "Ordered",
        "quantityType": "GrossWeight",
        "quantityValue": 10000,
        "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line is still `Confirmed`, but cannot be changed anymore (`"changeable": false`).

#### Step 4 of Scenario E

The step 4 of the scenario E will simulate the situation in which the _Supplier_ has completed the production (or conversion) process for the order line. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `12e8667f-14ed-49e6-9610-dc58dee95560`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "12e8667f-14ed-49e6-9610-dc58dee95560",
  "orderNumber": "1005",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1deca55f-2d03-4c18-93d0-c60362b891a5",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "ProductionCompleted",
      "changeable": false,
      "quantities": [
        {
        "quantityContext": "Ordered",
        "quantityType": "GrossWeight",
        "quantityValue": 10000,
        "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line has now reached the status `ProductionCompleted`. The quantities have been updated accordingly, using the context `Produced`.

#### Step 5 of Scenario E

The step 5 of the scenario E will simulate the situation in which the _Supplier_ has completed the shipment for the order line. It means that all the products have left the _Supplier_ location. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `12e8667f-14ed-49e6-9610-dc58dee95560`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "12e8667f-14ed-49e6-9610-dc58dee95560",
  "orderNumber": "1005",
  "orderStatus": "Active",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1deca55f-2d03-4c18-93d0-c60362b891a5",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "ShipmentCompleted",
      "changeable": false,
      "quantities": [
        {
        "quantityContext": "Ordered",
        "quantityType": "GrossWeight",
        "quantityValue": 10000,
        "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 6600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line has now reached the status `ShipmentCompleted`, despite the fact that `Shipped` quantities are less than the `Produced` quantities.

#### Step 6 of Scenario E

The step 6 of the scenario E will simulate the situation in which the _Supplier_ has sent an invoice referring to the order line. Then, the _Order Issuer_ sends another similar API request to the _Supplier_ in order to get the details of the first order `12e8667f-14ed-49e6-9610-dc58dee95560`:

```text
$ curl --request GET \
  --URL https://api.papinet.io/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request GET \
  --URL http://localhost:3001/orders/12e8667f-14ed-49e6-9610-dc58dee95560 \
  --header 'X-papiNet-Domain: papinet.papinet.io' \
  --header 'Authorization: Bearer ef1bee66-8607-4f32-854c-76ff44763ab7'

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "id": "12e8667f-14ed-49e6-9610-dc58dee95560",
  "orderNumber": "1005",
  "orderStatus": "Completed",
  "numberOfLineItems": 1,
  "orderLineItems": [
    {
      "id": "1deca55f-2d03-4c18-93d0-c60362b891a5",
      "orderLineItemNumber": "1",
      "orderLineItemStatus": "Completed",
      "changeable": false,
      "quantities": [
        {
        "quantityContext": "Ordered",
        "quantityType": "GrossWeight",
        "quantityValue": 10000,
        "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "GrossWeight",
          "quantityValue": 9600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Confirmed",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "GrossWeight",
          "quantityValue": 9900,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Produced",
          "quantityType": "Count",
          "quantityValue": 3,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "GrossWeight",
          "quantityValue": 6600,
          "quantityUOM": "Kilogram"
        },
        {
          "quantityContext": "Shipped",
          "quantityType": "Count",
          "quantityValue": 2,
          "quantityUOM": "Reel"
        },
        {
          "quantityContext": "Invoiced",
          "quantityType": "GrossWeight",
          "quantityValue": 6600,
          "quantityUOM": "Kilogram"
        }
      ]
    }
  ],
  "links": {}
}
```

It shows that the first (and unique) line, as well as the order `1005`, has now reached the status `Completed`. The quantities have been updated accordingly, using the context `Invoiced`. Notice that only the quantity of type `Count` is not relevant in the context `Invoiced`.

