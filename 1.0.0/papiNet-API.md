# papiNet API Semantic Specification

orderStatus:

* _**Active**_: The order is active when the _Supplier_ has processed it.
* _**Cancelled**_: The order is cancelled when all order line items are cancelled, the order will neither be produced nor shipped.
* _**Completed**_: The order is completed when order line items are either cancelled or completed, the order has been produced, shipped and invoiced.

orderLineItemStatus:

* _**Cancelled**_: The order line item is cancelled, it will neither be produced nor shipped.
* _**Completed**_: The  order line item is completed, it has been produced, shipped and invoiced.
* _**Confirmed**_: The order line item is confirmed, it will be produced, shipped and invoiced.
* _**Pending**_: The order line item is pending, it has neither been confirmed nor cancelled. This status indicates that the _Supplier_ requires more time to determine acceptance.
* _**ProductionCompleted**_: The order line item is fully stocked through a production or conversion process.
* _**ShipmentCompleted**_: The order line item is fully shipped.

quantityContext:

* _**Confirmed**_: The quantity is confirmed.
* _**Invoiced**_: The quantity is invoiced and qualified for compensation.
* _**Ordered**_: The quantity is the purchase order requested quantity.
* _**Produced**_: The quantity is added to stock through a production or conversion process.
* _**Shipped**_: The quantity is shipped, it has left the _Supplier_'s location.

quantityType:

* _**Area**_: The area that is the length multiplied by the width of the item.
* _**Count**_: The number of items.
* _**GrossWeight**_: The weight including all packaging and furnishing materials. The gross weight of the shipments includes tare weight.
* _**Length**_: The length of the item.
* _**NetNetWeight**_: The net weight of the product without any packaging and conversion components.
* _**NetWeight**_: The net weight of the product that may include certain conversion components, but does not include tare weight.
* _**NominalWeight**_: The calculated weight that is derived from other measurements. For example, the length of paper multiplied by the width of the paper and multiplied by the specified basis weight could be used to derive a nominal weight.
* _**TareWeight**_: The weight of the packaging and the furnishing materials.

quantityUOM:

* _**Bale**_: The value is expressed in number of bales.
* _**Box**_: The value is expressed in number of boxes.
* _**Centimeter**_: The value is expressed in centimetres.
* _**Decimeter**_: The value is expressed in decimetres.
* _**Foot**_: The value is expressed in feet.
* _**Gram**_: The value is expressed in grams.
* _**HundredPounds**_: The value is expressed in hundred of pounds.
* _**Inch**_: The value is expressed in inches.
* _**Kilogram**_: The value is expressed in kilograms.
* _**Kilometer**_: The value is expressed in kilometres.
* _**Meter**_: The value is expressed in metres.
* _**MetricTon**_: The value is expressed in metric tons. A metric ton is equal to 1000 kilogram.
* _**Millimeter**_: The value is expressed in millimetres.
* _**Package**_: The value is expressed in number of packages.
* _**PalletUnit**_: The value is expressed in number of pallets.
* _**Piece**_: The value is expressed in number of pieces.
* _**Pound**_: The value is expressed in pounds.
* _**PulpUnit**_: The value is expressed in number of pulp units. A pulp unit is related to the packaging characteristic or material handling equipment for pulp and normally contains several pulp bales.
* _**Ream**_: The value is expressed in number of reams.
* _**Reel**_: The value is expressed in number of reels.
* _**Sheet**_: The value is expressed in number of sheets.
* _**ShortTon**_: The value is expressed in short tons. A short ton is equal to 2000 pounds.
* _**Skid**_: The value is expressed in number of skids.
* _**SquareDecimeter**_: The value is expressed in square decimetres.
* _**SquareFoot**_: The value is expressed in square feet.
* _**SquareInch**_: The value is expressed in square inches.
* _**SquareMeter**_: The value is expressed in square metres.
* _**ThousandPieces**_: The value is expressed in thousand of pieces.
* _**ThousandSquareCentimeters**_: The value is expressed in thousand of square centimetres.
* _**ThousandSquareFeet**_: The value is expressed in thousand of square feet.
* _**ThousandSquareInches**_: The value is expressed in thousand of square inches.
* _**Yard**_: The value is expressed in yards.
