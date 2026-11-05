# AGENTS.md — Página Viva (rede de leitores e escritores)

## Projeto
API em Node + Express + TypeScript + MySQL; front em React + Vite + TypeScript. Tudo roda via docker-compose atrás do Nginx.

## Regras de código
- TypeScript estrito: proibido `any`. Use interfaces, type aliases e generics.
- Entidades protegem o estado (`#campo` / `private`); getters/setters só com validação ou regra de negócio.
- Erros sempre via classes de `src/errors.ts`. Pastas: entities, repositories, routes, middlewares.
- Todos os CRUDs usam rotas autenticadas e listagem paginada.

## Skills (em `.agents/skills/`)
1. `novo-crud` — adicionar um recurso novo ao `routes/resources.ts` e ao front.
2. `validacoes` — regras de e-mail, CPF e nível de senha (iguais no back e no front).
3. `docker-seguro` — mexer em compose/nginx sem expor portas nem segredos.

## Guardrails
- NUNCA ler, imprimir, copiar ou commitar `.env`, `.env.*` (exceto `.env.example`), chaves, tokens ou credenciais.
- Nunca colocar segredos em código, logs, respostas ou mensagens de commit; use variáveis de ambiente.
- Não publicar portas além do Nginx; não remover a rede interna do banco.
- Não rodar comandos destrutivos (`rm -rf`, `DROP`, `docker volume rm`) sem pedido explícito do usuário.
- Não desativar validações, autenticação ou verificação de dono do recurso para "fazer passar" um teste.
- Pedir confirmação antes de instalar dependências novas ou alterar o schema do banco.
