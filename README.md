# Keycloack POC


## Rodando
docker run --name keycloak -p 8081:8080 -d -e KEYCLOAK_USER=user -e KEYCLOAK_PASSWORD=change jboss/keycloak:6.0.1


## Configuração passo a passo
1) Criar realm Development
2) Listar os endpoints para Development
```
http :8081/auth/realms/development/.well-known/uma2-configuration
```

3) Criar um usuário admin para o realm de Development

4) Criar um clientId com Authorization enabled
    Criar com o nome frontend-js
    Em Root URL colocar o endereço da aplicação, para essa POC pode ser file://<caminho_completo_do_arquivo>

6) Autênticar com ele

TODO, não funcionou

http --form POST :8081/auth/realms/development/protocol/openid-connect/token grant_type=password username=ignacio83@gmail.com password=123456 -a orchestration-backend:eec4c271-9520-4459-ac71-323f1c906b65



X) Obter um token com esse client
```
http --form POST :8081/auth/realms/development/protocol/openid-connect/token grant_type=client_credentials -a orchestration-backend:eec4c271-9520-4459-ac71-323f1c906b65
```
