# Availability Use Case

## Context

This use case is designed for Paper business.

> Recovered paper is not included within our definition of Paper business.

## Preconditions

The _customer_ should know the identifier (UUID) of the _seller-product_ or _customer-article_ for which she/he wants to receive availability information.

## Process

An authenticated _customer_ requests to a _seller_ the availability of a particular _seller-product_ or _customer-article_.

The authenticated _customer_ requests to a _seller_ detailed information about the location(s) referenced within the availability response.

## papiNet Stub Service

You can run locally the papiNet stub service using the following command:

```text
./pact-stub-server --file papiNet.pact.json --port 3004 --provider-state-header-name X-Provider-State
```

The `pact-stub-server` is available at <https://github.com/pact-foundation/pact-stub-server/releases>.

## Scenarios

Within the **scenario A**, the _seller_ has 1 _seller-product_ in 1 _location_ with 2 different on-hand quantities depending on 2 different basis weight.

| Product Name  | Basis Weight | Location      | Quantity (now)     |
| ------------  | ------------ | ------------- | ------------------ |
| Galerie Brite | 54 g/m2      | Sappi Germany |  9600 kg (3 reels) |
| Galerie Brite | 90 g/m2      | Sappi Germany | 16000 kg (5 reels) |

Within the **scenario B**, the _seller_ has 1 _seller-product_ in 2 _locations_. In one _location_, there is 1 on-hand quantities for 1 specific basis weight, while in the other location, there are 2 different on-hand quantities depending on 2 different basis weight.

| Product Name  | Basis Weight | Location           | Quantity (now)     |
| ------------  | ------------ | ------------------ | ------------------ |
| Galerie Brite | 54 g/m2      | Sappi Lanaken Mill |  9600 kg (3 reels) |
| Galerie Brite | 54 g/m2      | Sappi Alfeld Mill  |  7200 kg (2 reels) |
| Galerie Brite | 90 g/m2      | Sappi Lanaken Mill | 16000 kg (5 reels) |

Within the **scenario C**, the _seller_ has 1 _seller-product_ in 1 _location_ with 2 different on-hand quantities depending on 2 different basis weight, as well as 2 different planned quantities for the 2 different basis weight

| Product Name  | Basis Weight | Location     | Quantity (now)     | Planned Quantities (future)                     |
| ------------  | ------------ | ------------ | ------------------ | ----------------------------------------------- |
| Galerie Brite | 54 g/m2      | Lanaken Mill |  9600 kg (3 reels) | 22400 kg (7 reels) on 2022-02-02 (Wed) at 13:00 |
| Galerie Brite | 90 g/m2      | Lanaken Mill | 16000 kg (5 reels) | 12800 kg (4 reels) on 2022-02-04 (Fri) at 09:00 |

### Scenario A

#### Interaction 1 of Scenario A - Authentication

Given that the _customer_ is not authenticated by the _seller_;

The _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --silent --show-error --request POST \
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
ACCESS_TOKEN=$(curl --silent --show-error --request POST \
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
curl --silent --show-error --request POST \
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
      "paper": {
        "basisWeight": {
          "value": 54,
          "UOM": "GramsPerSquareMeter"
        },
        "bulk": {
          "value": 0.92,
          "UOM": "CubicCentimeterPerGram"
        },
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
      "paper": {
        "basisWeight": {
          "value": 90,
          "UOM": "GramsPerSquareMeter"
        },
        "bulk": {
          "value": 0.92,
          "UOM": "CubicCentimeterPerGram"
        },
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

Within the _availability_ response, the _locations_ are only given via their URLs containing their identifier (UUID). However, you can get their detailed information using these URLs with the `GET` methods.

The authenticated _customer_ sends an API request to the _seller_ in order to get the detailed information of the _location_ `578e5b28-3ce0-4952-a2a9-bf2eec3ad7a5`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3004/locations/578e5b28-3ce0-4952-a2a9-bf2eec3ad7a5 \
  --header 'X-Provider-Sate: Interaction 3 of Scenario A' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

<!-- RESPONSE: Interaction 3 of Scenario A -->
```json
{
  "id": "578e5b28-3ce0-4952-a2a9-bf2eec3ad7a5",
  "name": "Sappi Germany"
}
```

### Scenario B

#### Interaction 1 of Scenario B - Authentication

This interaction is identical to the Interaction 1 of Scenario A.

#### Interaction 2 of Scenario B

| Product Name  | Basis Weight | Location           | Quantity (now)     |
| ------------  | ------------ | ------------------ | ------------------ |
| Galerie Brite | 54 g/m2      | Sappi Lanaken Mill |  9600 kg (3 reels) |
| Galerie Brite | 54 g/m2      | Sappi Alfeld Mill  |  7200 kg (2 reels) |
| Galerie Brite | 90 g/m2      | Sappi Lanaken Mill | 16000 kg (5 reels) |

Given that the _customer_ is authenticated by the _seller_, who has sent `a4f071c3-fe1f-4a45-9eae-07ddcb5bed26` as an access token;

Given that the _seller_ has the following availability data for the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`;

The authenticated _customer_ sends an API request to the _seller_ in order to get the availability of the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

```text
curl --silent --show-error --request POST \
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
      "paper": {
        "basisWeight": {
          "value": 54,
          "UOM": "GramsPerSquareMeter"
        },
        "bulk": {
          "value": 0.92,
          "UOM": "CubicCentimeterPerGram"
        },
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
      "paper": {
        "basisWeight": {
          "value": 90,
          "UOM": "GramsPerSquareMeter"
        },
        "bulk": {
          "value": 0.92,
          "UOM": "CubicCentimeterPerGram"
        },
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

The authenticated _customer_ sends an API request to the _seller_ in order to get the detailed information of the _location_ `4cc7b1ba-6278-4a56-9ee2-ad316950c008`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3004/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008 \
  --header 'X-Provider-Sate: Interaction 3 of Scenario B' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

<!-- RESPONSE: Interaction 3 of Scenario B -->
```json
{
  "id": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
  "name": "Sappi Lanaken Mill",
  "countryCode": "BE",
  "coordinatesWGS84": {
    "latitude": 50.8827787,
    "longitude": 5.6375872
  }
}
```

#### Interaction 4 of Scenario B

The authenticated _customer_ sends an API request to the _seller_ in order to get the detailed information of the _location_ `8a69e22b-9a8c-4585-a8f9-7fbce8de7c73`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3004/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73 \
  --header 'X-Provider-Sate: Interaction 4 of Scenario B' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

<!-- RESPONSE: Interaction 4 of Scenario B -->
```json
{
  "id": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
  "name": "Sappi Alfeld Mill",
  "countryCode": "BE",
  "coordinatesWGS84": {
    "latitude": 51.985233,
    "longitude": 9.8200211
  }
}
```

### Scenario C

#### Interaction 1 of Scenario C - Authentication

This interaction is identical to the Interaction 1 of Scenario A.

#### Interaction 2 of Scenario C

| Product Name  | Basis Weight | Location     | Quantity (now)     | Planned Quantities (future)                     |
| ------------  | ------------ | ------------ | ------------------ | ----------------------------------------------- |
| Galerie Brite | 54 g/m2      | Lanaken Mill |  9600 kg (3 reels) | 22400 kg (7 reels) on 2022-02-02 (Wed) at 13:00 |
| Galerie Brite | 90 g/m2      | Lanaken Mill | 16000 kg (5 reels) | 12800 kg (4 reels) on 2022-02-04 (Fri) at 09:00 |

Given that the _customer_ is authenticated by the _seller_, who has sent `a4f071c3-fe1f-4a45-9eae-07ddcb5bed26` as an access token;

Given that the _seller_ has the following availability data for the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`;

The authenticated _customer_ sends an API request to the _seller_ in order to get the availability of the _seller-product_ `e7bfd8a6-edde-48ab-b304-b7d4f1d007a6`:

```text
curl --silent --show-error --request POST \
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
      "paper": {
        "basisWeight": {
          "value": 54,
          "UOM": "GramsPerSquareMeter"
        },
        "bulk": {
          "value": 0.92,
          "UOM": "CubicCentimeterPerGram"
        },
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
      "paper": {
        "basisWeight": {
          "value": 90,
          "UOM": "GramsPerSquareMeter"
        },
        "bulk": {
          "value": 0.92,
          "UOM": "CubicCentimeterPerGram"
        },
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
          ],
          "plannedQuantities": [
            {
              "estimatedAvailableDateTime": "2022-02-04T09:00:00Z",
              "quantities": [
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

The authenticated _customer_ sends an API request to the _seller_ in order to get the detailed information of the _location_ `4cc7b1ba-6278-4a56-9ee2-ad316950c008`:

```text
curl --silent --show-error --request GET \
  --URL http://localhost:3004/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008 \
  --header 'X-Provider-Sate: Interaction 3 of Scenario C' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json'
```

If all goes well, the _customer_ will receive a response like this:

<!-- RESPONSE: Interaction 3 of Scenario C -->
```json
{
  "id": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
  "name": "Sappi Lanaken Mill",
  "countryCode": "BE",
  "coordinatesWGS84": {
    "latitude": 50.8827787,
    "longitude": 5.6375872
  }
}
```
