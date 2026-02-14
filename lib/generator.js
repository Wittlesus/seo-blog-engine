'use strict';

const fs = require('fs');
const path = require('path');
const { TEMPLATES, detectTemplate, slugify } = require('./templates');

/**
 * Core blog post generator.
 * Takes a topic, keywords, and optional template type, then produces
 * a structured SEO-optimized markdown blog post.
 */

/**
 * Parse keywords from a comma-separated string or array.
 */
function parseKeywords(keywords) {
  if (Array.isArray(keywords)) return keywords.map((k) => k.trim()).filter(Boolean);
  if (typeof keywords === 'string') return keywords.split(',').map((k) => k.trim()).filter(Boolean);
  return [];
}

/**
 * Generate a single blog post.
 *
 * @param {Object} options
 * @param {string} options.topic - The blog post topic
 * @param {string|string[]} options.keywords - Target keywords (comma-separated string or array)
 * @param {string} [options.template] - Template type: 'how-to', 'listicle', 'comparison', 'ultimate-guide'
 * @returns {Object} { filename, content, metadata }
 */
function generatePost({ topic, keywords, template }) {
  const kw = parseKeywords(keywords);

  // Detect or use explicit template
  const templateKey = template && TEMPLATES[template] ? template : detectTemplate(topic);
  const tmpl = TEMPLATES[templateKey];

  if (!tmpl) {
    throw new Error(`Unknown template type: "${templateKey}". Available: ${Object.keys(TEMPLATES).join(', ')}`);
  }

  const content = tmpl.generate(topic, kw);
  const slug = slugify(topic);
  const filename = `${slug}.md`;

  return {
    filename,
    content,
    metadata: {
      topic,
      keywords: kw,
      template: templateKey,
      templateName: tmpl.name,
      slug,
      generatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Generate an outline only (no full section content).
 *
 * @param {Object} options
 * @param {string} options.topic - The blog post topic
 * @param {string|string[]} [options.keywords] - Target keywords
 * @param {string} [options.template] - Template type
 * @returns {Object} { outline, metadata }
 */
function generateOutline({ topic, keywords, template }) {
  const kw = parseKeywords(keywords || '');
  const templateKey = template && TEMPLATES[template] ? template : detectTemplate(topic);
  const tmpl = TEMPLATES[templateKey];

  const outlineData = {
    topic,
    template: tmpl.name,
    targetKeywords: kw,
    suggestedSlug: slugify(topic),
    suggestedTitle: '',
    metaDescription: '',
    sections: [],
  };

  // Build outline based on template type
  switch (templateKey) {
    case 'how-to': {
      const cleanTopic = topic.replace(/^how\s+to\s+/i, '');
      outlineData.suggestedSlug = slugify(`how-to-${cleanTopic}`);
      outlineData.suggestedTitle = `How to ${cleanTopic}: A Step-by-Step Guide (${new Date().getFullYear()})`;
      outlineData.metaDescription = `Learn how to ${cleanTopic.toLowerCase()} with this comprehensive step-by-step guide. Covers ${kw.slice(0, 3).join(', ') || cleanTopic} and more.`;
      outlineData.sections = [
        { h2: 'Introduction', notes: 'Hook + what reader will learn' },
        { h2: `What is ${cleanTopic}?`, h3: [`Why ${cleanTopic} Matters`, `Who Should Learn ${cleanTopic}`] },
        { h2: 'Prerequisites Before You Start', h3: ['Tools You Need', 'Skills Required'] },
        { h2: 'Step 1: Getting Set Up', h3: ['Initial Configuration', 'Verifying Your Setup'] },
        { h2: 'Step 2: Core Implementation', h3: ['The Basic Approach', 'Best Practices'] },
        { h2: 'Step 3: Advanced Techniques', h3: ['Optimization Tips', 'Scaling Your Approach'] },
        { h2: 'Common Pitfalls and How to Avoid Them', h3: ['Mistake #1', 'Mistake #2', 'Mistake #3'] },
        { h2: 'Results and Next Steps', h3: ['Measuring Success', 'Where to Go From Here'] },
        { h2: 'FAQ', notes: '5 questions with schema markup' },
        { h2: 'Call to Action', notes: 'CTA + newsletter signup' },
      ];
      break;
    }
    case 'listicle': {
      outlineData.suggestedTitle = `10 Best ${topic} for ${new Date().getFullYear()} (Expert Picks)`;
      outlineData.metaDescription = `Discover the 10 best ${topic.toLowerCase()} hand-picked by experts. Compare features, pricing, and pros/cons.`;
      outlineData.sections = [
        { h2: 'Introduction', notes: 'Pain point + top 3 quick picks' },
        { h2: `How We Evaluated These ${topic} Options`, h3: ['Our Criteria', 'Testing Methodology'] },
        { h2: 'Quick Comparison Table', notes: 'Markdown table with all options' },
      ];
      for (let i = 1; i <= 10; i++) {
        outlineData.sections.push({
          h2: `#${i}. [Option Name]`,
          h3: ['Key Features', 'Pricing', 'Pros and Cons'],
        });
      }
      outlineData.sections.push(
        { h2: `How to Choose the Right ${topic}`, h3: ['For Beginners', 'For Professionals', 'For Enterprise'] },
        { h2: 'FAQ', notes: '5 questions with schema markup' },
        { h2: 'Call to Action', notes: 'CTA + affiliate links' }
      );
      break;
    }
    case 'comparison': {
      let itemA = topic, itemB = '[Alternative]';
      if (topic.toLowerCase().includes(' vs ')) {
        const parts = topic.split(/\s+vs\.?\s+/i);
        itemA = parts[0].trim();
        itemB = parts[1] ? parts[1].trim() : '[Alternative]';
      }
      outlineData.suggestedTitle = `${itemA} vs ${itemB}: Complete Comparison (${new Date().getFullYear()})`;
      outlineData.metaDescription = `${itemA} vs ${itemB} -- which is better? In-depth comparison of features, pricing, performance.`;
      outlineData.sections = [
        { h2: 'Introduction', notes: 'Frame the decision + quick verdict' },
        { h2: 'At a Glance', notes: 'Comparison snapshot table' },
        { h2: `${itemA} vs ${itemB}: Overview`, h3: [`What is ${itemA}?`, `What is ${itemB}?`] },
        { h2: 'Feature Comparison', h3: ['Core Features', 'Advanced Features', 'Integrations'] },
        { h2: 'Pricing Comparison', h3: ['Free Plans', 'Paid Plans', 'Value for Money'] },
        { h2: 'Performance and Reliability', h3: ['Speed', 'Uptime', 'Scalability'] },
        { h2: 'User Experience', h3: ['Ease of Setup', 'Learning Curve', 'Documentation'] },
        { h2: 'Customer Support', h3: ['Support Channels', 'Response Time', 'Community'] },
        { h2: `When to Choose ${itemA}`, notes: 'Ideal user profile' },
        { h2: `When to Choose ${itemB}`, notes: 'Ideal user profile' },
        { h2: 'Final Verdict', notes: 'Definitive recommendation with winner table' },
        { h2: 'FAQ', notes: '5 questions with schema markup' },
        { h2: 'Call to Action' },
      ];
      break;
    }
    case 'ultimate-guide':
    default: {
      outlineData.suggestedTitle = `The Ultimate Guide to ${topic} (${new Date().getFullYear()})`;
      outlineData.metaDescription = `Everything you need to know about ${topic.toLowerCase()}. Comprehensive guide covering ${kw.slice(0, 3).join(', ') || topic} and expert strategies.`;
      outlineData.sections = [
        { h2: 'Introduction', notes: 'Hook + scope + what reader will learn' },
        { h2: `What is ${topic}?`, h3: ['Definition and Key Concepts', 'Brief History', 'Why It Matters Today'] },
        { h2: `The Benefits of ${topic}`, h3: ['For Individuals', 'For Businesses', 'Industry Impact'] },
        { h2: `How ${topic} Works`, h3: ['Core Principles', 'Key Components', 'The Process Explained'] },
        { h2: `Getting Started with ${topic}`, h3: ['Prerequisites', 'Step-by-Step Setup', 'Your First Project'] },
        { h2: `${topic} Best Practices`, h3: ['Strategy Development', 'Implementation Tips', 'Common Mistakes to Avoid'] },
        { h2: `Advanced ${topic} Strategies`, h3: ['Scaling Up', 'Automation and Tools', 'Measuring ROI'] },
        { h2: `${topic} Tools and Resources`, h3: ['Essential Tools', 'Learning Resources', 'Communities to Join'] },
        { h2: `The Future of ${topic}`, h3: ['Emerging Trends', 'Predictions for Next Year', 'How to Stay Ahead'] },
        { h2: 'Key Takeaways', notes: '5 bullet summary' },
        { h2: 'FAQ', notes: '5 questions with schema markup' },
        { h2: 'Call to Action', notes: 'CTA + related articles cluster links' },
      ];
      break;
    }
  }

  // Format as readable text
  let outlineText = `# Blog Post Outline\n\n`;
  outlineText += `**Topic:** ${topic}\n`;
  outlineText += `**Template:** ${tmpl.name} (${tmpl.description})\n`;
  outlineText += `**Suggested Title:** ${outlineData.suggestedTitle}\n`;
  outlineText += `**Meta Description:** ${outlineData.metaDescription}\n`;
  outlineText += `**Target Keywords:** ${kw.length > 0 ? kw.join(', ') : '[none specified]'}\n`;
  outlineText += `**Suggested Slug:** /${outlineData.suggestedSlug}\n`;
  outlineText += `**Estimated Word Count:** ${templateKey === 'ultimate-guide' ? '4,000-6,000' : templateKey === 'listicle' ? '3,000-4,000' : '2,000-3,000'}\n\n`;
  outlineText += `---\n\n`;
  outlineText += `## Structure\n\n`;

  outlineData.sections.forEach((section, i) => {
    outlineText += `${i + 1}. **${section.h2}**`;
    if (section.notes) outlineText += ` -- _${section.notes}_`;
    outlineText += `\n`;
    if (section.h3) {
      section.h3.forEach((sub) => {
        outlineText += `   - ${sub}\n`;
      });
    }
  });

  outlineText += `\n---\n\n`;
  outlineText += `## SEO Recommendations\n\n`;
  outlineText += `- Place primary keyword "${kw[0] || topic}" in: title, H1, first paragraph, meta description, URL slug\n`;
  outlineText += `- Use secondary keywords in H2 and H3 headings\n`;
  outlineText += `- Include 3+ internal links and 2+ external authoritative links\n`;
  outlineText += `- Add descriptive alt text to all images\n`;
  outlineText += `- Include a FAQ section for featured snippet / People Also Ask targeting\n`;
  outlineText += `- Add a table of contents for jump links\n`;
  outlineText += `- Target keyword density of 1-2% for primary keyword\n`;

  return {
    outline: outlineText,
    metadata: outlineData,
  };
}

/**
 * Write a generated post to disk.
 *
 * @param {string} outputDir - Directory to write to
 * @param {string} filename - Filename for the post
 * @param {string} content - Markdown content
 * @returns {string} Full path of the written file
 */
function writePost(outputDir, filename, content) {
  const resolvedDir = path.resolve(outputDir);
  if (!fs.existsSync(resolvedDir)) {
    fs.mkdirSync(resolvedDir, { recursive: true });
  }
  const filepath = path.join(resolvedDir, filename);
  fs.writeFileSync(filepath, content, 'utf-8');
  return filepath;
}

/**
 * Batch generate posts from a JSON config.
 *
 * @param {string} jsonPath - Path to the topics JSON file
 * @param {string} outputDir - Output directory
 * @returns {Object[]} Array of results
 */
function batchGenerate(jsonPath, outputDir) {
  const resolvedPath = path.resolve(jsonPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Topics file not found: ${resolvedPath}`);
  }

  const raw = fs.readFileSync(resolvedPath, 'utf-8');
  let topics;
  try {
    topics = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in topics file: ${e.message}`);
  }

  if (!Array.isArray(topics)) {
    throw new Error('Topics file must contain a JSON array of topic objects.');
  }

  const results = [];

  topics.forEach((entry, i) => {
    if (!entry.topic) {
      console.warn(`  [SKIP] Entry ${i + 1} has no "topic" field.`);
      return;
    }

    try {
      const result = generatePost({
        topic: entry.topic,
        keywords: entry.keywords || '',
        template: entry.template || null,
      });

      const filepath = writePost(outputDir, result.filename, result.content);

      results.push({
        index: i + 1,
        topic: entry.topic,
        template: result.metadata.templateName,
        filename: result.filename,
        filepath,
        status: 'success',
      });
    } catch (err) {
      results.push({
        index: i + 1,
        topic: entry.topic,
        status: 'error',
        error: err.message,
      });
    }
  });

  return results;
}

/**
 * List all available templates.
 */
function listTemplates() {
  return Object.entries(TEMPLATES).map(([key, val]) => ({
    key,
    name: val.name,
    description: val.description,
  }));
}

module.exports = {
  generatePost,
  generateOutline,
  writePost,
  batchGenerate,
  listTemplates,
  parseKeywords,
};
