'use strict';

/**
 * SEO Analyzer CLI - Batch analysis and optimization commands
 */

const fs = require('fs');
const path = require('path');
const {
  generateMetaDescription,
  optimizeTitleTag,
  calculateReadability,
  suggestInternalLinks,
  generateSchemaMarkup,
  analyzeKeywordDensity
} = require('./ai-seo');

/**
 * Analyze a single blog post for SEO optimization opportunities.
 *
 * @param {string} filePath - Path to markdown file
 * @returns {Object} Complete SEO analysis report
 */
function analyzePost(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);

  // Extract metadata from frontmatter
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

  // Run all analyses
  const report = {
    file: filename,
    title: metadata.title || 'No title found',
    currentDescription: metadata.description || 'No description found',
    analyses: {}
  };

  // Meta description optimization
  const generatedMeta = generateMetaDescription(content, primaryKeyword);
  report.analyses.metaDescription = {
    current: metadata.description || 'None',
    currentLength: metadata.description ? metadata.description.length : 0,
    generated: generatedMeta,
    generatedLength: generatedMeta.length,
    recommendation: metadata.description ?
      (metadata.description.length < 120 ? 'Too short - use generated version' :
       metadata.description.length > 160 ? 'Too long - truncate to 150-160 chars' :
       'Length is good') :
      'Missing - use generated version'
  };

  // Title tag optimization
  if (metadata.title) {
    report.analyses.titleTag = optimizeTitleTag(metadata.title, keywords);
  }

  // Readability analysis
  report.analyses.readability = calculateReadability(content);

  // Keyword density
  if (keywords.length > 0) {
    report.analyses.keywordDensity = analyzeKeywordDensity(content, keywords.slice(0, 3));
  }

  // Schema markup
  report.analyses.schema = generateSchemaMarkup(content, metadata);

  return report;
}

/**
 * Analyze all posts in a directory and generate a summary report.
 *
 * @param {string} directory - Directory containing markdown files
 * @returns {Object[]} Array of analysis reports
 */
function analyzeDirectory(directory) {
  const resolvedDir = path.resolve(directory);

  if (!fs.existsSync(resolvedDir)) {
    throw new Error(`Directory not found: ${resolvedDir}`);
  }

  const files = fs.readdirSync(resolvedDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(resolvedDir, f));

  const reports = files.map(file => {
    try {
      return analyzePost(file);
    } catch (err) {
      return {
        file: path.basename(file),
        error: err.message
      };
    }
  });

  return reports;
}

/**
 * Generate internal linking suggestions for all posts in a directory.
 *
 * @param {string} directory - Directory containing markdown files
 * @returns {Object} Internal linking map
 */
function generateLinkingMap(directory) {
  const resolvedDir = path.resolve(directory);

  if (!fs.existsSync(resolvedDir)) {
    throw new Error(`Directory not found: ${resolvedDir}`);
  }

  const files = fs.readdirSync(resolvedDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(resolvedDir, f));

  const linkingMap = {};

  files.forEach(file => {
    const filename = path.basename(file);
    try {
      const suggestions = suggestInternalLinks(file, resolvedDir);
      linkingMap[filename] = suggestions;
    } catch (err) {
      linkingMap[filename] = { error: err.message };
    }
  });

  return linkingMap;
}

/**
 * Export schema markup for a post to a JSON file.
 *
 * @param {string} filePath - Path to markdown file
 * @param {string} outputPath - Path for JSON output
 */
function exportSchema(filePath, outputPath) {
  const content = fs.readFileSync(filePath, 'utf-8');

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

  const schemas = generateSchemaMarkup(content, metadata);

  fs.writeFileSync(outputPath, JSON.stringify(schemas, null, 2), 'utf-8');

  return schemas;
}

/**
 * Format analysis report as readable text.
 *
 * @param {Object} report - Analysis report from analyzePost
 * @returns {string} Formatted report
 */
function formatReport(report) {
  if (report.error) {
    return `\n[ERROR] ${report.file}: ${report.error}\n`;
  }

  let output = '';
  output += `\n${'='.repeat(70)}\n`;
  output += `SEO ANALYSIS REPORT: ${report.file}\n`;
  output += `${'='.repeat(70)}\n\n`;

  output += `TITLE: ${report.title}\n\n`;

  // Title Tag Analysis
  if (report.analyses.titleTag) {
    const tt = report.analyses.titleTag;
    output += `--- TITLE TAG OPTIMIZATION ---\n`;
    output += `Score: ${tt.score}/100 (Grade: ${tt.grade})\n`;
    output += `Length: ${tt.charCount} characters (${tt.wordCount} words)\n`;

    if (tt.powerWords.length > 0) {
      output += `Power Words: ${tt.powerWords.join(', ')}\n`;
    }

    if (tt.keywords.length > 0) {
      output += `Keywords:\n`;
      tt.keywords.forEach(kw => {
        output += `  - "${kw.keyword}": ${kw.present ? 'Present' : 'MISSING'} (Position: ${kw.position === -1 ? 'N/A' : kw.position})\n`;
      });
    }

    if (tt.suggestions.length > 0) {
      output += `Suggestions:\n`;
      tt.suggestions.forEach(s => output += `  - ${s}\n`);
    }

    if (tt.improved) {
      output += `\nImproved Version:\n  "${tt.improved}"\n`;
    }

    output += '\n';
  }

  // Meta Description
  if (report.analyses.metaDescription) {
    const md = report.analyses.metaDescription;
    output += `--- META DESCRIPTION ---\n`;
    output += `Current: ${md.current}\n`;
    output += `Length: ${md.currentLength} chars (Ideal: 150-160)\n`;
    output += `Recommendation: ${md.recommendation}\n\n`;
    output += `Generated Meta Description:\n`;
    output += `  "${md.generated}"\n`;
    output += `  (${md.generatedLength} chars)\n\n`;
  }

  // Readability
  if (report.analyses.readability) {
    const rd = report.analyses.readability;
    output += `--- READABILITY ANALYSIS ---\n`;
    output += `Flesch Reading Ease: ${rd.score}/100 (${rd.grade})\n`;
    output += `Grade Level: ${rd.gradeLevel}\n`;
    output += `Word Count: ${rd.wordCount}\n`;
    output += `Sentences: ${rd.sentenceCount}\n`;
    output += `Avg Words/Sentence: ${rd.avgWordsPerSentence}\n`;
    output += `Avg Syllables/Word: ${rd.avgSyllablesPerWord}\n`;

    if (rd.suggestions.length > 0) {
      output += `Suggestions:\n`;
      rd.suggestions.forEach(s => output += `  - ${s}\n`);
    }

    output += '\n';
  }

  // Keyword Density
  if (report.analyses.keywordDensity) {
    const kd = report.analyses.keywordDensity;
    output += `--- KEYWORD DENSITY ---\n`;
    output += `Total Words: ${kd.totalWords}\n`;

    kd.keywords.forEach(kw => {
      output += `\n"${kw.keyword}":\n`;
      output += `  Count: ${kw.count}\n`;
      output += `  Density: ${kw.density}%\n`;
      output += `  Status: ${kw.status.toUpperCase()}\n`;
      output += `  ${kw.suggestion}\n`;
    });

    output += '\n';
  }

  // Schema Markup
  if (report.analyses.schema) {
    const schemas = report.analyses.schema;
    output += `--- SCHEMA MARKUP ---\n`;
    output += `Available schemas: ${Object.keys(schemas).join(', ')}\n`;

    if (schemas.faq && schemas.faq.mainEntity) {
      output += `FAQ Questions: ${schemas.faq.mainEntity.length}\n`;
    }

    if (schemas.howTo && schemas.howTo.step) {
      output += `HowTo Steps: ${schemas.howTo.step.length}\n`;
    }

    output += `\nTo export schema markup, use:\n`;
    output += `  node seo.js schema --file "${report.file}" --output schema.json\n\n`;
  }

  output += `${'='.repeat(70)}\n\n`;

  return output;
}

module.exports = {
  analyzePost,
  analyzeDirectory,
  generateLinkingMap,
  exportSchema,
  formatReport
};
