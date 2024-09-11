<!-- papiNet materials are covered by the following copyright statements Copyright 2021-2024 papiNet G.I.E (papiNet). All rights reserved by the Copyright Owner under the laws of the United States, Belgium, the European Economic Community, and all states, domestic and foreign. -->

# Paper, Board and Pulp Warehouse Logistics Use case

## Context

This use case is designed for _Paper, Board and Pulp_ business.

## Simplification

For now, we only consider a simplified version of the business interactions between only two types of parties: the _logistics supplier_ and the _supplier_ where the _supplier_ will host the client calling the papiNet API endpoints implemented by the _supplier_.

## Definitions

N/A

## Domain Name

We suggest that the _supplier_ (as well as the _logistics supplier_ if it uses the notification mechanism) exposes the papiNet API endpoints using the domain name of its corporate web side with the prefix `papinet.*`. For instance, if the _supplier_ is the company **ACME** using `acme.com` for its corporate web site, they SHOULD then expose the papiNet API endpoints on the domain `papinet.acme.com`.

## Notifications

In order to get updated information on _suppier-orders_, _logistics delivery notes_ and _delivery instructions_ the _logistic suppliers_ have to call API endpoints of the _supplier_. As the _logistics suplliers_ do not know when these informations are getting updated, they should normally poll these API endpoints on a regular basis.

This polling mechanism is not optimal from an IT resources point of view, that's why we recommend the usage of notifications from the _logistics suppliers_ to the _supplier_. However, as the usage of these notifications would require additional investment on the _logistic supplier_ side, they remain an optional optimization.

For the implementation of these notifications, we recommend to use the [CloudEvents](https://cloudevents.io/) specification, which is a vendor-neutral specification for defining the format of event data. In order to ensure the decoupling between this notification mechanism and the papiNet API, we will use the CloudEvents specification following the **_thin event_** pattern. (...)

## papiNet Stub Service

You can run locally the papiNet stub service using the following command:

```text
./mock/pact-stub-server --file ./mock/papiNet.PACT.json --port 3030 --provider-state-header-name X-Provider-State
```

## Authentication

For authenticating the _logistic supplier_, we recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _logistic supplier_ sends an API request to create a session, and gets its associated _access token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _logistic supplier_ will receive a response like this:

```json
{ 
  "access_token": "1a27ae3f-02f3-4355-8a70-9ed547d0ccf8",
  "token_type": "bearer",
  "expires_in_": 86400
}
```

## Scenarios

**Scenario A:** Good Weather Flow

1.
2.
3.
4.
5.
6.
7.
8.

**Scenario B:** Bad Weather Fow (the one Petter and Bo-Goran have already done)

1.
2.
3.
4.
5.
6.
7.
8.
9.
10.

### ...

This part will be generated from the instance files.