<!-- Copyright 2000-2024 Papinet SNC ("papiNet") the "Copyright Owner". All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign. For support, more information, or to report implementation bugs, please contact papiNet at https://github.com/papinet. -->

# papiNet JSON Style Guide

## Introduction

This style guide documents guidelines and recommendations for designing JSON structures for the papiNet API. It clarifies and standardizes specific cases so that all JSON structures used by the papiNet API have a standard look and feel. These guidelines are applicable to JSON requests and responses.

## Definitions

For the purposes of this style guide, papiNet defines the following terms:

* **_property_** - a name/value pair inside a JSON object.
* **_property name_** - the name portion of the property, also called **_key_**.
* **_property value_** - the value portion of the property, sometimes simply called **_value_**.

So, within the following example:

```json
{
  "propertyName": "propertyValue",
  "anotherPropertyName": "anotherPropertyValue"
}
```

It's the `"propertyName": "propertyValue"` part, that papiNet calls a _property_.

## Design Rules

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119).

### Rule 0 - Naming convention for properties

If the context is clearly given by the parent, DO NOT repeat the context in the property name; If the context is NOT adequately given by the parent, then DO give the context in the property name up to what is necessary.

Let's give an example of each case:

* within `supplierOrders[]`, `supplierOrderNumber` should become `number` because its parent `supplierOrders[]` is giving the context.

* within `supplierOrders[]`, `purchaseOrderNumber` should NOT become `number` because its parent `supplierOrders[]` is NOT giving the right context, it is not the `number` (identifier) of the `supplierOrders[]`, but of the `number` (identifier) of `purchaseOrders[]`.

### Rule 1

papiNet restrict enumerated values to the minimum list that applies within the context. As a consequence, objects will be usually be defined **locally**! However, if a structure can be reuse whatever the context is, it could be defined globally.

### Rule 2 - How to handle empty collection

An empty collection MUST be communicated via the HTTP status code `204 No Content` and the response MUST NOT contain a response's body. This rule will be enforced by not allowing empty array in the non-empty response's body using `minItems: 1`.

### Rule 3 - minLength of property with type `string`

When papiNet defines a property with type `string` required, papiNet ALWAYS means that this property MUST communicate a non-empty information, therefore the constraint `minLength: 1` will always be added.

When a property with type `string` is not required and there is no information to be communicated, the property MUST NOT appear in the response's body. That rule will be enforced by always add the constraint `minLength: 1` to all properties with type `string`.

This `minLength: 1` constraint will not be added to the property with type `string` that already has such a constraint via `enum` or `format`. Of course, more restrictive constraint with more than 1 character minimum can be defined, but not less!

### Rule 4 - maxLength of property with type `string`

papiNet does not set a `maxLength` to all properties with type `string` driven by system technical constraints. papiNet only sets a `maxLength` to a property with type `string` when it is driven by a business constraint!

### Rule 5 - The response body always contains the full representation of the resource

The response body always contains the full representation of the resource, including the `id` even if it is already part of the request (usually conveyed by the URL).

### Rule 6 - Avoid lookup optimization

When a response contains the reference to something (e.g. a _seller-product_), it MUST only contain the identifier of that thing and any additional information MUST be retrieved via a subsequent lookup. There should not be any lookup optimization combining the identifier with additional information.

### Rule 7 - Array MUST be defined to have at least one element

When papiNet defines a property of type `array`, papiNet ALWAYS means that this array MUST have at least one element; therefore the constraint `minItems: 1` will always be added.

### Rule 8 - Response payload size SHOULD always be minimized

... (with the execption of the `id`)

### Rule 9 - UUID (only) as resource IDs

We MUST use UUID (only) for resource ID defined by the `id` property of every resource/entity/object.

When referring to another resource/entity/object we MUST also use this UUID only, therefore, to be able to know which type of resource/entity/object this UUID refers to, we MUST name of property or one of its ancestors including the type of resource/entity/object.

### Rule 10 - Properties with `...Timestamp` and `...DateTime` suffixes

We have two types of properties capturing date and time:

* The properties ending with the suffix `...Timestamp`: the MUST contain a date and time expressed in UTC, ending with the letter "Z", e.g. `2024-04-23T13:24:26.000Z`.
* The properties ending with the suffix `...DateTime`: they MUST contain a local date and time, in accordance with the ISO 8601 standard (preferably without explicit time-zone) for which the location is defined by the business context, excluding duration alone, but including intervals such as the following:
  - `2023-08-16T13:00/2023-08-18T13:00`
  - `2023-08-16/2023-08-18`
  - `2023-08-16T13:00/P2D`
  - `P2D/2023-08-18T13:00 `

### Rule 11 - JSON properties format

JSON properties MUST be written in lowerCamelCase names capitalize the first letter of each word, except the first which is always lowercase, **even if it's an acronym**. For instance, we have the property `coordinatesWgs84:` where `Wgs` stands for "World Geodetic System".

### Rule 12 - Avoid abbreviations

All names specified in path and query parameters, resource names, and JSON input and output fields and pre-defined values SHOULD NOT use abbreviations or acronyms.

However, we have decided, during papiNet CWG meeting 2024-06-19 (Wed), to make an exception with "unit of measure" that we will write `uom` or `(...)Uom`, instead of `unitOfMeasure` or `(...)UnitOfMeasure`.