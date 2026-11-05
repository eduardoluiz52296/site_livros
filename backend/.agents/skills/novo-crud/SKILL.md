---
name: novo-crud
description: Adiciona um novo recurso CRUD (rota autenticada, paginada) ao back e ao front.
---
1. Crie a tabela em `src/db.ts` com `user_id` e FK para `users`.
2. Registre o recurso em `src/routes/resources.ts` (campos, rótulos, obrigatórios, relação opcional).
3. Replique a definição em `frontend/src/resources.ts`. Listagem e formulário são genéricos.
4. Teste: 401 sem token, 404 em id inexistente, paginação e validação de campos.
