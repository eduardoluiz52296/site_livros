---
name: validacoes
description: Regras de validação de e-mail, CPF e senha compartilhadas entre back e front.
---
- E-mail: regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
- CPF: 11 dígitos, não repetidos, dois dígitos verificadores (`isCpf`).
- Senha: 8+ caracteres, maiúscula, minúscula, número e símbolo (`passwordProblems`).
- Mantenha `backend/src/validators.ts` e `frontend/src/validators.ts` idênticos.
- Edição de usuário nunca altera o e-mail.
