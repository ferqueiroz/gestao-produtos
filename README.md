# 📦 Sistema de Gestão de Produtos

Projeto full-stack com React + Spring Boot + PostgreSQL.

---

## 🗂️ Estrutura do projeto

```
projeto-produtos/
├── backend/           → API Java Spring Boot
├── frontend/          → Interface React (Vite)
└── banco-de-dados.sql → Script SQL inicial
```

---

## 🐘 1. Configurar o PostgreSQL

### Instalar (se ainda não tiver):
- Windows: https://www.postgresql.org/download/windows/
- Linux: `sudo apt install postgresql`
- Mac: `brew install postgresql`

### Criar banco e tabela:
```bash
# Entrar no psql
psql -U postgres

# Rodar o script
\i caminho/para/banco-de-dados.sql
```

Ou abrir o arquivo `banco-de-dados.sql` no pgAdmin e executar.

---

## ☕ 2. Rodar o Backend (Spring Boot)

### Pré-requisitos:
- Java 17+
- Maven (ou use o wrapper `./mvnw`)

### Configurar credenciais:
Edite `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/produtos_db
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA_AQUI
```

### Rodar:
```bash
cd backend
./mvnw spring-boot:run
```

A API ficará disponível em: `http://localhost:8080`

---

## ⚛️ 3. Rodar o Frontend (React)

### Pré-requisitos:
- Node.js 18+

### Instalar e rodar:
```bash
cd frontend
npm install
npm run dev
```

A aplicação ficará disponível em: `http://localhost:5173`

---

## 📡 Endpoints da API

| Método | URL                     | Descrição             |
|--------|-------------------------|-----------------------|
| GET    | /api/produtos?page=0&size=15 | Listar com paginação |
| GET    | /api/produtos/{id}      | Buscar por ID         |
| POST   | /api/produtos           | Criar produto         |
| PUT    | /api/produtos/{id}      | Atualizar produto     |
| DELETE | /api/produtos/{id}      | Excluir produto       |

### Exemplo de body (POST/PUT):
```json
{
  "descricao": "Notebook Dell Inspiron",
  "preco": 3499.99
}
```

---

## ✅ Funcionalidades

- [x] Listar produtos com paginação (15 por página)
- [x] Criar novo produto
- [x] Editar produto existente
- [x] Excluir produto com confirmação
- [x] Validação de campos
- [x] Feedback de erros de conexão
