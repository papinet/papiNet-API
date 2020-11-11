<!-- markdownlint-disable MD041 -->
![papiNet Logo](./papinet-logo.jpg)

# papiNet API

[papiNet](http://www.papinet.org) is a global paper, forest products and bioproducts industry **e-Business initiative**, which has started in October 2000! papiNet consists of an **XML set of standard electronic documents** that facilitates the flow of information among parties engaged in buying, selling, and distribution of paper, forest and bio related products.

[papiNet API](https://github.com/papinet/papiNet-API) is a new initiative that aim to deliver a similar industry level standardization of a **REST API** that facilitates the flow of information among parties engaged in buying, selling, and distribution of paper, forest and bio related products.

## Use Case Driven

For this new flavor of the papiNet standard, we have decided to adopt an agile way of working, delivering the papiNet API definition iteratively based on specific use cases.

### Order Status

The first use case we have decided to examine is the [_Order Status_](1.0.0/order-status.md), starting with the very simple scenario in which a _Buyer_ requests to the _Supplier_ the status of one or multiple of its _Orders_.

## The papiNet API Standard

The following normative documents are available:

- `papiNet-API.yaml` the OpenAPI document describing the papiNet API. This is the main normative document.
- `papiNet-API.md` the semantic specification of all the objects and attributes used within the OpenAPI document.

In addition to these normative documents, we also provide a papiNet mock service that give live response in line with the different scenarios described within the use case documents.

## Contributing

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for more information on contributing to the papiNet API standard.
