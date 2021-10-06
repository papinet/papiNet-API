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
  --URL http://papinet.papinet.io/tokens \
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

* Scenario A - An anonymous _customer_ gets the list of all _supplier-products_ on offer, and gets the details of a selected _supplier-product_.

* Scenario B - An authenticated _customer_ gets the list of all _supplier-products_ on offer, gets the details of a specific _supplier-product_, creates an _customer-article_ based on this specific _supplier-product_ and gets the list of all _customer-articles_ it has created.

### Scenario A

An anonymous _customer_ gets the list of all _products_ on offer, and gets the details of a selected _product_.

#### Step 1 of Scenario A

The anonymous _customer_ sends an API request to the _supplier_ in order to get the list of all _products_ on offer:

```text
$ curl --request GET \
  --URL http://localhost:3003/supplier-products
```

If all goes well, the anonymous _customer_ will receive a response like this:

```json
{
  "size": 30,
  "data": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "name": "Galerie Brite",
      "link": "/supplier-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6"
    },
    {
      "id": "c9e893c8-42ce-4321-97de-86b7f604647b",
      "name": "Galerie Brite Bulk",
      "link": "/supplier-products/c9e893c8-42ce-4321-97de-86b7f604647b"
    },
    {
      "id": "1ae825c7-b872-4e68-b2e3-af021e7ba2bd",
      "name": "Galerie Brite Plus",
      "link": "/supplier-products/1ae825c7-b872-4e68-b2e3-af021e7ba2bd"
    },
    {
      "id": "0d8b0183-49bb-4f49-86e1-2a8096aa5ca3",
      "name": "Galerie Brite Silk",
      "link": "/supplier-products/0d8b0183-49bb-4f49-86e1-2a8096aa5ca3"
    },
    {
      "id": "752513da-0eb2-4094-8ed4-08b53f854965",
      "name": "Galerie Fine",
      "link": "/supplier-products/752513da-0eb2-4094-8ed4-08b53f854965"
    }
  ],
  "links": {
    "self": {
      "href": "/supplier-products?offset=0&limit=5"
    },
    "next": {
      "href": "/supplier-products?offset=5&limit=5"
    }
  }
}
```

> You can see that the _supplier_ has **30** _products_ offered to the anonymous _customer_. The response only contains the `id` information, to get the details of a _product_, you can see the `link` properties that contains a prepared API endpoint giving direct access to the full _product_ details. You can also notice that the response only gives 5 _products_ out of the 30. This is because of the pagination mechanism.

#### Step 2 of Scenario A

Then, the anonymous _customer_ sends an API request to the _supplier_ in order to get the details of the first _product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

```text
$ curl --request GET \
  --URL http://localhost:3003/supplier-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6
```

If all goes well, the anonymous _Party_ will receive a response like this:

```json
{
  "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
  "name": "Galerie Brite",
  "link": "/supplier-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
  "descriptions": [
    {
      "language": "eng",
      "value": "When your high volume print job demands an ultra lightweight gloss paper with superior quality and runnability."
    },
    {
      "language": "fra",
      "value": "Quand vos travaux à longs tirages exigent un papier brillant dans des grammages légers avec une qualité d’impression et une roulabilité sans faille."
    }
  ],
  "paper": {
    "finishType": "Gloss",
    "printType": "HeatsetOffset",
    "basisWeights": [
      {
        "value": 54,
        "UOM": "GramsPerSquareMeter",
        "listPricePerUnit": {
          "amount": "1250",
          "currency": "EUR",
          "unit": {
            "value": 1,
            "UOM": "MetricTon"
          },
          "validity": {
            "from": "2021-09-15"
          }
        }
      },
      {
        "value": 57,
        "UOM": "GramsPerSquareMeter"
      },
      {
        "value": 60,
        "UOM": "GramsPerSquareMeter"
      },
      {
        "value": 65,
        "UOM": "GramsPerSquareMeter"
      },
      {
        "value": 70,
        "UOM": "GramsPerSquareMeter"
      },
      {
        "value": 80,
        "UOM": "GramsPerSquareMeter"
      },
      {
        "value": 90,
        "UOM": "GramsPerSquareMeter"
      }
    ],
    "reel": {
      "widthRange": {
        "min": {
          "value": 400,
          "UOM": "Millimeter"
        },
        "max": {
          "value": 2600,
          "UOM": "Millimeter"
        }
      },
      "diameters": [
        {
          "value": 1000,
          "UOM": "Millimeter"
        },
        {
          "value": 1250,
          "UOM": "Millimeter"
        }
      ],
      "coreDiameters": [
        {
          "value": 76,
          "UOM": "Millimeter"
        },
        {
          "value": 150,
          "UOM": "Millimeter"
        }
      ]
    }
  }
}
```

### Scenario B

An authenticated _customer_ gets the list of all _products_ on offer to that _customer_, and gets the details of a selected _product_.

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

...

```text
$ curl --request POST \
  --URL 'http://localhost:3003/customer-articles' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "name": "My Galerie Brite",
      "href": "/supplier-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "paper": {
          "basisWeight": {
              "value": "54",
              "UOM": "GramsPerSquareMeter"
          },
          "reel": {
              "width": {
                  "value": 1000,
                  "UOM": "Millimeter"
              },
              "diameter": {
                  "value": 1250,
                  "UOM": "Millimeter"
              },
              "coreDiameter": {
                  "value": 76,
                  "UOM": "Millimeter"
              }
          }
      }
  }'
```

```text
$ curl --request GET \
  --URL http://localhost:3003/customer-articles
```
