<!-- markdownlint-disable MD041 -->

![papiNet Logo](./papinet-logo.jpg)

# papiNet API

[papiNet](http://www.papinet.org) is a global paper, forest products and bioproducts industry **e-Business initiative**, which has started in October 2000! papiNet consists of an **XML set of standard electronic documents** that facilitates the flow of information among parties engaged in buying, selling, and distribution of paper, forest and bio related products.

[papiNet API](https://github.com/papinet/papiNet-API) is a new initiative that aim to deliver a similar industry level standardization of a **REST API** that facilitates the flow of information among parties engaged in buying, selling, and distribution of paper, forest and bio related products.

## Use Case Driven

For this new flavour of the papiNet standard, we have decided to adopt an agile way of working, delivering the papiNet API definition iteratively based on specific use cases.

### Master Data Use Case

The following API endpoints allows a _customer_ to get master data information such as _customer-articles_, _locations_ and _parties_ from a _seller_:

* `GET /customer-articles`
* `GET /customer-articles/{customerArticleId}`
* `GET /locations`
* `GET /locations/{locationId}`
* `GET /parties`
* `GET /parties/{partyId}`

### Purchase Order Use Case

The following API endpoints allows a _customer_ to send, list, reterieve and modify _purchase-orders_ for the _seller_:

* `POST /purchase-orders`
* `GET /purchase-orders`
* `GET /purchase-orders/{purchaseOrderId}`
* `PATCH /purchase-orders/{purchaseOrderId}`

## The papiNet API Standard

The following normative documents are available:

* [`papiNet-API.yaml`](2.0.0/papiNet-API.yaml) the OpenAPI document describing the papiNet API. This is the main normative document.
* [`papiNet-API.md`](2.0.0/papiNet-API.md) the semantic specification of the main objects and properties used within the OpenAPI document.

In addition to these normative documents, we also have a papiNet mock service that provides live responses in line with the scenarios described within the use case documents.
