# papiNet API Semantic Specification

orderStatus:

* _**Active**_: ...
* _**Cancelled**_: ...
* _**Completed**_: ...
* _**Pending**_: ...

orderLineItemStatus:

* _**ActiveFree**_: The PO, order, or line item has been accepted or confirmed by the supplier. It may not have been manufactured, packed, or shipped yet. It is free for production. This status is also known as open status.
* _**ActiveHold**_: The PO, order, or line item has been accepted or confirmed by the supplier. It may not have been manufactured, packed, or shipped yet. It is not free for production. Examples of this status include a reserved order or line item, the print time has not been determined, other payment terms not completed, or the last date for change has not been received.
* _**Cancelled**_: The PO, order, or line item has a cancelled status in the supplier’s system. It will not be manufactured nor shipped.
* _**Complete**_: The PO, order, or line item has a complete status in the supplier’s system. It has been packed, shipped, and invoiced successfully.
* _**Delayed**_: An unexpected event has caused a delay.
* _**OrderLineConfirmed**_: The order line has been confirmed.
* _**Pending**_: The PO, order, or line item has a pending status in the supplier’s system. It has not yet been confirmed, accepted, nor rejected by the suppler. This status indicates that the suppler requires more time to determine acceptance.
* _**ProductionComplete**_: The PO, order, or line item has completed the manufacture process by the supplier.
* _**ShipmentComplete**_: The order has been fully shipped.

quantityContext:

* _**CalledOff**_: A quantity put aside to be sent to the customer on a call off.
* _**Confirmed**_: ...
* _**Damaged**_: A quantity that has been damaged.
* _**Delivered**_: Delivered to the ship-to location.
* _**Intransit**_: A quantity that is undergoing the transportation process and is (usually) not available for immediate use.
* _**Invoiced**_: The number to be used when preparing the invoice.
* _**Ordered**_: A PurchaseOrder has been placed for the product.
* _**Produced**_: The quantity added to stock through a manufacturing or conversion process.

quantityType:

* _**Area**_: A number that represents the length multiplied by the width is being communicated.
* _**Count**_: The number of items.
* _**GrossWeight**_: The weight including all packaging and furnishing. The gross weight of the deliveries includes tare weight.

  > Note: In Forest Wood Supply business the quantity type GrossWeight is used in contexts when the weight of an item is not directly linked to a product. The gross weight of the item is then the weight before removal of rejects and other deductions. See also the definition of quantity type NetNetWeight.

* _**Length**_: The length of the object.
* _**NetNetWeight**_: The net weight of the product without any packaging or conversion materials.

  > Note: In Forest Wood Supply business the product specification defines what is included in this net weight, for example if rejects or other deductions are included or not. See also the definition of quantity type GrossWeight.

* _**NetWeight**_: The net weight of the product is being used, does not include tare weights. May include certain conversion components.

* _**NominalWeight**_: A calculated weight that is derived from another measurement. For example, the length of paper multiplied by the specified basis weight could be used to derive a nominal weight.
* _**TareWeight**_: The weight of the previously agreed to packaging and furnishing.
