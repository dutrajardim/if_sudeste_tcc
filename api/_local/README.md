# Procedimentos locais

Procedimentos para iniciar o ambiente de desenvolvimento

## Banco de dados

Para o banco de dados está sendo utilizado o DynamoDB em ambiente docker.
O comando que segue pode ser utilizado para levantar um banco sem persistencia, logo, quando finalizado não serão mantidos os dados.

```bash

docker run -p 8000:8000 amazon/dynamodb-local

```

Para criar a tabela de notificações, o seguinte comando pode ser utilizado a partir do diretório raiz do projeto.

```bash
aws dynamodb create-table \
  --cli-input-json file://./local/dynamodb/create-assistances-table.json \
  --endpoint-url http://localhost:8000
```

Para criar a tabela de conexões, o seguinte comando pode ser utilizado a partir do diretório raiz do projeto.

```bash
aws dynamodb create-table \
  --cli-input-json file://./local/dynamodb/create-connections-table.json \
  --endpoint-url http://localhost:8000
```

## Api Gateway

Para iniciar a API em ambiente local, os seguintes passos são recomendados:

1. Validação do template SAM, conforme comando abaixo:

```bash

sam validate -t stack.yaml --lint

```

2. Compilar a api:

```bash

sam build --use-container

```

3. Iniciar a API Gateway local:

```bash

sam local start-api --port 3001 --host 0.0.0.0 --env-vars local/env.json

```

4. Expor porta para web com ngrok

```bash
ngrok http 3001
```

4. Pegar jwt token

```bash
aws cognito-idp admin-initiate-auth --region sa-east-1 --cli-input-json file://auth.json
aws cognito-idp respond-to-auth-challenge --client-id <clientId> --challenge-name NEW_PASSWORD_REQUIRED --session <session-token> --challenge-responses "NEW_PASSWORD=dJ130587,USERNAME=rafaeldjardim@gmail.com"
```

5. Enviar mensagem

```bash
curl -i -X POST \
  http://192.168.100.65:3001/whatsapp/v16.0/101200309605682/messages \
  -H 'Content-Type: application/json' \
  -d '{ "messaging_product": "whatsapp", "to": "5531920079592", "type": "template", "template": { "name": "hello_world", "language": { "code": "en_US" } } }'
```


## Deploy do backend

```bash
sam deploy --guided --capabilities CAPABILITY_IAM CAPABILITY_AUTO_EXPAND
```