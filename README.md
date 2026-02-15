# SEO Blog Engine

**The blog engine that optimizes your SEO automatically.**

Hugo and Astro give you a fast blog. We give you a blog that ranks.

SEO Blog Engine is a CLI tool that generates production-ready blog posts with all the SEO scaffolding you would spend 2+ hours setting up manually: optimized titles, meta descriptions, schema markup, internal linking structure, keyword placement guides, and a built-in SEO checklist. Every single time.

You write the content. We handle the SEO infrastructure.

## Pricing

**$29 — One-time purchase. Lifetime updates.**

[**Buy Now**](https://buy.stripe.com/eVq7sKeTjcxQa7q9RE08g02)

**What you get:**
- 4 SEO-optimized content templates (How-To, Listicle, Comparison, Ultimate Guide)
- Intelligent template detection based on your topic
- Batch generation from JSON (scale to 100+ posts)
- **NEW: Automatic sitemap.xml generation with smart priorities**
- **NEW: robots.txt generator with intelligent defaults**
- **NEW: Comprehensive SEO audit system (checks 12+ SEO factors)**
- **NEW: Open Graph & Twitter Card meta tag generation**
- **NEW: JSON-LD structured data (Article, Breadcrumb, Organization, WebSite)**
- **NEW: Image alt text suggestion engine**
- **NEW: 301 redirect management system**
- **NEW: Performance optimization guide (lazy loading, preconnect, critical CSS)**
- Outline mode for planning content calendars
- Keyword density tracking and placement guides
- Built-in SEO checklists for every post format
- Lifetime updates and future template additions

**Save $119:** Get this + 6 other products in the [Complete Bundle for $99](https://buy.stripe.com/5kQeVceTj0P8enGe7U08g06)

## Why SEO Blog Engine?

**Hugo, Astro, and Jekyll help you build fast sites. They do not help you rank.**

Those tools leave you staring at a blank markdown file with no guidance on:
- What H2 sections Google expects for your topic
- Where to place your target keywords
- How to structure FAQ schema for featured snippets
- What meta description length actually converts
- How to build internal linking architecture
- Whether your existing posts meet SEO standards

**SEO Blog Engine solves this.** Every generated post includes:

- SEO-optimized H1 titles with current year signals
- Meta descriptions at the ideal 150-160 character length
- Table of contents with jump links for user experience
- 5-8 H2 sections with strategic keyword distribution
- FAQ section with ready-to-paste JSON-LD schema markup
- Internal and external link placeholders with SEO context
- Image placeholders with ALT text reminders
- Keyword density targets and placement guides
- Complete SEO checklists you can review pre-publish
- **Automatic sitemap.xml generation for search engines**
- **Comprehensive SEO audit with actionable recommendations**
- **Open Graph & Twitter Card meta tags for social sharing**
- **301 redirect management to preserve link equity**

**The result:** You cut setup time from 2+ hours to 3 seconds, and you never miss an SEO element again. Plus, you get professional-grade SEO infrastructure that usually requires expensive plugins or custom development.

## SEO Blog Engine vs The Alternatives

| Feature | SEO Blog Engine | Astro / Hugo | Ghost | WordPress |
|---------|----------------|--------------|-------|-----------|
| **Fast static builds** | ✓ (output works with any SSG) | ✓ | ✗ | ✗ |
| **SEO-optimized titles** | ✓ Auto-generated with year | ✗ Manual | ✗ Manual | ~ Plugins required |
| **Meta descriptions** | ✓ Auto-generated, length-optimized | ✗ Manual | ✗ Manual | ~ Plugins required |
| **Schema markup** | ✓ JSON-LD for FAQs included | ✗ Manual | ~ Limited | ~ Plugins required |
| **Keyword placement guides** | ✓ Built-in | ✗ None | ✗ None | ~ Plugins required |
| **Internal linking structure** | ✓ Placeholders with context | ✗ Manual | ✗ Manual | ✗ Manual |
| **SEO checklists** | ✓ Per-post, format-specific | ✗ None | ✗ None | ✗ None |
| **Batch generation** | ✓ 100+ posts from JSON | ✗ None | ✗ None | ✗ None |
| **Template detection** | ✓ Intelligent | ✗ None | ✗ None | ✗ None |
| **Learning curve** | Minutes | Hours | Hours | Days |

**What we automate that they do not:**
- Astro/Hugo: Great for building fast sites, but they start with a blank markdown file. No SEO guidance.
- Ghost: Beautiful CMS, but you are on your own for SEO structure and schema markup.
- WordPress: Powerful but bloated. Requires 5+ plugins to match our built-in SEO features.

**We are not a replacement for these tools.** We are the missing layer between "blank page" and "SEO-optimized content." Use us to generate the structure, then publish with your favorite SSG.

## Quick Start

### Installation

```bash
# Install globally
npm install -g seo-blog-engine

# Or use directly with npx (no install)
npx seo-blog-engine generate --topic "Your Topic"
```

### Generate your first blog post (3 seconds)

```bash
seo-blog generate --topic "How to Deploy a Node.js App to AWS" \
  --keywords "Node.js deployment, AWS, EC2, deploy Node.js" \
  --output ./blog-posts/
```

**Output:** A complete markdown file with frontmatter, 7 H2 sections, FAQ schema, keyword guides, and an SEO checklist. Ready to fill in.

### Preview an outline before generating

```bash
seo-blog outline --topic "Kubernetes vs Docker Swarm" \
  --keywords "Kubernetes, Docker Swarm, container orchestration"
```

**Output:** A detailed content outline showing title, meta description, structure, and SEO recommendations.

### Batch generate 100 posts at once

```bash
seo-blog batch --topics ./examples/topics.json --output ./blog-posts/
```

**Output:** A full content calendar generated in seconds. Perfect for planning your Q1 content strategy.

### See all available templates

```bash
seo-blog templates
```

## What You Get in Every Generated Post

SEO Blog Engine does not just create a blank template. Every post includes:

**SEO Infrastructure:**
- YAML frontmatter (title, description, date, tags, slug, canonical URL)
- Meta description at the ideal 150-160 character length
- H1 title with current year for freshness signals
- Keyword density targets and placement guides (inline comments)
- Internal and external link placeholders with context
- Complete SEO checklist as an HTML comment at the bottom

**Content Structure:**
- Table of contents with anchor links
- 5-8 H2 sections with relevant H3 subsections (varies by template)
- Introduction template (hook + context + promise structure)
- FAQ section with 5 common questions
- Call to action section with CTA and newsletter placeholders

**Rich Results:**
- Ready-to-paste JSON-LD schema markup for FAQ sections
- Image placeholders with ALT text reminders for accessibility

**Writing Guides:**
- Word count recommendations per section
- Keyword integration suggestions
- Content placeholders that explain what to write

All of this is included automatically. You just fill in the content.

## CLI Reference

| Command | Description |
|---------|-------------|
| `generate` | Generate a full SEO-optimized blog post with all scaffolding |
| `batch` | Batch generate posts from a JSON topics file (scale to 100+) |
| `outline` | Generate an outline only (structure + SEO recommendations) |
| `templates` | List all available content templates |
| **`audit`** | **Run comprehensive SEO audit on all posts (checks 12+ factors)** |
| **`sitemap`** | **Generate sitemap.xml with intelligent priorities and change frequencies** |
| **`robots`** | **Generate robots.txt with search engine directives** |
| **`redirect`** | **Manage 301 redirects (add, list, export as Next.js config)** |
| **`performance`** | **Show performance optimization recommendations** |

### Generate Options

| Flag | Description | Required |
|------|-------------|----------|
| `-t, --topic <topic>` | Blog post topic | Yes |
| `-k, --keywords <kw>` | Comma-separated target keywords | No |
| `-o, --output <dir>` | Output directory (default: ./output) | No |
| `--template <type>` | Force a specific template (`how-to`, `listicle`, `comparison`, `ultimate-guide`) | No |

**Note:** If you do not specify `--template`, the engine intelligently detects the best template based on your topic. Topics starting with "How to" get the How-To template, topics with "vs" get Comparison, etc.

### Batch Options

| Flag | Description | Required |
|------|-------------|----------|
| `--topics <file>` | Path to JSON topics file | Yes |
| `-o, --output <dir>` | Output directory (default: ./output) | No |

### SEO Audit Options

| Flag | Description | Required |
|------|-------------|----------|
| `-o, --output <dir>` | Posts directory to audit (default: ./output) | No |
| `--format <type>` | Output format: `text` or `json` (default: text) | No |
| `--save <file>` | Save report to file | No |

**Example:**
```bash
seo-blog audit --output ./output --save ./seo-audit-report.txt
```

### Sitemap Options

| Flag | Description | Required |
|------|-------------|----------|
| `--base-url <url>` | Base URL of your site (e.g., https://example.com) | Yes |
| `-o, --output <dir>` | Posts directory (default: ./output) | No |
| `--save <file>` | Save sitemap to file (default: ./sitemap.xml) | No |

**Example:**
```bash
seo-blog sitemap --base-url https://yourblog.com --save ./public/sitemap.xml
```

### Robots.txt Options

| Flag | Description | Required |
|------|-------------|----------|
| `--sitemap-url <url>` | Full URL to sitemap.xml | Yes |
| `--save <file>` | Save robots.txt to file (default: ./robots.txt) | No |

**Example:**
```bash
seo-blog robots --sitemap-url https://yourblog.com/sitemap.xml --save ./public/robots.txt
```

### Redirect Options

| Flag | Description | Required |
|------|-------------|----------|
| `--add` | Add a new redirect | No |
| `--from <path>` | Source path (e.g., /old-post) | Required with --add |
| `--to <path>` | Destination path (e.g., /new-post) | Required with --add |
| `--list` | List all redirects | No |
| `--export-nextjs` | Export as Next.js config | No |
| `--config <file>` | Redirects config file (default: ./redirects.json) | No |

**Examples:**
```bash
# Add a redirect
seo-blog redirect --add --from /old-post --to /new-post

# List all redirects
seo-blog redirect --list

# Export as Next.js config
seo-blog redirect --export-nextjs > next.config.redirects.js
```

## Advanced SEO Infrastructure

Beyond blog post generation, SEO Blog Engine includes professional SEO tools that transform it from "a blog template" to "an SEO system."

### SEO Audit System

Automatically check all your posts for 12+ SEO factors:

```bash
seo-blog audit --output ./output
```

**What it checks:**
- ✅ Title length (50-60 chars optimal)
- ✅ Meta description length (150-160 chars optimal)
- ✅ H1 tag presence and consistency
- ✅ Image alt text (missing and placeholder detection)
- ✅ Internal link count (minimum 3 recommended)
- ✅ External link count (minimum 2 recommended)
- ✅ Word count (2000+ recommended)
- ✅ Broken link detection
- ✅ Content placeholder detection
- ✅ SEO score calculation (0-100)

**Output:**
- Overall SEO health score
- Post-by-post breakdown with issues, warnings, and recommendations
- Common issues report across all posts
- Actionable next steps

### Sitemap Generation

Generate XML sitemaps with intelligent priorities:

```bash
seo-blog sitemap --base-url https://yourblog.com --save ./public/sitemap.xml
```

**Features:**
- Automatic priority assignment (recent posts get higher priority)
- Smart change frequency (daily for new posts, monthly for old)
- Includes homepage, blog index, and all posts
- Standards-compliant XML format

### Robots.txt Generation

Create search engine directives:

```bash
seo-blog robots --sitemap-url https://yourblog.com/sitemap.xml --save ./public/robots.txt
```

**Default configuration:**
- Allows all crawlers
- Blocks /admin, /api, /_next, /private
- Links to your sitemap
- Customizable crawl delay

### Open Graph & Twitter Cards

Generate social media meta tags for every post:

```javascript
const { generateOpenGraph, generateTwitterCard } = require('seo-blog-engine/lib/seo-infrastructure');

const og = generateOpenGraph(postMetadata, 'https://yourblog.com');
const twitter = generateTwitterCard(postMetadata, 'https://yourblog.com', 'yourhandle');
```

**Includes:**
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- `article:published_time`, `article:author`, `article:tag`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

### JSON-LD Structured Data

Generate 4 types of schema markup:

```javascript
const { generateJSONLD } = require('seo-blog-engine/lib/seo-infrastructure');

const schemas = generateJSONLD(postMetadata, 'https://yourblog.com');
// Returns: Article, BreadcrumbList, Organization, WebSite schemas
```

**Schema types:**
- **Article** - Main blog post content
- **BreadcrumbList** - Navigation hierarchy
- **Organization** - Publisher information
- **WebSite** - Site-wide search action

### 301 Redirect Management

Track and manage URL redirects:

```bash
# Add a redirect
seo-blog redirect --add --from /old-post --to /new-post

# List all redirects
seo-blog redirect --list

# Export for Next.js
seo-blog redirect --export-nextjs > redirects.config.js
```

**Use cases:**
- Preserve link equity when changing URLs
- Merge similar content
- Fix broken internal links
- Maintain SEO during site migrations

### Performance Optimization Guide

Get expert recommendations:

```bash
seo-blog performance
```

**Covers:**
- Lazy loading images
- Preconnect hints for third-party resources
- Critical CSS extraction
- Font optimization (font-display: swap)
- Modern image formats (WebP, AVIF)

**See the full SEO Infrastructure Guide:** [SEO_GUIDE.md](./SEO_GUIDE.md)

## The 4 SEO-Optimized Templates

Each template follows proven formats that rank in Google. Structure is based on analysis of top-performing content in each category.

### 1. How-To Tutorial
**Format:** "How to [X]: A Step-by-Step Guide (2026)"

**Best for:** Tutorials, walkthroughs, implementation guides

**Generated structure:**
- 7 H2 sections with step-by-step flow
- Prerequisites section with tools and skills checklist
- Code block placeholders for technical content
- "Common Pitfalls" section for featured snippet targeting
- Pro tip callouts to boost engagement and time-on-page

**Target word count:** 2,000-2,500 words

**SEO features:** Step-by-step schema potential, "how to" keyword optimization, FAQ section targeting "People Also Ask"

### 2. Listicle
**Format:** "10 Best [X] for 2026 (Expert Picks)"

**Best for:** Tool roundups, resource lists, product comparisons

**Generated structure:**
- Quick comparison table for featured snippets
- Evaluation criteria section for E-E-A-T signals
- 10 individual items with dedicated H2 headings
- Features, pricing, and pros/cons tables for each item
- "How to Choose" section for buyer intent keywords

**Target word count:** 3,000-4,000 words

**SEO features:** Comparison table schema potential, "best" keyword optimization, affiliate link placeholders with proper attributes

### 3. Comparison
**Format:** "[X] vs [Y]: Complete Comparison (2026)"

**Best for:** Head-to-head product reviews, technology comparisons

**Generated structure:**
- "At a Glance" comparison table for position zero
- Quick verdict callout for featured snippet targeting
- Category-by-category breakdown (features, pricing, performance, UX, support)
- "When to Choose X" sections for both options
- Final verdict with winner-by-category table

**Target word count:** 2,500-3,500 words

**SEO features:** Balanced treatment for neutral tone, comparison tables for rich results, "vs" keyword optimization

### 4. Ultimate Guide (Pillar Content)
**Format:** "The Ultimate Guide to [X] (2026)"

**Best for:** Comprehensive topic coverage, pillar pages, cornerstone content

**Generated structure:**
- 8+ in-depth H2 sections covering beginner to advanced
- Content cluster link placeholders (hub-and-spoke model)
- Key takeaway callouts for skimmers
- "The Future of X" section for thought leadership signals
- Related articles section for internal linking architecture

**Target word count:** 4,000-6,000 words

**SEO features:** Pillar page optimization, content cluster linking, topical authority signals, comprehensive FAQ section

## Batch Generation for Content Calendars

Planning a content calendar? Generate 10, 50, or 100 posts at once with batch mode.

**Create a JSON file** (example: `topics.json`):

```json
[
  {
    "topic": "How to Build a REST API with Node.js",
    "keywords": "REST API, Node.js, Express.js, API development",
    "template": "how-to"
  },
  {
    "topic": "Docker vs Kubernetes",
    "keywords": "Docker, Kubernetes, containerization",
    "template": "comparison"
  },
  {
    "topic": "10 Best API Testing Tools",
    "keywords": "API testing, testing tools, Postman, automation"
  }
]
```

**Run batch generation:**

```bash
seo-blog batch --topics topics.json --output ./content/
```

**Result:** All posts generated in seconds. Each file is ready to fill in with your content.

**JSON format:**
- `topic` (required) — The blog post topic
- `keywords` (optional) — Comma-separated target keywords (used for meta descriptions and keyword placement guides)
- `template` (optional) — Force a specific template (`how-to`, `listicle`, `comparison`, `ultimate-guide`). If omitted, the engine auto-detects the best template based on your topic.

## Example: Generated Output

Here's what you get when you run:

```bash
seo-blog generate --topic "How to Deploy a Node.js App to AWS" \
  --keywords "Node.js deployment, AWS, EC2"
```

**Generated file:** `how-to-deploy-a-nodejs-app-to-aws.md`

```markdown
---
title: "How to Deploy a Node.js App to AWS: A Step-by-Step Guide (2026)"
description: "Learn how to deploy a Node.js app to AWS with this comprehensive step-by-step guide. Covers Node.js deployment, AWS, EC2 and more."
date: "2026-02-14"
tags: ["Node.js deployment", "AWS", "EC2", "how-to", "tutorial", "guide"]
slug: "how-to-deploy-a-nodejs-app-to-aws"
author: "[AUTHOR_NAME]"
featured_image: "[IMAGE_PATH -- use descriptive alt text for SEO]"
canonical_url: "[YOUR_DOMAIN]/how-to-deploy-a-nodejs-app-to-aws"
---

# How to Deploy a Node.js App to AWS: A Step-by-Step Guide (2026)

![Deploy a Node.js App to AWS featured image -- REPLACE with descriptive alt text containing "Node.js deployment"](./images/how-to-deploy-a-nodejs-app-to-aws-hero.jpg)

**Meta Description:** Learn how to deploy a Node.js app to AWS with this comprehensive step-by-step guide. Covers Node.js deployment, AWS, EC2 and more.

<!-- TARGET_KEYWORD: "Node.js deployment" | SECONDARY: "AWS", "EC2" -->
<!-- RECOMMENDED_WORD_COUNT: 2,000-2,500 words -->
<!-- KEYWORD_DENSITY: Aim for 1-2% for primary keyword -->

## Introduction

[HOOK: Start with a surprising statistic, bold claim, or relatable problem about Deploy a Node.js App to AWS...]

[Content structure continues with 7 sections, FAQ, CTA, and SEO checklist]
```

**Key features in this output:**
- Frontmatter is complete and SEO-optimized
- Meta description is exactly 150 characters (ideal length)
- Target keywords are documented in comments
- Image placeholders include ALT text reminders
- Table of contents with anchor links (not shown in snippet)
- FAQ section with JSON-LD schema markup (not shown in snippet)
- SEO checklist at the bottom (not shown in snippet)

**You just fill in the content.** The SEO infrastructure is done.

## Who Should Use This?

**Content marketers** publishing 4-8 SEO blog posts per month
- Save 2-3 hours per post on structure and SEO setup
- Never miss an SEO element again

**SaaS founders** building organic traffic without a content team
- Generate a full content calendar in minutes
- Get professional SEO infrastructure without hiring an SEO specialist

**Freelance writers** delivering consistent quality for clients
- Start every project with proven templates that rank
- Include comprehensive SEO checklists in deliverables

**SEO agencies** managing content for multiple clients
- Batch generate 100+ posts per client per quarter
- Ensure consistent SEO standards across all content

**Developer advocates** creating technical content at scale
- Use code block placeholders and technical templates
- Optimize developer-focused content for Google

## Pricing

**$29 — One-time purchase. Lifetime updates.**

[**Buy Now**](https://buy.stripe.com/eVq7sKeTjcxQa7q9RE08g02)

**What is included:**
- All 4 SEO-optimized content templates
- Intelligent template detection
- Batch generation from JSON
- Outline mode for content planning
- JSON-LD schema markup generation
- Keyword placement guides
- Built-in SEO checklists
- Lifetime updates and future template additions

**Save $119:** Get this + 6 other products in the [Complete Bundle for $99](https://buy.stripe.com/5kQeVceTj0P8enGe7U08g06)

## More Tools for Indie Hackers

| Product | Description | Price |
|---------|-------------|-------|
| [LaunchFast SaaS Starter](https://github.com/Wittlesus/launchfast-starter) | Next.js 16 boilerplate with auth, payments, AI, email | $79 |
| [Indie Hacker Toolkit](https://github.com/Wittlesus/indie-hacker-toolkit) | 5 planning templates for solo founders | $19 |
| [PromptVault](https://github.com/Wittlesus/prompt-vault) | 64 production-ready AI prompts | $19 |
| [CursorRules Pro](https://github.com/Wittlesus/cursorrules-pro) | .cursorrules for 8 popular stacks | $14 |
| [Complete Bundle](https://buy.stripe.com/5kQeVceTj0P8enGe7U08g06) | All products above | $99 |

## License

ISC
