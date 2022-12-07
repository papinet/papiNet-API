<!-- markdownlint-disable MD041 -->

![papiNet Logo](./papinet-logo.jpg)

# papiNet API

[papiNet](http://www.papinet.org) is a global paper, forest products and bioproducts industry **e-Business initiative**, which has started in October 2000! papiNet consists of an **XML set of standard electronic documents** that facilitates the flow of information among parties engaged in buying, selling, and distribution of paper, forest and bio related products.

[papiNet API](https://github.com/papinet/papiNet-API) is a new initiative that aim to deliver a similar industry level standardization of a **REST API** that facilitates the flow of information among parties engaged in buying, selling, and distribution of paper, forest and bio related products.

## Use Case Driven

For this new flavour of the papiNet standard, we have decided to adopt an agile way of working, delivering the papiNet API definition iteratively based on specific use cases.

### Order Status

The first use case we have decided to examine is the [_Order Status_](1.3.0/order-status.md), starting with the very simple scenario in which a _customer_ is interested to get the status of one or multiple of its _orders_ previously sent to the _seller_. With this first use case, we have introduced the first 3 API endpoints of the papiNet API:

* `POST /tokens`
* `GET /orders`
* `GET /orders/{orderId}`

### Shipment Status

We complemented the _papiNet API_ with new _API endpoints_ in order to introduce the [_Shipment Status_](1.3.0/shipment-status.md) use case:

* `GET /shipments`
* `GET /shipments/{shipmentId}`

### Catalogue

Then, we add 8 new _API endpoints_ to the _papiNet API_ in order to support the [_Catalogue_](1.3.0/catalogue.md) use case:

* `GET /seller-products`
* `GET /seller-products/{sellerProductId}`
* `POST /customer-articles`
* `PATCH /customer-articles/{customerArticleId}`
* `GET /customer-articles`
* `GET /customer-articles/{customerArticleId}`
* `DELETE /customer-articles/{customerArticleId}`

### Availability

We completed the _papiNet API_ with the 3 following new _API endpoints_ in order to introduce the [_Availability_](1.3.0/availability.md) use case:

* `POST /seller-products/{sellerProductId}/check-availability`
* `POST /customer-articles/{customerArticleId}/check-availability`
* `GET  /locations/{locationId}`

## The papiNet API Standard

The following normative documents are available:

* [`papiNet-API.yaml`](1.3.0/papiNet-API.yaml) the OpenAPI document describing the papiNet API. This is the main normative document.
* [`papiNet-API.md`](1.3.0/papiNet-API.md) the semantic specification of the main objects and properties used within the OpenAPI document.

In addition to these normative documents, we also have a papiNet mock service that provides live responses in line with the scenarios described within the use case documents.
