# papiNet JSON Style Guide

## Introduction

This style guide documents guidelines and recommendations for designing JSON structures for the papiNet API. It clarifies and standardizes specific cases so that all JSON structures used by the papiNet API have a standard look and feel. These guidelines are applicable to JSON requests and responses.

## Definitions

For the purposes of this style guide, we define the following terms:

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

It's the `"propertyName": "propertyValue"` part, that we call a _property_.

## Design Rules

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119](https://datatracker.ietf.org/doc/html/rfc2119).

### Rule 1

We want to restrict enumerated values to the minimum list that applies within the context. As a consequence, we will always define objects **locally**!

### Rule 2 - How to handle empty collection

An empty collection MUST be communicated via the HTTP status code `204 No Content` and the response MUST NOT contain a response's body. We will enforce that rule by not allowing empty array in the non-empty response's body using `minContains: 1` (new in JSON Schema New in draft 2019-09) when it will be supported by OpenAPI.
