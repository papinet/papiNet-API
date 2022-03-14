# Availability Use Case

## Context

This use case is designed for Paper business.

> Recovered paper is not included within our definition of Paper business.

## Preconditions

The _customer_ should know the identifier (UUID) of the _seller-product_ or _customer-article_ for which she/he wants to receive availability information.

## Scenarios

Scenario A

| Product Name  | Basis Weight | Location      | Quantity (now)     |
| ------------  | ------------ | ------------- | ------------------ |
| Galerie Brite | 54 g/m2      | Sappi Germany |  9600 kg (3 reels) |
| Galerie Brite | 90 g/m2      | Sappi Germany | 16000 kg (5 reels) |

Scenario B

| Product Name  | Basis Weight | Location           | Quantity (now)     |
| ------------  | ------------ | ------------------ | ------------------ |
| Galerie Brite | 54 g/m2      | Sappi Lanaken Mill |  9600 kg (3 reels) |
| Galerie Brite | 54 g/m2      | Sappi Alfeld Mill  |  7200 kg (2 reels) |
| Galerie Brite | 90 g/m2      | Sappi Lanaken Mill | 16000 kg (5 reels) |

Scenario C

| Product Name  | Basis Weight | Location     | Quantity (now)     | Additional Quantities (future)                  |
| ------------  | ------------ | ------------ | ------------------ | ----------------------------------------------- |
| Galerie Brite | 54 g/m2      | Lanaken Mill |  9600 kg (3 reels) | 22400 kg (7 reels) on 2022-02-02 (Wed) at 13:00 |
| Galerie Brite | 90 g/m2      | Lanaken Mill | 16000 kg (5 reels) | 12800 kg (4 reels) on 2022-02-04 (Fri) at 09:00 |

### Scenario A

#### Interaction 1 of Scenario A - Authentication

Given that the _customer_ is not authenticated by the _seller_;

The _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --request POST \
  --URL https://papinet.papinet.io/tokens \
  --header 'X-Provider-Sate: Unauthenticated'
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

or, if you use locally the docker container of the papiNet mock server:

```text
curl --request POST \
  --URL http://localhost:3004/tokens \
  --header 'Host: papinet.papinet.io' \
  --header 'X-Provider-Sate: Unauthenticated' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

<!-- RESPONSE: Authentication -->
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
  --header 'X-Provider-Sate: Unauthenticated'
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

or, if you use locally the docker container of the papiNet mock server:

```text
ACCESS_TOKEN=$(curl --request POST \
  --URL http://localhost:3004/tokens \
  --header 'Host: papinet.papinet.io' \
  --header 'X-Provider-Sate: Unauthenticated' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

You can easily verify the value of the `ACCESS_TOKEN` environment variable using:

```text
echo $ACCESS_TOKEN
```

#### Interaction 2 of Scenario A

Given that the _customer_ is authenticated by the _seller_, who has sent `a4f071c3-fe1f-4a45-9eae-07ddcb5bed26` as an access token;

Given that the _seller_ has the following availability data for the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

| Product Name  | Basis Weight | Location      | Quantity (now)     |
| ------------  | ------------ | ------------- | ------------------ |
| Galerie Brite | 54 g/m2      | Sappi Germany |  9600 kg (3 reels) |
| Galerie Brite | 90 g/m2      | Sappi Germany | 16000 kg (5 reels) |

The authenticated _customer_ sends an API request to the _seller_ in order to get the availability of the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

```text
$ curl --request POST \
  --URL https://papinet.papinet.io/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6/check-availability \
  --header 'X-Provider-Sate: Interaction 2 of Scenario A' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request POST \
  --URL http://localhost:3004/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6/check-availability \
  --header 'X-Provider-Sate: Interaction 2 of Scenario A' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

<!-- RESPONSE: Interaction 2 of Scenario A -->
```json
{
  "sellerProducts": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
          "locationURL": "http://localhost:3004/locations/578e5b28-3ce0-4952-a2a9-bf2eec3ad7a5",
          "quantities": [
            {
              "quantityContext": "OnHand",
              "quantityType": "GrossWeight",
              "quantityValue": 9600,
              "quantityUOM": "Kilogram"
            },
            {
              "quantityContext": "OnHand",
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
          "locationURL": "http://localhost:3004/locations/578e5b28-3ce0-4952-a2a9-bf2eec3ad7a5",
          "quantities": [
            {
              "quantityContext": "OnHand",
              "quantityType": "GrossWeight",
              "quantityValue": 16000,
              "quantityUOM": "Kilogram"
            },
            {
              "quantityContext": "OnHand",
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

#### Interaction 3 of Scenario A

```text
$ curl --request GET \
  --URL http://localhost:3004/locations/578e5b28-3ce0-4952-a2a9-bf2eec3ad7a5 \
  --header 'X-Provider-Sate: Interaction 3 of Scenario A' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

<!-- RESPONSE: Interaction 3 of Scenario A -->
```json
{
  "name": "Sappi Germany"
}
```

### Scenario B

#### Interaction 1 of Scenario B - Authentication

This interaction is identical to the Interaction 1 of Scenario A.

#### Interaction 2 of Scenario B

Given that the _customer_ is authenticated by the _seller_, who has sent `a4f071c3-fe1f-4a45-9eae-07ddcb5bed26` as an access token;

Given that the _seller_ has the following availability data for the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

| Product Name  | Basis Weight | Location           | Quantity (now)     |
| ------------  | ------------ | ------------------ | ------------------ |
| Galerie Brite | 54 g/m2      | Sappi Lanaken Mill |  9600 kg (3 reels) |
| Galerie Brite | 54 g/m2      | Sappi Alfeld Mill  |  7200 kg (2 reels) |
| Galerie Brite | 90 g/m2      | Sappi Lanaken Mill | 16000 kg (5 reels) |

The authenticated _customer_ sends an API request to the _seller_ in order to get the availability of the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

```text
$ curl --request POST \
  --URL https://papinet.papinet.io/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6/check-availability \
  --header 'X-Provider-Sate: Interaction 2 of Scenario B' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request POST \
  --URL http://localhost:3004/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6/check-availability \
  --header 'X-Provider-Sate: Interaction 2 of Scenario B' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

<!-- RESPONSE: Interaction 2 of Scenario B -->
```json
{
  "sellerProducts": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
          "locationURL": "http://localhost:3004/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
          "quantities": [
            {
              "quantityContext": "OnHand",
              "quantityType": "GrossWeight",
              "quantityValue": 9600,
              "quantityUOM": "Kilogram"
            },
            {
              "quantityContext": "OnHand",
              "quantityType": "Count",
              "quantityValue": 3,
              "quantityUOM": "Reel"
            }
          ]
        },
        {
          "locationURL": "http://localhost:3004/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
          "quantities": [
            {
              "quantityContext": "OnHand",
              "quantityType": "GrossWeight",
              "quantityValue": 7200,
              "quantityUOM": "Kilogram"
            },
            {
              "quantityContext": "OnHand",
              "quantityType": "Count",
              "quantityValue": 2,
              "quantityUOM": "Reel"
            }
          ]
        }
      ]
    },
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
          "locationURL": "http://localhost:3004/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
          "quantities": [
            {
              "quantityContext": "OnHand",
              "quantityType": "GrossWeight",
              "quantityValue": 16000,
              "quantityUOM": "Kilogram"
            },
            {
              "quantityContext": "OnHand",
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

#### Interaction 3 of Scenario B

```text
$ curl --request GET \
  --URL http://localhost:3004/locations/7f54154d-7ca3-4e5d-9e94-93389e07f7fc \
  --header 'X-Provider-Sate: Interaction 3 of Scenario B' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

<!-- RESPONSE: Interaction 3 of Scenario B -->
```json
{
  "name": "Sappi Lanaken Mill",
  "country": "BE",
  "latitude" : 50.881141,
  "longitude" : 5.6317766
}
```

#### Interaction 4 of Scenario B

```text
$ curl --request GET \
  --URL http://localhost:3004/locations/987446dd-4554-4cf9-991d-393adfdc571e \
  --header 'X-Provider-Sate: Interaction 3 of Scenario B' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

<!-- RESPONSE: Interaction 4 of Scenario B -->
```json
{
  "name": "Sappi Alfeld Mill",
  "country": "DE",
  "latitude" : 51.9852363,,
  "longitude" : 9.8200211
}
```

### Scenario C

#### Interaction 1 of Scenario C - Authentication

This interaction is identical to the Interaction 1 of Scenario A.

#### Interaction 2 of Scenario C

Given that the _customer_ is authenticated by the _seller_, who has sent `a4f071c3-fe1f-4a45-9eae-07ddcb5bed26` as an access token;

Given that the _seller_ has the following availability data for the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

| Product Name  | Basis Weight | Location     | Quantity (now)     | Additional Quantities (future)                  |
| ------------  | ------------ | ------------ | ------------------ | ----------------------------------------------- |
| Galerie Brite | 54 g/m2      | Lanaken Mill |  9600 kg (3 reels) | 22400 kg (7 reels) on 2022-02-02 (Wed) at 13:00 |
| Galerie Brite | 90 g/m2      | Lanaken Mill | 16000 kg (5 reels) | 12800 kg (4 reels) on 2022-02-04 (Fri) at 09:00 |

The authenticated _customer_ sends an API request to the _seller_ in order to get the availability of the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

```text
$ curl --request POST \
  --URL https://papinet.papinet.io/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6/check-availability \
  --header 'X-Provider-Sate: Interaction 2 of Scenario C' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

or, if you use locally the docker container of the papiNet mock server:

```text
$ curl --request POST \
  --URL http://localhost:3004/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6/check-availability \
  --header 'X-Provider-Sate: Interaction 2 of Scenario C' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

<!-- RESPONSE: Interaction 2 of Scenario C -->
```json
{
  "sellerProducts": [
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
          "locationURL": "http://localhost:3004/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
          "quantities": [
            {
              "quantityContext": "OnHand",
              "quantityType": "GrossWeight",
              "quantityValue": 9600,
              "quantityUOM": "Kilogram"
            },
            {
              "quantityContext": "OnHand",
              "quantityType": "Count",
              "quantityValue": 3,
              "quantityUOM": "Reel"
            }
          ],
          "plannedQuantities": [
            {
              "estimatedAvailableDateTime": "2022-02-02T13:00:00Z",
              "quantities": [
                {
                  "quantityContext": "ProductionPlanned",
                  "quantityType": "GrossWeight",
                  "quantityValue": 22400,
                  "quantityUOM": "Kilogram"
                },
                {
                  "quantityContext": "ProductionPlanned",
                  "quantityType": "Count",
                  "quantityValue": 7,
                  "quantityUOM": "Reel"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "e7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
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
          "locationURL": "http://localhost:3004/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008",
          "quantities": [
            {
              "quantityContext": "OnHand",
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
              "estimatedAvailableDateTime": "2022-02-04T09:00:00Z",
              "quantites": [
                {
                  "quantityContext": "InTransit",
                  "quantityType": "GrossWeight",
                  "quantityValue": 12800,
                  "quantityUOM": "Kilogram"
                },
                {
                  "quantityContext": "InTransit",
                  "quantityType": "Count",
                  "quantityValue": 4,
                  "quantityUOM": "Reel"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

#### Interaction 3 of Scenario C

```text
$ curl --request GET \
  --URL http://localhost:3004/locations/7f54154d-7ca3-4e5d-9e94-93389e07f7fc \
  --header 'X-Provider-Sate: Interaction 3 of Scenario B' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

<!-- RESPONSE: Interaction 3 of Scenario C -->
```json
{
  "name": "Sappi Lanaken Mill",
  "country": "BE",
  "latitude" : 50.881141,
  "longitude" : 5.6317766
}
```
