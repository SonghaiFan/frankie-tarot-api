<h1 align="center"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/icon-dark.svg"><img src=".github/brand/icon-light.svg" width="56" height="56" alt=""></picture><br>Frankie Tarot API</h1>

<p align="center"><b>Read-only tarot data for applications and agents, with bilingual cards, spread definitions and optional draws.</b></p>

<p align="center"><a href="https://songhaifan.github.io/frankie-tarot-api/">Introduction</a> · <a href="https://tarot-api.songhai.site/">API docs</a> · <a href="docs/guide.md">Guide</a> · <a href="README.zh-CN.md">中文</a></p>

<p align="center"><img src="docs/readme/assets/ui.png" width="900" alt="Frankie Tarot API — project preview"></p>

## What it does

- Retrieve 78 bilingual cards and 11 spread definitions over REST.
- Connect agents through the UI-free MCP service.
- Draw distinct cards or a spread when the user explicitly delegates drawing.

## Run locally

Use npm to install dependencies and start the local service:

```sh
npm ci
npm run api
```

REST and MCP are served at http://127.0.0.1:3001. Use `npm run dev` to edit the documentation site.

## Before you start

The public service needs no API key. The calling app owns orientation and interpretation. A random draw is a new sample, so an uncertain request must not be retried as if it were the same reading. Full contracts and examples are in the project guide.

## For developers

```sh
npm run api:test
npm run typecheck
npm run build
```

Contract maintenance, smoke checks and deployment instructions remain in the project guide.

[Project guide](docs/guide.md) · [Artwork](docs/readme/README.md)

---

<p align="center"><a href="https://songhaifan.github.io/frankie-brain/"><img src=".github/brand/series/brain.svg" width="28" height="28" alt="Frankie Brain" title="Frankie Brain"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-brain-ios/"><img src=".github/brand/series/brain-ios.svg" width="28" height="28" alt="Frankie Brain · iOS" title="Frankie Brain · iOS"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-cards/"><img src=".github/brand/series/cards.svg" width="28" height="28" alt="Frankie Cards" title="Frankie Cards"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-dictionary/"><img src=".github/brand/series/dictionary.svg" width="28" height="28" alt="Blue Dictionary" title="Blue Dictionary"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-generative-art/"><img src=".github/brand/series/generative-art.svg" width="28" height="28" alt="Frankie Generative Art Gallery" title="Frankie Generative Art Gallery"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-goal/"><img src=".github/brand/series/goal.svg" width="28" height="28" alt="Frankie Goal" title="Frankie Goal"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-guitar/"><img src=".github/brand/series/guitar.svg" width="28" height="28" alt="Frankie Guitar" title="Frankie Guitar"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-list/"><img src=".github/brand/series/list.svg" width="28" height="28" alt="Frank’s Life List" title="Frank’s Life List"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-mbti/"><img src=".github/brand/series/mbti.svg" width="28" height="28" alt="Frankie MBTI" title="Frankie MBTI"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-onitama/"><img src=".github/brand/series/onitama.svg" width="28" height="28" alt="Frankie Onitama" title="Frankie Onitama"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-poker/"><img src=".github/brand/series/poker.svg" width="28" height="28" alt="Frankie Poker" title="Frankie Poker"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-stocks/"><img src=".github/brand/series/stocks.svg" width="28" height="28" alt="Frankie Stocks" title="Frankie Stocks"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-tarot/"><img src=".github/brand/series/tarot.svg" width="28" height="28" alt="Frankie Tarot" title="Frankie Tarot"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-tarot-api/"><img src=".github/brand/series/tarot-api.svg" width="28" height="28" alt="Frankie Tarot API" title="Frankie Tarot API"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-werewolf/"><img src=".github/brand/series/werewolf.svg" width="28" height="28" alt="Werewolf Local" title="Werewolf Local"></a></p>

<p align="center"><sub>Part of the Frankie series · Made by <a href="https://github.com/SonghaiFan">Songhai Fan</a></sub></p>

<p align="right"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/signature-dark.svg"><img src=".github/brand/signature-light.svg" width="90" alt="Frankie"></picture></p>
