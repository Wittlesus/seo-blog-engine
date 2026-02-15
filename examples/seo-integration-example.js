/**
 * SEO Infrastructure Integration Example
 *
 * This file demonstrates how to use the SEO infrastructure
 * modules in your own blog/static site generator.
 */

const fs = require('fs');
const path = require('path');
const {
  parseFrontmatter,
  generateSitemap,
  generateRobotsTxt,
  generateCanonical,
  generateOpenGraph,
  generateTwitterCard,
  generateJSONLD,
  suggestAltText,
  addRedirect,
  generatePerformanceHints,
} = require('../lib/seo-infrastructure');

// ============================================
// Example 1: Generate SEO meta tags for a post
// ============================================

function generatePostMetaTags(markdownFilePath, baseUrl, twitterHandle) {
  const content = fs.readFileSync(markdownFilePath, 'utf-8');
  const metadata = parseFrontmatter(content);

  if (!metadata) {
    console.error('No frontmatter found in markdown file');
    return;
  }

  console.log('=== SEO Meta Tags ===\n');

  // Canonical URL
  const canonical = generateCanonical(baseUrl, metadata.slug);
  console.log('Canonical:');
  console.log(canonical);
  console.log('');

  // Open Graph
  const og = generateOpenGraph(metadata, baseUrl);
  console.log('Open Graph:');
  console.log(og);
  console.log('');

  // Twitter Card
  const twitter = generateTwitterCard(metadata, baseUrl, twitterHandle);
  console.log('Twitter Card:');
  console.log(twitter);
  console.log('');

  // JSON-LD Structured Data
  const schemas = generateJSONLD(metadata, baseUrl, {
    authorName: 'John Doe',
    publisherName: 'My Tech Blog',
    publisherLogo: `${baseUrl}/logo.png`,
    organizationName: 'My Company',
  });

  console.log('JSON-LD Article Schema:');
  console.log('<script type="application/ld+json">');
  console.log(JSON.stringify(schemas.article, null, 2));
  console.log('</script>');
  console.log('');

  console.log('JSON-LD Breadcrumb Schema:');
  console.log('<script type="application/ld+json">');
  console.log(JSON.stringify(schemas.breadcrumb, null, 2));
  console.log('</script>');
  console.log('');
}

// ============================================
// Example 2: Generate sitemap and robots.txt
// ============================================

function generateSiteFiles(postsDir, baseUrl, outputDir) {
  console.log('=== Generating Site Files ===\n');

  // Generate sitemap.xml
  const sitemap = generateSitemap(postsDir, baseUrl);
  const sitemapPath = path.join(outputDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
  console.log(`✓ Sitemap generated: ${sitemapPath}`);

  // Generate robots.txt
  const robotsTxt = generateRobotsTxt(`${baseUrl}/sitemap.xml`);
  const robotsPath = path.join(outputDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robotsTxt, 'utf-8');
  console.log(`✓ Robots.txt generated: ${robotsPath}`);
  console.log('');
}

// ============================================
// Example 3: Get image alt text suggestions
// ============================================

function getImageAltSuggestions() {
  console.log('=== Image Alt Text Suggestions ===\n');

  const suggestions = suggestAltText(
    './images/how-to-deploy-kubernetes-hero.jpg',
    {
      topic: 'Kubernetes Deployment',
      keyword: 'kubernetes cluster',
    }
  );

  console.log('Image: how-to-deploy-kubernetes-hero.jpg');
  console.log('Suggestions:');
  suggestions.forEach((s, i) => {
    console.log(`  ${i + 1}. ${s}`);
  });
  console.log('');
}

// ============================================
// Example 4: Manage redirects
// ============================================

function manageRedirects(configPath) {
  console.log('=== Redirect Management ===\n');

  // Add redirects
  addRedirect(configPath, '/old-blog-post', '/new-blog-post');
  addRedirect(configPath, '/outdated-guide', '/updated-guide');
  console.log('✓ Redirects added');

  // Read redirects
  const content = fs.readFileSync(configPath, 'utf-8');
  const redirects = JSON.parse(content);

  console.log('\nConfigured Redirects:');
  redirects.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.from} → ${r.to} (${r.permanent ? '301' : '302'})`);
  });
  console.log('');
}

// ============================================
// Example 5: Next.js Integration
// ============================================

function nextJsIntegration() {
  console.log('=== Next.js Integration Example ===\n');

  console.log('// pages/blog/[slug].js');
  console.log(`
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import {
  parseFrontmatter,
  generateOpenGraph,
  generateTwitterCard,
  generateJSONLD
} from 'seo-blog-engine/lib/seo-infrastructure';

export default function BlogPost({ metadata, content, seoTags }) {
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoTags.jsonld.article)
          }}
        />
      </Head>

      <article>
        <h1>{metadata.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </>
  );
}

export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), 'posts', \`\${params.slug}.md\`);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const metadata = parseFrontmatter(fileContent);

  const seoTags = {
    og: generateOpenGraph(metadata, 'https://yourblog.com'),
    twitter: generateTwitterCard(metadata, 'https://yourblog.com', 'yourhandle'),
    jsonld: generateJSONLD(metadata, 'https://yourblog.com')
  };

  return {
    props: {
      metadata,
      content: fileContent,
      seoTags
    }
  };
}
  `);
  console.log('');
}

// ============================================
// Example 6: Performance Hints
// ============================================

function showPerformanceHints() {
  console.log('=== Performance Optimization ===\n');

  const hints = generatePerformanceHints();

  console.log('1. Lazy Loading:');
  console.log(`   ${hints.lazyLoadingImages.html}`);
  console.log('');

  console.log('2. Preconnect:');
  console.log(`   ${hints.preconnectHints.google_fonts}`);
  console.log('');

  console.log('3. Image Optimization:');
  console.log(`   Formats: ${hints.imageOptimization.formats.join(', ')}`);
  console.log(`   ${hints.imageOptimization.example}`);
  console.log('');
}

// ============================================
// Run Examples
// ============================================

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║       SEO Infrastructure Integration Examples         ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// Example 1: Generate meta tags for an existing post
const examplePostPath = path.join(__dirname, '../output/how-to-build-a-rest-api-with-node-js.md');
if (fs.existsSync(examplePostPath)) {
  generatePostMetaTags(examplePostPath, 'https://example.com', 'yourhandle');
}

// Example 2: Generate sitemap and robots.txt
const postsDir = path.join(__dirname, '../output');
const outputDir = path.join(__dirname, '../');
generateSiteFiles(postsDir, 'https://example.com', outputDir);

// Example 3: Image alt text suggestions
getImageAltSuggestions();

// Example 4: Redirect management
const redirectsPath = path.join(__dirname, '../redirects-example.json');
if (!fs.existsSync(redirectsPath)) {
  fs.writeFileSync(redirectsPath, '[]', 'utf-8');
}
manageRedirects(redirectsPath);

// Example 5: Next.js integration code
nextJsIntegration();

// Example 6: Performance hints
showPerformanceHints();

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║                    Examples Complete                   ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('For more information, see:');
console.log('  - SEO_GUIDE.md - Comprehensive SEO infrastructure guide');
console.log('  - lib/seo-infrastructure.js - Full API reference');
console.log('  - lib/seo-audit.js - SEO audit system\n');
