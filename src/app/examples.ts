import type { Locale } from "./copy";

export const API_BASE = "https://tarot-api.songhai.site";
const VERSION = "350d0b7d530942dd";

/*
 * Request and response examples for the docs page. Responses are real service
 * output, trimmed with "…"; they follow the page locale so readers see the
 * names and meanings their own requests will return.
 */
export function examples(locale: Locale) {
  const zh = locale === "zh-CN";
  const pick = (en: string, cn: string) => (zh ? cn : en);

  return {
    load: `const API = "${API_BASE}";

const [{ cards }, { spreads }] = await Promise.all([
  fetch(\`\${API}/api/v1/cards?locale=${locale}\`).then((response) => response.json()),
  fetch(\`\${API}/api/v1/spreads?locale=${locale}\`).then((response) => response.json()),
]);

cards.length;   // 78
spreads.length; // 11`,

    draw: `const draw = await fetch(\`\${API}/api/v1/spreads/COURT/draw?locale=${locale}\`).then((response) => response.json());

const reading = draw.cards.map(({ positionLabel, card }) => {
  const reversed = Math.random() < 0.4; // your app's setting
  return {
    position: positionLabel,
    card: card.name,
    reversed,
    meaning: card.meanings[reversed ? "reversed" : "upright"]["${locale}"],
  };
});`,

    drawResult: pick(`[
  { "position": "Situation (Pip)", "card": "Five of Swords", "reversed": false, "meaning": "…" },
  { "position": "Persona (Court)", "card": "Queen of Cups",  "reversed": true,  "meaning": "…" },
  { "position": "Cause (Major)",   "card": "The Tower",      "reversed": false, "meaning": "…" }
]`, `[
  { "position": "情境(小阿卡纳)", "card": "宝剑五", "reversed": false, "meaning": "…" },
  { "position": "角色(宫廷牌)",   "card": "圣杯王后", "reversed": true,  "meaning": "…" },
  { "position": "根因(大阿卡纳)", "card": "高塔",   "reversed": false, "meaning": "…" }
]`),

    health: {
      request: `curl "${API_BASE}/health"`,
      response: `{ "status": "ok", "service": "frankie-tarot-api", "apiVersion": "1" }`,
    },

    card: {
      request: `curl "${API_BASE}/api/v1/cards/maj00?locale=${locale}"`,
      response: `{
  "id": "maj00",
  "name": "${pick("The Fool", "愚人")}",
  "names": { "en": "The Fool", "zh-CN": "愚人" },
  "arcana": "MAJOR",
  "suit": null,
  "rank": 0,
  "imageUrls": {
    "redraw": "${API_BASE}/images/cards/maj00.webp?v=${VERSION}",
    "dreamy": "${API_BASE}/images/cards_dreamy/maj00.webp?v=${VERSION}",
    "original": "${API_BASE}/images/cards_rws_original/maj00.webp?v=${VERSION}"
  },
  "keywords": {
    "en": ["Infinite potential", "New beginnings", "Childlike heart", …],
    "zh-CN": ["无限潜力", "新的开始", "赤子之心", …]
  },
  "description": { "en": "The Fool, Mate, or Unwise Man. …", "zh-CN": "他是追寻经验的灵魂，…" },
  "meanings": {
    "upright": { "en": "Starting from zero; luck in gambling; …", "zh-CN": "从零开始; 好赌运; …" },
    "reversed": { "en": "Instability; reckless gambles ending in failure; …", "zh-CN": "不安定; 孤注一掷会失败; …" }
  },
  "source": { "dataset": "frankie-tarot-ground-truth", "datasetVersion": "${VERSION}", "note": "…" }
}`,
    },

    cards: {
      request: zh
        ? `curl "${API_BASE}/api/v1/cards?q=月亮&locale=zh-CN"
curl "${API_BASE}/api/v1/cards?suit=CUPS&locale=zh-CN"     # 14 张
curl "${API_BASE}/api/v1/cards?arcana=MAJOR&locale=zh-CN"  # 22 张`
        : `curl "${API_BASE}/api/v1/cards?q=moon&locale=en"
curl "${API_BASE}/api/v1/cards?suit=CUPS&locale=en"     # 14 cards
curl "${API_BASE}/api/v1/cards?arcana=MAJOR&locale=en"  # 22 cards`,
      response: zh
        ? `{
  "cards": [
    { "id": "maj18", "name": "月亮", "arcana": "MAJOR", "suit": null, "rank": 18, … }
  ],
  "locale": "zh-CN"
}`
        : `{
  "cards": [
    { "id": "maj18", "name": "The Moon", "arcana": "MAJOR", "suit": null, "rank": 18, … },
    { "id": "maj19", "name": "The Sun", "arcana": "MAJOR", "suit": null, "rank": 19, … }
  ],
  "locale": "en"
}`,
    },

    random: {
      request: `curl "${API_BASE}/api/v1/cards/random?n=3&locale=${locale}"`,
      response: `{
  "cards": [
    { "id": "swords07", "name": "${pick("Seven of Swords", "宝剑七")}", "suit": "SWORDS", "rank": 7, … },
    { "id": "maj17", "name": "${pick("The Star", "星星")}", "suit": null, "rank": 17, … },
    { "id": "pents01", "name": "${pick("Ace of Pentacles", "星币首牌")}", "suit": "PENTACLES", "rank": 1, … }
  ],
  "locale": "${locale}"
}`,
    },

    spreads: {
      request: `curl "${API_BASE}/api/v1/spreads?locale=${locale}"`,
      response: `{
  "spreads": [
    {
      "id": "COURT",
      "name": "${pick("Court Card Behavior", "宫廷行为模式")}",
      "description": "${pick("A three-card behavior pattern spread that reveals the situation, …", "这是用到三张塔罗牌的牌阵，分别代表情境、人格和原因。…")}",
      "cardCount": 3,
      "labels": ${pick(`["Situation (Pip)", "Persona (Court)", "Cause (Major)"]`, `["情境(小阿卡纳)", "角色(宫廷牌)", "根因(大阿卡纳)"]`)},
      "cardPools": ["MINOR_PIP", "COURT", "MAJOR"],
      "layout": {
        "type": "absolute",
        "positions": [
          { "x": -62, "y": 46, "labelPosition": "top" },
          { "x": 0, "y": -56, "labelPosition": "bottom" },
          { "x": 62, "y": 46, "labelPosition": "top" }
        ]
      },
      "interpretationInstruction": "${pick("… When [Card 1 Situation] arises, you become [Card 2 Persona] because of [Card 3 Cause]. …", "三张行为模式牌阵。牌 1：情境。牌 2：你呈现的角色/行为。牌 3：背后真实驱动。…")}",
      "defaultQuestions": { "en": ["What do I become when I am under pressure?", …], "zh-CN": ["我在面对压力时会变成什么样?", …] }
    },
    …
  ],
  "locale": "${locale}"
}`,
    },

    spreadDraw: {
      request: `curl "${API_BASE}/api/v1/spreads/COURT/draw?locale=${locale}"`,
      response: `{
  "spread": { "id": "COURT", "name": "${pick("Court Card Behavior", "宫廷行为模式")}", "cardCount": 3 },
  "cards": [
    { "positionIndex": 1, "positionLabel": "${pick("Situation (Pip)", "情境(小阿卡纳)")}", "cardPool": "MINOR_PIP", "card": { "id": "swords05", "name": "${pick("Five of Swords", "宝剑五")}", … } },
    { "positionIndex": 2, "positionLabel": "${pick("Persona (Court)", "角色(宫廷牌)")}", "cardPool": "COURT", "card": { "id": "cups13", "name": "${pick("Queen of Cups", "圣杯王后")}", … } },
    { "positionIndex": 3, "positionLabel": "${pick("Cause (Major)", "根因(大阿卡纳)")}", "cardPool": "MAJOR", "card": { "id": "maj16", "name": "${pick("The Tower", "高塔")}", … } }
  ],
  "locale": "${locale}"
}`,
    },

    image: {
      request: `curl -I "${API_BASE}/images/cards/maj00.webp?v=${VERSION}"`,
      response: `HTTP/2 200
content-type: image/webp
access-control-allow-origin: *
cache-control: public, max-age=31536000, immutable`,
      html: `<img src="${API_BASE}/images/cards/maj00.webp?v=${VERSION}" alt="${pick("The Fool", "愚人")}">`,
    },

    mcpConfig: `{
  "mcpServers": {
    "frankie-tarot": { "type": "http", "url": "${API_BASE}/mcp/agent" }
  }
}`,

    mcpCall: `curl ${API_BASE}/mcp/agent \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_random_tarot_cards","arguments":{"n":3,"locale":"${locale}"}}}'`,

    mcpResponse: `{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "structuredContent": {
      "cards": [{ "id": "swords07", "name": "${pick("Seven of Swords", "宝剑七")}", … }, …],
      "locale": "${locale}"
    },
    "content": [{ "type": "text", "text": "…" }]
  }
}`,

    error: {
      request: `curl "${API_BASE}/api/v1/cards/random?n=0"`,
      response: `{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request does not match the API schema.",
    "details": [{ "path": "n", "message": "Too small: expected number to be >=1" }]
  }
}`,
    },
  };
}
