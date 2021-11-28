# Catalogue Use Case

## Context

This use case is designed for Paper business.

> Recovered paper is not included within our definition of Paper business.

### Preconditions

The _seller_ has created a catalogue being a list of _products_, and more precisely a list of _seller-products_ as defined below.

### Definitions

The distinction we make between the concepts _product_ and _article_ is essential to the understanding of the 8 new API endpoints we introduced for this new catalogue use case.

A **_product_** is owned and defined by the _seller_. It has several properties such as the `basisWeight`, the `width`, a certain percentage of `recycled` material, and so on. Usually, some of these properties may have multiple possible values, for instance you could choose the `basisWeight` of your paper from a list of values: 35 g/m², 39 g/m², 42 g/m², ...

An **_article_** is owned and defined by the _customer_. Usually, a customer defines an _article_ in order to fix on one value the properties that have multiple possible values. However, this step is not mandatory for ordering as you could give the final specifications directly within the order.

In order to show that important distinction within the API itself, we will always use the word _product_ together with _seller_ creating the hyphenated word **_seller-product_**, and the word _article_ will always be used with _customer_ creating **_customer-article_**.

These hyphenated words _seller-product_ and _customer-article_ do sound like a pleonasm, however we found them a convenient way to remind the definition/distinction between _product_ and _article_ within the API endpoints themselves.

### Process

An authenticated or anonymous _customer_ requests to a _seller_ the list of its _seller-products_.

The authenticated or anonymous _customer_ requests to a _seller_ the details of a specific _seller-product_.

The authenticated _customer_ creates a _customer-article_ based on a specific _seller-product_.

The authenticated _customer_ requests to the _seller_ the list of _customer-articles_ that have been created.

The authenticated _customer_ requests to the _seller_ the details of a specific _customer-article_ that have been created.

## Domain Name

We suggest that the _seller_ exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`.
For instance, if the _seller_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

The _**papiNet Mock Service**_ is exposing the papiNet API endpoints on the domain `papinet.papinet.io`.

## Authentication

For authenticated _customer_, we recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _customer_ sends an API request to create a session, and gets its associated _access token_:

```text
curl --request POST \
  --URL http://localhost:3003/tokens \
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

* Scenario A - An anonymous _customer_ gets the list of all _seller-products_ on offer; and gets the details of a selected _seller-product_.

* Scenario B - An authenticated _customer_ gets the list of all _seller-products_ on offer for that _customer_; gets the details of a specific _seller-product_; creates a _customer-article_ based on this specific _seller-product_; and gets the list of all _customer-articles_ that have been created.

* Scenario C - An authenticated _customer_ gets the list of all _seller-products_ on offer for that _customer_; gets the details of a specific _seller-product_, using the `sellerProductOtherIdentifier` to refer to it (and not its UUID); creates a _customer-article_ based on this specific _seller-product_, using the `sellerProductOtherIdentifier` to refer to it (and not its UUID); and gets the list of all _customer-articles_ that have been created.

### Scenario A

An anonymous _customer_ gets the list of all _seller-products_ on offer; and gets the details of a selected _seller-product_.

#### Step 1 of Scenario A

The anonymous _customer_ sends an API request to the _seller_ in order to get the list of all _seller-products_ on offer:

```text
curl --request GET \
  --URL http://localhost:3003/seller-products
```


If all goes well, the anonymous _customer_ will receive a response like this:

```json
{
  "numberOfSellerProducts": 30,
  "sellerProducts": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "otherIdentifier": {
        "value": "galerie-brite",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite",
      "link": "/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
      "productType": "Paper"
    },
    {
      "id": "c9e893c8-42ce-4321-97de-86b7f604647b",
      "otherIdentifier": {
        "value": "galerie-brite-bulk",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite Bulk",
      "link": "/seller-products/c9e893c8-42ce-4321-97de-86b7f604647b",
      "descriptions": [
        {
          "language": "eng",
          "value": "When you’re looking for serious distribution savings in a high-bulk, matt paper with a natural feel and outstanding standards of brightness and opacity."
        },
        {
          "language": "fra",
          "value": "Quand vous cherchez à réaliser de sérieuses économies sur les frais de distribution avec un papier mat offrant une blancheur et une opacité remarquables, le tout avec un toucher authentique."
        }
      ],
      "productType": "Paper"
    },
    {
      "id": "1ae825c7-b872-4e68-b2e3-af021e7ba2bd",
      "otherIdentifier": {
        "value": "galerie-brite-plus",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite Plus",
      "link": "/seller-products/1ae825c7-b872-4e68-b2e3-af021e7ba2bd",
      "descriptions": [
        {
          "language": "eng",
          "value": "When the job demands a quality high bulk paper boasting a gloss surface alongside enhanced printability."
        },
        {
          "language": "fra",
          "value": "Quand votre travail exige un papier de qualité avec une main élevée associée à une belle surface brillante, le tout avec des propriétés d’imprimabilité optimales."
        }
      ],
      "productType": "Paper"
    },
    {
      "id": "0d8b0183-49bb-4f49-86e1-2a8096aa5ca3",
      "otherIdentifier": {
        "value": "galerie-brite-silk",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite Silk",
      "link": "/seller-products/0d8b0183-49bb-4f49-86e1-2a8096aa5ca3",
      "descriptions": [
        {
          "language": "eng",
          "value": "When you’re looking for a high quality paper with a seriously smooth surface that boasts superb printability."
        },
        {
          "language": "fra",
          "value": "When you’re looking for a high quality paper with a seriously smooth surface that boasts superb printability."
        }
      ],
      "productType": "Paper"
    },
    {
      "id": "752513da-0eb2-4094-8ed4-08b53f854965",
      "otherIdentifier": {
        "value": "galerie-fine",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Fine",
      "link": "/seller-products/752513da-0eb2-4094-8ed4-08b53f854965",
      "descriptions": [
        {
          "language": "eng",
          "value": "Outstanding image reproduction and superb smoothness meets first-class on-press performance."
        },
        {
          "language": "fra",
          "value": "Outstanding image reproduction and superb smoothness meets first-class on-press performance."
        }
      ],
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
curl --request GET \
  --URL http://localhost:3003/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6
```


If all goes well, the anonymous _customer_ will receive a response like this:

```json
{
  "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
  "otherIdentifier": {
    "value": "galerie-brite",
    "assignedBy": "Seller"
  },
  "status": "Active",
  "name": "Galerie Brite",
  "link": "/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
    "bulks": [
      {
        "value": 0.92,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.89,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.89,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.88,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.86,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.84,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.82,
        "UOM": "CubicCentimeterPerGram"
      }
    ],
    "format": "Reel",
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
```

### Scenario B

An authenticated _customer_ gets the list of all _seller-products_ on offer for that _customer_; gets the details of a specific _seller-product_; creates a _customer-article_ based on this specific _seller-product_; and gets the list of all _customer-articles_ that have been created.

#### Step 1 of Scenario B - Authentication

The _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

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
  --URL http://localhost:3003/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "access_token": "fe325ec2-ec40-4225-80a9-5a8cec6b4f07",
  "token_type": "bearer", 
  "expires_in": 3600
}
```

In order to re-use the value of the `access_token` in subsequent API requests, it is convenient to save it into an environment variable:

```text
ACCESS_TOKEN=$(curl --request POST \
  --URL https://papinet.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

or, if you use locally the docker container of the papiNet mock server:

```text
ACCESS_TOKEN=$(curl --request POST \
  --URL http://localhost:3003/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

You can easily verify the value of the `ACCESS_TOKEN` environment variable using:

```text
$ echo $ACCESS_TOKEN
fe325ec2-ec40-4225-80a9-5a8cec6b4f07
```

#### Step 2 of Scenario B

The authenticated _customer_ sends an API request to the _seller_ in order to get the list of all _seller-products_ on offer:

```text
curl --request GET \
  --URL http://localhost:3003/seller-products \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```


If all goes well, the authenticated _Party_ will receive a response like this:

```json
{
  "numberOfSellerProducts": 30,
  "sellerProducts": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "otherIdentifier": {
        "value": "galerie-brite",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite",
      "link": "/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
      "productType": "Paper"
    },
    {
      "id": "c9e893c8-42ce-4321-97de-86b7f604647b",
      "otherIdentifier": {
        "value": "galerie-brite-bulk",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite Bulk",
      "link": "/seller-products/c9e893c8-42ce-4321-97de-86b7f604647b",
      "descriptions": [
        {
          "language": "eng",
          "value": "When you’re looking for serious distribution savings in a high-bulk, matt paper with a natural feel and outstanding standards of brightness and opacity."
        },
        {
          "language": "fra",
          "value": "Quand vous cherchez à réaliser de sérieuses économies sur les frais de distribution avec un papier mat offrant une blancheur et une opacité remarquables, le tout avec un toucher authentique."
        }
      ],
      "productType": "Paper"
    },
    {
      "id": "1ae825c7-b872-4e68-b2e3-af021e7ba2bd",
      "otherIdentifier": {
        "value": "galerie-brite-plus",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite Plus",
      "link": "/seller-products/1ae825c7-b872-4e68-b2e3-af021e7ba2bd",
      "descriptions": [
        {
          "language": "eng",
          "value": "When the job demands a quality high bulk paper boasting a gloss surface alongside enhanced printability."
        },
        {
          "language": "fra",
          "value": "Quand votre travail exige un papier de qualité avec une main élevée associée à une belle surface brillante, le tout avec des propriétés d’imprimabilité optimales."
        }
      ],
      "productType": "Paper"
    },
    {
      "id": "0d8b0183-49bb-4f49-86e1-2a8096aa5ca3",
      "otherIdentifier": {
        "value": "galerie-brite-silk",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite Silk",
      "link": "/seller-products/0d8b0183-49bb-4f49-86e1-2a8096aa5ca3",
      "descriptions": [
        {
          "language": "eng",
          "value": "When you’re looking for a high quality paper with a seriously smooth surface that boasts superb printability."
        },
        {
          "language": "fra",
          "value": "When you’re looking for a high quality paper with a seriously smooth surface that boasts superb printability."
        }
      ],
      "productType": "Paper"
    },
    {
      "id": "752513da-0eb2-4094-8ed4-08b53f854965",
      "otherIdentifier": {
        "value": "galerie-fine",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Fine",
      "link": "/seller-products/752513da-0eb2-4094-8ed4-08b53f854965",
      "descriptions": [
        {
          "language": "eng",
          "value": "Outstanding image reproduction and superb smoothness meets first-class on-press performance."
        },
        {
          "language": "fra",
          "value": "Outstanding image reproduction and superb smoothness meets first-class on-press performance."
        }
      ],
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

> You can see that the _seller_ has **30** _seller-products_ offered to the authenticated _customer_. The response only contains a few properties per _seller-product_, to get the details of a specific _seller-product_, you can use the `link` property that contains a prepared URL path giving direct access to the full _seller-product_ details. You can also notice that the response only gives 5 _seller-products_ out of the 30. This is because of the pagination mechanism.

#### Step 3 of Scenario B

Then, the _customer_ sends an API request to the _seller_ in order to get the details of the first _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

```text
curl --request GET \
  --URL http://localhost:3003/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```


If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
  "otherIdentifier": {
    "value": "galerie-brite",
    "assignedBy": "Seller"
  },
  "status": "Active",
  "name": "Galerie Brite",
  "link": "/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
    "bulks": [
      {
        "value": 0.92,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.89,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.89,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.88,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.86,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.84,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.82,
        "UOM": "CubicCentimeterPerGram"
      }
    ],
    "format": "Reel",
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
```

We can see that this _seller-product_ has

* a fixed `finishType` set to `Gloss`
* a fixed `printType` set to `HeatsetOffset`
* a `basisWeight` and a `bulk` that can take the following values:
  * `54 GramsPerSquareMeter` with `0.92 CubicCentimeterPerGram`
  * `57 GramsPerSquareMeter` with `0.89 CubicCentimeterPerGram`
  * `60 GramsPerSquareMeter` with `0.89 CubicCentimeterPerGram`
  * `65 GramsPerSquareMeter` with `0.88 CubicCentimeterPerGram`
  * `70 GramsPerSquareMeter` with `0.86 CubicCentimeterPerGram`
  * `80 GramsPerSquareMeter` with `0.84 CubicCentimeterPerGram`
  * `90 GramsPerSquareMeter` with `0.82 CubicCentimeterPerGram`
* a `width` that has a range from `400` to `2600 Millimeter`
* a `diameter` that can take the following values:
  * `1000 Millimeter`
  * `1250 Millimeter`
* a `coreDiameter` that can take the following values:
  * `76 Millimeter`
  * `150 Millimeter`

#### Step 4 of Scenario B

The _customer_ will now create a new _customer-article_ based on the first _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`. This _customer-article_ will fix the values of the `basisWeight`, `bulk`, `width`, `diameter` and `coreDiameter`. If the _customer_ is not absolutely sure that the _seller_ will not change the properties of this _seller-product_, then all the other important properties, such as `finishType` and `printType` MUST also be copied to the _customer-article_ definition.

```text
curl --request POST \
  --URL 'http://localhost:3003/customer-articles' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "otherIdentifier": { "value": "SAP12345", "assignedBy": "Customer" },
      "sellerProductId": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "status": "Active",
      "name": "My Galerie Brite 54",
      "paper": {
        "finishType": "Gloss",
        "printType": "HeatsetOffset",
        "basisWeight": {
          "value": "54",
          "UOM": "GramsPerSquareMeter"
        },
        "bulk": {
          "value": 0.92,
          "UOM": "CubicCentimeterPerGram"
        },
        "format": "Reel",
        "width": {
          "value": 900,
          "UOM": "Millimeter"
        },
        "diameter": {
            "value": 1000,
            "UOM": "Millimeter"
        },
        "coreDiameter": {
            "value": 76,
            "UOM": "Millimeter"
        }
      }
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971",
  "otherIdentifier": { "value": "SAP12345", "assignedBy": "Customer" },
  "sellerProductId": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
  "sellerProductOtherIdentifier": {
    "value": "galerie-brite",
    "assignedBy": "Seller"
  },
  "sellerProductStatus": "Active",
  "status": "Active",
  "name": "My Galerie Brite 54",
  "link": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971",
  "paper": {
    "finishType": "Gloss",
    "printType": "HeatsetOffset",
    "basisWeight": {
      "value": "54",
      "UOM": "GramsPerSquareMeter"
    },
    "bulk": {
      "value": 0.92,
      "UOM": "CubicCentimeterPerGram"
    },
    "format": "Reel",
    "width": {
      "value": 900,
      "UOM": "Millimeter"
    },
    "diameter": {
      "value": 1000,
      "UOM": "Millimeter"
    },
    "coreDiameter": {
      "value": 76,
      "UOM": "Millimeter"
    }
  }
}
```

#### Step 5 of Scenario B

At any time, the _customer_ can list all the _customer-articles_ that have been created:

```text
curl --request GET \
  --URL http://localhost:3003/customer-articles \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```


If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfCustomerArticles": 1,
  "customerArticles": [
    {
      "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971",
      "otherIdentifier": { "value": "SAP12345", "assignedBy": "Customer" },
      "sellerProductId": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "sellerProductOtherIdentifier": {
        "value": "galerie-brite",
        "assignedBy": "Seller"
      },
      "sellerProductStatus": "Active",
      "status": "Active",
      "name": "My Galerie Brite 54",
      "link": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971",
      "productType": "Paper"
    }
  ],
  "links": {
    "self": {
      "href": "/customer-articles?offset=0&limit=5"
    },
    "next": {
      "href": "/customer-articles?offset=5&limit=5"
    }
  }
}
```

#### Step 6 of Scenario B

At any time, the _customer_ can get the details of a specific _customer-articles_ that has been created:

```text
curl --request GET \
  --URL http://localhost:3003/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```


If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971",
  "otherIdentifier": { "value": "SAP12345", "assignedBy": "Customer" },
  "sellerProductId": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
  "sellerProductOtherIdentifier": {
    "value": "galerie-brite",
    "assignedBy": "Seller"
  },
  "sellerProductStatus": "Active",
  "status": "Active",
  "name": "My Galerie Brite 54",
  "link": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971",
  "paper": {
    "finishType": "Gloss",
    "printType": "HeatsetOffset",
    "basisWeight": {
      "value": "54",
      "UOM": "GramsPerSquareMeter"
    },
    "bulk": {
      "value": 0.92,
      "UOM": "CubicCentimeterPerGram"
    },
    "format": "Reel",
    "width": {
      "value": 900,
      "UOM": "Millimeter"
    },
    "diameter": {
      "value": 1000,
      "UOM": "Millimeter"
    },
    "coreDiameter": {
      "value": 76,
      "UOM": "Millimeter"
    }
  }
}
```

### Scenario C

An authenticated _customer_ gets the list of all _seller-products_ on offer for that _customer_; gets the details of a specific _seller-product_, using the `sellerProductOtherIdentifier` to refer to it (and not its UUID); creates a _customer-article_ based on this specific _seller-product_, using the `sellerProductOtherIdentifier` to refer to it (and not its UUID); and gets the list of all _customer-articles_ that have been created.

#### Step 1 of Scenario C - Authentication

The _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

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
  --URL http://localhost:3003/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "access_token": "fe325ec2-ec40-4225-80a9-5a8cec6b4f07",
  "token_type": "bearer", 
  "expires_in": 3600
}
```

In order to re-use the value of the `access_token` in subsequent API requests, it is convenient to save it into an environment variable:

```text
ACCESS_TOKEN=$(curl --request POST \
  --URL https://papinet.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

or, if you use locally the docker container of the papiNet mock server:

```text
ACCESS_TOKEN=$(curl --request POST \
  --URL http://localhost:3003/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

You can easily verify the value of the `ACCESS_TOKEN` environment variable using:

```text
$ echo $ACCESS_TOKEN
fe325ec2-ec40-4225-80a9-5a8cec6b4f07
```

#### Step 2 of Scenario C

The authenticated _customer_ sends an API request to the _seller_ in order to get the list of all _seller-products_ on offer:

```text
curl --request GET \
  --URL http://localhost:3003/seller-products \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```


If all goes well, the authenticated _Party_ will receive a response like this:

```json
{
  "numberOfSellerProducts": 30,
  "sellerProducts": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "otherIdentifier": {
        "value": "galerie-brite",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite",
      "link": "/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
      "productType": "Paper"
    },
    {
      "id": "c9e893c8-42ce-4321-97de-86b7f604647b",
      "otherIdentifier": {
        "value": "galerie-brite-bulk",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite Bulk",
      "link": "/seller-products/c9e893c8-42ce-4321-97de-86b7f604647b",
      "descriptions": [
        {
          "language": "eng",
          "value": "When you’re looking for serious distribution savings in a high-bulk, matt paper with a natural feel and outstanding standards of brightness and opacity."
        },
        {
          "language": "fra",
          "value": "Quand vous cherchez à réaliser de sérieuses économies sur les frais de distribution avec un papier mat offrant une blancheur et une opacité remarquables, le tout avec un toucher authentique."
        }
      ],
      "productType": "Paper"
    },
    {
      "id": "1ae825c7-b872-4e68-b2e3-af021e7ba2bd",
      "otherIdentifier": {
        "value": "galerie-brite-plus",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite Plus",
      "link": "/seller-products/1ae825c7-b872-4e68-b2e3-af021e7ba2bd",
      "descriptions": [
        {
          "language": "eng",
          "value": "When the job demands a quality high bulk paper boasting a gloss surface alongside enhanced printability."
        },
        {
          "language": "fra",
          "value": "Quand votre travail exige un papier de qualité avec une main élevée associée à une belle surface brillante, le tout avec des propriétés d’imprimabilité optimales."
        }
      ],
      "productType": "Paper"
    },
    {
      "id": "0d8b0183-49bb-4f49-86e1-2a8096aa5ca3",
      "otherIdentifier": {
        "value": "galerie-brite-silk",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite Silk",
      "link": "/seller-products/0d8b0183-49bb-4f49-86e1-2a8096aa5ca3",
      "descriptions": [
        {
          "language": "eng",
          "value": "When you’re looking for a high quality paper with a seriously smooth surface that boasts superb printability."
        },
        {
          "language": "fra",
          "value": "When you’re looking for a high quality paper with a seriously smooth surface that boasts superb printability."
        }
      ],
      "productType": "Paper"
    },
    {
      "id": "752513da-0eb2-4094-8ed4-08b53f854965",
      "otherIdentifier": {
        "value": "galerie-fine",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Fine",
      "link": "/seller-products/752513da-0eb2-4094-8ed4-08b53f854965",
      "descriptions": [
        {
          "language": "eng",
          "value": "Outstanding image reproduction and superb smoothness meets first-class on-press performance."
        },
        {
          "language": "fra",
          "value": "Outstanding image reproduction and superb smoothness meets first-class on-press performance."
        }
      ],
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

> You can see that the _seller_ has **30** _seller-products_ offered to the authenticated _customer_. The response only contains a few properties per _seller-product_, to get the details of a specific _seller-product_, you can use the `link` property that contains a prepared URL path giving direct access to the full _seller-product_ details. You can also notice that the response only gives 5 _seller-products_ out of the 30. This is because of the pagination mechanism.

#### Step 3 of Scenario C

Then, the _customer_ sends an API request to the _seller_ in order to get the details of the first _seller-product_ using `{ "value": "galerie-brite", "assignedBy": "Seller" }` to refer to it (and not its UUID):

```text
curl --request GET \
  --URL http://localhost:3003/seller-products?otherIdentifier.value=galerie-brite&otherIdentifier.assignedBy=Seller \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfSellerProducts": 1,
  "sellerProducts": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "otherIdentifier": {
        "value": "galerie-brite",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "Galerie Brite",
      "link": "/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "descriptions": [
        {
          "language": "eng",
          "value": "When your high volume print job demands an ultra lightweight gloss paper with superior quality and runnability."
        },
        {
          "language": "fra",
          "value": "Quand vos travaux à longs tirages exigent un papier brillant dans des grammages légers avec une qualité d’impression et une roulabilité sans faille."
        }
      ]
    }
  ],
  "links": {
    "self": {
      "href": "/seller-products?otherIdentifier.value=galerie-brite&otherIdentifier.assignedBy=Seller&offset=0&limit=1"
    }
  }
}
```

```text
curl --request GET \
  --URL http://localhost:3003/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```


If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
  "otherIdentifier": {
    "value": "galerie-brite",
    "assignedBy": "Seller"
  },
  "status": "Active",
  "name": "Galerie Brite",
  "link": "/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
    "bulks": [
      {
        "value": 0.92,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.89,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.89,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.88,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.86,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.84,
        "UOM": "CubicCentimeterPerGram"
      },
      {
        "value": 0.82,
        "UOM": "CubicCentimeterPerGram"
      }
    ],
    "format": "Reel",
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
```

We can see that this _seller-product_ has

* a fixed `finishType` set to `Gloss`
* a fixed `printType` set to `HeatsetOffset`
* a `basisWeight` and a `bulk` that can take the following values:
  * `54 GramsPerSquareMeter` with `0.92 CubicCentimeterPerGram`
  * `57 GramsPerSquareMeter` with `0.89 CubicCentimeterPerGram`
  * `60 GramsPerSquareMeter` with `0.89 CubicCentimeterPerGram`
  * `65 GramsPerSquareMeter` with `0.88 CubicCentimeterPerGram`
  * `70 GramsPerSquareMeter` with `0.86 CubicCentimeterPerGram`
  * `80 GramsPerSquareMeter` with `0.84 CubicCentimeterPerGram`
  * `90 GramsPerSquareMeter` with `0.82 CubicCentimeterPerGram`
* a `width` that has a range from `400` to `2600 Millimeter`
* a `diameter` that can take the following values:
  * `1000 Millimeter`
  * `1250 Millimeter`
* a `coreDiameter` that can take the following values:
  * `76 Millimeter`
  * `150 Millimeter`

#### Step 4 of Scenario C

The _customer_ will now create a new _customer-article_ based on the first _seller-product_ `{ "value": "galerie-brite", "assignedBy": "Seller" }`. This _customer-article_ will fix the values of the `basisWeight`, `bulk`, `width`, `diameter` and `coreDiameter`. If the _customer_ is not absolutely sure that the _seller_ will not change the properties of this _seller-product_, then all the other important properties, such as `finishType` and `printType` MUST also be copied to the _customer-article_ definition.

```text
curl --request POST \
  --URL 'http://localhost:3003/customer-articles' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "otherIdentifier": { "value": "SAP12345", "assignedBy": "Customer" },
      "sellerProductIdentifier": {
        "value": "galerie-brite",
        "assignedBy": "Seller"
      },
      "status": "Active",
      "name": "My Galerie Brite 54",
      "paper": {
        "finishType": "Gloss",
        "printType": "HeatsetOffset",
        "basisWeight": {
          "value": "54",
          "UOM": "GramsPerSquareMeter"
        },
        "bulk": {
          "value": 0.92,
          "UOM": "CubicCentimeterPerGram"
        },
        "format": "Reel",
        "width": {
          "value": 900,
          "UOM": "Millimeter"
        },
        "diameter": {
            "value": 1000,
            "UOM": "Millimeter"
        },
        "coreDiameter": {
            "value": 76,
            "UOM": "Millimeter"
        }
      }
  }'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971",
  "otherIdentifier": { "value": "SAP12345", "assignedBy": "Customer" },
  "sellerProductId": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
  "sellerProductOtherIdentifier": {
    "value": "galerie-brite",
    "assignedBy": "Seller"
  },
  "sellerProductStatus": "Active",
  "status": "Active",
  "name": "My Galerie Brite 54",
  "link": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971",
  "paper": {
    "finishType": "Gloss",
    "printType": "HeatsetOffset",
    "basisWeight": {
      "value": "54",
      "UOM": "GramsPerSquareMeter"
    },
    "bulk": {
      "value": 0.92,
      "UOM": "CubicCentimeterPerGram"
    },
    "format": "Reel",
    "width": {
      "value": 900,
      "UOM": "Millimeter"
    },
    "diameter": {
      "value": 1000,
      "UOM": "Millimeter"
    },
    "coreDiameter": {
      "value": 76,
      "UOM": "Millimeter"
    }
  }
}
```

#### Step 5 of Scenario C

At any time, the _customer_ can list all the _customer-articles_ that have been created:

```text
curl --request GET \
  --URL http://localhost:3003/customer-articles \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```


If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfCustomerArticles": 1,
  "customerArticles": [
    {
      "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971",
      "otherIdentifier": { "value": "SAP12345", "assignedBy": "Customer" },
      "sellerProductId": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "sellerProductOtherIdentifier": {
        "value": "galerie-brite",
        "assignedBy": "Seller"
      },
      "sellerProductStatus": "Active",
      "status": "Active",
      "name": "My Galerie Brite 54",
      "link": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971",
      "productType": "Paper"
    }
  ],
  "links": {
    "self": {
      "href": "/customer-articles?offset=0&limit=5"
    },
    "next": {
      "href": "/customer-articles?offset=5&limit=5"
    }
  }
}
```

#### Step 6 of Scenario C

At any time, the _customer_ can get the details of a specific _customer-articles_ that has been created:

```text
curl --request GET \
  --URL http://localhost:3003/customer-articles?otherIdentifier.value=SAP12345&otherIdentifier.assignedBy=Customer \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfCustomerArticles": 1,
  "customerArticles": [
    {
      "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971",
      "otherIdentifier": { "value": "SAP12345", "assignedBy": "Customer" },
      "sellerProductId": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "sellerProductOtherIdentifier": {
        "value": "galerie-brite",
        "assignedBy": "Seller"
      },
      "sellerProductStatus": "Active",
      "status": "Active",
      "name": "My Galerie Brite 54",
      "link": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971"
    }
  ],
  "links": {
    "self": {
      "href": "/customer-articles?otherIdentifier.value=SAP12345&otherIdentifier.assignedBy=Customer&offset=0&limit=1"
    }
  }
}
```

```text
curl --request GET \
  --URL http://localhost:3003/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971 \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```


If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971",
  "otherIdentifier": { "value": "SAP12345", "assignedBy": "Customer" },
  "sellerProductId": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
  "sellerProductOtherIdentifier": {
    "value": "galerie-brite",
    "assignedBy": "Seller"
  },
  "sellerProductStatus": "Active",
  "status": "Active",
  "name": "My Galerie Brite 54",
  "link": "/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971",
  "paper": {
    "finishType": "Gloss",
    "printType": "HeatsetOffset",
    "basisWeight": {
      "value": "54",
      "UOM": "GramsPerSquareMeter"
    },
    "bulk": {
      "value": 0.92,
      "UOM": "CubicCentimeterPerGram"
    },
    "format": "Reel",
    "width": {
      "value": 900,
      "UOM": "Millimeter"
    },
    "diameter": {
      "value": 1000,
      "UOM": "Millimeter"
    },
    "coreDiameter": {
      "value": 76,
      "UOM": "Millimeter"
    }
  }
}
```