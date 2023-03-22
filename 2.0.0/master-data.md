# Master Data Use Case

## Context

This use case is designed for Paper business.

> Recovered paper is not included within our definition of Paper business.

## Definition

The distinction we make between the concepts _product_ and _article_ is essential to the understanding of our papiNet API endpoints.

A **_product_** is owned and defined by the _seller_. It has several properties such as the `basisWeight`, the `width`, a certain percentage of `recycled` material, and so on. Usually, some of these properties may have multiple possible values, for instance you could choose the `basisWeight` of your paper from a list of values: 35 g/m², 39 g/m², 42 g/m², ...

An **_article_** is owned and defined by the _customer_. Typically, a _customer_ specifies an individual _article_ from a _product_ in order to narrow down the various properties that may have multiple potential values, ultimately settling on a single value for each. For now, our assumption is that each property of the _article_ will have only one value, but this may change in the future.

In order to show that important distinction within the API itself, we will always use the word _product_ together with _seller_ creating the hyphenated word **_seller-product_**, and the word _article_ will always be used with _customer_ creating **_customer-article_**.

While the hyphenated terms _seller-product_ and _customer-article_ may sound redundant, we have found them to be a useful tool for reinforcing the distinction between _product_ and _article_ within the API endpoints.

A **_location_** is defined as a physical place where a business process or activity takes place or where a physical asset is located. A _location_ can be a building, room, area, or geographic region, and can be associated with various types of assets, such as equipment, inventory, or people.

A **_party_** is defined as any individual, organization, or system that has a relationship or role in a particular business process or activity. _Parties_ can include customers, suppliers, partners, employees, and other stakeholders who participate in the business process.

## Preconditions

Our initial approach will be to start with a simplified operational structure, which assumes that the _seller_ has already defined the necessary _customer-articles_, _parties_, and _locations_ required for the business transactions, by another means than API.

It should be noted that for now, this simplified operational structure excludes the step of defining _customer-articles_ from _seller-products_, which is assumed to have already been completed by the _seller_ prior to the start of the business transactions.

## Process

And authenticated _customer_ requests to the _seller_ the list of _customer-articles_ that have been created.

The authenticated _customer_ requests to the _seller_ the details of a specific _customer-article_ that have been created.

The authenticated _customer_ requests to the _seller_ the list of _locations_ that have been defined.

The authenticated _customer_ requests to the _seller_ the details of a specific _location_ that have been defined.

The authenticated _customer_ requests to the _seller_ the list of _parties_ that have been defined.

The authenticated _customer_ requests to the _seller_ the details of a specific _party_ that have been defined.

## Domain Name

We suggest that the _seller_ exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _seller_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

## Authentication

For authenticating the _customer_, we recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _customer_ sends an API request to create a session, and gets its associated _access token_:

```text
curl --request POST \
  --URL http://localhost:2000/tokens \
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

## Scenarios

* Scenario A - An authenticated _customer_ gets the list of all _customer-articles_ created for that _customer_ and then gets the details of a specific _customer-article_.

* Scenario B - An authenticated _customer_ gets the list of all _locations_ defined for that _customer_ and then gets the details of a specific _location_.

* Scenario C - An authenticated _customer_ gets the list of all _parties_ defined for that _customer_ and then gets the details of a specific _party_.

### Scenario A

An authenticated _customer_ gets the list of all _customer-articles_ created for that _customer_ and then gets the details of a specific _customer-article_.

#### Interaction 1 of Scenario A (Authentication)

The _customer_ sends an API request to the _seller_ in order to be authenticated, and gets an _access_token_:

```text
curl --request POST \
  --URL http://localhost:2000/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "accessToken": "a4f071c3-fe1f-4a45-9eae-07ddcb5bed26",
  "expiresIn": 86400, 
  "tokenType": "bearer", 
}
```

In order to re-use the value of the `access_token` in subsequent API requests, it is convenient to save it into an environment variable:

```text
ACCESS_TOKEN=$(curl --request POST \
  --URL http://localhost:2000/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials' | jq -r '.access_token')
```

You can easily verify the value of the `ACCESS_TOKEN` environment variable using:

```text
$ echo $ACCESS_TOKEN
a4f071c3-fe1f-4a45-9eae-07ddcb5bed26
```

#### Interaction 2 of Scenario A (List of Customer-Articles)

The authenticated _customer_ sends an API request in order to get the list of all _customer-articles_ created:

```text
curl --request GET \
  --URL http://localhost:2000/customer-articles \
  --header 'Authorization: Bearer '$ACCESS_TOKEN
```

If all goes well, the _customer_ will receive a response like this:

```json
{
  "numberOfCustomerArticle": 2,
  "customerArticle": [
    {
      "id": "/customer-articles/7bfd8a6-edde-48ab-b304-b7d4f1d007a6",
      "sellerProductBrandName": "Galerie",
      "sellerProductName": "Galerie Brite",
      "customerArticleNumber: "My-Galerie-Brite-54",
      "productType": "Paper"
    },
    {}
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