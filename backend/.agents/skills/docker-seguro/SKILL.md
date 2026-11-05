---
name: docker-seguro
description: Alterações em docker-compose e Nginx preservando isolamento de rede e segredos.
---
- Só o serviço `nginx` tem `ports`. Backend e front ficam na rede `edge`; MySQL fica na rede `data` (internal).
- Variáveis vêm de `.env` (nunca lido pelo agente); documente novas chaves apenas em `.env.example`.
- Volume `db_data` mantém os dados do MySQL; nunca remova sem pedido explícito.
