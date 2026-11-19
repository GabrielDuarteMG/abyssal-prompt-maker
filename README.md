# Abyssal Prompt Maker

Montador de prompts estruturados, inspirado no prompt do [Abyssal Garden](https://github.com/Noniv/abyssal-garden).

## Inspiração

O [Abyssal Garden](https://github.com/Noniv/abyssal-garden) é um mundo subaquático em WebGPU, contido num único arquivo HTML de ~96 KB: florestas de kelp, raios de luz atravessando a água, um navio afundado, arraias, som sintetizado. Tudo procedural.

Ele saiu de um [prompt de ~40 linhas](https://github.com/Noniv/abyssal-garden/blob/main/prompt.txt) com uma estrutura simples: uma frase de objetivo, prioridades ordenadas, restrições, um alvo mensurável, passos de verificação e um critério de conclusão.

O prompt é curto. O que funciona é a estrutura: ela diz ao modelo o que importa, o que é proibido, como medir o resultado e quando parar. Este projeto transforma esse formato num assistente passo a passo.

## A estrutura

Cada passo do assistente gera um bloco do prompt, nesta ordem:

| Passo | Bloco gerado | Papel |
| --- | --- | --- |
| Objetivo | texto livre + `{Verbo} {tarefa}. Ela só precisa {escopo}.` | o quê, e o mínimo necessário |
| Prioridades | `PRIORIDADES (nesta ordem, quando entrarem em conflito)`, numerada | critério de desempate |
| Restrições | `RESTRIÇÕES` | limites rígidos |
| Alvo | `ALVO` | ambiente e métricas |
| Extras | listas personalizadas (título em MAIÚSCULAS, padrão `Lista N`) + `OBSERVAÇÃO` | ex.: `CENA` e `CONTROLES` do original |
| Verificação | `VERIFICAÇÃO` + `CONCLUÍDO QUANDO:` | critérios de aceite |

- Blocos vazios são omitidos do resultado.
- Os itens de cada lista podem ser reordenados.
- O resumo do objetivo começa com um de 45 verbos (`SUMMARY_VERBS` em `src/store/promptStore.ts`).

## Exemplo

Uma versão condensada do prompt do Abyssal Garden, como o assistente a gera:

```text
Um jardim abissal: um mundo subaquático explorável que roda inteiro no navegador.

Construa uma cena subaquática procedural em WebGPU. Ela só precisa caber num único arquivo HTML.

PRIORIDADES (nesta ordem, quando entrarem em conflito)
1. Estabilidade: nada de travamentos nem erros no console
2. Desempenho: 60 fps em hardware comum
3. Beleza visual

RESTRIÇÕES
- Um único arquivo HTML, sem dependências externas
- Nenhum asset binário: geometria, texturas e som gerados por código
- Sem bibliotecas de terceiros

ALVO
- Chrome atual com WebGPU habilitado
- GPU integrada de notebook

VERIFICAÇÃO
- Abrir o arquivo localmente e navegar pela cena por 5 minutos
- Conferir o console: zero erros e zero avisos

CONCLUÍDO QUANDO: a cena carrega, roda estável a 60 fps e todos os itens de verificação passam.
```

## Funcionalidades

- Assistente em 6 passos, ou modo **Ver tudo** com todos os passos numa só página, e pré-visualização do prompt ao vivo.
- Botão **Copiar**, que envia o prompt para a área de transferência.
- Listas personalizadas para seções extras.
- Estado só em memória (Zustand, sem persistência): recarregar a página apaga tudo.

## Stack

- React 19 + TypeScript
- Vite
- Zustand
- StyleX
- Astryx Design (`@astryxdesign/core`, `@astryxdesign/theme-neutral`)
- oxlint

## Rodando localmente

Requer Node `^20.19.0 || >=22.12.0` (exigência do Vite).

```sh
npm install
npm run dev       # servidor de desenvolvimento
npm run build     # checagem de tipos + build de produção em dist/
npm run preview   # serve o build de dist/
npm run lint      # oxlint
```

## Estrutura do projeto

| Caminho | Conteúdo |
| --- | --- |
| `src/lib/buildPrompt.ts` | monta os blocos e o texto final do prompt |
| `src/lib/steps.ts` | passos do assistente, na ordem dos blocos |
| `src/store/promptStore.ts` | conteúdo do prompt: objetivo, verbos, listas, listas personalizadas |
| `src/store/wizardStore.ts` | passo ativo e modo de visualização (assistente / Ver tudo) |
| `src/components/` | seções do formulário e painel de saída |

## Créditos

Formato de prompt e inspiração: [Abyssal Garden](https://github.com/Noniv/abyssal-garden), de Noniv (licença MIT).
