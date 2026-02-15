# SEO Infrastructure Guide

## Overview

The SEO Blog Engine now includes advanced SEO infrastructure that goes far beyond basic blog templates. This guide covers all the professional SEO features included.

## Features

### 1. Automatic Sitemap Generation

Generate XML sitemaps with intelligent priorities and change frequencies.

```bash
# Generate sitemap
node cli.js sitemap --base-url https://yourblog.com --save ./public/sitemap.xml

# The sitemap includes:
# - Homepage (priority 1.0)
# - Blog index (priority 0.9)
# - Individual posts (priority 0.7-0.9 based on recency)
# - Automatic change frequency (daily for new posts, monthly for old)
```

**Features:**
- Automatically detects post dates and adjusts priorities
- Recent posts (< 30 days) get higher priority
- Change frequency adapts based on post age
- Includes canonical URLs for all pages

### 2. Robots.txt Generation

Create search engine-friendly robots.txt with intelligent defaults.

```bash
# Generate robots.txt
node cli.js robots --sitemap-url https://yourblog.com/sitemap.xml --save ./public/robots.txt
```

**Default configuration:**
- Allows all user-agents
- Blocks /admin, /api, /_next, /private
- Links to sitemap
- Optional crawl delay configuration

### 3. SEO Audit System

Comprehensive SEO audit that checks every post for common issues.

```bash
# Run SEO audit
node cli.js audit --output ./output

# Save audit to file
node cli.js audit --output ./output --save ./seo-audit-report.txt

# Get JSON output
node cli.js audit --output ./output --format json --save ./audit.json
```

**Audit checks:**
- ✅ Meta description presence and length (150-160 chars)
- ✅ Title length optimization (50-60 chars)
- ✅ H1 tag presence and consistency
- ✅ Image alt text (missing and placeholder detection)
- ✅ Internal link count (minimum 3 recommended)
- ✅ External link count (minimum 2 recommended)
- ✅ Word count (2000+ recommended)
- ✅ Broken link detection (for local files)
- ✅ Content placeholder detection
- ✅ SEO score calculation (0-100)

**Audit report includes:**
- Overall SEO score per post
- Categorization (Excellent 90+, Good 70-89, Needs Work 50-69, Poor <50)
- Detailed issue list per post
- Common issues across all posts
- Actionable recommendations

### 4. Canonical URL Management

All generated posts include canonical URL configuration in frontmatter.

```yaml
canonical_url: "[YOUR_DOMAIN]/your-post-slug"
```

**To use:**
1. Replace `[YOUR_DOMAIN]` with your actual domain
2. Use the `generateCanonical()` function from `lib/seo-infrastructure.js`:

```javascript
const { generateCanonical } = require('./lib/seo-infrastructure');
const tag = generateCanonical('https://yourblog.com', 'your-post-slug');
// Returns: <link rel="canonical" href="https://yourblog.com/your-post-slug" />
```

### 5. Open Graph & Twitter Card Meta Tags

Auto-generate social media preview tags for every post.

```javascript
const { generateOpenGraph, generateTwitterCard } = require('./lib/seo-infrastructure');

// Generate Open Graph tags
const og = generateOpenGraph(postMetadata, 'https://yourblog.com');

// Generate Twitter Card tags
const twitter = generateTwitterCard(postMetadata, 'https://yourblog.com', 'yourtwitterhandle');
```

**Includes:**
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- `article:published_time`, `article:author`, `article:tag`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- `twitter:site`, `twitter:creator`

### 6. JSON-LD Structured Data

Generate rich structured data for search engines.

```javascript
const { generateJSONLD } = require('./lib/seo-infrastructure');

const schemas = generateJSONLD(postMetadata, 'https://yourblog.com', {
  authorName: 'Your Name',
  publisherName: 'Your Blog',
  publisherLogo: 'https://yourblog.com/logo.png',
  organizationName: 'Your Company'
});

// Returns 4 schemas:
// - Article schema (main content)
// - BreadcrumbList schema (navigation)
// - Organization schema (publisher info)
// - WebSite schema (search action)
```

**Add to your page `<head>`:**
```html
<script type="application/ld+json">
  {JSON.stringify(schemas.article)}
</script>
<script type="application/ld+json">
  {JSON.stringify(schemas.breadcrumb)}
</script>
```

### 7. Image Alt Text Suggestions

Get intelligent alt text suggestions based on filename and context.

```javascript
const { suggestAltText } = require('./lib/seo-infrastructure');

const suggestions = suggestAltText(
  './images/how-to-deploy-kubernetes-hero.jpg',
  { topic: 'Kubernetes Deployment', keyword: 'kubernetes cluster' }
);

// Returns array of suggestions:
// [
//   "how to deploy kubernetes",
//   "how to deploy kubernetes for Kubernetes Deployment",
//   "Kubernetes Deployment - how to deploy kubernetes",
//   "how to deploy kubernetes showing kubernetes cluster",
//   ...
// ]
```

### 8. 301 Redirect Management

Track and manage URL redirects with a simple config system.

```bash
# Add a redirect
node cli.js redirect --add --from /old-post --to /new-post

# List all redirects
node cli.js redirect --list

# Export as Next.js config
node cli.js redirect --export-nextjs > next.config.redirects.js
```

**Redirect config** (`redirects.json`):
```json
[
  {
    "from": "/old-slug",
    "to": "/new-slug",
    "permanent": true,
    "created": "2026-02-14T12:00:00.000Z"
  }
]
```

**Next.js integration:**
```javascript
// In next.config.js
module.exports = {
  async redirects() {
    return require('./redirects.json').map(r => ({
      source: r.from,
      destination: r.to,
      permanent: r.permanent
    }));
  }
};
```

### 9. Performance Optimization Guide

Get expert performance optimization recommendations.

```bash
node cli.js performance
```

**Covers:**
- Lazy loading images (`loading="lazy"`)
- Preconnect hints for third-party resources
- Critical CSS extraction
- Font optimization (`font-display: swap`)
- Modern image formats (WebP, AVIF)

## Integration Examples

### Next.js Integration

```javascript
// pages/blog/[slug].js
import fs from 'fs';
import path from 'path';
import { parseFrontmatter, generateOpenGraph, generateTwitterCard, generateJSONLD } from '../../lib/seo-infrastructure';

export default function BlogPost({ content, metadata, seoTags }) {
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="canonical" href={metadata.canonical_url} />

        {/* Open Graph */}
        <div dangerouslySetInnerHTML={{ __html: seoTags.og }} />

        {/* Twitter Card */}
        <div dangerouslySetInnerHTML={{ __html: seoTags.twitter }} />

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seoTags.jsonld.article) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seoTags.jsonld.breadcrumb) }} />
      </Head>

      <article dangerouslySetInnerHTML={{ __html: content }} />
    </>
  );
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'posts', `${params.slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const metadata = parseFrontmatter(fileContent);

  const seoTags = {
    og: generateOpenGraph(metadata, 'https://yourblog.com'),
    twitter: generateTwitterCard(metadata, 'https://yourblog.com', 'yourhandle'),
    jsonld: generateJSONLD(metadata, 'https://yourblog.com')
  };

  return { props: { content: fileContent, metadata, seoTags } };
}
```

### Astro Integration

```astro
---
// src/pages/blog/[slug].astro
import { parseFrontmatter, generateOpenGraph, generateTwitterCard, generateJSONLD } from '../../lib/seo-infrastructure';

const { slug } = Astro.params;
const content = await Astro.glob('../posts/*.md');
const post = content.find(p => p.frontmatter.slug === slug);
const metadata = post.frontmatter;

const og = generateOpenGraph(metadata, 'https://yourblog.com');
const twitter = generateTwitterCard(metadata, 'https://yourblog.com', 'yourhandle');
const jsonld = generateJSONLD(metadata, 'https://yourblog.com');
---

<html>
  <head>
    <title>{metadata.title}</title>
    <meta name="description" content={metadata.description} />
    <link rel="canonical" href={metadata.canonical_url} />

    <Fragment set:html={og} />
    <Fragment set:html={twitter} />

    <script type="application/ld+json" set:html={JSON.stringify(jsonld.article)} />
    <script type="application/ld+json" set:html={JSON.stringify(jsonld.breadcrumb)} />
  </head>
  <body>
    <article set:html={post.compiledContent()} />
  </body>
</html>
```

## SEO Workflow

### Recommended workflow for maximum SEO impact:

1. **Generate posts**
   ```bash
   node cli.js generate -t "Your Topic" -k "keyword1, keyword2"
   ```

2. **Fill in content**
   - Replace all `[PLACEHOLDER]` content
   - Add high-quality images
   - Write custom alt text for images
   - Add internal and external links

3. **Run SEO audit**
   ```bash
   node cli.js audit --output ./output
   ```

4. **Fix issues**
   - Address all critical issues (red flags)
   - Review warnings (yellow flags)
   - Consider recommendations

5. **Generate sitemap**
   ```bash
   node cli.js sitemap --base-url https://yourblog.com --save ./public/sitemap.xml
   ```

6. **Generate robots.txt**
   ```bash
   node cli.js robots --sitemap-url https://yourblog.com/sitemap.xml --save ./public/robots.txt
   ```

7. **Implement structured data**
   - Use `generateJSONLD()` in your templates
   - Add Open Graph and Twitter Card meta tags
   - Set canonical URLs

8. **Deploy and monitor**
   - Submit sitemap to Google Search Console
   - Monitor Core Web Vitals
   - Track rankings and traffic

## SEO Checklist

Use this checklist for every post:

- [ ] Title is 50-60 characters
- [ ] Meta description is 150-160 characters
- [ ] H1 matches page title
- [ ] Primary keyword in: title, H1, first paragraph, meta description, URL
- [ ] All images have descriptive alt text with keywords
- [ ] At least 3 internal links to related content
- [ ] At least 2 external links to authoritative sources
- [ ] Content is 2000+ words (for pillar content: 4000+)
- [ ] FAQ section included (for featured snippets)
- [ ] Table of contents with jump links
- [ ] Canonical URL set correctly
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] JSON-LD structured data added
- [ ] Images lazy-loaded
- [ ] Sitemap updated
- [ ] robots.txt configured
- [ ] Mobile-friendly and fast (Core Web Vitals)

## Advanced Tips

### Keyword Density
- Aim for 1-2% keyword density for primary keyword
- Use LSI (Latent Semantic Indexing) keywords naturally
- Don't over-optimize or keyword stuff

### Internal Linking Strategy
- Link to your pillar content from cluster articles
- Link from pillar content to cluster articles
- Use descriptive anchor text (not "click here")
- Maintain logical content hierarchy

### External Linking
- Link to authoritative sources (.edu, .gov, industry leaders)
- Use `rel="nofollow"` for affiliate links
- Open external links in new tab (optional)

### Image SEO
- Use descriptive filenames (`kubernetes-deployment-guide.jpg`, not `IMG_1234.jpg`)
- Compress images (use WebP/AVIF for modern browsers)
- Add width/height attributes to prevent layout shift
- Use responsive images with `srcset`

### Schema Markup
- Always include Article schema
- Add BreadcrumbList for navigation
- Include FAQ schema for Q&A sections
- Use Product schema for reviews/comparisons

### URL Structure
- Keep URLs short and descriptive
- Use hyphens (not underscores)
- Include target keyword in URL
- Avoid stop words when possible

## Performance Checklist

- [ ] Images lazy-loaded below the fold
- [ ] Preconnect hints for third-party resources
- [ ] Critical CSS inlined in `<head>`
- [ ] Fonts use `font-display: swap`
- [ ] Images in WebP/AVIF with fallbacks
- [ ] Minified CSS and JavaScript
- [ ] Gzip/Brotli compression enabled
- [ ] CDN for static assets
- [ ] Browser caching configured
- [ ] Lighthouse score 90+ on all metrics

## Support

For issues, feature requests, or questions about the SEO infrastructure:
- GitHub: https://github.com/Wittlesus/seo-blog-engine
- Email: patricksereyouch@gmail.com

---

**SEO Blog Engine v1.0.0** - Transform your blog into an SEO powerhouse.
