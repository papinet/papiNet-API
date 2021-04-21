# Catalogue Use Case

## Context

An _Order Issuer_ requests to a _Supplier_ the list of _products_ she/he can order. The _products_ can be part of a _catalogue_; in that case the _Order Issuer_ SHOULD first select a _catalogue_.
This use case is designed for Pulp and Paper business.

## Base URL

We suggest that the _Supplier_ exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _Supplier_ is the company **ACME** using `acme.com` for its corporate web site, they should then expose the papiNet API endpoints on the domain `papinet.acme.com`.

The _**papiNet Mock Service**_ is exposing the papiNet API endpoints on the domain `papinet.papinet.io`.

## Authentication

We recommend secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _Order Issuer_ sends an API request to create a session, and gets its associated _access token_:

```text
$ curl --request POST \
  --URL https://papinet.papinet.io/tokens \
  --header 'Content-Type: application/json' \
  --data '{
    "partnerId": "public:36297346-e4d0-4214-b298-dd129c6ed82b",
    "partnerSecret": "private:ce2d3cf4-68f9-4202-acbf-8a73c3801195"
  }'
```

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{ 
  "accessToken": "0b732cd6-210b-4ae7-9e95-04938c7e862e",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

## Scenarios

* Scenario A - List of all available _products_
* Scenario B - List of all available _catalogues_
* Scenario C - List of all available _products_ within a specific _catalogue_
* Scenario D - Get the details of a specific _product_

### Scenario A - List of all available _products_

The _Order Issuer_ sends an API request to the _Supplier_ in order to get the list of all available _products_ she/he can order:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/products \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer 0b732cd6-210b-4ae7-9e95-04938c7e862e'
```

If all goes well, the _Order Issuer_ will receive a response like this:

```json
{
  "numberOfProducts": 42,
  "products": [
    {
      "id": "30eb793d-9dcb-41b7-b0ec-21a658e9bb77",
      "link": "/products/30eb793d-9dcb-41b7-b0ec-21a658e9bb77"
    },
    {
      "id": "960f18cc-8fd1-4c4b-8590-155d1c8fda4c",
      "link": "/products/960f18cc-8fd1-4c4b-8590-155d1c8fda4c"
    },
    {
      "id": "29ad4a9a-1035-4ff6-a12b-c610e3675a9c",
      "link": "/products/29ad4a9a-1035-4ff6-a12b-c610e3675a9c"
    },
    {
      "id": "ffb7e6c4-c9d2-4a7e-875b-00b5bbb332e3",
      "link": "/products/ffb7e6c4-c9d2-4a7e-875b-00b5bbb332e3"
    },
    {
      "id": "9099045a-1f9f-4c95-967a-afd46a270ab6",
      "link": "/products/9099045a-1f9f-4c95-967a-afd46a270ab6"
    },
    {
      "id": "d27f1810-0344-4c6f-b3f4-fcbf50f714ad",
      "link": "/products/d27f1810-0344-4c6f-b3f4-fcbf50f714ad"
    }
  ],
  "links": {
    "self": {
      "href": "/orders?orderStatus=Active&offset=0&limit=6"
    },
    "next": {
      "href": "/orders?orderStatus=Active&offset=6&limit=6"
    }
  }
}
```

> You can see that the _Supplier_ has **4** _products_ available to be ordered by the _Order Issuer_. The response only contains the `id` information, to get the details of a _product_, you can see the `link` properties that contains a prepared API endpoint giving direct access to the full _product_ details. You can also notice that the response only gives 6 _products_ out of the 42. This is because of the pagination mechanism.

### Scenario B - List of all available _catalogues_

