  /*  gen-documentation.js */

/* Requirements */

const fs = require('fs');
const path = require('path');
const nunjucks  = require('nunjucks');

const version     = "1.0";
const tagLineName = "Table of Contents for Headings, Landmarks and Links";
const extName     = "TOC: Headings, Landmarks and Links";

/* Constants */

const outputDirectory   = './docs/';
const templateDirectory = './src-docs/templates';
const websiteURL        = 'https://opena11y.github.io/toc-headings-landmarks-links/';
const repositoryURL     = 'https://github.com/opena11y/toc-headings-landmarks-links';

// setUseCodeTags(true);

/* Helper functions */

function outputFile(fname, data) {
  fs.writeFile(path.join(outputDirectory, fname), data, err => {
      if (err) {
        console.error(err)
        return
      }
  })
}

function outputTemplate(fname, data) {
  fs.writeFile(path.join(templateDirectory, fname), data, err => {
      if (err) {
        console.error(err)
        return
      }
  })
}

const pages = [
  { template: './src-docs/templates/content-home.njk',
    title: 'Browser Extension',
    link: 'Home',
    filename: 'index.html'
  },
  { template: './src-docs/templates/content-options.njk',
    title: 'Options',
    link: 'Options',
    filename: 'options.html'
  },
  { template: './src-docs/templates/content-faq.njk',
    title: 'Frequently Asked Questions',
    link: 'FAQ',
    filename: 'faq.html'
  },
  { template: './src-docs/templates/content-about.njk',
    title: 'About',
    link: 'About',
    filename: 'about.html'
  }
  ];

// Create files

pages.forEach( p => {
  console.log(`[page]: ${p.filename}`);
  outputFile(p.filename, nunjucks.render(p.template,{
    websiteURL: websiteURL,
    repositoryURL: repositoryURL,
    extName: extName,
    tagLineName: tagLineName,
    version: version,
    title: p.title,
    pages: pages,
  }));
})

