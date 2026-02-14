# SEO Blog Engine

**Generate SEO-optimized blog post templates in seconds.**

Stop staring at a blank page. SEO Blog Engine generates fully structured, SEO-ready markdown blog posts with frontmatter, table of contents, FAQ schema markup, keyword placement guides, and more. Just provide a topic and keywords, and get a production-ready template you can fill in and publish.

## Pricing

**$29 — One-time purchase. Not a subscription.**

[**Buy Now**](https://buy.stripe.com/eVq7sKeTjcxQa7q9RE08g02)

What you get:
- All 4 content templates (How-To, Listicle, Comparison, Ultimate Guide)
- Batch generation from JSON
- Outline mode
- SEO schema markup generation
- Lifetime updates and future template additions

**Save $119:** Get this + 6 other products in the [Complete Bundle for $99](https://buy.stripe.com/5kQeVceTj0P8enGe7U08g06)

## Why SEO Blog Engine?

- **Save 2-3 hours per blog post** on structure and SEO setup
- **Never miss an SEO element** -- every post includes meta descriptions, alt text placeholders, internal link markers, FAQ schema, and a built-in SEO checklist
- **4 proven content formats** that rank: How-To Tutorials, Listicles, Comparisons, and Ultimate Guides
- **Batch generate** 10, 50, or 100 posts at once from a JSON file
- **No API keys required** -- runs 100% locally as a CLI tool
- **Clean markdown output** compatible with any static site generator (Next.js, Astro, Hugo, Jekyll, Ghost, WordPress)

## Installation

```bash
# Install globally
npm install -g seo-blog-engine

# Or use directly with npx
npx seo-blog-engine generate --topic "Your Topic"

# Or clone and use locally
git clone <repo-url>
cd seo-blog-engine
npm install
node cli.js generate --topic "Your Topic"
```

## Quick Start

### Generate a single blog post

```bash
seo-blog generate --topic "How to Deploy a Node.js App to AWS" \
  --keywords "Node.js deployment, AWS, EC2, deploy Node.js" \
  --output ./blog-posts/
```

### Generate just an outline

```bash
seo-blog outline --topic "Kubernetes vs Docker Swarm" \
  --keywords "Kubernetes, Docker Swarm, container orchestration"
```

### Batch generate from a topics file

```bash
seo-blog batch --topics ./examples/topics.json --output ./blog-posts/
```

### List available templates

```bash
seo-blog templates
```

## Commands

| Command | Description |
|---------|-------------|
| `generate` | Generate a full SEO-optimized blog post |
| `batch` | Batch generate posts from a JSON topics file |
| `outline` | Generate a blog post outline (structure only) |
| `templates` | List all available content templates |

### Generate Options

| Flag | Description | Required |
|------|-------------|----------|
| `-t, --topic <topic>` | Blog post topic | Yes |
| `-k, --keywords <kw>` | Comma-separated keywords | No |
| `-o, --output <dir>` | Output directory (default: ./output) | No |
| `--template <type>` | Force a template type | No |

### Batch Options

| Flag | Description | Required |
|------|-------------|----------|
| `--topics <file>` | Path to JSON topics file | Yes |
| `-o, --output <dir>` | Output directory (default: ./output) | No |

## Template Formats

### 1. How-To Tutorial
**Format:** "How to [X]: A Step-by-Step Guide (2026)"

Best for: tutorials, walkthroughs, implementation guides. Generates 7 structured sections with step-by-step flow, code block placeholders, and pro tip callouts.

### 2. Listicle
**Format:** "10 Best [X] for 2026 (Expert Picks)"

Best for: tool roundups, resource lists, product comparisons. Generates 10 item slots with features, pricing, and pros/cons tables for each.

### 3. Comparison
**Format:** "[X] vs [Y]: Complete Comparison (2026)"

Best for: head-to-head product reviews, technology comparisons. Generates side-by-side comparison tables, category-by-category breakdown, and a final verdict.

### 4. Ultimate Guide (Pillar Content)
**Format:** "The Ultimate Guide to [X] (2026)"

Best for: comprehensive topic coverage, pillar pages, cornerstone content. Generates 8+ sections with content cluster linking strategy.

## Topics JSON Format

For batch generation, create a JSON file with this structure:

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
  }
]
```

Each entry supports:
- `topic` (required) -- the blog post topic
- `keywords` (optional) -- comma-separated target keywords
- `template` (optional) -- force a template type; auto-detected from topic if omitted

## What Each Generated Post Includes

Every generated markdown file contains:

- **YAML Frontmatter** -- title, description, date, tags, slug, author, canonical URL
- **SEO-optimized H1 title** with year for freshness signals
- **Meta description** (150-160 characters)
- **Table of contents** with anchor links
- **5-8 H2 sections** with H3 subsections
- **Introduction with hook** -- attention-grabbing opener template
- **Image placeholders** with ALT text reminders
- **Internal link placeholders** for site architecture
- **Keyword density markers** and placement guides
- **FAQ section** with ready-to-use JSON-LD schema markup
- **Call to action** section with CTA button and newsletter placeholders
- **SEO checklist** as an HTML comment at the bottom

## Example Output

```markdown
---
title: "How to Deploy a Node.js App to AWS: A Step-by-Step Guide (2026)"
description: "Learn how to deploy a Node.js app to AWS..."
date: "2026-02-13"
tags: ["Node.js", "AWS", "deployment"]
slug: "how-to-deploy-a-nodejs-app-to-aws"
---

# How to Deploy a Node.js App to AWS: A Step-by-Step Guide (2026)

## Table of Contents
1. [What is Node.js Deployment?](#what-is-nodejs-deployment)
2. [Prerequisites Before You Start](#prerequisites-before-you-start)
...

## Introduction
[HOOK: Start with a surprising statistic...]
...
```

## Pricing

**$29 -- One-time purchase. Lifetime updates.**

- All 4 content templates
- Batch generation
- Outline mode
- SEO schema markup generation
- Future template additions included

## More Developer Tools

| Product | Description | Price |
|---------|-------------|-------|
| [LaunchFast SaaS Starter](https://github.com/Wittlesus/launchfast-starter) | Next.js 16 boilerplate with auth, payments, AI, email | $79 |
| [PageBrain Extension](https://github.com/Wittlesus/pagebrain-extension) | Summarize any page with AI (Chrome) | Free |
| [Indie Hacker Toolkit](https://github.com/Wittlesus/indie-hacker-toolkit) | 5 planning templates for solo founders | $19 |
| [PromptVault](https://github.com/Wittlesus/prompt-vault) | 64 production-ready AI prompts | $19 |
| [CursorRules Pro](https://github.com/Wittlesus/cursorrules-pro) | .cursorrules for 8 popular stacks | $14 |
| [Complete Bundle](https://buy.stripe.com/5kQeVceTj0P8enGe7U08g06) | All products above | $99 |

## License

ISC
