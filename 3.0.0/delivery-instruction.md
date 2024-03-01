# Delivery Instruction

## Scenarios

**Scenario A:** Delivery Instruction

1. An authenticated _logistics supplier_ gets the list of all active _supplier-orders_.
2. An authenticated _logistics supplier_ gets the details of a specific _customer-article_.

### Scenario A: 

#### Interaction 0 of Scenario A (Authentication)

#### Interaction 1 of Scenario A (Get the list Delivery Instruction)


## Authentication

For authenticating the _customer_, we recommend to secure the access to the papiNet API endpoints using the OAuth 2.0 standard, with the _client credentials_ authorization grant.

The _customer_ sends an API request to create a session, and gets its associated _access token_:

```text
curl --request POST \
  --URL http://localhost:3020/tokens \
  --user 'public-36297346:private-ce2d3cf4' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials'
```

If all goes well, the _customer_ will receive a response like this:

```json
{ 
  "access_token": "1a27ae3f-02f3-4355-8a70-9ed547d0ccf8",
  "token_type": "bearer",
  "expires_in_": 86400
}
```