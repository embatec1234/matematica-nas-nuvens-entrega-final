# Matemática nas Nuvens

Jogo educativo de matemática para crianças (HTML + CSS + JavaScript puro, sem instalação de dependências).

## Como rodar no VS Code
1. Extraia este ZIP e abra a pasta `matematica-nas-nuvens` no VS Code (Arquivo > Abrir Pasta).
2. Aceite a recomendação para instalar a extensão **Live Server** (ou instale pela aba de extensões).
3. Clique com o botão direito em `index.html` e escolha **Open with Live Server**.

Sem Live Server, também funciona: dê duplo clique em `index.html` (mantenha as pastas `css/` e `js/` ao lado dele).

## Estrutura do projeto

```
matematica-nas-nuvens/
├── index.html              ← estrutura da página + lista (ordenada) de CSS e JS carregados
├── README.md
├── .vscode/extensions.json
├── css/                    ← visual
│   ├── base/               variáveis de cor, reset, utilitários, ajustes de tela pequena
│   ├── layout/             estrutura geral das telas e containers
│   ├── components/         peças reutilizáveis (botões, cartões, modal, mascote, narrador…)
│   ├── scenery/            cenário animado (céu, espaço, animações)
│   └── screens/            estilos específicos de cada tela
├── img/                    ← imagens: logo, ícones da aba e as estrelas de avaliação (estrela.png / estrela-vazia.png)
└── js/                     ← lógica do jogo
    ├── main.js             inicialização (sempre o último a carregar)
    ├── config/             constantes, textos, vozes dos narradores, trilhas de música, banco de nomes
    ├── core/               salvamento, perfis de jogador, banco de nomes (lógica), utilitários, navegação
    ├── audio/              efeitos sonoros, música, leitura em voz alta
    ├── game/               cronômetro, estatísticas, revisão de acertos/erros, fala de fim de fase
    ├── questions/          geração das perguntas (por fase e por atividade) e sorteio sem repetição
    ├── scenery/            arte vetorial (avião, pássaro, nuvens, foguete, planetas…) e cenário
    ├── ui/                 modais e banners de feedback
    └── screens/            uma tela por arquivo (início, perfil, mapa, jogo, vitória, etc.)
```

## "Quero mexer em… → qual arquivo?"

| Quero mudar…                                              | Arquivo                                                        |
|-----------------------------------------------------------|----------------------------------------------------------------|
| Nº de perguntas, vidas, nomes das fases, avatares, textos | `js/config/game-config.js`                                     |
| Personagens narradores (inclui a Nuvi, voz de IA)         | `js/config/narrator-voices.js`                                 |
| Escolha da melhor voz do aparelho / voz de IA             | `js/audio/speech.js` (`voiceQuality`, `bestNaturalVoice`)      |
| **Nomes e sobrenomes disponíveis para as crianças**       | `js/config/name-bank.js`                                       |
| Como o nome é escolhido (letras, busca, validação)        | `js/screens/profile.js` · `js/core/names.js`                   |
| Perfis de jogador (criar, trocar, apagar, migração)       | `js/core/profiles.js`                                          |
| Código secreto de figurinhas / código mestre              | `js/core/profile-lock.js` · `css/components/profile-lock.css` · `PARENT_MASTER_CODE` em `js/config/game-config.js` |
| Tela "Quem vai jogar?"                                    | `js/screens/players.js` · `css/screens/players.css`            |
| Músicas de fundo                                          | `js/config/music-tracks.js`                                    |
| Como o progresso é salvo (formato, localStorage)          | `js/core/save.js`                                              |
| Efeitos sonoros / música                                  | `js/audio/sfx.js` · `js/audio/music.js`                        |
| Leitura em voz alta                                       | `js/audio/speech.js`                                           |
| Tempo limite por pergunta                                 | `js/game/timer.js`                                             |
| Perguntas das fases 1, 2 e 3                              | `js/questions/phases-1-3.js`                                   |
| Perguntas da fase 4 (Desafio Final)                       | `js/questions/phase4-final-challenge.js`                       |
| Perguntas da Seleção de Atividades                        | `js/questions/topic-activities.js`                             |
| Regra de "não repetir perguntas"                          | `js/questions/unique-sets.js`                                  |
| Estrelas, ranking, estatísticas                           | `js/game/stats.js`                                             |
| Desenho das estrelas de avaliação (trocar a imagem)       | `img/estrela.png` · `img/estrela-vazia.png` · `STAR_ON`/`STAR_OFF` em `js/config/game-config.js` · `css/components/small-ui.css` |
| Revisão de acertos e erros (fim de fase)                  | `js/game/review.js`                                            |
| Desenhos do céu (avião, pássaro, nuvens)                  | `js/scenery/sky-art.js`                                        |
| Cenário do espaço (Desafio Bônus)                         | `js/scenery/space-scene.js`                                    |
| Tela inicial / perfil / dificuldade / tutorial            | `js/screens/start.js` · `profile.js` · `difficulty.js` · `tutorial.js` |
| Mapa de balões e dirigíveis                               | `js/screens/map/art.js` (desenhos) · `js/screens/map/screen.js` (tela) |
| Tela de jogo (responder, vidas, nova tentativa)           | `js/screens/gameplay.js`                                       |
| Pausa / Vitória / Derrota / Resultado do Bônus            | `js/screens/pause.js` · `victory.js` · `defeat.js` · `final-result.js` |
| Configurações / escolha de voz                            | `js/screens/settings.js` · `js/screens/voices.js`              |
| "Meu progresso" e gráfico de evolução                     | `js/screens/progress/` (`helpers.js`, `evolution.js`, `screen.js`) |
| Modo multijogador local                                   | `js/screens/multiplayer.js`                                    |
| Cores e tamanhos gerais                                   | `css/base/variables.css`                                       |
| Aparência de uma tela específica                          | `css/screens/<nome-da-tela>.css`                               |

## Importante: a ordem dos arquivos

O jogo usa scripts simples (sem módulos), então **um arquivo usa o que os anteriores definem**, e no CSS a ordem também afeta o resultado. A ordem correta está listada em `index.html`.

- **Criou um arquivo novo?** Adicione a linha `<script src="...">` (ou `<link ...>`) dele em `index.html`, no ponto certo da lista.
- **`js/main.js` deve ser sempre o último script.**
- **Não reordene** as linhas existentes sem necessidade.

## Jogadores (perfis) e nomes

**Vários jogadores no mesmo computador.** Cada criança tem um perfil com nome, avatar e progresso próprios. Ao abrir o jogo aparece "Quem vai jogar?"; a criança toca no seu nome e continua de onde parou. Para outra criança jogar: **Trocar de jogador** (tela inicial ou Configurações) → **Novo jogador**. O progresso de ninguém se perde.

- Os perfis ficam guardados **no navegador daquele computador** (`localStorage`). Outro computador, outro navegador ou outro usuário do Windows não vê esses perfis, e limpar os dados do navegador apaga tudo.
- Quem já jogava antes dos perfis não perde nada: o save antigo vira o primeiro jogador automaticamente.

**Código secreto (proteção do perfil).** Ao criar um jogador, a criança escolhe **3 figurinhas secretas** (🐶🐱🦊…) e repete para confirmar. Sem esse código ninguém apaga o perfil nem zera o progresso dele. Errou 3 vezes: espera 30 segundos. Perfis antigos, sem código, pedem para criar um na primeira vez que alguém tocar em 🗑️.

- **Esqueceu o código?** O professor/responsável toca em *"Esqueci o código"* e digita o **código mestre**, que permite apagar o jogador ou criar um novo código. **Troque o código mestre** (padrão `2580`) em `js/config/game-config.js` → `PARENT_MASTER_CODE`.
- Limite: o jogo roda só no navegador, então isso impede o "coleguinha" de apagar pelo jogo, mas não impede quem sabe limpar os dados do navegador.

**Nomes só da lista.** Não existe campo de texto para o nome: a criança escolhe o nome (e depois o sobrenome) numa lista, por letra ou pela busca. O que se digita na busca só filtra a lista e nunca vira nome. Isso vale também para o multiplayer.

- **Para adicionar um nome:** edite `FIRST_NAMES` ou `SURNAMES` em `js/config/name-bank.js` (a ordem alfabética é automática). Só inclua nomes adequados para crianças.
- Um save antigo cujo nome não esteja na lista não é exibido: o jogador escolhe um nome da lista e o progresso continua.

**Voz de IA.** A personagem **Nuvi** usa sempre a voz mais natural (neural) que o aparelho tiver. No Microsoft Edge ficam disponíveis as vozes "Natural", as mais fluidas. No Chrome, a voz "Google português do Brasil" (precisa de internet) é uma boa opção.
