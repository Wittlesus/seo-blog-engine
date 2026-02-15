#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const path = require('path');
const fs = require('fs');
const { generatePost, generateOutline, writePost, batchGenerate, listTemplates } = require('./lib/generator');
const { generateSitemap, generateRobotsTxt, generatePerformanceHints, addRedirect, generateNextJSRedirects } = require('./lib/seo-infrastructure');
const { auditAllPosts, generateAuditReport, generateAuditReportJSON } = require('./lib/seo-audit');
const pkg = require('./package.json');

const program = new Command();

program
  .name('seo-blog')
  .description('SEO Blog Engine - Generate SEO-optimized blog post templates in seconds')
  .version(pkg.version);

// ---- generate command ----
program
  .command('generate')
  .description('Generate an SEO-optimized blog post')
  .requiredOption('-t, --topic <topic>', 'Blog post topic (e.g., "Kubernetes Deployment")')
  .option('-k, --keywords <keywords>', 'Comma-separated target keywords', '')
  .option('-o, --output <dir>', 'Output directory', './output')
  .option('--template <type>', 'Template type: how-to, listicle, comparison, ultimate-guide')
  .action((opts) => {
    try {
      console.log('\n  SEO Blog Engine v' + pkg.version);
      console.log('  ========================\n');
      console.log(`  Topic:    ${opts.topic}`);
      console.log(`  Keywords: ${opts.keywords || '(auto-detect)'}`);
      console.log(`  Template: ${opts.template || '(auto-detect)'}`);
      console.log(`  Output:   ${path.resolve(opts.output)}\n`);

      const result = generatePost({
        topic: opts.topic,
        keywords: opts.keywords,
        template: opts.template,
      });

      const filepath = writePost(opts.output, result.filename, result.content);

      console.log('  [OK] Blog post generated successfully!\n');
      console.log(`  Template Used:  ${result.metadata.templateName}`);
      console.log(`  File:           ${filepath}`);
      console.log(`  Slug:           /${result.metadata.slug}`);
      console.log(`  Keywords:       ${result.metadata.keywords.join(', ') || '(none)'}`);
      console.log(`  Generated At:   ${result.metadata.generatedAt}\n`);
      console.log('  Next steps:');
      console.log('  1. Open the file and replace all [PLACEHOLDER] content');
      console.log('  2. Add your own images with SEO-friendly alt text');
      console.log('  3. Review the SEO checklist at the bottom of the file');
      console.log('  4. Add internal and external links');
      console.log('  5. Publish and submit to Google Search Console\n');
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- batch command ----
program
  .command('batch')
  .description('Batch generate blog posts from a JSON topics file')
  .requiredOption('--topics <file>', 'Path to JSON topics file')
  .option('-o, --output <dir>', 'Output directory', './output')
  .action((opts) => {
    try {
      console.log('\n  SEO Blog Engine v' + pkg.version + ' -- Batch Mode');
      console.log('  ========================================\n');
      console.log(`  Topics File: ${path.resolve(opts.topics)}`);
      console.log(`  Output Dir:  ${path.resolve(opts.output)}\n`);
      console.log('  Generating posts...\n');

      const results = batchGenerate(opts.topics, opts.output);

      let successCount = 0;
      let errorCount = 0;

      results.forEach((r) => {
        if (r.status === 'success') {
          successCount++;
          console.log(`  [OK]    ${r.index}. ${r.topic}`);
          console.log(`          Template: ${r.template} | File: ${r.filename}`);
        } else {
          errorCount++;
          console.log(`  [FAIL]  ${r.index}. ${r.topic}`);
          console.log(`          Error: ${r.error}`);
        }
      });

      console.log(`\n  ----------------------------------------`);
      console.log(`  Results: ${successCount} generated, ${errorCount} failed`);
      console.log(`  Output:  ${path.resolve(opts.output)}\n`);

      if (errorCount > 0) {
        process.exit(1);
      }
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- outline command ----
program
  .command('outline')
  .description('Generate a blog post outline (no full content)')
  .requiredOption('-t, --topic <topic>', 'Blog post topic')
  .option('-k, --keywords <keywords>', 'Comma-separated target keywords', '')
  .option('--template <type>', 'Template type: how-to, listicle, comparison, ultimate-guide')
  .action((opts) => {
    try {
      console.log('\n  SEO Blog Engine v' + pkg.version + ' -- Outline Mode');
      console.log('  ==========================================\n');

      const result = generateOutline({
        topic: opts.topic,
        keywords: opts.keywords,
        template: opts.template,
      });

      console.log(result.outline);
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- templates command ----
program
  .command('templates')
  .description('List all available blog post templates')
  .action(() => {
    console.log('\n  Available Templates:');
    console.log('  ====================\n');

    const templates = listTemplates();
    templates.forEach((t) => {
      console.log(`  ${t.key.padEnd(16)} ${t.name}`);
      console.log(`  ${''.padEnd(16)} Format: ${t.description}\n`);
    });
  });

// ---- audit command ----
program
  .command('audit')
  .description('Run SEO audit on all blog posts')
  .option('-o, --output <dir>', 'Posts directory to audit', './output')
  .option('--format <type>', 'Output format: text or json', 'text')
  .option('--save <file>', 'Save report to file (optional)')
  .action((opts) => {
    try {
      console.log('\n  SEO Blog Engine v' + pkg.version + ' -- SEO Audit');
      console.log('  ==========================================\n');
      console.log(`  Auditing posts in: ${path.resolve(opts.output)}\n`);

      const results = auditAllPosts(opts.output);

      let report;
      if (opts.format === 'json') {
        report = generateAuditReportJSON(results);
      } else {
        report = generateAuditReport(results);
      }

      console.log(report);

      if (opts.save) {
        fs.writeFileSync(opts.save, report, 'utf-8');
        console.log(`\n  Report saved to: ${path.resolve(opts.save)}\n`);
      }
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- sitemap command ----
program
  .command('sitemap')
  .description('Generate sitemap.xml for blog posts')
  .requiredOption('--base-url <url>', 'Base URL of the site (e.g., https://example.com)')
  .option('-o, --output <dir>', 'Posts directory', './output')
  .option('--save <file>', 'Save sitemap to file', './sitemap.xml')
  .action((opts) => {
    try {
      console.log('\n  SEO Blog Engine -- Sitemap Generator');
      console.log('  ====================================\n');

      const sitemap = generateSitemap(opts.output, opts.baseUrl);

      console.log(sitemap);

      if (opts.save) {
        fs.writeFileSync(opts.save, sitemap, 'utf-8');
        console.log(`\n  Sitemap saved to: ${path.resolve(opts.save)}\n`);
      }
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- robots command ----
program
  .command('robots')
  .description('Generate robots.txt')
  .requiredOption('--sitemap-url <url>', 'Full URL to sitemap.xml')
  .option('--save <file>', 'Save robots.txt to file', './robots.txt')
  .action((opts) => {
    try {
      console.log('\n  SEO Blog Engine -- Robots.txt Generator');
      console.log('  =======================================\n');

      const robotsTxt = generateRobotsTxt(opts.sitemapUrl);

      console.log(robotsTxt);

      if (opts.save) {
        fs.writeFileSync(opts.save, robotsTxt, 'utf-8');
        console.log(`\n  robots.txt saved to: ${path.resolve(opts.save)}\n`);
      }
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- redirect command ----
program
  .command('redirect')
  .description('Manage 301 redirects')
  .option('--add', 'Add a new redirect')
  .option('--from <path>', 'Source path (e.g., /old-post)')
  .option('--to <path>', 'Destination path (e.g., /new-post)')
  .option('--list', 'List all redirects')
  .option('--export-nextjs', 'Export as Next.js config')
  .option('--config <file>', 'Redirects config file', './redirects.json')
  .action((opts) => {
    try {
      if (opts.add) {
        if (!opts.from || !opts.to) {
          console.error('\n  [ERROR] --from and --to are required when adding a redirect\n');
          process.exit(1);
        }

        const redirects = addRedirect(opts.config, opts.from, opts.to);
        console.log(`\n  Redirect added: ${opts.from} -> ${opts.to}`);
        console.log(`  Total redirects: ${redirects.length}\n`);
      } else if (opts.list) {
        const content = fs.existsSync(opts.config) ? fs.readFileSync(opts.config, 'utf-8') : '[]';
        const redirects = JSON.parse(content);

        console.log('\n  Configured Redirects:');
        console.log('  =====================\n');

        if (redirects.length === 0) {
          console.log('  No redirects configured.\n');
        } else {
          redirects.forEach((r, i) => {
            console.log(`  ${i + 1}. ${r.from} -> ${r.to} (${r.permanent ? '301' : '302'})`);
          });
          console.log('');
        }
      } else if (opts.exportNextjs) {
        const code = generateNextJSRedirects(opts.config);
        console.log('\n' + code);
      } else {
        console.log('\n  Use --add, --list, or --export-nextjs\n');
      }
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- performance command ----
program
  .command('performance')
  .description('Show performance optimization recommendations')
  .action(() => {
    console.log('\n  SEO Blog Engine -- Performance Optimization Guide');
    console.log('  =================================================\n');

    const hints = generatePerformanceHints();

    console.log('  1. Lazy Loading Images');
    console.log('  ----------------------');
    console.log(`     HTML:   ${hints.lazyLoadingImages.html}`);
    console.log(`     Next.js: ${hints.lazyLoadingImages.nextjs}`);
    console.log(`     Note:   ${hints.lazyLoadingImages.note}\n`);

    console.log('  2. Preconnect Hints');
    console.log('  -------------------');
    console.log(`     Google Fonts:     ${hints.preconnectHints.google_fonts}`);
    console.log(`     Google Analytics: ${hints.preconnectHints.google_analytics}`);
    console.log(`     CDN:             ${hints.preconnectHints.cdn}`);
    console.log(`     Note:            ${hints.preconnectHints.note}\n`);

    console.log('  3. Critical CSS');
    console.log('  ---------------');
    console.log(`     Note:  ${hints.criticalCSS.note}`);
    console.log(`     Tools: ${hints.criticalCSS.tools.join(', ')}`);
    console.log(`     Example: ${hints.criticalCSS.example}\n`);

    console.log('  4. Font Optimization');
    console.log('  --------------------');
    console.log(`     Note: ${hints.fontOptimization.note}`);
    console.log(`     CSS:  ${hints.fontOptimization.css}\n`);

    console.log('  5. Image Optimization');
    console.log('  ---------------------');
    console.log(`     Formats: ${hints.imageOptimization.formats.join(', ')}`);
    console.log(`     Note:    ${hints.imageOptimization.note}`);
    console.log(`     Example:\n     ${hints.imageOptimization.example}\n`);
  });

// ---- ai-optimize command (AI-powered SEO features) ----
program
  .command('ai-optimize')
  .description('AI-powered SEO optimization for blog posts (auto meta descriptions, title optimization, readability scoring, internal linking)')
  .requiredOption('-f, --file <path>', 'Path to markdown file to analyze')
  .option('--dir <path>', 'Directory for internal link suggestions (defaults to file directory)')
  .action((opts) => {
    try {
      const { analyzePost, formatReport } = require('./lib/seo-analyzer');
      const { suggestInternalLinks } = require('./lib/ai-seo');

      console.log('\n  AI-Powered SEO Optimizer');
      console.log('  ========================\n');
      console.log('  Analyzing:', opts.file, '\n');

      const report = analyzePost(opts.file);
      const formatted = formatReport(report);

      console.log(formatted);

      console.log('  AI SEO Features Used:');
      console.log('  - Auto meta description generator');
      console.log('  - Title tag optimizer with keyword analysis');
      console.log('  - Readability scorer (Flesch-Kincaid)');
      console.log('  - Keyword density analyzer');
      console.log('  - Schema markup generator\n');

      console.log('  For more AI SEO commands: node seo.js --help\n');
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

program.parse(process.argv);
