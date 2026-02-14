'use strict';

/**
 * Blog post templates for common SEO content formats.
 * Each template returns structured markdown with SEO best practices baked in.
 */

/**
 * Utility: slugify a string for URLs
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Utility: generate today's date in YYYY-MM-DD format
 */
function todayDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Utility: build a table of contents from section headings
 */
function buildTOC(sections) {
  let toc = '## Table of Contents\n\n';
  sections.forEach((section, i) => {
    toc += `${i + 1}. [${section.title}](#${slugify(section.title)})\n`;
    if (section.subsections) {
      section.subsections.forEach((sub) => {
        toc += `   - [${sub}](#${slugify(sub)})\n`;
      });
    }
  });
  return toc;
}

/**
 * Utility: build FAQ section with schema markup comments
 */
function buildFAQ(topic, keywords) {
  const faqs = [
    {
      q: `What is ${topic}?`,
      a: `[Write a concise 2-3 sentence definition of ${topic}. Include the primary keyword "${keywords[0] || topic}" naturally. This answer should directly address the search intent behind this question.]`,
    },
    {
      q: `Why is ${topic} important?`,
      a: `[Explain the key benefits and importance of ${topic} in 2-3 sentences. Reference how ${keywords.slice(0, 2).join(' and ') || topic} play a role. Use data or statistics if available.]`,
    },
    {
      q: `How do I get started with ${topic}?`,
      a: `[Provide a brief 3-step quickstart. Mention relevant tools or resources. Include keyword "${keywords[1] || topic}" naturally.]`,
    },
    {
      q: `What are common mistakes with ${topic}?`,
      a: `[List 2-3 common pitfalls. Explain how to avoid each one. Weave in keyword "${keywords[2] || topic}" where appropriate.]`,
    },
    {
      q: `How much does ${topic} cost?`,
      a: `[Provide pricing context or ranges if applicable. Mention free and paid options. Include keyword "${keywords[0] || topic}" naturally.]`,
    },
  ];

  let faqSection = '## Frequently Asked Questions\n\n';
  faqSection += '<!-- FAQ Schema Markup - Copy this to your page head for rich results:\n';
  faqSection += '<script type="application/ld+json">\n';
  faqSection += '{\n';
  faqSection += '  "@context": "https://schema.org",\n';
  faqSection += '  "@type": "FAQPage",\n';
  faqSection += '  "mainEntity": [\n';

  faqs.forEach((faq, i) => {
    faqSection += '    {\n';
    faqSection += '      "@type": "Question",\n';
    faqSection += `      "name": "${faq.q}",\n`;
    faqSection += '      "acceptedAnswer": {\n';
    faqSection += '        "@type": "Answer",\n';
    faqSection += `        "text": "YOUR_ANSWER_HERE"\n`;
    faqSection += '      }\n';
    faqSection += i < faqs.length - 1 ? '    },\n' : '    }\n';
  });

  faqSection += '  ]\n';
  faqSection += '}\n';
  faqSection += '</script>\n';
  faqSection += '-->\n\n';

  faqs.forEach((faq) => {
    faqSection += `### ${faq.q}\n\n${faq.a}\n\n`;
  });

  return faqSection;
}

/**
 * Utility: build call to action section
 */
function buildCTA(topic) {
  return `## Ready to Master ${topic}?\n\n` +
    `[Write a compelling call to action here. Tell readers what to do next -- sign up, download, subscribe, or try your product. Create urgency and highlight the key benefit.]\n\n` +
    `**[CTA_BUTTON_TEXT: e.g., "Get Started Free" | "Download the Guide" | "Start Your Trial"]**\n\n` +
    `[INTERNAL_LINK: Link to your product page, pricing page, or related resource]\n\n` +
    `[NEWSLETTER_SIGNUP: Optional email capture form placeholder]\n`;
}

/**
 * Utility: build frontmatter
 */
function buildFrontmatter({ title, description, tags, slug }) {
  return [
    '---',
    `title: "${title}"`,
    `description: "${description}"`,
    `date: "${todayDate()}"`,
    `tags: [${tags.map((t) => `"${t}"`).join(', ')}]`,
    `slug: "${slug}"`,
    `author: "[AUTHOR_NAME]"`,
    `featured_image: "[IMAGE_PATH -- use descriptive alt text for SEO]"`,
    `canonical_url: "[YOUR_DOMAIN]/${slug}"`,
    '---',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// TEMPLATE: How-To Tutorial
// ---------------------------------------------------------------------------
function howToTemplate(topic, keywords) {
  // Strip leading "How to" from topic to avoid duplication (e.g. "How to Build X" -> "Build X")
  const cleanTopic = topic.replace(/^how\s+to\s+/i, '');
  const title = `How to ${cleanTopic}: A Step-by-Step Guide (${new Date().getFullYear()})`;
  const slug = slugify(`how-to-${cleanTopic}`);
  const description = `Learn how to ${cleanTopic.toLowerCase()} with this comprehensive step-by-step guide. Covers ${keywords.slice(0, 3).join(', ')} and more.`;
  const tags = [...keywords.slice(0, 5), 'how-to', 'tutorial', 'guide'];

  // Use the original topic for display in section headings (reads more naturally)
  const displayTopic = cleanTopic;

  const sections = [
    {
      title: `What is ${displayTopic}?`,
      subsections: [`Why ${displayTopic} Matters`, `Who Should Learn ${displayTopic}`],
    },
    {
      title: `Prerequisites Before You Start`,
      subsections: ['Tools You Need', 'Skills Required'],
    },
    {
      title: `Step 1: Getting Set Up`,
      subsections: ['Initial Configuration', 'Verifying Your Setup'],
    },
    {
      title: `Step 2: Core Implementation`,
      subsections: ['The Basic Approach', 'Best Practices'],
    },
    {
      title: `Step 3: Advanced Techniques`,
      subsections: ['Optimization Tips', 'Scaling Your Approach'],
    },
    {
      title: `Common Pitfalls and How to Avoid Them`,
      subsections: ['Mistake #1', 'Mistake #2', 'Mistake #3'],
    },
    {
      title: `Results and Next Steps`,
      subsections: ['Measuring Success', 'Where to Go From Here'],
    },
  ];

  let post = buildFrontmatter({ title, description, tags, slug });

  post += `# ${title}\n\n`;
  post += `![${displayTopic} featured image -- REPLACE with descriptive alt text containing "${keywords[0] || displayTopic}"](./images/${slug}-hero.jpg)\n\n`;
  post += `**Meta Description:** ${description}\n\n`;
  post += `<!-- TARGET_KEYWORD: "${keywords[0] || displayTopic}" | SECONDARY: "${keywords.slice(1, 3).join('", "')}" -->\n`;
  post += `<!-- RECOMMENDED_WORD_COUNT: 2,000-2,500 words -->\n`;
  post += `<!-- KEYWORD_DENSITY: Aim for 1-2% for primary keyword -->\n\n`;

  // Introduction
  post += `## Introduction\n\n`;
  post += `[HOOK: Start with a surprising statistic, bold claim, or relatable problem about ${displayTopic}. This first sentence must grab attention.]\n\n`;
  post += `[CONTEXT: Explain why ${displayTopic} matters right now. Reference current trends, data, or industry changes. Naturally include "${keywords[0] || displayTopic}".]\n\n`;
  post += `[PROMISE: Tell the reader exactly what they will learn and achieve by the end of this guide. Be specific.]\n\n`;
  post += `**In this guide, you will learn:**\n`;
  sections.forEach((s) => {
    post += `- ${s.title}\n`;
  });
  post += `\n`;

  // TOC
  post += buildTOC(sections) + '\n';

  // Body sections
  sections.forEach((section, i) => {
    post += `## ${section.title}\n\n`;
    post += `![${section.title} illustration -- REPLACE alt text](./images/${slug}-section-${i + 1}.jpg)\n\n`;
    post += `[Write 150-300 words for this section. Include keyword "${keywords[i % keywords.length] || displayTopic}" naturally within the first two sentences.]\n\n`;

    if (section.subsections) {
      section.subsections.forEach((sub) => {
        post += `### ${sub}\n\n`;
        post += `[Write 100-200 words. Use bullet points or numbered lists where appropriate. Include relevant internal and external links.]\n\n`;
        post += `[INTERNAL_LINK: Link to related content on your site]\n\n`;
      });
    }

    if (i === 2 || i === 3) {
      post += `> **Pro Tip:** [Add an expert tip or insider insight related to ${section.title.toLowerCase()}. These callouts boost engagement and time-on-page.]\n\n`;
    }

    if (i === 1) {
      post += '```\n[CODE_BLOCK or COMMAND_EXAMPLE: If applicable, show a code snippet, terminal command, or configuration example here.]\n```\n\n';
    }
  });

  // FAQ
  post += buildFAQ(displayTopic, keywords) + '\n';

  // CTA
  post += buildCTA(displayTopic) + '\n\n';

  // SEO checklist comment
  post += `<!-- SEO CHECKLIST:\n`;
  post += `  [ ] Primary keyword "${keywords[0] || displayTopic}" appears in: title, H1, first paragraph, meta description, URL slug\n`;
  post += `  [ ] Secondary keywords appear in H2/H3 headings\n`;
  post += `  [ ] All images have descriptive alt text with keywords\n`;
  post += `  [ ] Internal links: minimum 3 links to related content\n`;
  post += `  [ ] External links: minimum 2 links to authoritative sources\n`;
  post += `  [ ] Meta description is 150-160 characters\n`;
  post += `  [ ] Content is 2,000+ words\n`;
  post += `  [ ] FAQ section includes 4-5 questions for featured snippet potential\n`;
  post += `  [ ] Table of contents for jump links\n`;
  post += `-->\n`;

  return post;
}

// ---------------------------------------------------------------------------
// TEMPLATE: Listicle ("[N] Best [X] for [Y]")
// ---------------------------------------------------------------------------
function listicleTemplate(topic, keywords) {
  const itemCount = 10;
  const title = `${itemCount} Best ${topic} for ${new Date().getFullYear()} (Expert Picks)`;
  const slug = slugify(`best-${topic}`);
  const description = `Discover the ${itemCount} best ${topic.toLowerCase()} hand-picked by experts. Compare features, pricing, and pros/cons for ${keywords.slice(0, 2).join(', ')}.`;
  const tags = [...keywords.slice(0, 5), 'best-of', 'listicle', 'reviews'];

  const items = [];
  for (let i = 1; i <= itemCount; i++) {
    items.push({
      title: `#${i}. [${topic} Option ${i} Name]`,
      subsections: ['Key Features', 'Pricing', 'Pros and Cons'],
    });
  }

  const allSections = [
    {
      title: `How We Evaluated These ${topic} Options`,
      subsections: ['Our Criteria', 'Testing Methodology'],
    },
    { title: 'Quick Comparison Table', subsections: [] },
    ...items,
    {
      title: `How to Choose the Right ${topic}`,
      subsections: ['For Beginners', 'For Professionals', 'For Enterprise'],
    },
  ];

  let post = buildFrontmatter({ title, description, tags, slug });

  post += `# ${title}\n\n`;
  post += `![Best ${topic} comparison -- REPLACE alt text](./images/${slug}-hero.jpg)\n\n`;
  post += `**Meta Description:** ${description}\n\n`;
  post += `<!-- TARGET_KEYWORD: "best ${keywords[0] || topic}" | SECONDARY: "${keywords.slice(1, 3).join('", "')}" -->\n`;
  post += `<!-- RECOMMENDED_WORD_COUNT: 3,000-4,000 words -->\n`;
  post += `<!-- KEYWORD_DENSITY: Aim for 1-2% for primary keyword -->\n\n`;

  // Introduction
  post += `## Introduction\n\n`;
  post += `[HOOK: Start with the pain point -- why choosing the right ${topic} is difficult and what is at stake.]\n\n`;
  post += `[CREDIBILITY: Briefly explain your expertise or testing process. How many hours of research? How many options tested?]\n\n`;
  post += `[PREVIEW: Give the reader a quick summary -- "Our top pick is [X] because..." This helps users who want a fast answer.]\n\n`;
  post += `**TL;DR -- Our Top 3 Picks:**\n`;
  post += `1. **[Best Overall]** -- [One-line reason]\n`;
  post += `2. **[Best Value]** -- [One-line reason]\n`;
  post += `3. **[Best for Beginners]** -- [One-line reason]\n\n`;

  // TOC
  post += buildTOC(allSections) + '\n';

  // How We Evaluated
  post += `## How We Evaluated These ${topic} Options\n\n`;
  post += `[Describe your evaluation criteria in 200-300 words. This builds trust and E-E-A-T signals.]\n\n`;
  post += `### Our Criteria\n\n`;
  post += `- **Feature Set:** [What features matter most]\n`;
  post += `- **Ease of Use:** [How we measured usability]\n`;
  post += `- **Pricing:** [Price-to-value ratio]\n`;
  post += `- **Support:** [Quality of documentation and customer support]\n`;
  post += `- **Scalability:** [How well it grows with your needs]\n\n`;
  post += `### Testing Methodology\n\n`;
  post += `[Explain your testing process. Include specific numbers: "We tested X options over Y weeks..."]\n\n`;

  // Comparison Table
  post += `## Quick Comparison Table\n\n`;
  post += `| ${topic} | Best For | Price | Rating | Link |\n`;
  post += `|---|---|---|---|---|\n`;
  for (let i = 1; i <= itemCount; i++) {
    post += `| [Option ${i}] | [Use case] | $[XX]/mo | [X.X]/5 | [AFFILIATE_LINK] |\n`;
  }
  post += `\n`;

  // Individual items
  for (let i = 1; i <= itemCount; i++) {
    post += `## #${i}. [${topic} Option ${i} Name]\n\n`;
    post += `![${topic} option ${i} screenshot -- REPLACE alt text](./images/${slug}-option-${i}.jpg)\n\n`;
    post += `[Write 200-300 words reviewing this option. Include keyword "${keywords[i % keywords.length] || topic}" naturally.]\n\n`;
    post += `### Key Features\n\n`;
    post += `- [Feature 1 with brief description]\n`;
    post += `- [Feature 2 with brief description]\n`;
    post += `- [Feature 3 with brief description]\n`;
    post += `- [Feature 4 with brief description]\n\n`;
    post += `### Pricing\n\n`;
    post += `- **Free Tier:** [Details or "N/A"]\n`;
    post += `- **Starter:** $[XX]/month\n`;
    post += `- **Pro:** $[XX]/month\n`;
    post += `- **Enterprise:** [Contact for pricing]\n\n`;
    post += `### Pros and Cons\n\n`;
    post += `| Pros | Cons |\n`;
    post += `|---|---|\n`;
    post += `| [Pro 1] | [Con 1] |\n`;
    post += `| [Pro 2] | [Con 2] |\n`;
    post += `| [Pro 3] | [Con 3] |\n\n`;
    post += `[AFFILIATE_LINK: "Try [Option ${i}] Free" -- link to product]\n\n`;
    post += `---\n\n`;
  }

  // How to Choose
  post += `## How to Choose the Right ${topic}\n\n`;
  post += `[Write 200-300 words. Help readers narrow down their choice based on their specific situation.]\n\n`;
  post += `### For Beginners\n\n[Recommend the easiest option with reasoning.]\n\n`;
  post += `### For Professionals\n\n[Recommend the most powerful option with reasoning.]\n\n`;
  post += `### For Enterprise\n\n[Recommend the most scalable option with reasoning.]\n\n`;

  // FAQ
  post += buildFAQ(topic, keywords) + '\n';

  // CTA
  post += buildCTA(topic) + '\n\n';

  post += `<!-- SEO CHECKLIST:\n`;
  post += `  [ ] Primary keyword "best ${keywords[0] || topic}" in: title, H1, first paragraph, meta description, URL\n`;
  post += `  [ ] Each list item has a unique H2 heading\n`;
  post += `  [ ] Comparison table for featured snippet potential\n`;
  post += `  [ ] All images have descriptive alt text\n`;
  post += `  [ ] Affiliate links use nofollow/sponsored attributes\n`;
  post += `  [ ] Content is 3,000+ words\n`;
  post += `  [ ] FAQ section for People Also Ask targeting\n`;
  post += `-->\n`;

  return post;
}

// ---------------------------------------------------------------------------
// TEMPLATE: Comparison ("[X] vs [Y]")
// ---------------------------------------------------------------------------
function comparisonTemplate(topic, keywords) {
  // Try to split topic into two items by "vs" or just use as-is
  let itemA, itemB;
  if (topic.toLowerCase().includes(' vs ')) {
    const parts = topic.split(/\s+vs\.?\s+/i);
    itemA = parts[0].trim();
    itemB = parts[1] ? parts[1].trim() : '[Alternative]';
  } else {
    itemA = topic;
    itemB = '[Alternative]';
  }

  const title = `${itemA} vs ${itemB}: Complete Comparison (${new Date().getFullYear()})`;
  const slug = slugify(`${itemA}-vs-${itemB}`);
  const description = `${itemA} vs ${itemB} -- which is better? This in-depth comparison covers features, pricing, performance, and more to help you decide.`;
  const tags = [...keywords.slice(0, 5), 'comparison', 'vs', 'review'];

  const sections = [
    {
      title: `${itemA} vs ${itemB}: Overview`,
      subsections: [`What is ${itemA}?`, `What is ${itemB}?`],
    },
    {
      title: 'Feature Comparison',
      subsections: ['Core Features', 'Advanced Features', 'Integrations'],
    },
    {
      title: 'Pricing Comparison',
      subsections: ['Free Plans', 'Paid Plans', 'Value for Money'],
    },
    {
      title: 'Performance and Reliability',
      subsections: ['Speed', 'Uptime', 'Scalability'],
    },
    {
      title: 'User Experience',
      subsections: ['Ease of Setup', 'Learning Curve', 'Documentation'],
    },
    {
      title: 'Customer Support',
      subsections: ['Support Channels', 'Response Time', 'Community'],
    },
    {
      title: `When to Choose ${itemA}`,
      subsections: [],
    },
    {
      title: `When to Choose ${itemB}`,
      subsections: [],
    },
  ];

  let post = buildFrontmatter({ title, description, tags, slug });

  post += `# ${title}\n\n`;
  post += `![${itemA} vs ${itemB} comparison -- REPLACE alt text](./images/${slug}-hero.jpg)\n\n`;
  post += `**Meta Description:** ${description}\n\n`;
  post += `<!-- TARGET_KEYWORD: "${itemA} vs ${itemB}" | SECONDARY: "${keywords.slice(0, 3).join('", "')}" -->\n`;
  post += `<!-- RECOMMENDED_WORD_COUNT: 2,500-3,500 words -->\n`;
  post += `<!-- KEYWORD_DENSITY: Aim for 1-2% for primary keyword -->\n\n`;

  // Introduction
  post += `## Introduction\n\n`;
  post += `[HOOK: Frame the decision. "Choosing between ${itemA} and ${itemB}? You are not alone -- this is one of the most common questions in [industry]."]\n\n`;
  post += `[CONTEXT: Briefly explain why this comparison matters. What problem do both tools/approaches solve?]\n\n`;
  post += `[SUMMARY: Give the bottom line upfront. "If you need X, go with ${itemA}. If you need Y, go with ${itemB}."]\n\n`;

  // Quick verdict box
  post += `> **Quick Verdict:** [One sentence summary of who should choose which option. Example: "Choose ${itemA} for [use case] and ${itemB} for [use case]."]\n\n`;

  // Comparison snapshot table
  post += `## At a Glance\n\n`;
  post += `| Feature | ${itemA} | ${itemB} |\n`;
  post += `|---|---|---|\n`;
  post += `| **Price** | [Price] | [Price] |\n`;
  post += `| **Best For** | [Use case] | [Use case] |\n`;
  post += `| **Ease of Use** | [X/5] | [X/5] |\n`;
  post += `| **Features** | [X/5] | [X/5] |\n`;
  post += `| **Support** | [X/5] | [X/5] |\n`;
  post += `| **Overall** | [X/5] | [X/5] |\n\n`;

  // TOC
  post += buildTOC(sections) + '\n';

  // Body sections
  sections.forEach((section, i) => {
    post += `## ${section.title}\n\n`;

    if (i === 0) {
      post += `### What is ${itemA}?\n\n`;
      post += `[Write 100-150 words introducing ${itemA}. When was it founded? What problem does it solve? Who is it for?]\n\n`;
      post += `### What is ${itemB}?\n\n`;
      post += `[Write 100-150 words introducing ${itemB}. Same structure as above for fair comparison.]\n\n`;
    } else if (section.subsections.length > 0) {
      post += `[Write 100-150 word overview of this comparison area.]\n\n`;
      section.subsections.forEach((sub) => {
        post += `### ${sub}\n\n`;
        post += `| | ${itemA} | ${itemB} |\n`;
        post += `|---|---|---|\n`;
        post += `| ${sub} | [Details] | [Details] |\n\n`;
        post += `[Write 100-200 words comparing both options on ${sub.toLowerCase()}.]\n\n`;
      });
    } else {
      post += `[Write 200-300 words explaining the ideal user profile for this option. Be specific about use cases, team sizes, and budgets.]\n\n`;
      post += `**Choose ${section.title.replace('When to Choose ', '')} if:**\n`;
      post += `- [Reason 1]\n`;
      post += `- [Reason 2]\n`;
      post += `- [Reason 3]\n`;
      post += `- [Reason 4]\n\n`;
    }
  });

  // Final verdict
  post += `## Final Verdict\n\n`;
  post += `[Write 200-300 words summarizing your recommendation. Be definitive but fair. Acknowledge that the "best" choice depends on the reader's needs.]\n\n`;
  post += `| Winner By Category | ${itemA} | ${itemB} |\n`;
  post += `|---|---|---|\n`;
  post += `| Features | [ ] | [ ] |\n`;
  post += `| Pricing | [ ] | [ ] |\n`;
  post += `| Ease of Use | [ ] | [ ] |\n`;
  post += `| Support | [ ] | [ ] |\n`;
  post += `| **Overall Winner** | [ ] | [ ] |\n\n`;

  // FAQ
  post += buildFAQ(topic, keywords) + '\n';

  // CTA
  post += buildCTA(topic) + '\n\n';

  post += `<!-- SEO CHECKLIST:\n`;
  post += `  [ ] Primary keyword "${itemA} vs ${itemB}" in: title, H1, first paragraph, meta description, URL\n`;
  post += `  [ ] Both options get equal treatment (balanced comparison)\n`;
  post += `  [ ] Comparison tables for featured snippet potential\n`;
  post += `  [ ] "Quick verdict" box for position zero targeting\n`;
  post += `  [ ] Content is 2,500+ words\n`;
  post += `  [ ] FAQ section for People Also Ask targeting\n`;
  post += `-->\n`;

  return post;
}

// ---------------------------------------------------------------------------
// TEMPLATE: Ultimate Guide (Pillar Content)
// ---------------------------------------------------------------------------
function ultimateGuideTemplate(topic, keywords) {
  const title = `The Ultimate Guide to ${topic} (${new Date().getFullYear()})`;
  const slug = slugify(`ultimate-guide-${topic}`);
  const description = `Everything you need to know about ${topic.toLowerCase()}. This comprehensive guide covers ${keywords.slice(0, 3).join(', ')} and expert strategies for success.`;
  const tags = [...keywords.slice(0, 5), 'ultimate-guide', 'pillar-content', 'comprehensive'];

  const sections = [
    {
      title: `What is ${topic}?`,
      subsections: ['Definition and Key Concepts', 'Brief History', 'Why It Matters Today'],
    },
    {
      title: `The Benefits of ${topic}`,
      subsections: ['For Individuals', 'For Businesses', 'Industry Impact'],
    },
    {
      title: `How ${topic} Works`,
      subsections: ['Core Principles', 'Key Components', 'The Process Explained'],
    },
    {
      title: `Getting Started with ${topic}`,
      subsections: ['Prerequisites', 'Step-by-Step Setup', 'Your First Project'],
    },
    {
      title: `${topic} Best Practices`,
      subsections: ['Strategy Development', 'Implementation Tips', 'Common Mistakes to Avoid'],
    },
    {
      title: `Advanced ${topic} Strategies`,
      subsections: ['Scaling Up', 'Automation and Tools', 'Measuring ROI'],
    },
    {
      title: `${topic} Tools and Resources`,
      subsections: ['Essential Tools', 'Learning Resources', 'Communities to Join'],
    },
    {
      title: `The Future of ${topic}`,
      subsections: ['Emerging Trends', 'Predictions for Next Year', 'How to Stay Ahead'],
    },
  ];

  let post = buildFrontmatter({ title, description, tags, slug });

  post += `# ${title}\n\n`;
  post += `![Ultimate guide to ${topic} -- REPLACE alt text containing "${keywords[0] || topic}"](./images/${slug}-hero.jpg)\n\n`;
  post += `**Meta Description:** ${description}\n\n`;
  post += `<!-- TARGET_KEYWORD: "${keywords[0] || topic}" | SECONDARY: "${keywords.slice(1, 4).join('", "')}" -->\n`;
  post += `<!-- RECOMMENDED_WORD_COUNT: 4,000-6,000 words -->\n`;
  post += `<!-- CONTENT_TYPE: Pillar Content -- link all related cluster articles to this page -->\n`;
  post += `<!-- KEYWORD_DENSITY: Aim for 1-1.5% for primary keyword -->\n\n`;

  // Introduction
  post += `## Introduction\n\n`;
  post += `[HOOK: Open with a bold statement, surprising statistic, or thought-provoking question about ${topic}. Aim for immediate engagement.]\n\n`;
  post += `[SCOPE: Explain the comprehensiveness of this guide. "Whether you are a complete beginner or an experienced practitioner, this guide covers everything you need to know about ${topic}."]\n\n`;
  post += `[CREDIBILITY: Establish why this guide is authoritative. Mention experience, research, or expert contributions.]\n\n`;
  post += `**What You Will Learn:**\n`;
  sections.forEach((s) => {
    post += `- ${s.title}\n`;
  });
  post += `\n`;
  post += `**Estimated Reading Time:** [X] minutes\n\n`;

  // TOC
  post += buildTOC(sections) + '\n';

  // Body sections
  sections.forEach((section, i) => {
    post += `## ${section.title}\n\n`;
    post += `![${section.title} -- REPLACE alt text](./images/${slug}-section-${i + 1}.jpg)\n\n`;
    post += `[Write 300-500 words for this section. This is pillar content so be thorough and authoritative. Include keyword "${keywords[i % keywords.length] || topic}" naturally.]\n\n`;

    section.subsections.forEach((sub) => {
      post += `### ${sub}\n\n`;
      post += `[Write 200-300 words. Use a mix of paragraphs, bullet points, numbered lists, and examples. Every subsection should provide standalone value.]\n\n`;
      post += `[INTERNAL_LINK: Link to a dedicated cluster article about "${sub}" if available]\n\n`;
    });

    if (i === 3) {
      post += '```\n[CODE_BLOCK or EXAMPLE: Provide a practical, copy-paste-ready example here]\n```\n\n';
    }

    if (i % 2 === 0) {
      post += `> **Key Takeaway:** [Summarize the most important point from this section in one sentence.]\n\n`;
    }

    post += `---\n\n`;
  });

  // Summary / Key Takeaways
  post += `## Key Takeaways\n\n`;
  post += `[Summarize the most important points from the entire guide. Use a numbered or bulleted list.]\n\n`;
  post += `1. [Key takeaway 1]\n`;
  post += `2. [Key takeaway 2]\n`;
  post += `3. [Key takeaway 3]\n`;
  post += `4. [Key takeaway 4]\n`;
  post += `5. [Key takeaway 5]\n\n`;

  // FAQ
  post += buildFAQ(topic, keywords) + '\n';

  // CTA
  post += buildCTA(topic) + '\n\n';

  // Cluster content links
  post += `## Related Articles\n\n`;
  post += `<!-- CONTENT_CLUSTER: Link all supporting articles below. This pillar page should be the hub. -->\n\n`;
  post += `- [INTERNAL_LINK: How to Get Started with ${topic}]\n`;
  post += `- [INTERNAL_LINK: ${topic} Tools and Software Comparison]\n`;
  post += `- [INTERNAL_LINK: ${topic} Case Studies]\n`;
  post += `- [INTERNAL_LINK: ${topic} Mistakes to Avoid]\n`;
  post += `- [INTERNAL_LINK: Advanced ${topic} Techniques]\n\n`;

  post += `<!-- SEO CHECKLIST:\n`;
  post += `  [ ] Primary keyword "${keywords[0] || topic}" in: title, H1, first paragraph, meta description, URL\n`;
  post += `  [ ] This pillar page links to 5+ cluster articles\n`;
  post += `  [ ] All cluster articles link back to this page\n`;
  post += `  [ ] Content is 4,000+ words (pillar content standard)\n`;
  post += `  [ ] All images have descriptive alt text\n`;
  post += `  [ ] Internal links: minimum 8 links to related content\n`;
  post += `  [ ] External links: minimum 5 links to authoritative sources\n`;
  post += `  [ ] Table of contents with jump links\n`;
  post += `  [ ] FAQ section for featured snippet potential\n`;
  post += `  [ ] Key takeaway callouts for skimmers\n`;
  post += `-->\n`;

  return post;
}

// ---------------------------------------------------------------------------
// Template registry
// ---------------------------------------------------------------------------
const TEMPLATES = {
  'how-to': {
    name: 'How-To Tutorial',
    description: '"How to [X]: A Step-by-Step Guide"',
    generate: howToTemplate,
  },
  listicle: {
    name: 'Listicle',
    description: '"[N] Best [X] for [Y]"',
    generate: listicleTemplate,
  },
  comparison: {
    name: 'Comparison',
    description: '"[X] vs [Y]: Complete Comparison"',
    generate: comparisonTemplate,
  },
  'ultimate-guide': {
    name: 'Ultimate Guide',
    description: '"The Ultimate Guide to [X]" (Pillar Content)',
    generate: ultimateGuideTemplate,
  },
};

/**
 * Detect the best template for a given topic string.
 */
function detectTemplate(topic) {
  const lower = topic.toLowerCase();
  if (lower.startsWith('how to ') || lower.includes('step by step') || lower.includes('tutorial')) {
    return 'how-to';
  }
  if (lower.includes(' vs ') || lower.includes(' versus ') || lower.includes('comparison')) {
    return 'comparison';
  }
  if (/^\d+\s/.test(lower) || lower.includes('best ') || lower.includes('top ')) {
    return 'listicle';
  }
  if (lower.includes('ultimate guide') || lower.includes('complete guide') || lower.includes('everything')) {
    return 'ultimate-guide';
  }
  // Default to ultimate guide for generic topics (most versatile)
  return 'ultimate-guide';
}

module.exports = {
  TEMPLATES,
  detectTemplate,
  howToTemplate,
  listicleTemplate,
  comparisonTemplate,
  ultimateGuideTemplate,
  slugify,
  buildTOC,
  buildFAQ,
  buildCTA,
  buildFrontmatter,
};
