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

### Rule 1

papiNet restrict enumerated values to the minimum list that applies within the context. As a consequence, objects will always be defined **locally**!

### Rule 2 - How to handle empty collection

An empty collection MUST be communicated via the HTTP status code `204 No Content` and the response MUST NOT contain a response's body. This rule will be enforced by not allowing empty array in the non-empty response's body using `minContains: 1` (new in JSON Schema New in draft 2019-09) when it will be supported by OpenAPI.

### Rule 3 - minLength of property with type `string`

When papiNet defines a property with type `string` required, papiNet ALWAYS means that this property MUST communicate a non-empty information, therefore the constraint `minLength: 1` will always be added.

When a property with type `string` is not required and there is no information to be communicated, the property MUST NOT appear in the reponse's body. That rule will be enforced by always add the constraint `minLength: 1` to all properties with type `string`.

This `minLength: 1` constraint will not be added to the property with type `string` that already has such a contraint via `enum` or `format`. Of course, more restrictive constraint with more than 1 character minimum can be defined, but not less!

### Rule 4 - maxLength of property with type `string`

papiNet does not set a `maxLength` to all properties with type `string` driven by system technical constraints. papiNet only sets a `maxLength` to a property with type `string` when it is driven by a business contraint!
