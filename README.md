# Keycloak POC

## Subindo o Keycloak

```
docker run --name keycloak -p 8081:8080 -d -e KEYCLOAK_USER=user -e KEYCLOAK_PASSWORD=change jboss/keycloak:6.0.1
```

## Configuração passo a passo

<!-- All examples use [HTTPie](https://httpie.org/) -->

1. Criar _realm_ poc
2. Listar os endpoints para o _realm_ poc

```
GET localhost:8081/auth/realms/poc/.well-known/uma2-configuration
```

3. Criar um clientId do tipo client_credentials
   - Menu _Clients_
   - Create
     - _Client ID:_ poc-client
     - Clicar em _save_
   - Em _Client Protocol_ selecionar _openid-connect_
   - Em _Access Type_: selecionar _confidential_
   - Em _Authorization Enabled_ selecionar _ON_
   - Em _Valid Redirect URIs_ preencher com none
   - Clicar em _save_
4. Criar uma _role_ personalizada
   - Menu _Roles_
   - Clicar em _Add Role_
     - Em _Role Name_ preencher com manage_system_parameters
5. Criar um _group_ personalizado

   - Menu _Groups_
   - Clicar em _New_
     - Em _Name_ preencher com Supervisores
     - Na aba _Role Mappings_
       - Clicar em manage_system_parameters
       - Clicar em _Add selected_

6. Liberar acesso para gerenciar os usuários

   - No menu _Clients_, em poc-client, acessar a aba _Service Account Roles_
   - Em _Client Roles_ selecionar _realm-management_
   - Adicionar a role _manager-users_

7. Obter um access token para o client

   - A secret está na aba _Credentials_ do client

   ```
   POST localhost:8081/auth/realms/poc/protocol/openid-connect/token \
   grant_type=client_credentials \
   --user poc-client:<secret>
   ```

8. Criar um usuário para o _realm_ poc

   ```
   POST localhost:8081/auth/admin/realms/poc/users Authorization:"Bearer <ACCESS_TOKEN>" \
   enabled=true \
   email=poc@poc.com.br \
   username=Poc \
   firstName=Prova \
   lastName=Conceito \
   attributes:='{"phone":["11-1234-5678"], "address":"Av. Paulista, 1" }'
   ```

9. Lista os usuários
   ```
   GET localhost:8081/auth/admin/realms/poc/users Authorization:"Bearer <ACCESS_TOKEN>"
   ```
10. Atribuir uma senha ao usuário
    ```
    PUT localhost:8081/auth/admin/realms/poc/users/<USER_ID>/reset-password Authorization:"Bearer <ACCESS_TOKEN>" \
    type=password \
    value=123456 \
    temporary=true
    ```
11. Lista os grupos

    ```
    GET localhost:8081/auth/admin/realms/poc/groups Authorization:"Bearer <ACCESS_TOKEN>"
    ```

12. Vincular o usuário a um grupo

    ```
    PUT localhost:8081/auth/admin/realms/poc/users/<USER_ID>/groups/<GROUP_ID> Authorization:"Bearer <ACCESS_TOKEN>"
    ```

13. Criar o _client_ para o frontend
    - Menu _Clients_
    - Create
      - _Client ID:_ poc-js
      - _RootURL:_ http://localhost:5000
      - _Client Protocol_ selecionar _openid-connect_
      - Clicar em _save_

## Iniciando o servidor

```
npm install
npm start
```

## Acesso

http://localhost:5000

## Adendos

### Autenticar manuamente com usuário e senha

```
http --form :8081/auth/realms/poc/protocol/openid-connect/token \
grant_type=password \
username=poc \
password=123456 \
-a poc-client:<secret>
```

## Observações

- Para multiempresa a ferramenta sugere a criação de diferentes _realms_.
- É possivel configurar os _themes_ de login no menu _Realm Settings_, aba _Themes_.
- É possivel configurar os _locales_ no menu _Realm Settings_, aba _Themes_.
- É possível alterar a duração dos _tokens_ no menu _Realm Settings_, aba _Tokens_.
