# Availability Use Case

## Context

This use case is designed for Paper business.

> Recovered paper is not included within our definition of Paper business.

## Preconditions

The _customer_ should know the identifier (UUID) of the _seller-product_ or _customer-article_ for which she/he wants to receive availability information.

## Scenarios

...

| Product Name  | Basis Weight | Location     | Quantity (now)     |
| ------------  | ------------ | ------------ | ------------------ |
| Galerie Brite | 54 g/m2      | Lanaken Mill |  9600 kg (3 reels) |
| Galerie Brite | 90 g/m2      | Lanaken Mill | 16000 kg (5 reels) |

| Product Name  | Basis Weight | Location     | Quantity (now)     | Additional Quantities (future)                  |
| ------------  | ------------ | ------------ | ------------------ | ----------------------------------------------- |
| Galerie Brite | 54 g/m2      | Lanaken Mill |  9600 kg (3 reels) | 22400 kg (7 reels) on 2022-02-02 (Wed) at 13:00 |
| Galerie Brite | 90 g/m2      | Lanaken Mill | 16000 kg (5 reels) | 12800 kg (4 reels) on 2022-02-04 (Fri) at 09:00 |

### Scenario X

...

#### Step 1 of Scenario X - Authentication

The _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --request POST \
  --URL https://papinet.papinet.io/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

or, if you use locally the docker container of the papiNet mock server:

```text
curl --request POST \
  --URL http://localhost:3004/tokens \
  --header 'Host: papinet.papinet.io' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
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
  --URL http://localhost:3004/tokens \
  --header 'Host: papinet.papinet.io' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

You can easily verify the value of the `ACCESS_TOKEN` environment variable using:

```text
echo $ACCESS_TOKEN
```

#### Step 2 of Scenario X

The authenticated _customer_ sends an API request to the _seller_ in order to get the availability of the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

```text
$ curl --request POST \
  --URL https://papinet.papinet.io/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6/check-availability \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "sellerProducts": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "otherIdentifier": { "value": "galerie-brite", "assignedBy": "Seller" },
      "name": "Galerie Brite",
      "paper": {
        "finishType": "Gloss",
        "printType": "HeatsetOffset",
        "basisWeight": {
          "value": 54,
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
      },
      "locations": [
        {
          "otherIdentifier": { "value": "lanaken-mill", "assignedBy": "Seller" },
          "name": "Lanaken Mill",
          "country": "BE",
          "latitude" : 50.881141,
          "longitude" : 5.6317766,
          "quantitiesOnHand": [
            {
              "quantityContext": "Stock",
              "quantityType": "GrossWeight",
              "quantityValue": 9600,
              "quantityUOM": "Kilogram"
            },
            {
              "quantityContext": "Stock",
              "quantityType": "Count",
              "quantityValue": 3,
              "quantityUOM": "Reel"
            }
          ]
        }
      ]
    },
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "otherIdentifier": { "value": "galerie-brite", "assignedBy": "Seller" },
      "name": "Galerie Brite",
      "paper": {
        "finishType": "Gloss",
        "printType": "HeatsetOffset",
        "basisWeight": {
          "value": 90,
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
      },
      "locations": [
        {
          "otherIdentifier": { "value": "lanaken-mill", "assignedBy": "Seller" },
          "name": "Lanaken Mill",
          "country": "BE",
          "latitude" : 50.881141,
          "longitude" : 5.6317766,
          "quantitiesOnHand": [
            {
              "quantityContext": "Stock",
              "quantityType": "GrossWeight",
              "quantityValue": 16000,
              "quantityUOM": "Kilogram"
            },
            {
              "quantityContext": "Stock",
              "quantityType": "Count",
              "quantityValue": 5,
              "quantityUOM": "Reel"
            }
          ]
        }
      ]
    }
  ]
}
```

...

```json
{
  "sellerProducts": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "otherIdentifier": { "value": "galerie-brite", "assignedBy": "Seller" },
      "name": "Galerie Brite",
      "paper": {
        "finishType": "Gloss",
        "printType": "HeatsetOffset",
        "basisWeight": {
          "value": 54,
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
      },
      "locations": [
        {
          "otherIdentifier": { "value": "lanaken-mill", "assignedBy": "Seller" },
          "name": "Lanaken Mill",
          "country": "BE",
          "latitude" : 50.881141,
          "longitude" : 5.6317766,
          "quantitiesOnHand": [
            {
              "quantityContext": "Stock",
              "quantityType": "GrossWeight",
              "quantityValue": 9600,
              "quantityUOM": "Kilogram"
            },
            {
              "quantityContext": "Stock",
              "quantityType": "Count",
              "quantityValue": 3,
              "quantityUOM": "Reel"
            }
          ],
          "plannedQuantities": [
            {
              "quantitites": [
                {
                  "quantityContext": "Stock",
                  "quantityType": "GrossWeight",
                  "quantityValue": 22400,
                  "quantityUOM": "Kilogram"
                },
                {
                  "quantityContext": "Stock",
                  "quantityType": "Count",
                  "quantityValue": 7,
                  "quantityUOM": "Reel"
                }
              ],
              estimatedAvailableDateTime: "2022-02-02T13:00:00Z"
            }
          ]
        }
      ]
    },
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "otherIdentifier": { "value": "galerie-brite", "assignedBy": "Seller" },
      "name": "Galerie Brite",
      "paper": {
        "finishType": "Gloss",
        "printType": "HeatsetOffset",
        "basisWeight": {
          "value": 90,
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
      },
      "locations": [
        {
          "otherIdentifier": { "value": "lanaken-mill", "assignedBy": "Seller" },
          "name": "Lanaken Mill",
          "country": "BE",
          "latitude" : 50.881141,
          "longitude" : 5.6317766,
          "quantitiesOnHand": [
            {
              "quantityContext": "Stock",
              "quantityType": "GrossWeight",
              "quantityValue": 16000,
              "quantityUOM": "Kilogram"
            },
            {
              "quantityContext": "Stock",
              "quantityType": "Count",
              "quantityValue": 5,
              "quantityUOM": "Reel"
            }
          ],
          "plannedQuantities": [
            {
              "quantitites": [
                {
                  "quantityContext": "Stock",
                  "quantityType": "GrossWeight",
                  "quantityValue": 12800,
                  "quantityUOM": "Kilogram"
                },
                {
                  "quantityContext": "Stock",
                  "quantityType": "Count",
                  "quantityValue": 7,
                  "quantityUOM": "Reel"
                }
              ],
              estimatedAvailableDateTime: "2022-02-04T09:00:00Z"
            }
          ]
        }
      ]
    }
  ]
}
```
