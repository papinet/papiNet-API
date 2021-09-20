# Catalogue Use Case

## Context

This use case is designed for Paper business.

> Recovered paper is not included with our definition of the Paper business.

### Preconditions

None.

### Process

An authenticated or anonymous _customer_ requests to a _supplier_ the list of its _products_.

The authenticated or anonymous _customer_ requests to a _supplier_ the details of a specific _product_.

The authenticated _customer_ creates an _article_ based on a specific _product_.

The authenticated _customer_ requests to the _supplier_ the list of _articles_ it has created.

## Domain Name

We suggest that the _supplier_ exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`.
For instance, if the _supplier_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

The _**papiNet Mock Service**_ is exposing the papiNet API endpoints on the domain `papinet.papinet.io`.

## Authentication

For authenticated _customer_, we recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _customer_ sends an API request to create a session, and gets its associated _access token_:

```text
$ curl --request POST \
  --URL https://papinet.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "accessToken": "1a27ae3f-02f3-4355-8a70-9ed547d0ccf8",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

This step is not necessary if the _supplier_ supports anonymous requests.

## Scenarios

* Scenario A - An anonymous _customer_ gets the list of all _products_ on offer, and gets the details of a selected _product_.

* Scenario B - An authenticated _customer_ gets the list of all _products_ on offer, gets the details of a specific _product_, creates an _article_ based on this specific _product_ and gets the list of all _articles_ it has created.

### Scenario A

An anonymous _customer_ gets the list of all _products_ on offer, and gets the details of a selected _product_.

#### Step 1 of Scenario A

The anonymous _customer_ sends an API request to the _supplier_ in order to get the list of all _products_ on offer:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/products \
```

If all goes well, the anonymous _Party_ will receive a response like this:

```json
{
  "numberOfProducts": 17,
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
      "href": "/products?offset=0&limit=6"
    },
    "next": {
      "href": "/products?offset=6&limit=6"
    }
  }
}
```

> You can see that the _Supplier_ has **17** _products_ offered to the anonymous _Party_. The response only contains the `id` information, to get the details of a _product_, you can see the `link` properties that contains a prepared API endpoint giving direct access to the full _product_ details. You can also notice that the response only gives 6 _products_ out of the 17. This is because of the pagination mechanism.

#### Step 2 of Scenario A

Then, the anonymous _Party_ sends an API request to the _Supplier_ in order to get the details of the first _product_ `30eb793d-9dcb-41b7-b0ec-21a658e9bb77`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/products/30eb793d-9dcb-41b7-b0ec-21a658e9bb77
```

If all goes well, the anonymous _Party_ will receive a response like this:

```json

```

### Scenario B

An authenticated _Party_ gets the list of all _products_ on offer to that _Party_, and gets the details of a selected _product_.

#### Step 1 of Scenario B

The authenticated _Party_ sends an API request to the _Supplier_ in order to get the list of all _products_ on offer:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/products \
  --header 'Authorization: Bearer 0b732cd6-210b-4ae7-9e95-04938c7e862e'
```

If all goes well, the authenticated _Party_ will receive a response like this:

```json
{
  "numberOfProducts": 42,
  "products": [
    {
      "id": "30eb793d-9dcb-41b7-b0ec-21a658e9bb77",
      "brandName": "GalerieArt Plus Silk",
      "link": "/products/30eb793d-9dcb-41b7-b0ec-21a658e9bb77"
    },
    {
      "id": "960f18cc-8fd1-4c4b-8590-155d1c8fda4c",
      "brandName": "Magno Gloss",
      "link": "/products/960f18cc-8fd1-4c4b-8590-155d1c8fda4c"
    },
    {
      "id": "29ad4a9a-1035-4ff6-a12b-c610e3675a9c",
      "brandName": "...",
      "link": "/products/29ad4a9a-1035-4ff6-a12b-c610e3675a9c"
    },
    {
      "id": "ffb7e6c4-c9d2-4a7e-875b-00b5bbb332e3",
      "brandName": "...",
      "link": "/products/ffb7e6c4-c9d2-4a7e-875b-00b5bbb332e3"
    },
    {
      "id": "9099045a-1f9f-4c95-967a-afd46a270ab6",
      "brandName": "...",
      "link": "/products/9099045a-1f9f-4c95-967a-afd46a270ab6"
    },
    {
      "id": "d27f1810-0344-4c6f-b3f4-fcbf50f714ad",
      "brandName": "...",
      "link": "/products/d27f1810-0344-4c6f-b3f4-fcbf50f714ad"
    }
  ],
  "links": {
    "self": {
      "href": "/products?offset=0&limit=6"
    },
    "next": {
      "href": "/products?offset=6&limit=6"
    }
  }
}
```

> You can see that the _Supplier_ has **42** _products_ available to be ordered by the _Party_. The response only contains the `id` information, to get the details of a _product_, you can see the `link` properties that contains a prepared API endpoint giving direct access to the full _product_ details. You can also notice that the response only gives 6 _products_ out of the 42. This is because of the pagination mechanism.

#### Step 2 of Scenario B

Then, the _Party_ sends an API request to the _Supplier_ in order to get the details of the first _product_ `30eb793d-9dcb-41b7-b0ec-21a658e9bb77`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/products/30eb793d-9dcb-41b7-b0ec-21a658e9bb77 \
  --header 'Authorization: Bearer 0b732cd6-210b-4ae7-9e95-04938c7e862e'
```

```json
{
  "id": "30eb793d-9dcb-41b7-b0ec-21a658e9bb77",
  "brandName": "GalerieArt Plus Silk",
  "identifiers": [
    {
      "assignedBy": "Supplier",
      "type": "PartNumber",
      "value": "GTFT-JUH-GTH"
    },
    {
      "assignedBy": "OrderIssuer",
      "type": "PartNumber",
      "value": "ABC001F"
    },
    {
      "assignedBy": "GS1",
      "type": "GTIN-13",
      "value": "9782221051689"
    }
  ],
  "descriptions": [
    {
      "language": "eng",
      "value": "A high white, high bulk silk paper increasing the perceived value of your communication."
    },
    {
      "language": "fra",
      "value": "Réalisez des gains grâce à une main et une opacité accrues pour de superbes résultats d’impression à la clé sur une surface satinée."
    }
  ],
  "url": "https://www.sappi.com/galerieart-plus-silk",
  "basisWeight": {
    "value": "90",
    "UnitOfMeasure": "GramsPerSquareMeter"
  }
}
```

### Scenario C

An authenticated _Party_ gets the list of all _catalogues_ on offer to that _Party_, gets the list of all _products_ within a selected _catalogue_, and gets the details of a selected _product_.

#### Step 1 of Scenario C

The _Party_ sends an API request to the _Supplier_ in order to get the list of all _catalogues_ offered:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/catalogues \
  --header 'Authorization: Bearer 0b732cd6-210b-4ae7-9e95-04938c7e862e'
```

If all goes well, the _Party_ will receive a response like this:

```json
{
  "numberOfCatalogues": 3,
  "catalogues": [
    {
      "id": "81cd426a-480a-4793-bc6b-991bcee6705d",
      "link": "/catalogues/81cd426a-480a-4793-bc6b-991bcee6705d/products"
    },
    {
      "id": "945473b7-df4f-4854-abdd-ae15d21f1ce9",
      "link": "/catalogues/945473b7-df4f-4854-abdd-ae15d21f1ce9/products"
    },
    {
      "id": "b101ec3c-7094-4789-bb9d-62d5fb259d0c",
      "link": "/catalogues/b101ec3c-7094-4789-bb9d-62d5fb259d0c/products"
    }
  ],
  "links": {
    "self": {
      "href": "/catalogues?offset=0&limit=3"
    }
  }
}
```

#### Step 2 of Scenario C

Then, the _Party_ sends an API request to the _Supplier_ in order to get the list of all _products_ offered within the first _catalogue_ `81cd426a-480a-4793-bc6b-991bcee6705d`:

```text
$ curl --request GET \
  --URL https://papinet.papinet.io/catalogues/81cd426a-480a-4793-bc6b-991bcee6705d/products \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer 0b732cd6-210b-4ae7-9e95-04938c7e862e'
```

If all goes well, the _Party_ will receive a response like this:

```json
{
  "numberOfProducts": 8,
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
      "href": "/products?offset=0&limit=6"
    },
    "next": {
      "href": "/products?offset=6&limit=2"
    }
  }
}
```

> You can see that the _Supplier_ has **8** _products_ available to be ordered by the _Party_. The response only contains the `id` information, to get the details of a _product_, you can see the `link` properties that contains a prepared API endpoint giving direct access to the full _product_ details. You can also notice that the response only gives 6 _products_ out of the 8. This is because of the pagination mechanism.