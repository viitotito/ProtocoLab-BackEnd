# 🏢 ProtocoLab - Backend API

## 📖 Sobre

O **ProtocoLab** é uma API backend desenvolvida para gerenciamento de chamados (tickets) internos de empresas.

O sistema permite que empresas organizem seus departamentos, usuários, tickets e comentários em um fluxo estruturado de suporte e comunicação interna.

---

## 🎯 Objetivo

Projeto desenvolvido com foco em:

- Gerenciar usuários dentro de empresas
- Organizar departamentos internos
- Criar e administrar tickets (chamados)
- Permitir comentários em tickets
- Controlar permissões de acesso (RBAC)
- Garantir isolamento de dados por empresa (multi-tenant)

---

## 🚀 Tecnologias 
- [Node.js](https://nodejs.org/pt-br)
- [Express](https://expressjs.com/pt-br/)
- [Prisma ORM](https://www.prisma.io/orm)
- [MySQL](https://www.mysql.com/) 
- [JWT](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [i18next](https://www.i18next.com/) 
- [Swagger](https://swagger.io/) 
- [Zod](https://zod.dev/)

---

## ⚙ Funcionalidades

### 👤 Autenticação
- Registro de empresa e usuário inicial
- Login com geração de Access Token e Refresh Token
- Refresh token via cookie seguro
- Logout
- Recuperação de dados do usuário logado (me)

### 🏣 Empresas
- Criação automática no registro
- Associação de usuários e departamentos

### 🏬 Departamentos
- Criar departamento
- Listar departamentos da empresa
- Buscar departamento por ID
- Atualizar departamento
- Remover departamento
- Listar usuários por departamento
  
### 👥 Usuários
- Criar usuário
- Listar usuários da empresa
- Buscar usuário por ID
- Atualizar usuário
- Remover usuário
- Listar usuários por departamento
  
### 🎫 Tickets (Chamados)
- Criar ticket
- Listar tickets da empresa
- Buscar ticket por ID
- Atualizar ticket
- Deletar ticket
- Atribuir usuários ao ticket
- Remover usuários do ticket
- Listar usuários atribuídos
  
### 💬 Comentários
- Criar comentário em ticket
- Listar comentários do ticket
- Editar comentário (somente autor)
- Deletar comentário (somente autor)

---

## 🌍 Internacionalização 

- Suporte a múltiplos idiomas:
  - Português (pt-BR)
  - Inglês (en-US)
  - Espanhol (es)
- Tradução automática via header Accept-Language
- Mensagens de erro e sucesso internacionalizadas

---

## 📄 Documentação

Documentação completa de todos os endpoints:

```cmd
/api/documentation
```

Documentação de funções utilizando marcação JSDoc.

---

## 🔧 Instalação (Dev)

### 1. Clonar o projeto:
```bash
git clone https://github.com/viitotito/ProtocoLab-BackEnd.git
```

### 2. Acessar diretório:
```bash
cd ProtocoLab-BackEnd
```

### 3. Instalar dependências:
```bash
npm i
```

### 4. Copiar template para arquivo original:
```bash
cp .env.template .env
```

### 5. Configurar variáveis de ambiente seguindo o modelo:
```
DATABASE_URL="sua_url_do_banco" (connection string com informações do banco)

JWT_ACCESS_SECRET="sua_chave" (chave para gerar token de acesso)
JWT_REFRESH_SECRET="sua_chave_refresh" (chave para gerar token de refresh)
JWT_ACCESS_EXPIRATION="1d" (expiração do token de acesso)
JWT_REFRESH_EXPIRATION="7d" (expiração do token de refresh)

ALLOWED_ORIGINS="http://localhost:3000" (origens permitidas para requisição)
```

### 6. Rodar migrations do Prisma:
```bash
npm run db:migrate
```

7. Iniciar servidor
```bash
npm run dev
```

---

## 🔗 Endpoints 
- /api/auth
- /api/users
- /api/departments
- /api/tickets
- /api/comments

### Swagger completo:
- /api/documentation

---

## 📐 Arquitetura do projeto

### O projeto segue arquitetura em camadas:
- Controllers → controle das requisições HTTP
- Services → regras de negócio
- Prisma → camada de persistência
- Middlewares → autenticação, autorização e i18n
- Validations → validação com Zod

---

## 📌 ToDo
- Notificações em tempo real (WebSocket)
- Sistema de anexos em tickets
- Histórico de alterações em tickets
- Permissões mais granulares por roles
- Sistema de auditoria (logs de ações)
- Notificações por email
- Relatórios em PDF e CSV
