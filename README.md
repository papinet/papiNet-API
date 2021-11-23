<!-- markdownlint-disable MD041 -->
![papiNet Logo](./papinet-logo.jpg)

# papiNet API

[papiNet](http://www.papinet.org) is a global paper, forest products and bioproducts industry **e-Business initiative**, which has started in October 2000! papiNet consists of an **XML set of standard electronic documents** that facilitates the flow of information among parties engaged in buying, selling, and distribution of paper, forest and bio related products.

[papiNet API](https://github.com/papinet/papiNet-API) is a new initiative that aim to deliver a similar industry level standardization of a **REST API** that facilitates the flow of information among parties engaged in buying, selling, and distribution of paper, forest and bio related products.

## Use Case Driven

For this new flavour of the papiNet standard, we have decided to adopt an agile way of working, delivering the papiNet API definition iteratively based on specific use cases.

### Order Status

The first use case we have decided to examine is the [_Order Status_](1.2.0/order-status.md), starting with the very simple scenario in which an _Order Issuer_ is interested to get the status of one or multiple of its _Orders_ previously sent to the _Supplier_. This use case is from the Pulp and Paper business.

### Shipment Status

We complemented the _papiNet API_ with new _API endpoints_ in order to introduce the [_Shipment Status_](1.2.0/shipment-status.md) use case.

### Catalogue

Then, we add 8 new _API endpoints_ to the _papiNet API_ in order to support the [_Catalogue_](1.2.0/catalogue.md) use case.

## The papiNet API Standard

The following normative documents are available:

- [`papiNet-API.yaml`](1.2.0/papiNet-API.yaml) the OpenAPI document describing the papiNet API. This is the main normative document.
- [`papiNet-API.md`](1.2.0/papiNet-API.md) the semantic specification of the main objects and properties used within the OpenAPI document.

In addition to these normative documents, we also provide a papiNet mock service that give live responses in line with the scenarios described within the use case documents.
