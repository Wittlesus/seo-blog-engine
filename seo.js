#!/usr/bin/env node
'use strict';

/**
 * SEO Analyzer CLI
 *
 * AI-powered SEO analysis commands for blog posts.
 * These features differentiate this engine from static site generators.
 */

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const {
  analyzePost,
  analyzeDirectory,
  generateLinkingMap,
  exportSchema,
  formatReport
} = require('./lib/seo-analyzer');

const program = new Command();

program
  .name('seo')
  .description('AI-Powered SEO Analysis Tools')
  .version('1.0.0');

// ---- analyze command ----
program
  .command('analyze')
  .description('Analyze a blog post for SEO optimization opportunities')
  .requiredOption('-f, --file <path>', 'Path to markdown file')
  .option('-o, --output <path>', 'Save report to file (optional)')
  .action((opts) => {
    try {
      console.log('\n  AI-Powered SEO Analyzer');
      console.log('  ========================\n');

      const report = analyzePost(opts.file);
      const formatted = formatReport(report);

      console.log(formatted);

      if (opts.output) {
        fs.writeFileSync(opts.output, formatted, 'utf-8');
        console.log(`  Report saved to: ${path.resolve(opts.output)}\n`);
      }
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- batch-analyze command ----
program
  .command('batch-analyze')
  .description('Analyze all posts in a directory')
  .requiredOption('-d, --dir <path>', 'Directory containing markdown files')
  .option('-o, --output <path>', 'Save summary report to file (optional)')
  .action((opts) => {
    try {
      console.log('\n  AI-Powered SEO Batch Analyzer');
      console.log('  ==============================\n');

      const reports = analyzeDirectory(opts.dir);

      let output = '';
      let passCount = 0;
      let warnCount = 0;
      let failCount = 0;

      reports.forEach((report) => {
        if (report.error) {
          console.log(`  [ERROR] ${report.file}: ${report.error}`);
          failCount++;
          return;
        }

        // Quick score calculation
        let score = 0;
        let maxScore = 0;

        if (report.analyses.titleTag) {
          score += report.analyses.titleTag.score;
          maxScore += 100;
        }

        if (report.analyses.readability && report.analyses.readability.score >= 60) {
          score += 100;
          maxScore += 100;
        } else if (report.analyses.readability) {
          score += report.analyses.readability.score;
          maxScore += 100;
        }

        const avgScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

        let status = '[ OK ]';
        if (avgScore < 50) {
          status = '[FAIL]';
          failCount++;
        } else if (avgScore < 75) {
          status = '[WARN]';
          warnCount++;
        } else {
          passCount++;
        }

        console.log(`  ${status} ${report.file.padEnd(50)} Score: ${avgScore}/100`);

        output += formatReport(report);
      });

      console.log(`\n  ${'─'.repeat(70)}`);
      console.log(`  Summary: ${passCount} passed, ${warnCount} warnings, ${failCount} failed`);
      console.log(`  Total Posts: ${reports.length}\n`);

      if (opts.output) {
        fs.writeFileSync(opts.output, output, 'utf-8');
        console.log(`  Full report saved to: ${path.resolve(opts.output)}\n`);
      }
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- internal-links command ----
program
  .command('internal-links')
  .description('Generate internal linking suggestions for all posts')
  .requiredOption('-d, --dir <path>', 'Directory containing markdown files')
  .option('-o, --output <path>', 'Save linking map to JSON file (optional)')
  .action((opts) => {
    try {
      console.log('\n  AI-Powered Internal Linking Suggester');
      console.log('  ======================================\n');

      const linkingMap = generateLinkingMap(opts.dir);

      Object.entries(linkingMap).forEach(([filename, suggestions]) => {
        console.log(`\n  ${filename}`);
        console.log(`  ${'─'.repeat(filename.length)}`);

        if (suggestions.error) {
          console.log(`  [ERROR] ${suggestions.error}`);
          return;
        }

        if (suggestions.length === 0) {
          console.log(`  No related posts found.`);
          return;
        }

        suggestions.forEach((link, i) => {
          console.log(`\n  ${i + 1}. ${link.title}`);
          console.log(`     Relevance: ${link.relevance} (Score: ${link.score})`);
          console.log(`     Link: /${link.slug}`);
          console.log(`     Common Topics: ${link.commonKeywords.slice(0, 3).join(', ')}`);
        });
      });

      console.log(`\n  ${'─'.repeat(70)}\n`);

      if (opts.output) {
        fs.writeFileSync(opts.output, JSON.stringify(linkingMap, null, 2), 'utf-8');
        console.log(`  Linking map saved to: ${path.resolve(opts.output)}\n`);
      }
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- schema command ----
program
  .command('schema')
  .description('Generate schema markup for a blog post')
  .requiredOption('-f, --file <path>', 'Path to markdown file')
  .option('-o, --output <path>', 'Save schema to JSON file (optional)')
  .action((opts) => {
    try {
      console.log('\n  Schema Markup Generator');
      console.log('  =======================\n');

      const content = fs.readFileSync(opts.file, 'utf-8');

      // Extract metadata
      const metadata = {};
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m);
        const descMatch = frontmatter.match(/^description:\s*["']?(.+?)["']?\s*$/m);
        const dateMatch = frontmatter.match(/^date:\s*["']?(.+?)["']?\s*$/m);
        const authorMatch = frontmatter.match(/^author:\s*["']?(.+?)["']?\s*$/m);

        if (titleMatch) metadata.title = titleMatch[1].replace(/^["']|["']$/g, '');
        if (descMatch) metadata.description = descMatch[1].replace(/^["']|["']$/g, '');
        if (dateMatch) metadata.date = dateMatch[1].replace(/^["']|["']$/g, '');
        if (authorMatch) metadata.author = authorMatch[1].replace(/^["']|["']$/g, '');
      }

      const { generateSchemaMarkup } = require('./lib/ai-seo');
      const schemas = generateSchemaMarkup(content, metadata);

      console.log('  Generated Schema Types:');
      console.log('  -----------------------\n');

      Object.keys(schemas).forEach(type => {
        console.log(`  - ${type}`);
      });

      console.log('\n  Schema JSON:\n');
      console.log(JSON.stringify(schemas, null, 2));
      console.log('');

      if (opts.output) {
        fs.writeFileSync(opts.output, JSON.stringify(schemas, null, 2), 'utf-8');
        console.log(`  Schema saved to: ${path.resolve(opts.output)}\n`);
      }

      console.log('  Copy the schema objects above and add them to your HTML <head> tag');
      console.log('  inside <script type="application/ld+json"> tags.\n');
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

// ---- optimize command (all-in-one) ----
program
  .command('optimize')
  .description('Run all SEO optimizations on a post and show recommendations')
  .requiredOption('-f, --file <path>', 'Path to markdown file')
  .action((opts) => {
    try {
      console.log('\n  AI-Powered SEO Optimizer');
      console.log('  ========================\n');

      const content = fs.readFileSync(opts.file, 'utf-8');
      const filename = path.basename(opts.file);

      // Extract metadata
      const metadata = {};
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);

      if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        const titleMatch = frontmatter.match(/^title:\s*["']?(.+?)["']?\s*$/m);
        const keywordsMatch = frontmatter.match(/^tags:\s*\[(.+?)\]/m);
        const descMatch = frontmatter.match(/^description:\s*["']?(.+?)["']?\s*$/m);

        if (titleMatch) metadata.title = titleMatch[1].replace(/^["']|["']$/g, '');
        if (descMatch) metadata.description = descMatch[1].replace(/^["']|["']$/g, '');
        if (keywordsMatch) {
          metadata.keywords = keywordsMatch[1]
            .split(',')
            .map(k => k.trim().replace(/^["']|["']$/g, ''));
        }
      }

      const keywords = metadata.keywords || [];
      const primaryKeyword = keywords[0] || '';

      console.log(`  File: ${filename}\n`);

      // Meta Description
      const { generateMetaDescription } = require('./lib/ai-seo');
      const generatedMeta = generateMetaDescription(content, primaryKeyword);

      console.log('  RECOMMENDED META DESCRIPTION:');
      console.log('  ' + '─'.repeat(68));
      console.log(`  ${generatedMeta}`);
      console.log('  ' + '─'.repeat(68));
      console.log(`  Length: ${generatedMeta.length} chars (Optimal: 150-160)\n`);

      // Title Optimization
      if (metadata.title) {
        const { optimizeTitleTag } = require('./lib/ai-seo');
        const titleAnalysis = optimizeTitleTag(metadata.title, keywords);

        console.log(`  TITLE TAG OPTIMIZATION:`);
        console.log('  ' + '─'.repeat(68));
        console.log(`  Current: ${metadata.title}`);
        console.log(`  Score: ${titleAnalysis.score}/100 (${titleAnalysis.grade})`);

        if (titleAnalysis.improved) {
          console.log(`  Improved: ${titleAnalysis.improved}`);
        }

        if (titleAnalysis.suggestions.length > 0) {
          console.log('  Suggestions:');
          titleAnalysis.suggestions.forEach(s => console.log(`    - ${s}`));
        }
        console.log('');
      }

      // Readability
      const { calculateReadability } = require('./lib/ai-seo');
      const readability = calculateReadability(content);

      console.log(`  READABILITY SCORE:`);
      console.log('  ' + '─'.repeat(68));
      console.log(`  Flesch Reading Ease: ${readability.score}/100 (${readability.grade})`);
      console.log(`  Grade Level: ${readability.gradeLevel}`);
      console.log(`  Word Count: ${readability.wordCount} words`);

      if (readability.suggestions.length > 0) {
        console.log('  Suggestions:');
        readability.suggestions.forEach(s => console.log(`    - ${s}`));
      }
      console.log('');

      // Internal Links
      const dir = path.dirname(opts.file);
      const { suggestInternalLinks } = require('./lib/ai-seo');

      try {
        const links = suggestInternalLinks(opts.file, dir);

        if (links.length > 0) {
          console.log(`  INTERNAL LINKING SUGGESTIONS:`);
          console.log('  ' + '─'.repeat(68));

          links.slice(0, 3).forEach((link, i) => {
            console.log(`  ${i + 1}. ${link.title}`);
            console.log(`     Link: /${link.slug}`);
            console.log(`     Relevance: ${link.relevance}\n`);
          });
        }
      } catch (e) {
        // Skip if no other posts found
      }

      console.log('  ' + '═'.repeat(68));
      console.log('  Optimization complete! Apply the recommendations above.\n');
    } catch (err) {
      console.error(`\n  [ERROR] ${err.message}\n`);
      process.exit(1);
    }
  });

program.parse(process.argv);
