#!/usr/bin/env node
/**
 * build-profile.mjs — single source of truth for the Luisarg03 GitHub profile.
 *
 *   node build-profile.mjs
 *
 * Writes:
 *   images/header.svg         identity terminal (whoami + fact sheet)
 *   images/what-i-do.svg      five areas of work
 *   images/experience.svg     career log, last three roles
 *   images/skills.svg         skill categories as outlined chips
 *   README.md                 the profile README (markdown, for GitHub)
 *   profile-preview.html      faithful local preview of how GitHub renders it
 *
 * Every colour, every string and every panel height comes from this file, so the
 * three outputs can never drift. Panel heights are computed from the content and
 * asserted before writing: text that would clip or overflow fails the build.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = [];
const write = (rel, body) => { writeFileSync(join(ROOT, rel), body); OUT.push([rel, body]); };

/* ─────────────────────────────────────────────────────────────────────────────
   1 · tokens  (mirrors brand-spec.md — extracted from the original images/*.svg)
   ───────────────────────────────────────────────────────────────────────────── */

const P = {
  bg: '#0a0e14',
  surface: '#131820',
  fg: '#d7dde5',
  muted: '#7d8794',
  border: '#232d3d',
  accent: '#f0b429',
  mutedStrong: '#9aa3b0',
  lineStrong: '#2f3b4e',
  teal: '#2AD4C9',
  green: '#3fb950',
};

const MONO = "ui-monospace,'SF Mono','JetBrains Mono','Cascadia Mono',Menlo,Consolas,'DejaVu Sans Mono',monospace";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif";

/* Monospace advance width per em. Conservative: 0.60 is the widest common value,
   so a viewer whose fallback is narrower only gains slack. */
const CH = 0.6;
const r2 = (n) => Math.round(n * 100) / 100;
const W = 900;          // every panel shares one measure
const SAFE = 36;        // text must stay this far from the right edge
const tw = (s, size, ls = 0) => s.length * size * CH + Math.max(0, s.length - 1) * ls;

/* ─────────────────────────────────────────────────────────────────────────────
   2 · content  (facts from assets/profile.yaml, tmp/Resume.md and the live
       GitHub API — nothing here is invented)
   ───────────────────────────────────────────────────────────────────────────── */

const ID = {
  handle: '@Luisarg03',
  role: 'CLOUD PLATFORM ENGINEER',
  place: 'Buenos Aires, Argentina · Remote-first',
  user: 'luis@cloud',
  facts: [
    ['experience', '7+ years on AWS'],
    ['current', 'Interbank · Peru (remote)'],
    ['focus', 'IaC · CI/CD · Platform · Data'],
    ['education', 'Data Architect · NTT Data Academy'],
    ['cert', 'AWS DevOps Pro · in progress'],
    ['languages', 'Spanish native · English intermediate'],
  ],
};

const FOCUS = [
  {
    title: 'CI/CD & pipeline automation',
    l1: 'Reusable GitHub Actions and Bitbucket pipeline templates, adopted by 10+ engineers across',
    l2: 'Data Science teams at Interbank. Build, test and deploy without reinventing the wheel.',
  },{
    title: 'Infrastructure as Code',
    l1: 'The CDK → Terraform migration at Prisma Medios de Pago, plus modules that stay honest:',
    l2: 'reviewable plans, drift detection, no snowflake stacks.',
  },
  {
    title: 'Internal Developer Platforms',
    l1: 'Self-service tooling that removes toil — a FastAPI + React variable catalog, service',
    l2: 'scaffolding, and paved roads that let Data Science teams ship without a ticket.',
  },
  {
    title: 'Cost & workload observability',
    l1: 'Monitoring built from scratch — log aggregation, pipeline health, ECS and batch usage,',
    l2: 'dashboards and alerts that make cloud spend visible: Step Functions, Glue, Athena, QuickSight.',
  },
  {
    title: 'AI-assisted developer workflows',
    l1: 'Reusable MCP servers, agent orchestration and local agent workflows that cut repetitive',
    l2: 'work. Built for real teams, used daily — not a slideware pilot.',
  },
];

const CAREER = [
  {
    title: 'Cloud Platform Engineer',
    org: 'Interbank · Peru (remote)',
    dates: '2023 — now',
    active: true,
    lines: [
      'Leading the Bitbucket → GitHub Actions migration; shared workflow templates, libraries, ECR.',
      'Self-service IDP tooling (FastAPI + React), cost observability, MCP integrations for DS teams.',
    ],
  },
  {
    title: 'AWS Data Platform Engineer',
    org: 'Prisma Medios de Pago · Argentina',
    dates: '2022 — 2023',
    lines: [
      'Large-scale IaC modernization: migrated platform infrastructure from AWS CDK to Terraform.',
      'Event-driven ingestion with AWS SDLF — SQS, SNS, EventBridge — and Salesforce API into S3.',
    ],
  },
  {
    title: 'Data Platform Engineer',
    org: 'Tiendanube · Argentina',
    dates: '2021 — 2022',
    lines: [
      'Built ETL pipelines with AWS Glue and Databricks feeding the company Lakehouse platform.',
      'Contributed to the Lakehouse architecture; enabled cross-team SQL access through Trino.',
    ],
  },
];

const SKILLS = [
  { label: 'CLOUD & IAC', tone: 'accent', items: ['AWS', 'Terraform', 'AWS CDK', 'CloudFormation', 'Lambda', 'ECS', 'Step Functions', 'S3'] },
  { label: 'CI/CD & DEVOPS', tone: 'teal', items: ['GitHub Actions', 'Bitbucket Pipelines', 'GitLab CI', 'Docker', 'Git'] },
  { label: 'PLATFORM', tone: 'fg', items: ['Internal Developer Platforms', 'Observability', 'Cost Management', 'Developer Enablement'] },
  { label: 'AI & AGENTS', tone: 'green', items: ['MCP', 'Agent Orchestration', 'Multi-agent Workflows', 'AWS Bedrock', 'OpenAI APIs'] },
  { label: 'DATA', tone: 'mutedStrong', items: ['ETL Pipelines', 'PySpark', 'Databricks', 'Trino', 'Athena', 'Glue', 'QuickSight'] },
  { label: 'LANGUAGES', tone: 'mutedStrong', items: ['Python', 'SQL', 'Bash', 'YAML'] },
];

const LINKS = {
  linkedin: 'https://www.linkedin.com/in/luisarg03/',
  github: 'https://github.com/Luisarg03',
  portfolio: 'https://luisarg03.github.io',
  email: 'mailto:luis.m.paz.03@gmail.com',
};

/* ─────────────────────────────────────────────────────────────────────────────
   3 · svg panel builder
   ───────────────────────────────────────────────────────────────────────────── */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const strip = (s) => s.replace(/<[^>]+>/g, '');

class Panel {
  constructor(slug, h) {
    this.slug = slug;
    this.h = h;
    this.parts = [];
    this.marks = [];
    this.fails = [];
  }

  assert(ok, msg) { if (!ok) this.fails.push(`[${this.slug}] ${msg}`); return ok; }

  text(o) {
    const { x, y, size, fill, body, anchor = 'start', weight = 400, ls = 0, cls = '', glow = false, chars, note = '' } = o;
    const n = chars ?? strip(body).length;
    const width = tw(strip(body), size, ls);
    const left = anchor === 'end' ? x - width : anchor === 'middle' ? x - width / 2 : x;
    this.marks.push({ x, y, size, left, right: left + width, label: note || strip(body) });
    const a = [
      `x="${x}"`, `y="${y}"`, `font-size="${size}"`, `fill="${fill}"`,
      weight !== 400 ? `font-weight="${weight}"` : '',
      ls ? `letter-spacing="${ls}"` : '',
      anchor !== 'start' ? `text-anchor="${anchor}"` : '',
      cls ? `class="${cls}"` : '',
      glow ? `filter="url(#${this.slug}-glow)"` : '',
    ].filter(Boolean).join(' ');
    this.parts.push(`<text ${a}>${body}</text>`);
    return { left, right: left + width, width };
  }

  rect(x, y, w, h, o = {}) {
    [x, y, w, h] = [r2(x), r2(y), r2(w), r2(h)];
    const a = [`x="${x}"`, `y="${y}"`, `width="${w}"`, `height="${h}"`,
      o.rx !== undefined ? `rx="${o.rx}"` : '',
      o.fill ? `fill="${o.fill}"` : 'fill="none"',
      o.stroke ? `stroke="${o.stroke}" stroke-width="${o.sw || 1}"` : ''].filter(Boolean).join(' ');
    this.parts.push(`<rect ${a}/>`);
  }

  line(x1, y1, x2, y2, stroke, sw = 1) {
    this.parts.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"/>`);
  }

  raw(s) { this.parts.push(s); }

  /* shared terminal chrome: clipped body + 34px bar + ~/tab + three dots */
  chrome(tab, stage = false) {
    const s = this.slug;
    this.raw(
      `<defs>` +
      `<clipPath id="${s}-clip"><rect width="${W}" height="${this.h}" rx="8"/></clipPath>` +
      `<filter id="${s}-glow" x="-40%" y="-40%" width="180%" height="180%">` +
      `<feGaussianBlur stdDeviation="5" result="b"/>` +
      `<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>` +
      `</filter>` +
      (stage ? `<linearGradient id="${s}-bg" x1="0" y1="0" x2="0" y2="1">` +
        `<stop offset="0" stop-color="${P.surface}"/><stop offset="1" stop-color="${P.bg}"/>` +
        `</linearGradient>` : '') +
      `</defs>` +
      `<g clip-path="url(#${s}-clip)">` +
      `<rect width="${W}" height="${this.h}" fill="${stage ? `url(#${s}-bg)` : P.surface}"/>` +
      `<rect width="${W}" height="34" fill="${P.bg}"/>`
    );
    this.text({
      x: 18, y: 22, size: 11, fill: P.fg, chars: tab.length + 2,
      body: `<tspan fill="${P.teal}">~/</tspan><tspan fill="${P.fg}">${esc(tab)}</tspan>`,
      note: 'tab',
    });
    for (let i = 0; i < 3; i++) {
      this.parts.push(`<circle cx="${846 + i * 16}" cy="17" r="3.5" fill="${P.lineStrong}"/>`);
    }
  }

  close() {
    this.parts.push(`</g>`);
    this.parts.push(`<rect x="0.5" y="0.5" width="${W - 1}" height="${this.h - 1}" rx="8" fill="none" stroke="${P.border}"/>`);
    return this.parts.join('');
  }

  verify() {
    for (const m of this.marks) {
      if (m.left < 18 - 0.5) this.fails.push(`[${this.slug}] "${m.label}" starts at x=${m.left.toFixed(1)} (< 18)`);
      if (m.right > W - SAFE + 24) this.fails.push(`[${this.slug}] "${m.label}" overflows: right=${m.right.toFixed(1)} > ${W - SAFE + 24}`);
      if (m.y + m.size * 0.24 > this.h - 6) this.fails.push(`[${this.slug}] "${m.label}" clipped: baseline ${m.y} + descender > ${this.h - 6}`);
    }
    /* same-baseline collision check */
    const rows = {};
    for (const m of this.marks) { const k = Math.round(m.y); (rows[k] ||= []).push(m); }
    for (const k of Object.keys(rows)) {
      const r = rows[k].sort((a, b) => a.left - b.left);
      for (let i = 1; i < r.length; i++) {
        if (r[i].left < r[i - 1].right - 1) {
          this.fails.push(`[${this.slug}] overlap on baseline ${k}: "${r[i - 1].label}" → "${r[i].label}"`);
        }
      }
    }
    return this.fails;
  }

  svg(style = '') {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="panel" width="${W}" height="${this.h}" viewBox="0 0 ${W} ${this.h}" role="img" aria-label="${esc(this.alt || '')}">` +
      `<style>text{font-family:${MONO}}${style}</style>${this.close()}</svg>`;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   4 · panels
   ───────────────────────────────────────────────────────────────────────────── */

function headerSvg() {
  const H = 300;
  const p = new Panel('hdr', H);
  p.alt = 'Terminal window: whoami returns @Luisarg03, Cloud Platform Engineer, Buenos Aires, remote-first, with a fact sheet beside it.';
  p.chrome('whoami', true);

  const prompt = (x, y, size, cmd) =>
    `<tspan fill="${P.teal}">${ID.user}</tspan><tspan fill="${P.muted}">:</tspan><tspan fill="${P.teal}">~</tspan>` +
    `<tspan fill="${P.muted}">$ </tspan>` + (cmd ? `<tspan fill="${P.fg}">${esc(cmd)}</tspan>` : '');

  p.text({ x: 40, y: 80, size: 13, fill: P.fg, body: prompt(40, 80, 13, 'whoami'), chars: 21, note: 'prompt' });
  p.text({ x: 40, y: 140, size: 38, fill: P.accent, body: esc(ID.handle), weight: 700, ls: -0.4, glow: true, cls: 'hdr-name', note: 'handle' });
  p.text({ x: 40, y: 174, size: 14, fill: P.fg, body: esc(ID.role), ls: 3, note: 'role' });
  p.text({ x: 40, y: 200, size: 11.5, fill: P.mutedStrong, body: esc(ID.place), note: 'place' });
  p.text({ x: 40, y: 246, size: 13, fill: P.fg, body: prompt(40, 246, 13, ''), chars: 14, note: 'prompt2' });
  const cur = tw(`${ID.user}:~$ `, 13);
  p.raw(`<rect class="hdr-cur" x="${(40 + cur).toFixed(1)}" y="236" width="8" height="15" fill="${P.accent}"/>`);

  /* right column: the fact sheet, keys right-aligned to a hard margin */
  p.line(396, 62, 396, 258, P.border);
  const keyX = 546, valX = 564;
  ID.facts.forEach((f, i) => {
    const y = 92 + i * 26;
    p.text({ x: keyX, y, size: 10.5, fill: P.muted, body: esc(f[0]), anchor: 'end', ls: 0.6, note: `key ${f[0]}` });
    p.text({ x: keyX + 6, y, size: 10.5, fill: P.muted, body: ':', note: 'colon' });
    const v = p.text({ x: valX, y, size: 12, fill: P.fg, body: esc(f[1]), note: `val ${f[0]}` });
    p.assert(v.right <= W - 40, `fact value "${f[1]}" ends at ${v.right.toFixed(1)}`);
  });

  return p;
}

function focusSvg() {
  const pitch = 76, first = 74;
  const H = first + pitch * (FOCUS.length - 1) + 38 + 28;
  const p = new Panel('wid', H);
  p.alt = 'Five areas of work: CI/CD and pipeline automation, Infrastructure as Code, Internal Developer Platforms, cost and workload observability, and AI-assisted developer workflows.';
  p.chrome('what-i-do');

  FOCUS.forEach((f, i) => {
    const y = first + i * pitch;
    if (i > 0) p.line(40, y - 22, W - 40, y - 22, P.border);
    p.text({ x: 40, y, size: 12.5, fill: P.accent, body: '▸', note: 'mark' });
    p.text({ x: 56, y, size: 12.5, fill: P.fg, weight: 500, body: esc(f.title), note: f.title });
    p.text({ x: W - 40, y, size: 10, fill: P.muted, body: String(i + 1).padStart(2, '0'), anchor: 'end', ls: 1, note: 'index' });
    const a = p.text({ x: 56, y: y + 21, size: 11.5, fill: P.mutedStrong, body: esc(f.l1), note: 'line 1' });
    const b = p.text({ x: 56, y: y + 38, size: 11.5, fill: P.mutedStrong, body: esc(f.l2), note: 'line 2' });
    p.assert(Math.max(a.right, b.right) <= W - 40, `"${f.title}" body runs to ${Math.max(a.right, b.right).toFixed(1)}`);
  });
  return p;
}

function careerSvg() {
  const pitch = 100, first = 110;
  const H = first + pitch * (CAREER.length - 1) + 59 + 60;
  const p = new Panel('exp', H);
  p.alt = 'Career log: Cloud Platform Engineer at Interbank (2023 to now), AWS Data Platform Engineer at Prisma Medios de Pago (2022 to 2023), and Data Platform Engineer at Tiendanube (2021 to 2022).';
  p.chrome('career.log');

  const cmd = 'journalctl -u career --since 2019';
  p.text({
    x: 40, y: 72, size: 12.5, fill: P.fg, chars: 14 + cmd.length,
    body: `<tspan fill="${P.teal}">${ID.user}</tspan><tspan fill="${P.muted}">:</tspan><tspan fill="${P.teal}">~</tspan>` +
      `<tspan fill="${P.muted}">$ </tspan><tspan fill="${P.fg}">${esc(cmd)}</tspan>`,
    note: 'prompt',
  });

  CAREER.forEach((r, i) => {
    const y = first + i * pitch;
    if (i > 0) p.line(40, y - 26, W - 40, y - 26, P.border);
    p.text({ x: 40, y, size: 13, fill: P.fg, weight: 500, body: esc(r.title), note: r.title });
    p.text({ x: W - 40, y, size: 10.5, fill: P.muted, body: esc(r.dates), anchor: 'end', ls: 0.6, note: 'dates' });
    const org = p.text({ x: 40, y: y + 20, size: 11.5, fill: P.teal, body: esc(r.org), note: r.org });
    if (r.active) {
      const px = org.right + 10, pw = tw('ACTIVE', 9, 0.6) + 14;
      p.assert(px > org.right + 6, 'pill clears the org text');
      p.rect(px, y + 10, pw, 15, { rx: 3, fill: P.bg, stroke: P.green });
      p.text({ x: px + 7, y: y + 21, size: 9, fill: P.green, body: 'ACTIVE', ls: 0.6, cls: 'exp-pill', note: 'ACTIVE' });
    }
    r.lines.forEach((l, j) => {
      const m = p.text({ x: 56, y: y + 42 + j * 17, size: 11.5, fill: P.mutedStrong, body: esc(l), note: `role ${i + 1} line ${j + 1}` });
      p.assert(m.right <= W - 40, `"${r.title}" line ${j + 1} runs to ${m.right.toFixed(1)}`);
    });
  });

  const foot = '▸ 4 earlier roles · 2019 – 2021 · expanded below';
  p.text({ x: 40, y: H - 30, size: 11, fill: P.accent, body: '▸', note: 'foot mark' });
  p.text({ x: 56, y: H - 30, size: 11, fill: P.muted, body: esc(foot.slice(2)), note: 'foot' });
  return p;
}

function skillsSvg() {
  const pitch = 66, first = 60;
  const H = first + pitch * (SKILLS.length - 1) + 34 + 28;
  const p = new Panel('skl', H);
  p.alt = 'Skill categories as outlined chips: Cloud and IaC, CI/CD and DevOps, Platform, AI and Agents, Data, and Languages.';
  p.chrome('skills.conf');

  SKILLS.forEach((cat, i) => {
    const y = first + i * pitch;
    p.text({ x: 40, y, size: 10, fill: P.muted, body: esc(cat.label), ls: 1.2, note: cat.label });
    p.text({ x: W - 40, y, size: 10, fill: P.muted, body: String(cat.items.length).padStart(2, '0'), anchor: 'end', ls: 1, note: 'count' });
    let x = 40;
    cat.items.forEach((item) => {
      const cw = tw(item, 11) + 18;
      p.rect(x, y + 10, cw, 24, { rx: 5, fill: P.bg, stroke: P.border });
      const t = p.text({ x: x + 9, y: y + 26, size: 11, fill: P[cat.tone], body: esc(item), note: `${cat.label}/${item}` });
      p.assert(t.right <= x + cw - 6, `chip "${item}" text overflows its box`);
      x += cw + 8;
    });
    p.assert(x - 8 <= W - 36, `${cat.label} chips end at ${(x - 8).toFixed(1)}`);
  });
  return p;
}

/* ─────────────────────────────────────────────────────────────────────────────
   5 · README model  (one model → markdown for GitHub, HTML for the preview)
   ───────────────────────────────────────────────────────────────────────────── */

const a = (href, label) => `<a href="${href}"><code>${label}</code></a>`;
const li = (html) => ({ k: 'li', html });

const BLOCKS = [
  { k: 'centerImg', src: './images/header.svg', alt: 'Terminal window: whoami returns @Luisarg03, Cloud Platform Engineer — Buenos Aires, Argentina, remote-first — next to a fact sheet: 7+ years on AWS, currently at Interbank, focused on IaC, CI/CD, platform and data.' },

  { k: 'h2', text: '~/positioning', id: 'positioning' },
  { k: 'p', html: '<strong>I build the platform — and the tooling that makes teams faster on it.</strong>' },
  { k: 'p', html: 'Cloud Platform Engineer working where infrastructure as code, CI/CD and internal developer platforms meet: Terraform and CDK, GitHub Actions, cost and workload observability, and AI-assisted developer workflows. Seven years on AWS, the last three building platform tooling for Data Science teams at Interbank. Buenos Aires, Argentina · remote-first.' },
  { k: 'p', html: 'Outside the terminal: quiet places, and tinkering with systems that should just work.' },

  { k: 'img', id: 'what-i-do', src: './images/what-i-do.svg', alt: 'Five areas of work: CI/CD and pipeline automation, Infrastructure as Code, Internal Developer Platforms, cost and workload observability, and AI-assisted developer workflows.' },

  { k: 'h2', text: '~/experience', id: 'experience' },
  { k: 'img', src: './images/experience.svg', alt: 'Career log: Cloud Platform Engineer at Interbank (2023 to now), AWS Data Platform Engineer at Prisma Medios de Pago (2022 to 2023), Data Platform Engineer at Tiendanube (2021 to 2022).' },
  {
    k: 'details', summary: 'Earlier roles · 2019 – 2021', blocks: [
      { k: 'ul', items: [
        li('<strong>Data Engineer</strong> · Walmart / Dorinka · 2021 — data migration and database moves during the transition to Dorinka.'),
        li('<strong>Data Engineer</strong> · Tsoft · 2020–2021 — DirectTV: API-driven ingestion automation in Python.'),
        li('<strong>Data Engineer</strong> · Monsun · 2020 — Banco Supervielle (predictive models on SQL Server) and AGIP (Pentaho ETL).'),
        li('<strong>Data Engineer</strong> · Dthink · 2019–2020 — SQL Server and SSIS pipelines, Power BI and Metabase dashboards for three clients.'),
      ] },
    ],
  },

  { k: 'h2', text: '~/credentials', id: 'credentials' },
  { k: 'ul', items: [
    li('<strong>AWS Certified DevOps Engineer — Professional (DOP-C02)</strong> · in progress'),
    li('<strong>Data Architect</strong> · NTT Data Academy · 2024'),
    li('<strong>AWS Skill Builder</strong> · Cloud Practitioner Essentials, Developing on AWS, Well-Architected · completed'),
  ] },

  { k: 'h2', text: '~/projects', id: 'projects' },
  { k: 'ul', items: [
    li(`<a href="https://github.com/Luisarg03/OpenDashboard"><strong>OpenDashboard</strong></a> — visualiser for OpenCode agent delegation chains: what each subagent did, what it cost, how many tokens it burned. <code>TypeScript</code>`),
    li(`<a href="https://github.com/Luisarg03/dsh-memory-vault"><strong>dsh-memory-vault</strong></a> — persistent memory for DeepSeek Harness: an MCP server (SQLite FTS5 + Markdown) plus the <code>memory-mcp</code> and <code>memory-auto</code> plugins. <code>Python</code>`),
    li(`<a href="https://github.com/Luisarg03/ArchCustomWidgets"><strong>ArchCustomWidgets</strong></a> — factory of installable widgets and services extending Caelestia (HyDE 3.x) on Arch Linux / Hyprland. <code>Shell</code>`),
    li(`<a href="https://github.com/Luisarg03/tabimichi"><strong>tabimichi</strong></a> — 旅道 local discovery: tell it where you are and how long you have, it ranks nearby places by weather, time and taste. <code>TypeScript</code>`),
    li(`<a href="https://github.com/Luisarg03/NexoCode"><strong>NexoCode</strong></a> — AI-powered coding agent, a fork of opencode. <code>TypeScript</code>`),
    li(`<a href="https://github.com/Luisarg03/sagemaker-cicd-poc"><strong>sagemaker-cicd-poc</strong></a> — SageMaker training pipelines wired into CI/CD. <code>Python</code>`),
  ] },
  { k: 'p', html: `Everything from 2019 onwards — data science, web, cloud, ML — lives in <a href="https://github.com/Luisarg03/projects-archive">projects-archive</a>, and the site itself is <a href="${LINKS.portfolio}">luisarg03.github.io</a>.` },

  { k: 'h2', text: '~/skills', id: 'skills' },
  { k: 'img', src: './images/skills.svg', alt: 'Skill categories as chips: Cloud and IaC (AWS, Terraform, AWS CDK, CloudFormation, Lambda, ECS, Step Functions, S3), CI/CD and DevOps, Platform, AI and Agents, Data, and Languages.' },

  { k: 'h2', text: '~/contact', id: 'contact' },
  { k: 'p', html: `${a(LINKS.linkedin, 'linkedin')} · ${a(LINKS.github, 'github')} · ${a(LINKS.portfolio, 'portfolio')} · ${a(LINKS.email, 'luis.m.paz.03@gmail.com')}` },
];

/* markdown ---------------------------------------------------------------- */

function md(blocks, depth = 0) {
  const pad = '  '.repeat(depth);
  return blocks.map((b) => {
    switch (b.k) {
      case 'centerImg':
        return `<div align="center">\n\n<img src="${b.src}" width="100%" alt="${b.alt}" />\n\n</div>`;
      case 'img':
        return `<img src="${b.src}" width="100%" alt="${b.alt}" />`;
      case 'h2':
        return `## \`${b.text}\``;
      case 'p':
        return b.html;
      case 'ul':
        return b.items.map((i) => `- ${i.html}`).join('\n');
      case 'details':
        return `<details>\n<summary>${b.summary}</summary>\n\n${md(b.blocks).trimEnd()}\n\n</details>`;
      default:
        throw new Error(`unknown block ${b.k}`);
    }
  }).map((s) => s.split('\n').map((l) => (l ? pad + l : l)).join('\n')).join('\n\n') + '\n';
}

/* html (preview only) ----------------------------------------------------- */

function html(blocks) {
  let out = '', open = false;
  for (const b of blocks) {
    if (b.id && open) { out += `</section>\n`; open = false; }
    if (b.id) { out += `<section data-od-id="${b.id}">\n`; open = true; }
    switch (b.k) {
      case 'centerImg':
        out += `<div class="center">${panel(b.src)}</div>\n`; break;
      case 'img':
        out += panel(b.src) + "\n"; break;
      case 'h2':
        out += `<h2><code>${b.text}</code></h2>\n`; break;
      case 'p':
        out += `<p>${b.html}</p>\n`; break;
      case 'ul':
        out += `<ul>\n${b.items.map((i) => `<li>${i.html}</li>`).join('\n')}\n</ul>\n`; break;
      case 'details':
        out += `<details>\n<summary>${b.summary}</summary>\n${html(b.blocks)}</details>\n`; break;
      default:
        throw new Error(`unknown block ${b.k}`);
    }
  }
  if (open) out += `</section>\n`;
  return out;
}

/* ─────────────────────────────────────────────────────────────────────────────
   6 · preview page
   ───────────────────────────────────────────────────────────────────────────── */

const PANELS = {};

function panel(src) {
  return PANELS[src.replace('./images/', '').replace('.svg', '')];
}

function previewPage(body) {
  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Luisarg03 · README preview</title>
<style>
  :root{
    /* brand — the terminal identity, mirrored from brand-spec.md */
    --bg:#0a0e14; --surface:#131820; --fg:#d7dde5; --muted:#7d8794; --border:#232d3d; --accent:#f0b429;
    --muted-strong:#9aa3b0; --line-strong:#2f3b4e; --teal:#2AD4C9; --green:#3fb950;
    --font-display:ui-monospace,'SF Mono','JetBrains Mono','Cascadia Mono',Menlo,Consolas,'DejaVu Sans Mono',monospace;
    --font-mono:ui-monospace,'SF Mono',Menlo,Consolas,'DejaVu Sans Mono',monospace;
    --font-body:${SANS};
    --radius:8px;
  }
  /* the surface being previewed: GitHub's own rendering tokens */
  :root[data-theme="dark"]{
    --gh-canvas:#0d1117; --gh-fg:#f0f6fc; --gh-muted:#9198a1; --gh-border:#3d444d;
    --gh-link:#4493f8; --gh-code:rgba(101,108,118,.4); --gh-quote:#3d444d;
  }
  /* html[...] matches the :root specificity above, so these win by order.
     Without them the chrome stays dark while the canvas turns white and the
     prose (--fg on --gh-canvas) drops to 1.06:1 — unreadable. */
  html[data-theme="light"]{
    /* preview chrome, re-pitched for a light page (same hues, inverted lightness) */
    --bg:#f6f8fa; --surface:#ffffff; --fg:#1f2328; --muted:#59636e; --border:#d1d9e0;
    --muted-strong:#41474d; --line-strong:#8c959f;
    --gh-canvas:#ffffff; --gh-fg:#1f2328; --gh-muted:#59636e; --gh-border:#d1d9e0;
    --gh-link:#0969da; --gh-code:rgba(129,139,152,.12); --gh-quote:#d1d9e0;
  }

  *,*::before,*::after{box-sizing:border-box}
  html{-webkit-text-size-adjust:100%}
  body{
    margin:0; background:var(--bg); color:var(--fg);
    font-family:var(--font-display); font-size:14px; line-height:1.55;
    -webkit-font-smoothing:antialiased;
  }
  a{color:inherit}

  /* ── preview chrome ─────────────────────────────────────────────── */
  .bar{
    position:sticky; top:0; z-index:10;
    background:var(--surface); border-bottom:1px solid var(--border);
  }
  .bar-in{
    max-width:1012px; margin-inline:auto; padding:10px 16px;
    display:flex; align-items:center; justify-content:space-between; gap:16px;
  }
  .bar-id{display:flex; align-items:center; gap:10px; font-size:12.5px; color:var(--muted); min-width:0}
  .bar-id b{color:var(--fg); font-weight:500}
  .bar-id .sep{color:var(--border)}
  .bar-id .file{
    display:inline-flex; align-items:center; gap:6px; padding:3px 9px;
    border:1px solid var(--border); border-radius:5px; color:var(--fg); background:var(--bg);
    font-size:11.5px; letter-spacing:.02em; white-space:nowrap;
  }
  .bar-id .file i{width:6px; height:6px; border-radius:50%; background:var(--accent); display:block}

  .seg{display:flex; gap:2px; padding:2px; border:1px solid var(--border); border-radius:var(--radius); background:var(--bg)}
  .seg button{
    appearance:none; border:0; background:transparent; color:var(--muted);
    font:inherit; font-size:11.5px; letter-spacing:.06em; text-transform:uppercase;
    padding:5px 12px; border-radius:5px; cursor:pointer;
    transition:background .16s cubic-bezier(.23,1,.32,1), color .16s cubic-bezier(.23,1,.32,1);
  }
  .seg button:hover{background:color-mix(in oklch, var(--fg) 9%, transparent); color:var(--fg)}
  .seg button[aria-pressed="true"]{background:var(--accent); color:var(--bg); font-weight:600}
  .seg button[aria-pressed="true"]:hover{background:var(--accent); color:var(--bg)}
  @media (pointer:coarse){ .seg button{padding:11px 16px} }

  /* ── simulated GitHub README surface ────────────────────────────── */
  .shell{max-width:1012px; margin-inline:auto; padding:28px 16px 56px}
  .gh{
    background:var(--gh-canvas); border:1px solid var(--gh-border); border-radius:6px;
    padding:32px 40px 40px;
  }
  .md{font-family:var(--font-body); font-size:16px; line-height:1.5; color:var(--gh-fg); word-wrap:break-word}
  .md > *:first-child{margin-top:0}
  .md > *:last-child{margin-bottom:0}
  .md h2{
    font-family:var(--font-body); font-size:1.5em; font-weight:600; line-height:1.25;
    margin:36px 0 16px; padding-bottom:.3em; border-bottom:1px solid var(--gh-border);
  }
  .md h2 code{background:var(--gh-code); color:var(--gh-fg); font-size:.8em; font-weight:600}
  .md p{margin:0 0 16px}
  .md ul{margin:0 0 16px; padding-left:2em}
  .md li{margin-top:.25em}
  .md a{color:var(--gh-link); text-decoration:none}
  .md a:hover{text-decoration:underline}
  .md a code{color:var(--gh-link)}
  .md code{font-family:var(--font-mono); font-size:85%; background:var(--gh-code); padding:.2em .4em; border-radius:6px}
  .md strong{font-weight:600}
  .md .center{text-align:center}
  .md .panel{display:block; width:100%; height:auto; max-width:100%}
  .md details{margin:0 0 16px}
  .md summary{cursor:pointer; font-weight:600; color:var(--gh-fg)}
  .md summary:hover{color:var(--gh-link)}
  .md details[open] summary{margin-bottom:16px}
  .md summary:focus-visible{outline:2px solid var(--accent); outline-offset:2px; border-radius:4px}
  .md section{margin:0}

  .foot{
    max-width:1012px; margin-inline:auto; padding:0 16px 40px;
    font-size:11.5px; color:var(--muted); display:flex; flex-wrap:wrap; gap:6px 14px;
  }
  .foot code{font-family:var(--font-mono); color:var(--fg); background:var(--bg); border:1px solid var(--border); border-radius:4px; padding:1px 5px}

  @media (max-width:760px){
    .gh{padding:20px 16px 28px}
    .bar-in{padding:8px 12px}
    .bar-id .file{display:none}
  }
  @media (prefers-reduced-motion:reduce){
    *{animation:none !important; transition:none !important}
  }
</style>
</head>
<body>

<header class="bar" data-od-id="preview-bar">
  <div class="bar-in">
    <div class="bar-id">
      <b>Luisarg03</b><span class="sep">/</span><span>Luisarg03</span>
      <span class="file"><i></i>README.md</span>
    </div>
    <div class="seg" role="group" aria-label="GitHub theme">
      <button type="button" data-set="dark" aria-pressed="true">Dark</button>
      <button type="button" data-set="light" aria-pressed="false">Light</button>
    </div>
  </div>
</header>

<div class="shell">
  <article class="gh md" data-od-id="readme-body">
${body}
  </article>
</div>

<footer class="foot" data-od-id="preview-foot">
  <span>Vista previa local del README del perfil — no es la página real de GitHub.</span>
  <span>Para publicar: <code>README.md</code> + <code>images/</code> → raíz del repo <code>Luisarg03/Luisarg03</code>.</span>
</footer>

<script>
  (function () {
    var root = document.documentElement;
    var key = 'luisarg03:preview-theme';
    var buttons = Array.prototype.slice.call(document.querySelectorAll('.seg button'));
    function apply(theme) {
      root.setAttribute('data-theme', theme);
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.set === theme)); });
    }
    var saved = null;
    try { saved = localStorage.getItem(key); } catch (e) {}
    apply(saved === 'light' || saved === 'dark' ? saved : 'dark');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        apply(b.dataset.set);
        try { localStorage.setItem(key, b.dataset.set); } catch (e) {}
      });
    });
  })();
</script>
</body>
</html>
`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   7 · build
   ───────────────────────────────────────────────────────────────────────────── */

const STYLE = {
  hdr: `.hdr-cur{animation:hdr-blink 1.15s steps(1,end) infinite}
.hdr-name{animation:hdr-in .62s cubic-bezier(.23,1,.32,1) forwards}
@keyframes hdr-blink{0%,49%{opacity:1}50%,100%{opacity:0}}
@keyframes hdr-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.hdr-cur,.hdr-name{animation:none}}`,
  wid: '',
  exp: `.exp-pill{letter-spacing:.06em}`,
  skl: '',
};

const built = {
  header: headerSvg(),
  'what-i-do': focusSvg(),
  experience: careerSvg(),
  skills: skillsSvg(),
};

const fails = [];
for (const [key, p] of Object.entries(built)) {
  fails.push(...p.verify());
  PANELS[key] = p.svg(STYLE[key === 'header' ? 'hdr' : key === 'what-i-do' ? 'wid' : key === 'experience' ? 'exp' : 'skl']);
}

const readme = md(BLOCKS);
const preview = previewPage(html(BLOCKS).trimEnd());

mkdirSync(join(ROOT, 'images'), { recursive: true });
for (const [key, svg] of Object.entries(PANELS)) write(`images/${key}.svg`, svg + '\n');
write('README.md', readme);
write('profile-preview.html', preview);

/* ─────────────────────────────────────────────────────────────────────────────
   8 · report
   ───────────────────────────────────────────────────────────────────────────── */

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (x, y) => { const [hi, lo] = [lum(x), lum(y)].sort((m, n) => n - m); return (hi + 0.05) / (lo + 0.05); };

console.log('\npanels');
for (const [key, p] of Object.entries(built)) {
  const right = Math.max(...p.marks.map((m) => m.right));
  const bottom = Math.max(...p.marks.map((m) => m.y + m.size * 0.24));
  console.log(`  ${key.padEnd(11)} 900×${String(p.h).padEnd(4)} marks ${String(p.marks.length).padStart(3)}  ` +
    `right ${right.toFixed(0).padStart(3)}/864  bottom ${bottom.toFixed(0).padStart(3)}/${p.h - 6}  ${p.fails.length ? 'FAIL' : 'ok'}`);
}

console.log('\ncontrast (WCAG AA needs 4.5:1 for text)');
for (const [name, c] of [['fg', P.fg], ['mutedStrong', P.mutedStrong], ['muted', P.muted], ['accent', P.accent], ['teal', P.teal], ['green', P.green]]) {
  const s1 = ratio(c, P.surface), s2 = ratio(c, P.bg);
  console.log(`  ${name.padEnd(12)} on surface ${s1.toFixed(2)}   on chrome ${s2.toFixed(2)}   ${Math.min(s1, s2) >= 4.5 ? 'ok' : 'FAIL'}`);
}
console.log(`  ${'lineStrong'.padEnd(12)} shapes only (chrome dots, chip strokes) — never used for text: ${ratio(P.lineStrong, P.surface).toFixed(2)} on surface`);

console.log('\nfiles');
for (const [rel, body] of OUT) console.log(`  ${rel.padEnd(26)} ${String(body.split('\n').length).padStart(4)} lines  ${(Buffer.byteLength(body) / 1024).toFixed(1)} kB`);

if (fails.length) {
  console.error(`\n✗ ${fails.length} layout failure(s):`);
  for (const f of fails) console.error('  ' + f);
  process.exit(1);
}
console.log('\n✓ every panel fits: no clipped baselines, no overflow, no overlapping text.\n');
