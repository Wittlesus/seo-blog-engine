# SEO Blog Engine

## Overview
Node.js CLI tool that generates SEO-optimized markdown blog post templates with advanced SEO infrastructure. Supports 4 content formats (how-to, listicle, comparison, ultimate guide) with batch generation, plus comprehensive SEO auditing, sitemap generation, redirect management, and more. Sold at $29.

## Tech Stack
- **Runtime:** Node.js (>=18, CommonJS)
- **CLI Framework:** Commander.js v14
- **Markdown:** Marked v17
- **No database, no auth, no server** -- pure CLI tool

## Key Commands

### Blog Post Generation
- `node cli.js generate --topic "Topic" --keywords "kw1, kw2"` -- Generate a single post
- `node cli.js outline --topic "Topic"` -- Generate outline only
- `node cli.js batch --topics ./examples/topics.json` -- Batch generate from JSON
- `node cli.js templates` -- List available templates

### SEO Infrastructure (NEW)
- `node cli.js audit --output ./output` -- Run comprehensive SEO audit on all posts
- `node cli.js sitemap --base-url https://example.com --save ./sitemap.xml` -- Generate sitemap.xml
- `node cli.js robots --sitemap-url https://example.com/sitemap.xml --save ./robots.txt` -- Generate robots.txt
- `node cli.js redirect --add --from /old --to /new` -- Add 301 redirect
- `node cli.js redirect --list` -- List all redirects
- `node cli.js redirect --export-nextjs` -- Export redirects as Next.js config
- `node cli.js performance` -- Show performance optimization guide
- `node cli.js --help` -- Show help
- `npm test` -- Runs `node cli.js --help` (smoke test)

## Project Structure
- `cli.js` -- Entry point, Commander CLI setup (also the `seo-blog` bin command)
- `lib/generator.js` -- Core blog post generation logic
- `lib/templates.js` -- Template definitions for 4 content formats
- `lib/seo-infrastructure.js` -- **NEW: Sitemap, robots.txt, Open Graph, JSON-LD, redirects**
- `lib/seo-audit.js` -- **NEW: SEO audit system (checks 12+ factors)**
- `examples/topics.json` -- Sample batch topics file
- `output/` -- Default output directory for generated posts
- `SEO_GUIDE.md` -- **NEW: Comprehensive SEO infrastructure guide**
- `redirects.json` -- 301 redirect configuration
- `sitemap.xml` -- Generated sitemap (if created)
- `robots.txt` -- Generated robots.txt (if created)

## Key Files
- `cli.js` -- CLI entry point with all command definitions
- `lib/generator.js` -- Markdown generation engine
- `lib/templates.js` -- How-to, listicle, comparison, ultimate guide templates
- `lib/seo-infrastructure.js` -- SEO infrastructure module
- `lib/seo-audit.js` -- SEO audit system
- `examples/topics.json` -- Example batch input format
- `SEO_GUIDE.md` -- Complete SEO infrastructure documentation

## Stripe Integration
- Payment link: `buy.stripe.com/eVq7sKeTjcxQa7q9RE08g02` ($29)
- No runtime Stripe integration (digital product, one-time purchase)

## SEO Infrastructure Features (NEW)

### SEO Audit System
- Checks 12+ SEO factors per post
- Generates SEO score (0-100)
- Identifies issues, warnings, and recommendations
- Reports on: title length, meta description, H1, alt text, links, word count, placeholders
- Output formats: text or JSON
- See: `lib/seo-audit.js`

### Sitemap Generation
- XML sitemap with intelligent priorities
- Recent posts get higher priority
- Smart change frequency (daily/weekly/monthly)
- Includes homepage, blog index, all posts
- See: `lib/seo-infrastructure.js` → `generateSitemap()`

### Robots.txt Generation
- Intelligent defaults (blocks /admin, /api, etc.)
- Links to sitemap
- Customizable crawl delay
- See: `lib/seo-infrastructure.js` → `generateRobotsTxt()`

### Open Graph & Twitter Cards
- Auto-generate social media meta tags
- Includes og:title, og:description, og:image, og:url
- Twitter card support with handle
- See: `lib/seo-infrastructure.js` → `generateOpenGraph()`, `generateTwitterCard()`

### JSON-LD Structured Data
- 4 schema types: Article, BreadcrumbList, Organization, WebSite
- Ready for rich results
- See: `lib/seo-infrastructure.js` → `generateJSONLD()`

### 301 Redirect Management
- JSON config file (`redirects.json`)
- Add, list, export redirects
- Next.js integration support
- See: `lib/seo-infrastructure.js` → redirect functions

### Performance Optimization
- Lazy loading images
- Preconnect hints
- Critical CSS extraction guidance
- Font optimization (font-display: swap)
- Modern image formats (WebP, AVIF)
- See: `lib/seo-infrastructure.js` → `generatePerformanceHints()`

## Notes
- Output includes YAML frontmatter, TOC, FAQ schema markup, SEO checklist
- Template auto-detection based on topic keywords (e.g., "vs" triggers comparison)
- **NEW: SEO audit checks all posts for SEO compliance**
- **NEW: Automatic sitemap.xml and robots.txt generation**
- **NEW: Open Graph and Twitter Card meta tag generation**
- **NEW: JSON-LD structured data for rich results**
- **NEW: 301 redirect management system**
- Can be installed globally via `npm install -g seo-blog-engine`
- Output compatible with any static site generator (Next.js, Astro, Hugo, Jekyll, Ghost)
- Repo: github.com/Wittlesus/seo-blog-engine
