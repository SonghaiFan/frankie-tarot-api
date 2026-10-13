export type Locale = "en" | "zh-CN";
type CopySet = {
  nav: string[]; onPage: string; asideNote: string; heroEyebrow: string; heroDescription: string;
  quickstart: string; reference: string; stats: string[]; firstRequest: string; quickDescription: string;
  quickFields: string[]; auth: string; spreadChoice: string; copied: string; copy: string;
  loadLabel: string; drawIntro: string; drawResultLabel: string; equivalentCurl: string; statelessNote: string;
  endpointsTitle: string; endpointsDescription: string; endpointDescriptions: string[];
  paramHeads: string[]; paramNotes: Record<string, string>; request: string; response: string;
  imageStyles: string[]; imageHtml: string;
  spreadTitle: string; spreadDescription: string; spreadLoadError: string; spreadLoading: string; spreadDataNote: string; spreadPoolNote: string;
  poolTitle: string; poolDescription: string; poolMembers: string[];
  mcpTitle: string; mcpDescription: string; mcpHeads: string[]; mcpReturns: string[];
  mcpConfigLabel: string; mcpCallLabel: string; agentGuide: string; tryApp: string;
  errorsTitle: string; errorsDescription: string; errorHeads: string[]; errorWhen: string[];
  openapi: string; footer: string[]; positions: string; card: string; cards: string;
};

export const COPY = {
  en: {
    nav: ["Overview", "Quickstart", "Endpoints", "Spreads", "Card pools", "MCP", "Errors"],
    onPage: "On this page",
    asideNote: "Read-only REST and MCP. Franklin knows the cards and the spreads; your app owns the reading.",
    heroEyebrow: "REST API · MCP · Open source",
    heroDescription: "A read-only tarot service for apps and AI agents: 78 bilingual cards, real spreads with positions and card pools, and random spread draws. Your app decides orientation and owns the reading.",
    quickstart: "Quickstart", reference: "Reference", stats: ["Cards", "Spreads", "Locales"],
    firstRequest: "Your first reading", quickDescription: "Load the deck and the spreads once, then draw a spread and decide orientation in your app.",
    quickFields: ["Base URL", "Auth", "Locales", "Methods"],
    auth: "None. No key required.", spreadChoice: "en or zh-CN, as ?locale=. Default zh-CN.",
    copied: "Copied", copy: "Copy",
    loadLabel: "1 · load the deck and spreads",
    drawIntro: "Franklin draws one card per position from that position's pool, never repeating a card. Your app decides upright or reversed. Call only for an explicitly requested delegated draw; retries sample again, with no seed or idempotency key. Frankie keeps manual selection local:",
    drawResultLabel: "result",
    equivalentCurl: "Equivalent cURL request",
    statelessNote: "Franklin does not store or interpret readings. Your app decides orientation and keeps the reading; tarot is for reflection, not factual prediction.",
    endpointsTitle: "Reference", endpointsDescription: "Every endpoint is a GET with JSON out. The responses below are real output; “…” marks a shortened field.",
    endpointDescriptions: [
      "Service health check.",
      "One card by its stable ID: maj00–maj21 for the major arcana, wandsNN, cupsNN, swordsNN or pentsNN (01–14) for the minor arcana.",
      "Every card, or those matching a search. With no filters it returns all 78 in catalog order. There is no pagination.",
      "n distinct cards in random order. Cards carry no orientation: your app decides upright or reversed. Responses are not cached.",
      "The 11 spreads with positions in draw order, localized labels, one card pool per position, layout and interpretation guidance.",
      "Card artwork as WebP, in three styles. The URLs come from each card's imageUrls; ?v= changes whenever the artwork does, so images are cached for a year.",
      "One random card per position, from that position's card pool, never repeating a card. Cards carry no orientation: your app decides upright or reversed. Responses are not cached.",
    ],
    paramHeads: ["Parameter", "Values", "Description"],
    paramNotes: {
      id: "Stable card ID, e.g. maj00 or cups12",
      locale: "Language of name and labels. Default zh-CN",
      q: "Search names, keywords, descriptions and meanings, up to 120 characters",
      arcana: "Major or minor arcana",
      suit: "Minor arcana suit",
      n: "How many cards, 1–78. Default 1",
      style: "cards (redraw), cards_dreamy or cards_rws_original",
      spreadId: "A spread ID from /api/v1/spreads",
    },
    request: "request", response: "response",
    imageStyles: ["redraw", "dreamy", "1909 original"], imageHtml: "html",
    spreadTitle: "See the spreads", spreadDescription: "Each diagram uses the same relative card positions as the Frankie app. Numbers show draw order; labels name each position.", spreadLoadError: "Spread layouts could not be loaded. Try refreshing.", spreadLoading: "Loading spread layouts…", spreadDataNote: "Positions and localized labels come from", spreadPoolNote: "each position's card pool says which cards may be drawn there.",
    poolTitle: "Card pools", poolDescription: "Each spread lists one pool per position in cardPools. A draw takes each position's card from its pool and never repeats a card. Membership follows each card's suit and rank.",
    poolMembers: ["All 78 cards", "suit is null: the 22 major arcana", "Minor arcana with rank 1–10 (40 cards)", "Minor arcana with rank 11–14: Page, Knight, Queen, King (16 cards)", "All 14 cards whose suit matches"],
    mcpTitle: "Agent MCP", mcpDescription: "A stateless Streamable HTTP MCP server with the same data as REST, for agents that look up cards and spreads, draw spreads or take random cards. Orientation and the reading stay with the calling app.",
    mcpHeads: ["Tool", "Arguments", "Returns"],
    mcpReturns: ["Every matching card", "One card", "n distinct random cards, without orientation", "The 11 spreads with positions and card pools", "One card per position, without orientation"],
    mcpConfigLabel: "MCP client config", mcpCallLabel: "call a tool", agentGuide: "Agent guide", tryApp: "Try Frankie Tarot",
    errorsTitle: "Errors", errorsDescription: "Every error shares one JSON envelope with a stable code. Fix the request rather than retrying it unchanged.",
    errorHeads: ["Status", "Code", "When"],
    errorWhen: ["A parameter is out of range, such as n=0 or locale=fr", "No card has that ID, e.g. /api/v1/cards/nope", "No spread has that ID, e.g. /api/v1/spreads/NOPE/draw", "No route matches", "Any method other than GET"],
    openapi: "OpenAPI schema", footer: ["For reflection, not prediction", "Source"],
    positions: "positions in draw order", card: "card", cards: "cards",
  },
  "zh-CN": {
    nav: ["概览", "快速开始", "接口", "牌阵", "牌池", "MCP", "错误"],
    onPage: "本页导航",
    asideNote: "只读的 REST 与 MCP。Franklin 只知道牌和牌阵，牌局由你的应用负责。",
    heroEyebrow: "REST API · MCP · 开源",
    heroDescription: "为应用和 AI Agent 提供的只读塔罗服务：78 张中英文牌、含位置与牌池的真实牌阵，并按牌阵随机抽牌。正逆位和牌局由你的应用负责。",
    quickstart: "快速开始", reference: "接口参考", stats: ["张牌", "种牌阵", "种语言"],
    firstRequest: "完成第一次抽牌", quickDescription: "先加载一次牌库和牌阵，再抽牌，并在你的应用里决定正逆位。",
    quickFields: ["服务地址", "身份验证", "语言", "请求方法"],
    auth: "无需密钥。", spreadChoice: "en 或 zh-CN，用 ?locale= 指定，默认 zh-CN。",
    copied: "已复制", copy: "复制",
    loadLabel: "1 · 加载牌库和牌阵",
    drawIntro: "Franklin 从每个位置的牌池里各抽一张，同一局不重复。正逆位由你的应用决定。仅在用户明确要求代抽时调用；没有 seed 或幂等键，重试会重新采样。Frankie 仍由用户在本地选牌：",
    drawResultLabel: "结果",
    equivalentCurl: "对应的 cURL 请求",
    statelessNote: "Franklin 不保存牌局，也不做解读。正逆位和牌局状态由你的应用负责；塔罗用于反思，不用于确定性预测。",
    endpointsTitle: "接口参考", endpointsDescription: "所有接口都是 GET，返回 JSON。下面的返回都是真实数据，“…”表示省略了部分内容。",
    endpointDescriptions: [
      "服务健康检查。",
      "按稳定 ID 获取一张牌：大阿卡那为 maj00–maj21，小阿卡那为 wandsNN、cupsNN、swordsNN、pentsNN（01–14）。",
      "返回全部牌，或按条件搜索。不带筛选时按牌库顺序返回全部 78 张，没有分页。",
      "随机返回 n 张不重复的牌。不含正逆位，由你的应用决定。结果不缓存。",
      "11 种牌阵：按抽牌顺序排列的位置、本地化标签、每个位置的牌池、布局和解读指引。",
      "WebP 格式的卡牌图片，共三种画风。地址来自每张牌的 imageUrls；画面更新时 ?v= 会变，所以图片缓存一年。",
      "为每个位置从它的牌池里随机抽一张，同一局不重复。不含正逆位，由你的应用决定。结果不缓存。",
    ],
    paramHeads: ["参数", "取值", "说明"],
    paramNotes: {
      id: "牌的稳定 ID，例如 maj00、cups12",
      locale: "牌名和标签的语言，默认 zh-CN",
      q: "搜索牌名、关键词、描述和牌义，最长 120 字符",
      arcana: "大阿卡那或小阿卡那",
      suit: "小阿卡那的花色",
      n: "取几张，1–78，默认 1",
      style: "cards（重绘）、cards_dreamy 或 cards_rws_original",
      spreadId: "来自 /api/v1/spreads 的牌阵 ID",
    },
    request: "请求", response: "返回",
    imageStyles: ["重绘", "梦境", "1909 原版"], imageHtml: "html",
    spreadTitle: "查看牌阵", spreadDescription: "牌阵图使用与 Frankie 应用相同的相对位置。数字表示抽牌顺序，下方列出每个位置的含义。", spreadLoadError: "无法加载牌阵布局，请刷新后重试。", spreadLoading: "正在加载牌阵…", spreadDataNote: "相对位置和本地化标签来自", spreadPoolNote: "每个位置的牌池决定该位置可以抽到哪些牌。",
    poolTitle: "牌池", poolDescription: "每个牌阵的 cardPools 为每个位置给出一个牌池。抽牌时每个位置的牌都来自它的牌池，同一局不重复。牌池按每张牌的 suit 和 rank 划分。",
    poolMembers: ["全部 78 张", "suit 为 null：22 张大阿卡那", "rank 为 1–10 的小阿卡那（40 张）", "rank 为 11–14 的小阿卡那：侍从、骑士、王后、国王（16 张）", "suit 匹配的全部 14 张"],
    mcpTitle: "Agent MCP", mcpDescription: "无状态的 Streamable HTTP MCP 服务，数据与 REST 相同，供 Agent 查询牌和牌阵、按牌阵抽牌或随机取牌。正逆位和牌局由调用方应用负责。",
    mcpHeads: ["工具", "参数", "返回"],
    mcpReturns: ["全部匹配的牌", "一张牌", "n 张不重复的随机牌，不含正逆位", "11 种牌阵，含位置和牌池", "每个位置一张牌，不含正逆位"],
    mcpConfigLabel: "MCP 客户端配置", mcpCallLabel: "调用工具", agentGuide: "Agent 接入指南", tryApp: "体验 Frankie Tarot",
    errorsTitle: "错误", errorsDescription: "所有错误都使用同一种 JSON 结构，并带有稳定的错误码。应修正请求，不要原样重试。",
    errorHeads: ["状态码", "错误码", "何时出现"],
    errorWhen: ["参数超出范围，例如 n=0 或 locale=fr", "没有这个 ID 的牌，例如 /api/v1/cards/nope", "没有这个 ID 的牌阵，例如 /api/v1/spreads/NOPE/draw", "没有匹配的路径", "使用了 GET 以外的方法"],
    openapi: "OpenAPI Schema", footer: ["用于反思，不作预测", "源码"],
    positions: "按抽牌顺序排列", card: "张牌", cards: "张牌",
  },
} satisfies Record<Locale, CopySet>;
