Copyright 2000 - 2026 the Confederation of European Paper Industries AISBL ("papiNet") the "Copyright Owner". All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign. For support, more information, or to report implementation bugs, please contact papiNet at https://github.com/papinet. <br/><br/>


<!-- markdownlint-disable MD041 -->

![papiNet Logo](./papinet-logo.png)

# papiNet API

[papiNet](http://www.papinet.org) is a global paper, forest products and bioproducts industry **e-Business initiative**, started in year 2000. papiNet consists of an **XML set of standard electronic documents** that facilitates the flow of information among parties engaged in buying, selling, and distribution of paper, forest and bio related products.

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

The following API endpoints allows a _customer_ to send, list, retrieve and modify _purchase-orders_ for the _seller_:

* `POST /purchase-orders`
* `GET /purchase-orders`
* `GET /purchase-orders/{purchaseOrderId}`
* `PATCH /purchase-orders/{purchaseOrderId}`

### Warehouse Logistics Use Case

The following API endpoints allows a _supplier_ to communicate to a _logistics supplier_:

* `GET /supplier-orders`
* `GET /supplier-orders/{supplierOrderId}`
* `GET /logistics-delivery-notes`
* `GET /logistics-delivery-notes/{logisticsDeliveryNoteId}`
* `POST /logistics-delivery-notes`
* `PUT /logistics-delivery-notes/{logisticsDeliveryNoteId}`
* `POST /logistics-goods-receipts`
* `PUT /logistics-goods-receipts/{logisticsGoodsReceiptId}`
* `GET /logistics-delivery-instructions`
* `GET /logistics-delivery-instructions/{deliveryInstructionId}`

### Warehouse Logistics Inventory Change Use Case

The following API endpoints allows a _supplier_ to communicate inventory changes with a _logistics supplier_:

* `GET /logistics-inventory-changes`
* `GET /logistics-inventory-changes/{logisticsInventoryChangeId}`
* `POST /logistics-inventory-changes`

## The papiNet API Standard

The following normative document is available:

* [`papiNet-API.yaml`](4.0.0/papiNet-API.yaml) the OpenAPI document describing the papiNet API. This is the main normative document.

In addition to these normative documents, papiNet also has a **papiNet stub service** that provides live responses in line with the scenarios described within the use case documents.
