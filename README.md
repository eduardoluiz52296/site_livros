# Página Viva — versão básica (requisitos do chat)

Contém apenas: cadastro de usuário no back-end (campos obrigatórios, validação de CPF, nível de senha e e-mail), cadastro no front-end (senha dupla, CPF, e-mail, redirecionamento ao login, erros da API) e os critérios Tech Forge de encapsulamento (`#campos` privados) e acesso controlado (getters/setters só com validação) em `backend/src/entities/User.ts`.

## Rodar
1. `cp .env.example .env` (troque as senhas) e `docker compose up -d` para subir o MySQL.
2. Backend: `cd backend && npm install`, exporte `DB_HOST=localhost DB_NAME DB_USER DB_PASSWORD` e rode `npm run dev`.
3. Frontend: `cd frontend && npm install && npm run dev` e abra http://localhost:5173
