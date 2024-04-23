# papiNet API Semantic Specification

product.gradeCode: The product identifier for a not-fully-defined product.

product.articleNumber: The product identifier for a fully-defined product.

quantities[].context:

* _**Confirmed**_: The quantity is confirmed.
* _**InTransit**: The quantity is transported to a stock location and has not yet arrived.
* _**Invoiced**_: The quantity is invoiced and qualified for compensation.
* _**OnHand**_: The quantity is available without any restrictions.
* _**Ordered**_: The quantity is the purchase order requested quantity.
* _**PlannedProduction**_: The quantity is planned for production.
* _**Produced**_: The quantity is added to stock through a production or conversion process.
* _**Reserved**_: The quantity is reserved for one or multiple customers, but might be freed up later in the future.
* _**Shipped**_: The quantity is shipped, it has departed the _Supplier_'s location.

quantities[].type:

* _**Area**_: The area that is the length multiplied by the width of the item.
* _**Count**_: The number of items.
* _**GrossWeight**_: The weight including all packaging and furnishing materials. The gross weight of the shipments includes tare weight.
* _**Length**_: The length of the item.
* _**NetNetWeight**_: The net weight of the product without any packaging and conversion components.
* _**NetWeight**_: The net weight of the product that may include certain conversion components, but does not include tare weight.
* _**NominalWeight**_: The calculated weight that is derived from other measurements. For example, the length of paper multiplied by the width of the paper and multiplied by the specified basis weight could be used to derive a nominal weight.
* _**TareWeight**_: The weight of the packaging and the furnishing materials.

quantities[].unitOfMeasure:

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
