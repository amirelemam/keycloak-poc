# Keycloak POC

## Subindo o Keycloak
docker run --name keycloak -p 8081:8080 -d -e KEYCLOAK_USER=user -e KEYCLOAK_PASSWORD=change jboss/keycloak:6.0.1

## Configuração passo a passo
All examples use [HTTPie](https://httpie.org/)

1) Criar *realm* poc
2) Listar os endpoints para o *realm* poc
```
http :8081/auth/realms/poc/.well-known/uma2-configuration
```

3) Criar um clientId do tipo client_credentials
    * Menu *Clients*
    * Create
        * *Client ID:* poc-client
        * Clicar em salvar
    * Em *Client Protocol* selecionar *openid-connect* 
    * Em *Access Type*: selecionar *confidential*
    * Em *Authorization Enabled* selecionar *ON*
    * Em *Valid Redirect URIs* preencher com none
    * Salvar

4) Liberar acesso aos usuários
    * Acessar a aba *Service Account Roles*
    * Em *Client Roles* selecionar *realm-management*
    * Adicionar a role *manager-users*

5) Obter um access token para o client
    * A secret está na aba *Credentials* do client
    ```
    http --form :8081/auth/realms/poc/protocol/openid-connect/token grant_type=client_credentials -a poc-client:<secret>
    ```

6) Criar um usuário para o *realm* poc
    ``` 
    http :8081/auth/admin/realms/poc/users Authorization:"Bearer <ACCESS_TOKEN>" \
    enabled=true \
    email=poc@poc.com.br \
    username=Poc \
    firstName=Prova \
    lastName=Conceito \
    attributes:='{"phone":["11-1234-5678"], "address":"Av. Paulista, 1" }'
    ```

7) Lista usuários
    ```
    http :8081/auth/admin/realms/poc/users Authorization:"Bearer <ACCESS_TOKEN>"
    ```
    
8) Atribuir uma senha ao usuário
    ```
    http PUT :8081/auth/admin/realms/poc/users/<USER_ID>/reset-password Authorization:"Bearer <ACCESS_TOKEN>" \
    type=password \
    value=123456 \
    temporary=true
    ```

9) Criar o *client* para o frontend
    * Menu *Clients*
    * Create
        * *Client ID:* poc-js
        * *RootURL:* http://localhost:5000
        * *Client Protocol* selecionar *openid-connect*  
        * Clicar em salvar
        

## Iniciando o servidor
```
npm install
npm start
``` 

## Acesso
http://localhost:5000