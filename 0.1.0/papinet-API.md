# papiNet API Semantic Specification

orderStatus:

* _**Active**_: The order is confirmed by the supplier.
* _**Cancelled**_: The order is cancelled when all order line items are cancelled. It will not be produced nor shipped.
* _**Completed**_: The order is completed when all order line items are completed. It has been produced, shipped and invoiced.
* _**Pending**_: The order is pending when all order lines are pending. It has not yet been confirmed nor rejected by the supplier. This status indicates that the supplier requires more time to determine acceptance.

orderLineItemStatus:

* _**Cancelled**_: The order line item is cancelled. It will not be produced nor shipped.
* _**Completed**_: The  order line item is completed. It has been produced, shipped and invoiced.
* _**Confirmed**_: The order line item is confirmed by the supplier.
* _**Pending**_: The order line item is pending. It has not yet been confirmed nor rejected by the supplier. This status indicates that the supplier requires more time to determine acceptance.
* _**ProductionCompleted**_: The order line item is fully stocked through a production or conversion process by the supplier.
* _**ShipmentCompleted**_: The order line item is fully shipped.
 
quantityContext:

* _**Confirmed**_: The quantity confirmed by the supplier.
* _**Invoiced**_: The quantity invoiced and qualified for compensation.
* _**Ordered**_: The quantity ordered on the purchase order by the order issuer.
* _**Produced**_: The quantity added to stock through a production or conversion process.
* _**Shipped**_: The quantity shipped to the ship-to location.

quantityType:

* _**Area**_: The area that is the length multiplied by the width of the item.
* _**Count**_: The number of items.
* _**GrossWeight**_: The weight including all packaging and furnishing. The gross weight of the shipments includes tare weight.
* _**Length**_: The length of the item.
* _**NetNetWeight**_: The net weight of the product without any packaging and conversion components.
* _**NetWeight**_: The net weight of the product that may include certain conversion components, but does not include tare weight.
* _**NominalWeight**_: The calculated weight that is derived from another measurements. For example, the length of paper multiplied by the width of the paper and multiplied by the specified basis weight could be used to derive a nominal weight.
* _**TareWeight**_: The weight of the packaging and the furnishing materials.

quantityUOM:

* _**Bale**_: The value is expressed in number of bales.
* _**Box**_: The value is expressed in number of boxes.
* _**Centimeter**_: The value is expressed in centimetres.
* _**Decimeter**_: The value is expressed in decimetres.
* _**Foot**_: The value is expressed in feet.
* _**Gram**_: The value is expressed in grams.
* _**HundredPound**_: The value is expressed in hundred of pounds.
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
* _**SquareFeet**_: The value is expressed in square feet.
* _**SquareInch**_: The value is expressed in square inches.
* _**SquareMeter**_: The value is expressed in square metres.
* _**ThousandPieces**_: The value is expressed in thousand of pieces.
* _**ThousandSquareCentimeters**_: The value is expressed in thousand of square centimetres.
* _**ThousandSquareFeet**_: The value is expressed in thousand of square feet.
* _**ThousandSquareInch**_: The value is expressed in thousand of square inches.
* _**Yard**_: The value is expressed in yards.
