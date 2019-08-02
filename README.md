# Keycloak POC

## Subindo o Keycloak
```
docker run --name keycloak -p 8081:8080 -d -e KEYCLOAK_USER=user -e KEYCLOAK_PASSWORD=change jboss/keycloak:6.0.1
```

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
        * Clicar em *save*
    * Em *Client Protocol* selecionar *openid-connect* 
    * Em *Access Type*: selecionar *confidential*
    * Em *Authorization Enabled* selecionar *ON*
    * Em *Valid Redirect URIs* preencher com none
    * Clicar em *save*
    
4) Criar uma *role* personalizada
    * Menu *Roles*
    * Clicar em *Add Role*
        * Em *Role Name* preencher com manage_system_parameters
        
5) Criar um *group* personalizado
    * Menu *Groups*
    * Clicar em *New*
        * Em *Name* preencher com Supervisores
        * Na aba *Role Mappings*
            * Clicar em manage_system_parameters
            * Clicar em *Add selected*

5) Liberar acesso para gerenciar os usuários
    * Acessar a aba *Service Account Roles* no menu *Clients* dentro de poc-client
    * Em *Client Roles* selecionar *realm-management*
    * Adicionar a role *manager-users*

6) Obter um access token para o client
    * A secret está na aba *Credentials* do client
    ```
    http --form :8081/auth/realms/poc/protocol/openid-connect/token \ 
    grant_type=client_credentials \ 
    -a poc-client:<secret>
    ```

7) Criar um usuário para o *realm* poc
    ``` 
    http :8081/auth/admin/realms/poc/users Authorization:"Bearer <ACCESS_TOKEN>" \
    enabled=true \
    email=poc@poc.com.br \
    username=Poc \
    firstName=Prova \
    lastName=Conceito \
    attributes:='{"phone":["11-1234-5678"], "address":"Av. Paulista, 1" }'
    ```

8) Lista os usuários
    ```
    http :8081/auth/admin/realms/poc/users Authorization:"Bearer <ACCESS_TOKEN>"
    ```
    
9) Atribuir uma senha ao usuário
    ```
    http PUT :8081/auth/admin/realms/poc/users/<USER_ID>/reset-password Authorization:"Bearer <ACCESS_TOKEN>" \
    type=password \
    value=123456 \
    temporary=true
    ```
    
10) Lista os grupos
    ```
    http :8081/auth/admin/realms/poc/groups Authorization:"Bearer <ACCESS_TOKEN>"
    ```

11) Vincular o usuário a um grupo
    ```
    http PUT :8081/auth/admin/realms/poc/users/<USER_ID>/groups/<GROUP_ID> Authorization:"Bearer <ACCESS_TOKEN>"
    ```

12) Criar o *client* para o frontend
    * Menu *Clients*
    * Create
        * *Client ID:* poc-js
        * *RootURL:* http://localhost:5000
        * *Client Protocol* selecionar *openid-connect*  
        * Clicar em *save*
        

## Iniciando o servidor
```
npm install
npm start
``` 

## Acesso
http://localhost:5000

## Personalizando os *themes*

### Subindo o Keycloak com o *theme* Carenet
```
docker run --name keycloak -p 8081:8080 -d -e KEYCLOAK_USER=user -e KEYCLOAK_PASSWORD=change -v /<PATH_TO_THIS_PROJECT>/themes/carenet:/opt/jboss/keycloak/themes/carenet  jboss/keycloak:6.0.1
```

### Editando um *theme* on-the-fly
É recomendado desligar o cache do keycloak para editar um *theme* com o servidor ligado, para isso execute:
```
docker exec -it <container_id> bash
vi /opt/jboss/keycloak/standalone/configuration/standalone.xml
```

E altere as propriedades *staticMaxAge* para -1, *cacheTemplates* para false e cacheThemes para false. Ex:

```
<staticMaxAge>-1</staticMaxAge>
<cacheThemes>false</cacheThemes>
<cacheTemplates>false</cacheTemplates>
```

## Adendos
### Autênticar manuamente com usuário e senha
```
http --form :8081/auth/realms/poc/protocol/openid-connect/token \ 
grant_type=password \
username=poc \
password=123456 \
-a poc-client:<secret>
```

## Observações
* Para multiempresa a ferramenta sugere a criação de diferentes *realms*.
* É possivel configurar os *themes* de login no menu *Realm Settings*, aba *Themes*.
* É possivel configurar os *locales* no menu *Realm Settings*, aba *Themes*.
* É possível alterar a duração dos *tokens* no menu *Realm Settings*, aba *Tokens*.
