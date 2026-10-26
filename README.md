# Cuidar em Casa (nome provisório)

Protótipo de app para pacientes paliativos/oncológicos em alta hospitalar: cuidados de nutrição, enfermagem e saúde bucal num só lugar, em linguagem simples, com cartilha impressa personalizada.

Trabalho da disciplina Conhecimento e Inovação.

## Para a equipe: como revisar os textos

Todo o texto está em **`conteudo.js`**. Abra, mude só o que está entre aspas e salve.
Quando os textos estiverem validados, troque `rascunho: true` por `rascunho: false` (some a faixa amarela de RASCUNHO).

Cores e letra: **`tema.css`**.

## Arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | estrutura das telas |
| `conteudo.js` | textos (Nutrição, Enfermagem, Saúde da boca, Sinais de alerta, exemplo) |
| `tema.css` | nome das cores e tamanho da letra |
| `estilo.css` | layout do celular e da cartilha A4 (`@media print`) |
| `app.js` | navegação, checklist do dia, cadastro, impressão |

## Privacidade

Os dados do paciente ficam só no aparelho (localStorage). Não há servidor.
