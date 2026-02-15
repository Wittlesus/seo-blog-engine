# Changelog

All notable changes to SEO Blog Engine will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-02-14

### Major Update: SEO Automation Infrastructure

This release repositions SEO Blog Engine from "blog template generator" to "SEO automation infrastructure." All core features remain the same, but documentation now clearly highlights what we automate that static site generators (Hugo, Astro, Jekyll) and CMSs (Ghost, WordPress) do not.

### Added
- **Intelligent template detection** — Automatically selects the best template (How-To, Listicle, Comparison, Ultimate Guide) based on topic keywords. You can still force a specific template if needed.
- **Keyword placement guides** — Inline HTML comments in generated posts showing where and how to integrate target keywords for optimal density (1-2%).
- **SEO checklists** — Every generated post includes a comprehensive, template-specific SEO checklist as an HTML comment at the bottom.
- **JSON-LD schema markup** — All posts include ready-to-paste FAQ schema markup for Google rich results and featured snippets.
- **Meta description optimization** — Auto-generated meta descriptions are precisely 150-160 characters (the ideal length for search results display).
- **Freshness signals** — All post titles include the current year (e.g., "2026") to signal content freshness to search engines.
- **Content cluster linking** — Ultimate Guide template includes placeholders for hub-and-spoke content architecture.
- **Outline mode** — Generate just the structure and SEO recommendations before committing to a full post (useful for content planning).

### Enhanced
- **How-To Template** — Now includes "Common Pitfalls" section optimized for featured snippet targeting, plus pro tip callouts to boost time-on-page.
- **Listicle Template** — Quick comparison table added at the top for featured snippet potential. Includes "How to Choose" section for buyer intent keywords.
- **Comparison Template** — "At a Glance" table and quick verdict callout added for position zero targeting. Winner-by-category table in final verdict.
- **Ultimate Guide Template** — Expanded to 8+ sections with key takeaway callouts, "The Future of X" thought leadership section, and related articles cluster links.

### Documentation
- **README.md** — Complete rewrite with new positioning: "The blog engine that optimizes your SEO automatically."
- **Comparison table** — Added detailed feature comparison vs Astro, Hugo, Ghost, and WordPress showing what we automate that they don't.
- **GUMROAD_LISTING.md** — Updated with new positioning and detailed ROI calculations (saves $400/month for content marketers publishing 4 posts/month).
- **CHANGELOG.md** — Added this file to track all updates.

### Features That Ship With Every Generated Post
- YAML frontmatter (title, description, date, tags, slug, author, canonical URL)
- SEO-optimized H1 title with year for freshness signals
- Meta description (150-160 characters, auto-generated)
- Table of contents with anchor links
- 5-8 H2 sections with H3 subsections (varies by template)
- Introduction with hook, context, and promise structure
- Image placeholders with ALT text reminders
- Internal and external link placeholders with SEO context
- Keyword density targets and placement guides
- FAQ section with ready-to-paste JSON-LD schema markup
- Call to action section with CTA and newsletter placeholders
- SEO checklist as an HTML comment

### Key Differentiators vs Alternatives
- **vs Astro/Hugo/Jekyll:** We provide SEO infrastructure. They provide blank markdown files.
- **vs Ghost:** We include schema markup and SEO checklists. Ghost requires manual setup.
- **vs WordPress:** We are lightweight and local. WordPress requires 5+ plugins to match our built-in SEO features.

### Technical Details
- Node.js 18+ required
- No database, no auth, no server — pure CLI tool
- Output compatible with any static site generator or markdown-based CMS
- Runs 100% locally (no API keys, no cloud dependencies)

### Pricing
- $29 one-time purchase
- Lifetime updates included
- Available individually or as part of the Complete Bundle ($99 for 7 products)

---

## [1.0.0] - 2026-02-13

### Initial Release
- 4 content templates (How-To, Listicle, Comparison, Ultimate Guide)
- Batch generation from JSON
- CLI tool with Commander.js
- Markdown output with frontmatter
- Basic SEO elements (meta descriptions, FAQ schema)
