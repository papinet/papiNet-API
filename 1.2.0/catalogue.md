# Catalogue Use Case

## Context

This use case is designed for Paper business.

> Recovered paper is not included within our definition of Paper business.

### Preconditions

None.

### Definitions

The distinction we make between the concepts _product_ and _article_ is essential to the understanding of the 8 new API endpoints we introduced for this new catalogue use case.

A **_product_** is owned and defined by the _seller_. It has several properties such as the `basisWeight`, the `width`, a certain percentage of `recycled` material, and so on. Usually, some of these properties may have multiple possible values, for instance you could choose the `basisWeight` of your paper from a list of values: 35 g/m², 39 g/m², 42 g/m², ...

An **_article_** is owned and defined by the _customer_. Usually, a customer defines an _article_ in order to fix on one value the properties that have multiple possible values. However, this step is not mandatory for ordering as you could give the final specifications directly within the order.

In order to show that important distintion within the API itself, we will always use the word _product_ together with _seller_ creating the hyphenated word **_seller-product_**, and the word _article_ will always be used with _customer_ creating **_customer-article_**.

These hyphenated words _seller-product_ and _customer-article_ do sound like a pleonasm, however we found them a convenient way to remind the definition/disctinction between _product_ and _article_ within the API endpoints themselves.

### Process

An authenticated or anonymous _customer_ requests to a _seller_ the list of its _seller-products_.

The authenticated or anonymous _customer_ requests to a _seller_ the details of a specific _seller-product_.

The authenticated _customer_ creates an _customer-article_ based on a specific _seller-product_.

The authenticated _customer_ requests to the _seller_ the list of _customer-articles_ it has created.

## Domain Name

We suggest that the _seller_ exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`.
For instance, if the _seller_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

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

This step is not necessary if the _seller_ supports anonymous requests.

## Scenarios

* Scenario A - An anonymous _customer_ gets the list of all _seller-products_ on offer, and gets the details of a selected _seller-product_.

* Scenario B - An authenticated _customer_ gets the list of all _seller-products_ on offer, gets the details of a specific _seller-product_, creates an _customer-article_ based on this specific _seller-product_ and gets the list of all _customer-articles_ it has created.

### Scenario A

An anonymous _customer_ gets the list of all _seller-products_ on offer, and gets the details of a selected _seller-product_.

#### Step 1 of Scenario A

The anonymous _customer_ sends an API request to the _seller_ in order to get the list of all _seller-products_ on offer:

```text
$ curl --request GET \
  --URL http://localhost:3003/seller-products
```

If all goes well, the anonymous _customer_ will receive a response like this:

```json
{
  "numberOfSellerProducts": 30,
  "sellerProducts": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "status": "Active",
      "name": "Galerie Brite",
      "link": "/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "productType": "Paper"
    },
    {
      "id": "c9e893c8-42ce-4321-97de-86b7f604647b",
      "status": "Active",
      "name": "Galerie Brite Bulk",
      "link": "/seller-products/c9e893c8-42ce-4321-97de-86b7f604647b",
      "productType": "Paper"
    },
    {
      "id": "1ae825c7-b872-4e68-b2e3-af021e7ba2bd",
      "status": "Active",
      "name": "Galerie Brite Plus",
      "link": "/seller-products/1ae825c7-b872-4e68-b2e3-af021e7ba2bd",
      "productType": "Paper"
    },
    {
      "id": "0d8b0183-49bb-4f49-86e1-2a8096aa5ca3",
      "status": "Active",
      "name": "Galerie Brite Silk",
      "link": "/seller-products/0d8b0183-49bb-4f49-86e1-2a8096aa5ca3",
      "productType": "Paper"
    },
    {
      "id": "752513da-0eb2-4094-8ed4-08b53f854965",
      "status": "Active",
      "name": "Galerie Fine",
      "link": "/seller-products/752513da-0eb2-4094-8ed4-08b53f854965",
      "productType": "Paper"
    }
  ],
  "links": {
    "self": {
      "href": "/seller-products?offset=0&limit=5"
    },
    "next": {
      "href": "/seller-products?offset=5&limit=5"
    }
  }
}
```

> You can see that the _seller_ has **30** _seller-products_ offered to the anonymous _customer_. The response only contains a few properties per _seller-product_, to get the details of a specific _seller-product_, you can use the `link` property that contains a prepared URL path giving direct access to the full _seller-product_ details. You can also notice that the response only gives 5 _seller-products_ out of the 30. This is because of the pagination mechanism.

#### Step 2 of Scenario A

Then, the anonymous _customer_ sends an API request to the _seller_ in order to get the details of the first _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

```text
$ curl --request GET \
  --URL http://localhost:3003/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6
```

If all goes well, the anonymous _Party_ will receive a response like this:

```json
{
  "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
  "status": "Active",
  "name": "Galerie Brite",
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
        "UOM": "GramsPerSquareMeter"
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

An authenticated _customer_ gets the list of all _seller-products_ on offer to that _customer_, and gets the details of a selected _seller-product_.

#### Step 1 of Scenario B

The authenticated _Party_ sends an API request to the _seller_ in order to get the list of all _products_ on offer:

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

> You can see that the _seller_ has **42** _products_ available to be ordered by the _Party_. The response only contains the `id` information, to get the details of a _product_, you can see the `link` properties that contains a prepared API endpoint giving direct access to the full _product_ details. You can also notice that the response only gives 6 _products_ out of the 42. This is because of the pagination mechanism.

#### Step 2 of Scenario B

Then, the _Party_ sends an API request to the _seller_ in order to get the details of the first _product_ `30eb793d-9dcb-41b7-b0ec-21a658e9bb77`:

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
      "assignedBy": "seller",
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
      "href": "/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
