#! /usr/bin/env bash

printf "Interaction 2 of Scenario A: "

response=$(curl --silent --show-error --request POST \
  --URL http://localhost:3004/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6/check-availability \
  --header 'X-Provider-Sate: Interaction 2 of Scenario A' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json')

echo "${response}" | jq . > scenario-a-interaction-2.json

output=$(openapi-examples-validator ../papiNet-API.yaml \
  -s $.paths./seller-products/{sellerProductId}/check-availability.post.responses.200.content.application/json.schema \
  -e scenario-a-interaction-2.json)

if [[ $output == *"No errors found."* ]]; then printf "PASSED.\n"; else printf "FAILED.\n"; fi

printf "Interaction 3 of Scenario A: "

response=$(curl --silent --show-error --request GET \
  --URL http://localhost:3004/locations/578e5b28-3ce0-4952-a2a9-bf2eec3ad7a5 \
  --header 'X-Provider-Sate: Interaction 3 of Scenario A' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json')

echo "${response}" | jq . > scenario-a-interaction-3.json

output=$(openapi-examples-validator ../papiNet-API.yaml \
  -s $.paths./locations/{locationId}.get.responses.200.content.application/json.schema \
  -e scenario-a-interaction-3.json)

if [[ $output == *"No errors found."* ]]; then printf "PASSED.\n"; else printf "FAILED.\n"; fi

printf "Interaction 2 of Scenario B: "

response=$(curl --silent --show-error --request POST \
  --URL http://localhost:3004/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6/check-availability \
  --header 'X-Provider-Sate: Interaction 2 of Scenario B' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json')

echo "${response}" | jq . > scenario-b-interaction-2.json

output=$(openapi-examples-validator ../papiNet-API.yaml \
  -s $.paths./seller-products/{sellerProductId}/check-availability.post.responses.200.content.application/json.schema \
  -e scenario-b-interaction-2.json)

if [[ $output == *"No errors found."* ]]; then printf "PASSED.\n"; else printf "FAILED.\n"; fi

printf "Interaction 3 of Scenario B: "

response=$(curl --silent --show-error --request GET \
  --URL http://localhost:3004/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008 \
  --header 'X-Provider-Sate: Interaction 3 of Scenario B' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json')

echo "${response}" | jq . > scenario-b-interaction-3.json

output=$(openapi-examples-validator ../papiNet-API.yaml \
  -s $.paths./locations/{locationId}.get.responses.200.content.application/json.schema \
  -e scenario-b-interaction-3.json)

if [[ $output == *"No errors found."* ]]; then printf "PASSED.\n"; else printf "FAILED.\n"; fi

printf "Interaction 4 of Scenario B: "

response=$(curl --silent --show-error --request GET \
  --URL http://localhost:3004/locations/8a69e22b-9a8c-4585-a8f9-7fbce8de7c73 \
  --header 'X-Provider-Sate: Interaction 4 of Scenario B' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json')

echo "${response}" | jq . > scenario-b-interaction-4.json

output=$(openapi-examples-validator ../papiNet-API.yaml \
  -s $.paths./locations/{locationId}.get.responses.200.content.application/json.schema \
  -e scenario-b-interaction-4.json)

if [[ $output == *"No errors found."* ]]; then printf "PASSED.\n"; else printf "FAILED.\n"; fi

printf "Interaction 2 of Scenario C: "

response=$(curl --silent --show-error --request POST \
  --URL http://localhost:3004/seller-products/e7bfd8a6-edde-48ab-b304-b7d4f1d007a6/check-availability \
  --header 'X-Provider-Sate: Interaction 2 of Scenario C' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json')

echo "${response}" | jq . > scenario-c-interaction-2.json

output=$(openapi-examples-validator ../papiNet-API.yaml \
  -s $.paths./seller-products/{sellerProductId}/check-availability.post.responses.200.content.application/json.schema \
  -e scenario-c-interaction-2.json)

if [[ $output == *"No errors found."* ]]; then printf "PASSED.\n"; else printf "FAILED.\n"; fi

printf "Interaction 3 of Scenario C: "

response=$(curl --silent --show-error --request GET \
  --URL http://localhost:3004/locations/4cc7b1ba-6278-4a56-9ee2-ad316950c008 \
  --header 'X-Provider-Sate: Interaction 3 of Scenario C' \
  --header 'Host: papinet.papinet.io' \
  --header 'Authorization: Bearer '$ACCESS_TOKEN \
  --header 'Content-Type: application/json')

echo "${response}" | jq . > scenario-c-interaction-3.json

output=$(openapi-examples-validator ../papiNet-API.yaml \
  -s $.paths./locations/{locationId}.get.responses.200.content.application/json.schema \
  -e scenario-c-interaction-3.json)

if [[ $output == *"No errors found."* ]]; then printf "PASSED.\n"; else printf "FAILED.\n"; fi
