# SEO Blog Engine

## Overview
Node.js CLI tool that generates SEO-optimized markdown blog post templates. Supports 4 content formats (how-to, listicle, comparison, ultimate guide) with batch generation. Sold at $29.

## Tech Stack
- **Runtime:** Node.js (>=18, CommonJS)
- **CLI Framework:** Commander.js v14
- **Markdown:** Marked v17
- **No database, no auth, no server** -- pure CLI tool

## Key Commands
- `node cli.js generate --topic "Topic" --keywords "kw1, kw2"` -- Generate a single post
- `node cli.js outline --topic "Topic"` -- Generate outline only
- `node cli.js batch --topics ./examples/topics.json` -- Batch generate from JSON
- `node cli.js templates` -- List available templates
- `node cli.js --help` -- Show help
- `npm test` -- Runs `node cli.js --help` (smoke test)

## Project Structure
- `cli.js` -- Entry point, Commander CLI setup (also the `seo-blog` bin command)
- `lib/generator.js` -- Core blog post generation logic
- `lib/templates.js` -- Template definitions for 4 content formats
- `examples/topics.json` -- Sample batch topics file
- `output/` -- Default output directory for generated posts

## Key Files
- `cli.js` -- CLI entry point with all command definitions
- `lib/generator.js` -- Markdown generation engine
- `lib/templates.js` -- How-to, listicle, comparison, ultimate guide templates
- `examples/topics.json` -- Example batch input format

## Stripe Integration
- Payment link: `buy.stripe.com/eVq7sKeTjcxQa7q9RE08g02` ($29)
- No runtime Stripe integration (digital product, one-time purchase)

## Notes
- Output includes YAML frontmatter, TOC, FAQ schema markup, SEO checklist
- Template auto-detection based on topic keywords (e.g., "vs" triggers comparison)
- Can be installed globally via `npm install -g seo-blog-engine`
- Output compatible with any static site generator (Next.js, Astro, Hugo, Jekyll, Ghost)
- Repo: github.com/Wittlesus/seo-blog-engine
