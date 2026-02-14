#!/usr/bin/env node
'use strict';

const { Command } = require('commander');
const path = require('path');
const { generatePost, generateOutline, writePost, batchGenerate, listTemplates } = require('./lib/generator');
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

// ---- templates command (bonus) ----
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

program.parse(process.argv);
