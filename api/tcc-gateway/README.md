# tcc-gateway

docker run -p 8000:8000 amazon/dynamodb-local

aws dynamodb create-table \
  --cli-input-json file://./dynamodb/create-tcc-contact-requests-table.json \
  --endpoint-url http://localhost:8000


aws dynamodb scan --table-name tcc_ContactRequests \
    --endpoint-url http://localhost:8000

aws dynamodb delete-table --table-name tcc_ContactRequests \
    --endpoint-url http://localhost:8000

sam local invoke postContactRequest --event events/event-post-contact-request.json --env-vars env.json