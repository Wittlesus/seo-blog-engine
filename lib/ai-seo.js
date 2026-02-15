'use strict';

/**
 * AI-Powered SEO Utilities
 *
 * These functions provide automated SEO optimization features that static
 * site generators cannot offer. No external API dependencies required.
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate an SEO-optimized meta description from blog post content.
 *
 * Algorithm:
 * 1. Extract first meaningful paragraph (skip frontmatter, headings)
 * 2. Identify key terms and action words
 * 3. Truncate to 150-160 characters with complete sentences
 * 4. Ensure primary keyword is included
 *
 * @param {string} content - Full markdown content
 * @param {string} primaryKeyword - Primary keyword to include
 * @returns {string} Optimized meta description
 */
function generateMetaDescription(content, primaryKeyword = '') {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '');

  // Remove markdown formatting, headings, code blocks, images
  let cleanText = withoutFrontmatter
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/^#+\s+.*/gm, '') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/\[.*?\]/g, ''); // Remove placeholders

  // Split into paragraphs
  const paragraphs = cleanText
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 50 && !p.startsWith('[') && !p.startsWith('##'));

  if (paragraphs.length === 0) {
    return `Learn about ${primaryKeyword}. Comprehensive guide covering key concepts, best practices, and expert tips.`;
  }

  // Get first substantial paragraph
  let description = paragraphs[0];

  // Ensure primary keyword is present (case-insensitive)
  if (primaryKeyword && !description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
    description = `Learn about ${primaryKeyword}. ${description}`;
  }

  // Truncate to 150-160 chars at sentence boundary
  if (description.length > 160) {
    // Try to break at sentence
    const sentences = description.match(/[^.!?]+[.!?]+/g) || [description];
    let result = '';

    for (const sentence of sentences) {
      if ((result + sentence).length <= 160) {
        result += sentence;
      } else {
        break;
      }
    }

    if (result.length < 120) {
      // If we got too short, just truncate at word boundary
      const words = description.split(' ');
      result = '';
      for (const word of words) {
        if ((result + ' ' + word).length <= 157) {
          result += (result ? ' ' : '') + word;
        } else {
          break;
        }
      }
      result += '...';
    }

    description = result;
  }

  return description.trim();
}

/**
 * Optimize title tag for SEO.
 *
 * Analyzes a title and provides:
 * - Character count (ideal: 50-60)
 * - Keyword placement score
 * - Power word usage
 * - Improved suggestions
 *
 * @param {string} title - Original title
 * @param {string[]} keywords - Target keywords
 * @returns {Object} Analysis and suggestions
 */
function optimizeTitleTag(title, keywords = []) {
  const charCount = title.length;
  const wordCount = title.split(/\s+/).length;

  // Power words that improve CTR
  const powerWords = [
    'ultimate', 'complete', 'essential', 'proven', 'amazing', 'incredible',
    'perfect', 'best', 'top', 'definitive', 'comprehensive', 'expert',
    'step-by-step', 'easy', 'simple', 'fast', 'quick', 'free', 'bonus'
  ];

  const titleLower = title.toLowerCase();
  const usedPowerWords = powerWords.filter(word => titleLower.includes(word));

  // Check keyword placement
  const keywordScores = keywords.map(kw => {
    const kwLower = kw.toLowerCase();
    const index = titleLower.indexOf(kwLower);

    return {
      keyword: kw,
      present: index !== -1,
      position: index,
      positionScore: index === -1 ? 0 : (index < 20 ? 10 : index < 40 ? 7 : 5)
    };
  });

  const primaryKeywordScore = keywordScores[0] || { positionScore: 0 };

  // Calculate overall score (0-100)
  let score = 0;

  // Length score (max 30 points)
  if (charCount >= 50 && charCount <= 60) {
    score += 30;
  } else if (charCount >= 40 && charCount <= 70) {
    score += 20;
  } else if (charCount >= 30 && charCount <= 80) {
    score += 10;
  }

  // Keyword placement (max 40 points)
  score += primaryKeywordScore.positionScore * 4;

  // Power words (max 20 points)
  score += Math.min(usedPowerWords.length * 10, 20);

  // Year inclusion (10 points)
  if (/202\d/.test(title)) {
    score += 10;
  }

  // Generate suggestions
  const suggestions = [];

  if (charCount > 60) {
    suggestions.push(`Title is too long (${charCount} chars). Aim for 50-60 characters.`);
  } else if (charCount < 40) {
    suggestions.push(`Title is too short (${charCount} chars). Aim for 50-60 characters.`);
  }

  if (keywords.length > 0 && !keywordScores[0].present) {
    suggestions.push(`Primary keyword "${keywords[0]}" is missing from title.`);
  }

  if (keywordScores[0] && keywordScores[0].position > 40) {
    suggestions.push(`Move primary keyword "${keywords[0]}" closer to the beginning.`);
  }

  if (usedPowerWords.length === 0) {
    suggestions.push(`Add a power word like "Complete", "Ultimate", or "Step-by-Step" to improve CTR.`);
  }

  if (!/202\d/.test(title)) {
    const year = new Date().getFullYear();
    suggestions.push(`Add current year (${year}) to show content is fresh.`);
  }

  // Generate improved version
  let improved = title;

  if (keywords.length > 0 && !keywordScores[0].present) {
    improved = `${keywords[0]}: ${improved}`;
  }

  if (!/202\d/.test(improved)) {
    const year = new Date().getFullYear();
    improved = improved.replace(/\s*\(?\d{4}\)?$/, ''); // Remove old year
    improved = `${improved} (${year})`;
  }

  if (improved.length > 60) {
    // Simplify to fit
    improved = improved.replace(/:\s*/, ' - ').replace(/\s*\|\s*/, ' ');
  }

  return {
    original: title,
    charCount,
    wordCount,
    score: Math.round(score),
    grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
    keywords: keywordScores,
    powerWords: usedPowerWords,
    suggestions,
    improved: improved !== title ? improved : null
  };
}

/**
 * Calculate readability score using Flesch Reading Ease formula.
 *
 * Formula: 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
 *
 * Score interpretation:
 * 90-100: Very Easy (5th grade)
 * 80-89: Easy (6th grade)
 * 70-79: Fairly Easy (7th grade)
 * 60-69: Standard (8th-9th grade)
 * 50-59: Fairly Difficult (10th-12th grade)
 * 30-49: Difficult (College)
 * 0-29: Very Difficult (College graduate)
 *
 * @param {string} content - Full markdown content
 * @returns {Object} Readability analysis
 */
function calculateReadability(content) {
  // Clean content
  const cleanText = content
    .replace(/^---[\s\S]*?---\n/, '') // Remove frontmatter
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links -> text only
    .replace(/^#+\s+/gm, '') // Remove heading markers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/\[.*?\]/g, '') // Remove placeholders
    .trim();

  if (!cleanText || cleanText.length < 100) {
    return {
      score: 0,
      grade: 'N/A',
      gradeLevel: 'Content too short to analyze',
      suggestions: ['Add more content for accurate readability analysis.']
    };
  }

  // Count sentences (approximate)
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;

  // Count words
  const words = cleanText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Count syllables (simplified algorithm)
  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;

    const vowels = 'aeiouy';
    let syllableCount = 0;
    let previousWasVowel = false;

    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        syllableCount++;
      }
      previousWasVowel = isVowel;
    }

    // Adjust for silent e
    if (word.endsWith('e')) {
      syllableCount--;
    }

    // Adjust for le ending
    if (word.endsWith('le') && word.length > 2 && !vowels.includes(word[word.length - 3])) {
      syllableCount++;
    }

    return Math.max(syllableCount, 1);
  }

  const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

  // Flesch Reading Ease formula
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = totalSyllables / wordCount;

  const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
  const clampedScore = Math.max(0, Math.min(100, Math.round(fleschScore)));

  // Grade interpretation
  let grade, gradeLevel;
  if (clampedScore >= 90) {
    grade = 'Very Easy';
    gradeLevel = '5th grade';
  } else if (clampedScore >= 80) {
    grade = 'Easy';
    gradeLevel = '6th grade';
  } else if (clampedScore >= 70) {
    grade = 'Fairly Easy';
    gradeLevel = '7th grade';
  } else if (clampedScore >= 60) {
    grade = 'Standard';
    gradeLevel = '8th-9th grade';
  } else if (clampedScore >= 50) {
    grade = 'Fairly Difficult';
    gradeLevel = '10th-12th grade';
  } else if (clampedScore >= 30) {
    grade = 'Difficult';
    gradeLevel = 'College';
  } else {
    grade = 'Very Difficult';
    gradeLevel = 'College graduate';
  }

  // Generate suggestions
  const suggestions = [];

  if (avgWordsPerSentence > 25) {
    suggestions.push(`Average sentence length is ${avgWordsPerSentence.toFixed(1)} words. Break long sentences into shorter ones (aim for 15-20 words per sentence).`);
  }

  if (avgSyllablesPerWord > 1.8) {
    suggestions.push(`Average word complexity is high (${avgSyllablesPerWord.toFixed(2)} syllables per word). Use simpler alternatives where possible.`);
  }

  if (clampedScore < 60) {
    suggestions.push(`Readability score is ${clampedScore}. For better engagement, aim for 60-70 (8th-9th grade level).`);
  }

  if (clampedScore >= 60 && clampedScore <= 70) {
    suggestions.push(`Great! Readability is in the optimal range (60-70) for web content.`);
  }

  return {
    score: clampedScore,
    grade,
    gradeLevel,
    wordCount,
    sentenceCount,
    avgWordsPerSentence: parseFloat(avgWordsPerSentence.toFixed(1)),
    avgSyllablesPerWord: parseFloat(avgSyllablesPerWord.toFixed(2)),
    suggestions
  };
}

/**
 * Suggest internal links between blog posts based on content similarity.
 *
 * Algorithm:
 * 1. Extract keywords and topics from each post
 * 2. Calculate TF-IDF-like similarity scores
 * 3. Suggest top 3-5 related posts for each post
 *
 * @param {string} targetFile - Path to the post to analyze
 * @param {string} postsDirectory - Directory containing all posts
 * @returns {Object[]} Array of suggested internal links with relevance scores
 */
function suggestInternalLinks(targetFile, postsDirectory) {
  const targetContent = fs.readFileSync(targetFile, 'utf-8');
  const targetFilename = path.basename(targetFile);

  // Extract keywords from target post
  function extractKeywords(content) {
    const cleanText = content
      .replace(/^---[\s\S]*?---\n/, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .toLowerCase();

    // Common stop words to ignore
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      'it', 'its', 'you', 'your', 'we', 'our', 'they', 'their', 'write',
      'section', 'include', 'use', 'example', 'placeholder', 'replace'
    ]);

    const words = cleanText.match(/\b[a-z]{3,}\b/g) || [];
    const wordFreq = {};

    for (const word of words) {
      if (!stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    }

    return wordFreq;
  }

  const targetKeywords = extractKeywords(targetContent);

  // Get all markdown files in directory
  const allFiles = fs.readdirSync(postsDirectory)
    .filter(f => f.endsWith('.md') && f !== targetFilename)
    .map(f => path.join(postsDirectory, f));

  // Calculate similarity scores
  const similarities = [];

  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const keywords = extractKeywords(content);

      // Calculate overlap score (simplified TF-IDF)
      let score = 0;
      const commonKeywords = [];

      for (const [word, freq] of Object.entries(targetKeywords)) {
        if (keywords[word]) {
          const similarity = Math.min(freq, keywords[word]);
          score += similarity;
          commonKeywords.push(word);
        }
      }

      // Extract title from frontmatter or first heading
      let title = path.basename(file, '.md').replace(/-/g, ' ');
      const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
      if (titleMatch) {
        title = titleMatch[1].replace(/^["']|["']$/g, '');
      } else {
        const headingMatch = content.match(/^#\s+(.+)$/m);
        if (headingMatch) {
          title = headingMatch[1];
        }
      }

      // Extract slug from frontmatter or filename
      let slug = path.basename(file, '.md');
      const slugMatch = content.match(/^slug:\s*["']?(.+?)["']?\s*$/m);
      if (slugMatch) {
        slug = slugMatch[1].replace(/^["']|["']$/g, '');
      }

      if (score > 0) {
        similarities.push({
          file: path.basename(file),
          title,
          slug,
          score,
          commonKeywords: commonKeywords.slice(0, 5),
          relevance: score > 50 ? 'High' : score > 20 ? 'Medium' : 'Low'
        });
      }
    } catch (err) {
      // Skip files that can't be read
      continue;
    }
  }

  // Sort by score and return top 5
  similarities.sort((a, b) => b.score - a.score);

  return similarities.slice(0, 5);
}

/**
 * Generate schema markup for blog posts.
 *
 * Supports:
 * - Article schema
 * - FAQ schema (from FAQ sections)
 * - HowTo schema (from step-by-step guides)
 *
 * @param {string} content - Full markdown content
 * @param {Object} metadata - Post metadata (title, author, date, etc.)
 * @returns {Object} Schema markup objects
 */
function generateSchemaMarkup(content, metadata = {}) {
  const schemas = {};

  // Extract title
  let title = metadata.title || '';
  if (!title) {
    const titleMatch = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (titleMatch) {
      title = titleMatch[1].replace(/^["']|["']$/g, '');
    } else {
      const headingMatch = content.match(/^#\s+(.+)$/m);
      if (headingMatch) {
        title = headingMatch[1];
      }
    }
  }

  // Extract description
  let description = metadata.description || '';
  if (!description) {
    const descMatch = content.match(/^description:\s*["']?(.+?)["']?\s*$/m);
    if (descMatch) {
      description = descMatch[1].replace(/^["']|["']$/g, '');
    }
  }

  // Extract date
  let datePublished = metadata.date || new Date().toISOString().split('T')[0];
  const dateMatch = content.match(/^date:\s*["']?(.+?)["']?\s*$/m);
  if (dateMatch) {
    datePublished = dateMatch[1].replace(/^["']|["']$/g, '');
  }

  // Extract author
  let author = metadata.author || 'Your Name';
  const authorMatch = content.match(/^author:\s*["']?(.+?)["']?\s*$/m);
  if (authorMatch) {
    author = authorMatch[1].replace(/^["']|["']$/g, '').replace(/\[AUTHOR_NAME\]/, 'Your Name');
  }

  // Article Schema
  schemas.article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: datePublished,
    author: {
      '@type': 'Person',
      name: author
    }
  };

  if (metadata.image || metadata.featured_image) {
    schemas.article.image = metadata.image || metadata.featured_image;
  }

  // FAQ Schema - Extract from FAQ section
  const faqMatch = content.match(/##\s+Frequently Asked Questions[\s\S]*?(?=##\s+[^#]|$)/i);
  if (faqMatch) {
    const faqSection = faqMatch[0];
    const questions = faqSection.match(/###\s+(.+?)\n\n([\s\S]+?)(?=###|$)/g) || [];

    if (questions.length > 0) {
      schemas.faq = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map(q => {
          const qMatch = q.match(/###\s+(.+?)\n\n([\s\S]+)/);
          if (qMatch) {
            return {
              '@type': 'Question',
              name: qMatch[1].trim(),
              acceptedAnswer: {
                '@type': 'Answer',
                text: qMatch[2].trim().substring(0, 500) // Truncate long answers
              }
            };
          }
          return null;
        }).filter(Boolean)
      };
    }
  }

  // HowTo Schema - Extract from step-by-step content
  const howToMatch = content.match(/##\s+Step\s+\d+:/gi);
  if (howToMatch && howToMatch.length >= 3) {
    const steps = [];
    const stepMatches = content.match(/##\s+(Step\s+\d+:.+?)\n\n([\s\S]+?)(?=##\s+Step\s+\d+:|##\s+[^S]|$)/gi) || [];

    for (const stepContent of stepMatches) {
      const stepMatch = stepContent.match(/##\s+(Step\s+\d+:.+?)\n\n([\s\S]+)/i);
      if (stepMatch) {
        const stepText = stepMatch[2]
          .replace(/###.+/g, '')
          .replace(/!\[.*?\]\(.*?\)/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .trim()
          .substring(0, 300);

        steps.push({
          '@type': 'HowToStep',
          name: stepMatch[1].trim(),
          text: stepText
        });
      }
    }

    if (steps.length >= 3) {
      schemas.howTo = {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: title,
        description: description,
        step: steps
      };
    }
  }

  return schemas;
}

/**
 * Analyze keyword density in content.
 *
 * @param {string} content - Full markdown content
 * @param {string[]} keywords - Target keywords to analyze
 * @returns {Object} Keyword density analysis
 */
function analyzeKeywordDensity(content, keywords) {
  const cleanText = content
    .replace(/^---[\s\S]*?---\n/, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .toLowerCase();

  const totalWords = (cleanText.match(/\b[a-z]+\b/g) || []).length;

  const densityAnalysis = keywords.map(keyword => {
    const kwLower = keyword.toLowerCase();
    const regex = new RegExp('\\b' + kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
    const matches = cleanText.match(regex) || [];
    const count = matches.length;
    const density = totalWords > 0 ? ((count / totalWords) * 100).toFixed(2) : 0;

    let status = 'optimal';
    let suggestion = '';

    if (density < 0.5) {
      status = 'too low';
      suggestion = `Keyword "${keyword}" appears ${count} times (${density}%). Aim for 1-2% density. Add ${Math.ceil(totalWords * 0.01 - count)} more mentions.`;
    } else if (density > 3) {
      status = 'too high';
      suggestion = `Keyword "${keyword}" appears ${count} times (${density}%). Risk of keyword stuffing. Reduce to 1-2% density.`;
    } else {
      suggestion = `Keyword "${keyword}" density is optimal at ${density}%.`;
    }

    return {
      keyword,
      count,
      density: parseFloat(density),
      status,
      suggestion
    };
  });

  return {
    totalWords,
    keywords: densityAnalysis
  };
}

module.exports = {
  generateMetaDescription,
  optimizeTitleTag,
  calculateReadability,
  suggestInternalLinks,
  generateSchemaMarkup,
  analyzeKeywordDensity
};
