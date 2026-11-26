<h1 align="center"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/icon-dark.svg"><img src=".github/brand/icon-light.svg" width="56" height="56" alt=""></picture><br>Frankie Tarot API</h1>

<p align="center"><b>面向应用与智能体的只读塔罗数据服务，提供双语牌义、牌阵定义与可选的抽牌功能。</b></p>

<p align="center"><a href="https://songhaifan.github.io/frankie-tarot-api/zh/">项目介绍</a> · <a href="https://tarot-api.songhai.site/">API 文档</a> · <a href="docs/guide.md">使用指南</a> · <a href="README.md">English</a></p>

<p align="center"><img src="docs/readme/assets/ui.png" width="900" alt="Frankie Tarot API — project preview"></p>

## 可以做什么

- 通过 REST 获取 78 张双语卡牌与 11 种牌阵定义。
- 通过不带 UI 的 MCP 服务连接智能体。
- 在用户明确委托抽牌时，抽取不重复的卡牌或完整牌阵。

## 本地运行

使用 npm 安装依赖并启动本地服务：

```sh
npm ci
npm run api
```

REST 与 MCP 服务运行于 http://127.0.0.1:3001。编辑文档站点时使用 `npm run dev`。

## 开始之前

公共服务无需 API key。调用方应用管理正逆位与解读。随机抽牌每次都会产生新样本，因此请求结果不确定时，不能将重试视为同一次解读。完整约定与示例见项目指南。

## 开发说明

```sh
npm run api:test
npm run typecheck
npm run build
```

接口约定维护、冒烟检查与部署说明见项目指南。

[项目指南](docs/guide.md) · [Banner 维护](docs/readme/README.md)

---

<p align="center"><a href="https://songhaifan.github.io/frankie-brain/"><img src=".github/brand/series/brain.svg" width="28" height="28" alt="Frankie Brain" title="Frankie Brain"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-brain-ios/"><img src=".github/brand/series/brain-ios.svg" width="28" height="28" alt="Frankie Brain · iOS" title="Frankie Brain · iOS"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-cards/"><img src=".github/brand/series/cards.svg" width="28" height="28" alt="Frankie Cards" title="Frankie Cards"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-dictionary/"><img src=".github/brand/series/dictionary.svg" width="28" height="28" alt="Blue Dictionary" title="Blue Dictionary"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-generative-art/"><img src=".github/brand/series/generative-art.svg" width="28" height="28" alt="Frankie Generative Art Gallery" title="Frankie Generative Art Gallery"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-goal/"><img src=".github/brand/series/goal.svg" width="28" height="28" alt="Frankie Goal" title="Frankie Goal"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-guitar/"><img src=".github/brand/series/guitar.svg" width="28" height="28" alt="Frankie Guitar" title="Frankie Guitar"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-list/"><img src=".github/brand/series/list.svg" width="28" height="28" alt="Frank’s Life List" title="Frank’s Life List"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-mbti/"><img src=".github/brand/series/mbti.svg" width="28" height="28" alt="Frankie MBTI" title="Frankie MBTI"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-onitama/"><img src=".github/brand/series/onitama.svg" width="28" height="28" alt="Frankie Onitama" title="Frankie Onitama"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-poker/"><img src=".github/brand/series/poker.svg" width="28" height="28" alt="Frankie Poker" title="Frankie Poker"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-stocks/"><img src=".github/brand/series/stocks.svg" width="28" height="28" alt="Frankie Stocks" title="Frankie Stocks"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-tarot/"><img src=".github/brand/series/tarot.svg" width="28" height="28" alt="Frankie Tarot" title="Frankie Tarot"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-tarot-api/"><img src=".github/brand/series/tarot-api.svg" width="28" height="28" alt="Frankie Tarot API" title="Frankie Tarot API"></a> &nbsp; <a href="https://songhaifan.github.io/frankie-werewolf/"><img src=".github/brand/series/werewolf.svg" width="28" height="28" alt="Werewolf Local" title="Werewolf Local"></a></p>

<p align="center"><sub>Frankie 系列 · 制作：<a href="https://github.com/SonghaiFan">Songhai Fan</a></sub></p>

<p align="right"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/signature-dark.svg"><img src=".github/brand/signature-light.svg" width="90" alt="Frankie"></picture></p>
