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

### Rule 1

Create as many "components" as needed in order to restrict the 'enumeration list' based on the context! It means that we will ALWAYS define LOCALLY the structure containing enumeration.
