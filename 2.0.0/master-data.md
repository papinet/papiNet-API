# Master Data Use Case

## Context

This use case is designed for _Paper and Board_ business.

> _Paper For Recycling_ and _Pulp_ are not included within our definition of _Paper and Board_, they are raw materials for _Paper and Board_.

## Definitions

The distinction we make between the concepts _product_ and _article_ is essential to the understanding of our papiNet API endpoints.

A **_product_** is owned and defined by the _seller_. It has several properties such as the `basisWeight`, the `width`, a certain percentage of `recycled` material, and so on. Usually, some of these properties may have multiple possible values, for instance you could choose the `basisWeight` of your paper from a list of values: 35 g/m², 39 g/m², 42 g/m², ...

An **_article_** is owned and defined by the _customer_. Typically, a _customer_ specifies an individual _article_ from a _product_ in order to narrow down the various properties that may have multiple potential values, ultimately settling on a single value for each.

In order to show that important distinction within the API itself, we will always use the word _product_ together with _seller_ creating the hyphenated word **_seller-product_**, and the word _article_ will always be used with _customer_ creating **_customer-article_**.

While the hyphenated terms _seller-product_ and _customer-article_ may sound redundant, we have found them to be a useful tool for reinforcing the distinction between _product_ and _article_ within the API endpoints.

A **_location_** is defined as a physical place where a business process or activity takes place or where a physical asset is located. _Locations_ can have the following types when being part in the business process:

* **_shipToLocation_**: the _location_ the _customer-article_ should be shipped to.

A **_party_** is defined as any organization that has a relationship or role in a particular business process or activity. _Parties_ can have the following roles when participating in the business process:

* **_customerParty_**: a _party_ acting for the _buyer_ in the transaction.
* **_supplierPatry_**: a _party_ responsible for providing the _customer-article_.
* **_sellerParty_**: a legal entity selling the _customer-article_.
* **_buyerParty_**: a legal entity to which the _customer-article_ is sold.
* **_billToParty_**: a _party_ receiving the _invoice_.

## Preconditions

Our initial approach will be to start with a simplified operational structure, which assumes that the _seller_ has already created the necessary _customer-articles_ (based on _customer_ requirements), _parties_, and _locations_ required for the business transactions, by another means than papiNet API. The creation of _customer-articles_, _parties_, and _locations_ will be part of the scope of the papiNet API in the future.

It should be noted that, for now, this simplified operational structure excludes the step of defining _customer-articles_ from _seller-products_, which is assumed to have already been completed by the _seller_ prior to the start of the business transactions. In addition to that, our assumption is that each property of the _customer-article_, required to order it, has only one value, meaning that the _customer-article_ is fully defined. But this restriction will change in the future.

## Processes

An authenticated _customer_ requests the _supplier_ to provide the list of active _customer-articles_ that have been created.

The authenticated _customer_ requests the _supplier_ to provide the details of a specific _customer-article_ that has been created.

The authenticated _customer_ requests the _supplier_ to provide the list of active _locations_ that have been defined.

The authenticated _customer_ requests the _supplier_ to provide the details of a specific _location_ that has been defined.

The authenticated _customer_ requests the _supplier_ to provide the list of active _parties_ that have been defined.

The authenticated _customer_ requests the _supplier_ to provide the details of a specific _party_ that has been defined.

## Domain Name

We suggest that the _supplier_ exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _supplier_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

## papiNet Stub Service

You can run locally the papiNet stub service using the following command:

```text
./mock/pact-stub-server --file ./mock/papiNet.PACT.json --port 3020 --provider-state-header-name X-Provider-State
```

## Authentication

For authenticating the _customer_, we recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _customer_ sends an API request to create a session, and gets its associated _access token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "access_token": "1a27ae3f-02f3-4355-8a70-9ed547d0ccf8",
  "token_type": "bearer",
  "expires_in_": 86400
}
```

## Scenarios

* Scenario A - An authenticated _customer_ gets the list of all active _customer-articles_ created for that _customer_ and then gets the details of a specific _customer-article_.

* Scenario B - An authenticated _customer_ gets the list of all active _locations_ defined for that _customer_ and then gets the details of a specific _location_.

* Scenario C - An authenticated _customer_ gets the list of all active _parties_ defined for that _customer_ and then gets the details of a specific _party_.

* Scenario D - An authenticated _customer_ retrieves the UUID of a _customer-article_ based on its `customerArticleNumber`.

* Scenario E - An authenticated _customer_ retrieves the UUID of a _location_ based on its `locationIdentifier`.

* Scenario F - An authenticated _customer_ retrieves the UUID of a _party_ based on its `partyIdentifier`.

### Scenario A: Customer-Articles

An authenticated _customer_ gets the list of all _customer-articles_ created for that _customer_ and then gets the details of a specific _customer-article_.

#### Interaction 0 of Scenario A (Authentication)

The _customer_ sends an API request to the _supplier_ in order to be authenticated, and gets an _access token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --header 'X-Provider-State: Master_Data_Interaction_0_of_Scenario_A' \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "access_token": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "token_type": "bearer",
  "expires_in_": 86400
}
```

#### Interaction 1 of Scenario A (List of Customer-Articles)

The authenticated _customer_ sends an API request in order to get the list of all active _customer-articles_ created:

```text
curl --request GET \
  --URL http://localhost:3020/customer-articles?status=Active \
  --header 'X-Provider-State: Master_Data_Interaction_1_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfCustomerArticles": 17,
  "customerArticles": [
    {
      "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971",
      "customerArticleNumber": "ERP-GA-L-35-900-1000",
      "customerArticleTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",
      "sellerProductBrandName": "Advertising Paper",
      "sellerProductName": "Advertising Paper Lite",
      "productType": "Paper"
    },
    {
      "id": "b10d0a30-ce23-405b-8176-67452ea2ef6c",
      "customerArticleNumber": "ERP-GA-L-35-2100-1250",
      "status": "Active",
      "customerArticleTimestamp": "2023-06-21T13:45:00Z",
      "sellerProductBrandName": "Advertising Paper",
      "sellerProductName": "Advertising Paper Lite",
      "productType": "Paper"
    },
    {
      "id": "a9c15fde-f410-46f7-b16c-43678d414ea3",
      "customerArticleNumber": "ERP-GA-L-51-1800-1250",
      "customerArticleTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",
      "sellerProductBrandName": "Advertising Paper",
      "sellerProductName": "Advertising Paper Lite",
      "productType": "Paper"
    },
    {
      "id": "b4a28c7e-95d9-43a6-a82a-ed1c807124b9",
      "customerArticleNumber": "ERP-GA-BS-65-1000-1000",
      "customerArticleTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",
      "sellerProductBrandName": "Advertising Paper",
      "sellerProductName": "Advertising Paper Brite",
      "productType": "Paper"
    },
    {
      "id": "3b034825-6908-4bef-8c43-e7a424a2c486",
      "customerArticleNumber": "ERP-MA-G-100",
      "customerArticleTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",
      "sellerProductBrandName": "Brilliant Paper",
      "sellerProductName": "Brilliant Paper Gloss",
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

#### Interaction 2 of Scenario A (Get the Details of a Specific Customer-Article)

At any time, the _customer_ can send an API request in order to get the details of a specific _customer-article_ that has been created:

```text
curl --request GET \
  --URL http://localhost:3020/customer-articles/fd345ee7-ba9a-4856-8fcb-a912b10ea971 \
  --header 'X-Provider-State: Master_Data_Interaction_2_of_Scenario_A' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "fd345ee7-ba9a-4856-8fcb-a912b10ea971",
  "customerArticleNumber": "ERP-GAL-35-900-1000",
  "customerArticleTimestamp": "2023-06-21T13:45:00Z",
  "status": "Active",
  "sellerProductBrandName": "Advertising Paper",
  "sellerProductName": "Advertising Paper Brite",
  "paper": {
    "finishType": "Gloss",
    "printType": "HeatsetOffset",
    "basisWeight": {
      "value": 35,
      "UOM": "GramsPerSquareMeter"
    },
    "bulk": {
      "value": 1.02,
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

***WARNING.*** The properties of a _customer-articles_ SHOULD NOT change once defined, they SHOULD be immutable, with the exception of of the `status` property that can be switched from `Active` to `Inactive`.

### Scenario B: Locations

An authenticated _customer_ gets the list of all _locations_ defined for that _customer_ and then gets the details of a specific _location_.

#### Interaction 0 of Scenario B (Authentication)

See [above](#interaction-0-of-scenario-a-authentication).

#### Interaction 1 of Scenario B (List of Locations)

The authenticated _customer_ sends an API request in order to get the list of all active _locations_ defined:

```text
curl --request GET \
  --URL http://localhost:3020/locations?status=Active \
  --header 'X-Provider-State: Master_Data_Interaction_1_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfLocations": 9,
  "locations": [
    {
      "id": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "locationIdentifier": "ERP-L-DE-ACME-01",
      "locationTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",
      "nameLines": [
        "Acme Alfeld GmbH"
      ],
      "countryCode": "DE"
    },
    {
      "id": "0c7ef7cc-27d7-4d14-a8d2-c8da0eba1ecd",
      "locationIdentifier": "ERP-L-IT-ACME-01",
      "locationTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",
      "nameLines": [
        "Acme Carmignano Mill"
      ],
      "countryCode": "IT"
    },
    {
      "id": "4cc7b1ba-6278-4a56-9ee2-ad316950c008",
      "locationIdentifier": "ERP-L-BE-ACME-01",
      "locationTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",

      "nameLines": [
        "Acme Lanaken Mill"
      ],
      "countryCode": "BE"
    }
  ],
  "links": {
    "self": {
      "href": "/locations?offset=0&limit=5"
    },
    "next": {
      "href": "/locations?offset=5&limit=5"
    }
  }
}
```

#### Interaction 2 of Scenario B (Get the Details of a Specific Location)

At any time, the _customer_ can send an API request in order to get the details of a specific _location_ that has been defined:

```text
curl --request GET \
  --URL http://localhost:3020/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73 \
  --header 'X-Provider-State: Master_Data_Interaction_2_of_Scenario_B' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
  "locationIdentifier": "ERP-L-DE-ACME-01",
  "locationTimestamp": "2023-06-21T13:45:00Z",
  "status": "Active",
  "nameLines": [
    "Acme Alfeld GmbH"
  ],
  "address": {
    "addressLines": [
      "Mühlenmasch 1"
    ],
    "city": "Alfeld",
    "postalCode": "31061",
    "countryCode": "DE"
  },
  "coordinatesWGS84": {
    "latitude": 51.9840695,
    "longitude": 9.8236417
  }
}
```

***WARNING.*** The properties of a _location_ SHOULD NOT change once defined, they SHOULD be immutable, with the exception of of the `status` property that can be switched from `Active` to `Inactive`.

***IMPORTANT NOTICE.*** The _customer_ is responsible to retrieve the time zone (including UTC offsets and daylight saving time), of the _location_ if it would want to present a date and/or time in the local time zone of that _location_. As a reminder, dates and/or times within papiNet API are in UTC (formatted as in ISO 8601).

### Scenario C: Parties

An authenticated _customer_ gets the list of all active _parties_ defined for that _customer_ and then gets the details of a specific _party_.

#### Interaction 0 of Scenario C (Authentication)

See [above](#interaction-0-of-scenario-a-authentication).

#### Interaction 1 of Scenario C (List of Parties)

The authenticated _customer_ sends an API request in order to get the list of all active _parties_ defined:

```text
curl --request GET \
  --URL http://localhost:3020/parties?status=Active \
  --header 'X-Provider-State: Master_Data_Interaction_1_of_Scenario_C' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfParties": 1,
  "parties": [
    {
      "id": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
      "partyIdentifier": "ERP-P-NL-ACME-01",
      "partyTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",
      "nameLines": [
        "Sales Office Benelux",
        "Acme Netherlands Services BV"
      ],
      "countryCode": "NL"
    }
  ],
  "links": {
    "self": {
      "href": "/parties?offset=0&limit=5"
    },
    "next": {}
  }
}
```

#### Interaction 2 of Scenario C (Get the Details of a Specific Party)

At any time, the _customer_ can send an API request in order to get the details of a specific _location_ that has been defined:

```text
curl --request GET \
  --URL http://localhost:3020/parties/1e3e727b-815d-4b92-b6e8-5db3deb17c65 \
  --header 'X-Provider-State: Master_Data_Interaction_2_of_Scenario_C' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "id": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
  "partyIdentifier": "ERP-P-NL-ACME-01",
  "partyTimestamp": "2023-06-21T13:45:00Z",
  "status": "Active",
  "nameLines": [
    "Sales Office Benelux",
    "Acme Netherlands Services BV"
  ],
  "address": {
    "addressLines": [
      "Biesenweg 16"
    ],
    "city": "Maastricht",
    "postalCode": " 6211 AA",
    "countryCode": "NL"
  }
}
```

***WARNING.*** The properties of a _party_ SHOULD NOT change once defined, they SHOULD be immutable, with the exception of of the `status` property that can be switched from `Active` to `Inactive`.

### Scenario D: Customer-Article (by customerArticleNumber)

An authenticated _customer_ retrieves the UUID of a _customer-article_ based on its `customerArticleNumber`.

#### Interaction 0 of Scenario D (Authentication)

See [above](#interaction-0-of-scenario-a-authentication).

#### Interaction 1 of Scenario D (Retrieve UUID by customerArticleNumber)

The authenticated _customer_ sends an API request in order to retreive the UUID of a _customer-article_ based on its `customerArticleNumber`:

```text
curl --request GET \
  --URL http://localhost:3020/customer-articles?customerArticleNumber=ERP-GA-BS-65-1000-1000 \
  --header 'X-Provider-State: Master_Data_Interaction_1_of_Scenario_D' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfCustomerArticles": 1,
  "customerArticles": [
    {
      "id": "b4a28c7e-95d9-43a6-a82a-ed1c807124b9",
      "customerArticleNumber": "ERP-GA-BS-65-1000-1000",
      "customerArticleTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",
      "sellerProductBrandName": "Advertising Paper",
      "sellerProductName": "Advertising Paper Brite",
      "productType": "Paper"
    }
  ],
  "links": {
    "self": {
      "href": "/customer-articles?customerArticles.id=b4a28c7e-95d9-43a6-a82a-ed1c807124b9"
    },
    "next": {}
  }
}
```

### Scenario E: Location (by locationIdentifier)

#### Interaction 0 of Scenario E (Authentication)

See [above](#interaction-0-of-scenario-a-authentication).

#### Interaction 1 of Scenario E (Retrieve UUID by locationIdentifier)

The authenticated _customer_ sends an API request in order to retreive the UUID of a _location_ based on its `locationIdentifer`:

```text
curl --request GET \
  --URL http://localhost:3020/locations?locationsIdentifier=ERP-L-DE-ACME-01 \
  --header 'X-Provider-State: Master_Data_Interaction_1_of_Scenario_E' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfLocations": 1,
  "locations": [
    {
      "id": "8a69e22b-9a8c-4585-a8f9-7fbce8de7c73",
      "locationIdentifier": "ERP-L-DE-ACME-01",
      "locationTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",
      "nameLines": [
        "Acme Alfeld GmbH"
      ],
      "countryCode": "DE"
    }
  ],
  "links": {
    "self": {
      "href": "/locations?locationsIdentifier=ERP-L-DE-ACME-01"
    }
  }
}
```

### Scenario F: Party (by locationIdentifier)

#### Interaction 0 of Scenario F (Authentication)

See [above](#interaction-0-of-scenario-a-authentication).

#### Interaction 1 of Scenario F (Retrieve UUID by partyIdentifier)

The authenticated _customer_ sends an API request in order to retreive the UUID of a _party_ based on its `partyIdentifer`:

```text
curl --request GET \
  --URL http://localhost:3020/parties?partyIdentifier=ERP-P-NL-ACME-01 \
  --header 'X-Provider-State: Master_Data_Interaction_1_of_Scenario_F' \
  --header 'Authorization: Bearer a4f071c3-fe1f-4a45-9eae-07ddcb5bed26'
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfParties": 1,
  "parties": [
    {
      "id": "1e3e727b-815d-4b92-b6e8-5db3deb17c65",
      "partyIdentifier": "ERP-P-NL-ACME-01",
      "partyTimestamp": "2023-06-21T13:45:00Z",
      "status": "Active",
      "nameLines": [
        "Sales Office Benelux",
        "Acme Netherlands Services BV"
      ],
      "countryCode": "NL"
    }
  ],
  "links": {
    "self": {
      "href": "/parties?partieIdentifier=ERP-P-NL-ACME-01"
    }
  }
}
```
