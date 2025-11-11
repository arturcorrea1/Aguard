# Documento de Projeto: Aguard - Água é Vida

## 1. Tema Escolhido

O projeto **Aguard** (Água é Vida) é uma plataforma web dedicada à **conscientização e engajamento** da comunidade sobre a importância da **conservação da água**. O objetivo principal é educar os usuários sobre o uso responsável da água e fornecer um espaço interativo para a troca de informações e experiências.

A plataforma busca incentivar pequenas atitudes diárias que, em conjunto, promovem uma grande diferença na preservação deste recurso vital.

## 2. Tecnologias Utilizadas

O sistema Aguard foi desenvolvido como uma aplicação **Full-Stack**, utilizando as seguintes tecnologias:

| Componente | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript | Interface do usuário, responsabilidade pela apresentação e interação. |
| **Backend** | Node.js com Express.js | Servidor de aplicação, responsável pela lógica de negócios e comunicação com o banco de dados. |
| **Banco de Dados** | MySQL (via `mysql2`) | Armazenamento persistente de dados de usuários, posts e comentários. |
| **Segurança** | `bcrypt` | Utilizado para realizar o *hash* seguro das senhas dos usuários. |
| **Uploads** | `multer` | Middleware para manipulação de *uploads* de arquivos (imagens de perfil e posts). |

## 3. Manual de Uso das Principais Funcionalidades

A plataforma Aguard oferece as seguintes funcionalidades principais para os usuários:

### 3.1. Acesso e Autenticação

| Funcionalidade | Descrição |
| :--- | :--- |
| **Cadastro** | Permite que novos usuários criem uma conta, fornecendo e-mail, nome de usuário e senha. O sistema armazena a senha de forma segura usando `bcrypt`. |
| **Login** | Permite o acesso à plataforma. Após o login, o usuário recebe um token (ou dados de sessão) que o identifica, e o tipo de usuário (`padrao` ou `admininistrador`) é verificado. |
| **Gerenciamento de Perfil** | Usuários podem visualizar e editar suas informações de perfil, incluindo nome de usuário, e-mail e senha. |

### 3.2. Fórum de Discussão

O fórum é o centro de interação da plataforma, permitindo que os usuários compartilhem informações e debatam sobre a conservação da água.

| Funcionalidade | Descrição |
| :--- | :--- |
| **Visualização de Posts** | Exibe uma lista de todos os posts criados, com informações do autor e data de criação. |
| **Criação de Post** | Usuários logados podem criar novos posts, incluindo título, conteúdo e, opcionalmente, uma imagem. |
| **Comentários** | Usuários podem adicionar comentários a qualquer post existente. |
| **Edição e Exclusão de Posts** | Usuários podem editar ou excluir seus próprios posts. **Administradores** têm permissão para editar ou excluir **qualquer** post. |

### 3.3. Funcionalidades Administrativas

O sistema inclui um painel de administração acessível apenas por usuários com o tipo `admininistrador`.

| Funcionalidade | Descrição |
| :--- | :--- |
| **Listagem de Usuários** | O administrador pode visualizar uma lista completa de todos os usuários cadastrados na plataforma. |
| **Gerenciamento de Conteúdo** | O administrador pode editar e excluir posts e comentários de qualquer usuário. |

## 4. Dados de Acesso para Usuário Administrador

Para fins de demonstração e testes, o sistema está configurado com as seguintes credenciais de acesso para o banco de dados e um usuário administrador padrão:

### 4.1. Credenciais do Banco de Dados (MySQL)

As credenciais de conexão estão definidas no arquivo `back/src/db_config.js`:

| Parâmetro | Valor |
| :--- | :--- |
| **Host** | `localhost` |
| **Usuário** | `root` |
| **Senha** | `root` |
| **Banco de Dados** | `Aguard` |

**Nota:** Em um ambiente de produção, é **altamente recomendado** alterar essas credenciais e utilizar variáveis de ambiente para maior segurança.

### 4.2. Credenciais de Acesso do Administrador

O sistema permite a criação de um usuário administrador através do cadastro, definindo o campo `tipo` como `admininistrador` (o padrão é `padrao`).

**Para acesso imediato, é necessário que um usuário com o campo `tipo` = `admininistrador` seja inserido diretamente no banco de dados `Aguard` na tabela `usuario`.**

**Exemplo de Inserção SQL (a ser executado no banco de dados):**

```sql
INSERT INTO usuario (email, username, password, tipo) 
VALUES ('admin@aguard.com', 'AdminMaster', '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'admininistrador');
```

*   **E-mail:** `admin@aguard.com`
*   **Username:** `AdminMaster`
*   **Senha:** (A senha deve ser *hashed* com `bcrypt` antes da inserção. O *hash* `$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` é um placeholder. Para fins de teste, você pode usar uma senha simples e *hashear* manualmente ou criar um usuário padrão e alterar o campo `tipo` diretamente no banco de dados.)

**Recomendação para Teste:**
1.  Cadastre um usuário padrão (ex: `teste@teste.com`, senha `123456`).
2.  Acesse o banco de dados `Aguard` e execute o seguinte comando para promover o usuário a administrador:
    ```sql
    UPDATE usuario SET tipo = 'admininistrador' WHERE email = 'teste@teste.com';
    ```
3.  **Credenciais de Teste (Após a alteração no DB):**
    *   **E-mail:** `teste@teste.com`
    *   **Senha:** `123456`
    *   **Tipo:** `admininistrador`

## 5. Estrutura do Projeto

O projeto está organizado em duas pastas principais:

*   **`front/`**: Contém todos os arquivos do frontend (HTML, CSS, JavaScript) que rodam no navegador do cliente.
*   **`back/`**: Contém o código do servidor (Node.js/Express) e a lógica de comunicação com o banco de dados.

**Fim do Documento**
