'use strict';

const fs = require('fs');
const path = require('path');
const { parseFrontmatter, extractH1, extractImages } = require('./seo-infrastructure');

/**
 * SEO Audit Module
 * Checks blog posts for common SEO issues and generates detailed reports
 */

/**
 * Count words in text
 */
function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Extract all links from markdown content
 */
function extractLinks(content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2];
    const isInternal = !url.startsWith('http') && !url.startsWith('//');
    links.push({
      text: match[1],
      url,
      isInternal,
    });
  }

  return links;
}

/**
 * Check if a URL is broken (basic check for file paths)
 */
function checkBrokenLink(link, postsDir) {
  if (link.url.startsWith('http') || link.url.startsWith('//')) {
    // External link - would need HTTP request to verify
    return { broken: false, reason: 'External link (not checked)' };
  }

  if (link.url.startsWith('#')) {
    // Anchor link - would need to check if anchor exists
    return { broken: false, reason: 'Anchor link (not checked)' };
  }

  // Check if internal file exists
  if (link.url.startsWith('./') || link.url.startsWith('../')) {
    const linkPath = path.resolve(postsDir, link.url);
    if (!fs.existsSync(linkPath)) {
      return { broken: true, reason: 'File not found' };
    }
  }

  return { broken: false, reason: 'OK' };
}

/**
 * Audit a single blog post
 */
function auditPost(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const filename = path.basename(filepath);

  // Parse metadata
  const metadata = parseFrontmatter(content);
  const h1 = extractH1(content);
  const images = extractImages(content);
  const links = extractLinks(content);

  const issues = [];
  const warnings = [];
  const recommendations = [];

  // Check title
  if (!metadata || !metadata.title) {
    issues.push('Missing title in frontmatter');
  } else {
    const titleLength = metadata.title.length;
    if (titleLength < 30) {
      warnings.push(`Title too short (${titleLength} chars, recommended 50-60)`);
    } else if (titleLength > 70) {
      warnings.push(`Title too long (${titleLength} chars, recommended 50-60)`);
    }
  }

  // Check meta description
  if (!metadata || !metadata.description) {
    issues.push('Missing meta description');
  } else {
    const descLength = metadata.description.length;
    if (descLength < 120) {
      warnings.push(`Meta description too short (${descLength} chars, recommended 150-160)`);
    } else if (descLength > 160) {
      warnings.push(`Meta description too long (${descLength} chars, recommended 150-160)`);
    }
  }

  // Check H1
  if (!h1) {
    issues.push('Missing H1 tag');
  } else if (metadata && metadata.title && h1 !== metadata.title) {
    warnings.push('H1 does not match frontmatter title');
  }

  // Check slug
  if (!metadata || !metadata.slug) {
    issues.push('Missing slug in frontmatter');
  }

  // Check canonical URL
  if (!metadata || !metadata.canonical_url || metadata.canonical_url.includes('[YOUR_DOMAIN]')) {
    warnings.push('Canonical URL not configured (still has placeholder)');
  }

  // Check author
  if (!metadata || !metadata.author || metadata.author === '[AUTHOR_NAME]') {
    warnings.push('Author name not configured (still has placeholder)');
  }

  // Check featured image
  if (!metadata || !metadata.featured_image || metadata.featured_image.includes('[IMAGE_PATH')) {
    warnings.push('Featured image not configured (still has placeholder)');
  }

  // Check images
  let missingAltCount = 0;
  let placeholderAltCount = 0;

  images.forEach((img) => {
    if (!img.alt || img.alt.trim() === '') {
      missingAltCount++;
    } else if (img.alt.includes('REPLACE') || img.alt.includes('[') || img.alt.includes('IMAGE_PATH')) {
      placeholderAltCount++;
    }
  });

  if (missingAltCount > 0) {
    issues.push(`${missingAltCount} image(s) missing alt text`);
  }

  if (placeholderAltCount > 0) {
    warnings.push(`${placeholderAltCount} image(s) have placeholder alt text`);
  }

  // Check word count
  const wordCount = countWords(content);
  if (wordCount < 1000) {
    warnings.push(`Low word count (${wordCount} words, recommended 2000+)`);
  }

  // Check internal links
  const internalLinks = links.filter((l) => l.isInternal);
  const externalLinks = links.filter((l) => !l.isInternal);

  if (internalLinks.length < 3) {
    recommendations.push(`Add more internal links (found ${internalLinks.length}, recommended 3+)`);
  }

  if (externalLinks.length < 2) {
    recommendations.push(`Add more external authoritative links (found ${externalLinks.length}, recommended 2+)`);
  }

  // Check for broken links (basic check)
  const postsDir = path.dirname(filepath);
  const brokenLinks = [];

  links.forEach((link) => {
    const check = checkBrokenLink(link, postsDir);
    if (check.broken) {
      brokenLinks.push({ ...link, reason: check.reason });
    }
  });

  if (brokenLinks.length > 0) {
    issues.push(`${brokenLinks.length} potentially broken link(s)`);
  }

  // Check for placeholders in content
  const placeholderMatches = content.match(/\[PLACEHOLDER\]|\[.*?\]|\[Write.*?\]/gi);
  if (placeholderMatches && placeholderMatches.length > 0) {
    warnings.push(`${placeholderMatches.length} content placeholder(s) found - content not finalized`);
  }

  return {
    filename,
    filepath,
    metadata: {
      title: metadata?.title || 'N/A',
      titleLength: metadata?.title?.length || 0,
      description: metadata?.description || 'N/A',
      descriptionLength: metadata?.description?.length || 0,
      slug: metadata?.slug || 'N/A',
      date: metadata?.date || 'N/A',
      tags: metadata?.tags || [],
    },
    content: {
      wordCount,
      h1Present: !!h1,
      imageCount: images.length,
      imagesWithAlt: images.length - missingAltCount - placeholderAltCount,
      imagesMissingAlt: missingAltCount,
      imagesPlaceholderAlt: placeholderAltCount,
      internalLinkCount: internalLinks.length,
      externalLinkCount: externalLinks.length,
      totalLinkCount: links.length,
      brokenLinks: brokenLinks.length,
    },
    issues,
    warnings,
    recommendations,
    score: calculateSEOScore(issues, warnings, recommendations),
  };
}

/**
 * Calculate SEO score (0-100)
 */
function calculateSEOScore(issues, warnings, recommendations) {
  let score = 100;

  // Deduct for issues (critical)
  score -= issues.length * 10;

  // Deduct for warnings (moderate)
  score -= warnings.length * 5;

  // Deduct for recommendations (minor)
  score -= recommendations.length * 2;

  return Math.max(0, Math.min(100, score));
}

/**
 * Audit all posts in a directory
 */
function auditAllPosts(postsDir) {
  if (!fs.existsSync(postsDir)) {
    throw new Error(`Posts directory not found: ${postsDir}`);
  }

  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'));

  if (files.length === 0) {
    return { posts: [], summary: null };
  }

  const results = files.map((file) => {
    const filepath = path.join(postsDir, file);
    return auditPost(filepath);
  });

  // Calculate summary statistics
  const summary = {
    totalPosts: results.length,
    averageScore: Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length),
    totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
    totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
    totalRecommendations: results.reduce((sum, r) => sum + r.recommendations.length, 0),
    postsByScore: {
      excellent: results.filter((r) => r.score >= 90).length,
      good: results.filter((r) => r.score >= 70 && r.score < 90).length,
      needsWork: results.filter((r) => r.score >= 50 && r.score < 70).length,
      poor: results.filter((r) => r.score < 50).length,
    },
  };

  return { posts: results, summary };
}

/**
 * Generate audit report as formatted text
 */
function generateAuditReport(auditResults) {
  const { posts, summary } = auditResults;

  let report = '';
  report += '╔════════════════════════════════════════════════════════════════╗\n';
  report += '║                    SEO AUDIT REPORT                            ║\n';
  report += '╚════════════════════════════════════════════════════════════════╝\n\n';

  if (!summary) {
    report += 'No posts found to audit.\n';
    return report;
  }

  // Summary
  report += '📊 SUMMARY\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += `Total Posts:        ${summary.totalPosts}\n`;
  report += `Average SEO Score:  ${summary.averageScore}/100\n`;
  report += `Total Issues:       ${summary.totalIssues}\n`;
  report += `Total Warnings:     ${summary.totalWarnings}\n`;
  report += `Total Suggestions:  ${summary.totalRecommendations}\n\n`;

  report += 'Posts by Score:\n';
  report += `  Excellent (90+):  ${summary.postsByScore.excellent}\n`;
  report += `  Good (70-89):     ${summary.postsByScore.good}\n`;
  report += `  Needs Work (50-69): ${summary.postsByScore.needsWork}\n`;
  report += `  Poor (<50):       ${summary.postsByScore.poor}\n\n`;

  // Individual post details
  report += '📄 INDIVIDUAL POST DETAILS\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

  // Sort by score (lowest first - show problems first)
  const sortedPosts = [...posts].sort((a, b) => a.score - b.score);

  sortedPosts.forEach((post, i) => {
    const scoreEmoji = post.score >= 90 ? '✅' : post.score >= 70 ? '⚠️' : '❌';

    report += `${i + 1}. ${post.filename}\n`;
    report += `   ${scoreEmoji} SEO Score: ${post.score}/100\n`;
    report += `   Title: "${post.metadata.title}" (${post.metadata.titleLength} chars)\n`;
    report += `   Description: ${post.metadata.descriptionLength} chars\n`;
    report += `   Word Count: ${post.content.wordCount}\n`;
    report += `   Images: ${post.content.imageCount} (${post.content.imagesWithAlt} with proper alt text)\n`;
    report += `   Links: ${post.content.internalLinkCount} internal, ${post.content.externalLinkCount} external\n`;

    if (post.issues.length > 0) {
      report += `\n   🔴 ISSUES (${post.issues.length}):\n`;
      post.issues.forEach((issue) => {
        report += `      - ${issue}\n`;
      });
    }

    if (post.warnings.length > 0) {
      report += `\n   🟡 WARNINGS (${post.warnings.length}):\n`;
      post.warnings.forEach((warning) => {
        report += `      - ${warning}\n`;
      });
    }

    if (post.recommendations.length > 0) {
      report += `\n   💡 RECOMMENDATIONS (${post.recommendations.length}):\n`;
      post.recommendations.forEach((rec) => {
        report += `      - ${rec}\n`;
      });
    }

    report += '\n' + '─'.repeat(64) + '\n\n';
  });

  // Common issues
  report += '🔍 COMMON ISSUES ACROSS ALL POSTS\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

  const allIssues = {};
  posts.forEach((post) => {
    post.issues.forEach((issue) => {
      allIssues[issue] = (allIssues[issue] || 0) + 1;
    });
    post.warnings.forEach((warning) => {
      allIssues[warning] = (allIssues[warning] || 0) + 1;
    });
  });

  const sortedIssues = Object.entries(allIssues).sort((a, b) => b[1] - a[1]);

  if (sortedIssues.length === 0) {
    report += 'No common issues found. Great job!\n\n';
  } else {
    sortedIssues.forEach(([issue, count]) => {
      report += `  ${count} posts: ${issue}\n`;
    });
    report += '\n';
  }

  // Recommendations
  report += '💡 OVERALL RECOMMENDATIONS\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

  if (summary.averageScore >= 90) {
    report += '✅ Excellent SEO health! Keep maintaining these standards.\n';
  } else if (summary.averageScore >= 70) {
    report += '⚠️  Good SEO foundation, but room for improvement:\n';
  } else {
    report += '❌ Significant SEO issues detected. Priority fixes:\n';
  }

  if (summary.totalIssues > 0) {
    report += `  1. Address ${summary.totalIssues} critical issues first\n`;
  }

  if (summary.totalWarnings > 0) {
    report += `  2. Review ${summary.totalWarnings} warnings\n`;
  }

  const postsNeedingAltText = posts.filter((p) => p.content.imagesMissingAlt > 0 || p.content.imagesPlaceholderAlt > 0).length;
  if (postsNeedingAltText > 0) {
    report += `  3. Add proper alt text to images in ${postsNeedingAltText} posts\n`;
  }

  const postsNeedingLinks = posts.filter((p) => p.content.internalLinkCount < 3).length;
  if (postsNeedingLinks > 0) {
    report += `  4. Add more internal links to ${postsNeedingLinks} posts\n`;
  }

  const lowWordCountPosts = posts.filter((p) => p.content.wordCount < 1000).length;
  if (lowWordCountPosts > 0) {
    report += `  5. Expand content in ${lowWordCountPosts} posts (< 1000 words)\n`;
  }

  report += '\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  report += 'Report generated on: ' + new Date().toISOString() + '\n';
  report += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';

  return report;
}

/**
 * Generate audit report as JSON
 */
function generateAuditReportJSON(auditResults) {
  return JSON.stringify(auditResults, null, 2);
}

module.exports = {
  auditPost,
  auditAllPosts,
  generateAuditReport,
  generateAuditReportJSON,
};
