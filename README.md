# Protocolab Backend

Backend desenvolvido com Node.js, Express e Prisma ORM.

## Tecnologias

- Node.js
- Express
- Prisma ORM
- MySQL
- Swagger

---

## Instalação

Copie o repositório:
```bash
git clone https://github.com/viitotito/ProtocoLab-BackEnd.git
```


Instale as dependências:
```bash
npm install
```

Configure as variáveis de ambiente criando um arquivo `.env` na raiz do projeto.
```bash
cp .env.template .env
```
---

## Executando o projeto

Modo desenvolvimento:

```bash
npm run dev
```

Modo produção:

```bash
npm start
```

---

## Banco de Dados

O projeto utiliza Prisma para gerenciamento do banco de dados e controle de migrations.

### Validar Schema

```bash
npm run db:validate
```

Verifica se o arquivo `schema.prisma` está válido.

### Gerar Prisma Client

```bash
npm run db:generate
```

Atualiza o cliente Prisma utilizado pela aplicação.

### Criar e Aplicar Migrations

Após alterar o schema do banco:

```bash
npm run db:migrate 
```

Exemplo:

```bash
npm run db:migrate campo_telefone
```

### Aplicar Migrations Existentes

Utilizado após atualizar o projeto via Git:

```bash
npx prisma migrate deploy
```

### Resetar Banco de Dados

```bash
npm run db:reset
```

⚠️ Este comando remove todos os dados do banco.

---
