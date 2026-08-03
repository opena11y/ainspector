/*  gen-documentation.js */

/* Requirements */

const fs = require('fs');
const path = require('path');
const nunjucks  = require('nunjucks');

/* Constants */

const version     = "5.0";
const tagLineName = "Accessibility Inspector for WCAG Evaluation";
const projectName = "AInspector for WCAG Evaluation";
const issuesURL   = "https://github.com/opena11y/ainspector/issues";
const issuesEmail = "jongund@illinois.edu";

const outputDirectory   = './docs/';
const templateDirectory = './src-docs/templates/';
const websiteURL        = 'https://opena11y.github.io/ainspector/';
const repositoryURL     = 'https://github.com/opena11y/ainspector';

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

const mainPages = [
  { content: 'content-home.njk',
    title: 'Browser Extension',
    link: 'Home',
    filename: 'index.html'
  },
  {
    dropdown: 'Getting Started',
    id: 'id-getting-started',
    pages: [
      { content: 'content-getting-started-chrome.njk',
        title: 'Chrome Browser',
        link: 'Chrome',
        filename: 'getting-started-chrome.html'
      },
      { content: 'content-getting-started-edge.njk',
        title: 'Edge Browser',
        link: 'Edge',
        filename: 'getting-started-edge.html'
      },
      { content: 'content-getting-started-firefox.njk',
        title: 'Firefox Browser',
        link: 'Firefox',
        filename: 'getting-started-firefox.html'
      },
      { content: 'content-getting-started-opera.njk',
        title: 'Opera Browser',
        link: 'Opera',
        filename: 'getting-started-opera.html'
      }
    ]
  },
  {
    dropdown: 'Options',
    id: 'id-options',
    pages: [
      { content: 'content-option-ruleset.njk',
        title: 'Ruleset Options',
        link: 'Rulesets',
        filename: 'option-rulesets.html'
      },
      { content: 'content-option-general.njk',
        title: 'General Options',
        link: 'General',
        filename: 'option-general.html'
      },
      { content: 'content-option-export.njk',
        title: 'Export Options',
        link: 'Export',
        filename: 'option-export.html'
      },
      { content: 'content-option-shortcuts.njk',
        title: 'Shortcut Options',
        link: 'Shortcuts',
        filename: 'option-shortcuts.html'
      }
    ]
  },
  {
    dropdown: 'Views',
    id: 'id-views',
    pages: [
      { content: 'content-view-summary.njk',
        title: 'Summary View',
        link: 'Summary',
        filename: 'view-summary.html'
      },
      { content: 'content-view-rule-group.njk',
        title: 'Rule Group View',
        link: 'Rule Group',
        filename: 'view-rule-group.html'
      },
      { content: 'content-view-rule-result.njk',
        title: 'Rule Result View',
        link: 'Rule Result',
        filename: 'view-rule-result.html'
      },
      {
        spacer: ''
      },
      { content: 'content-view-rule-result-ccr.njk',
        title: 'Color Contrast Rule Results',
        link: 'Color Contrast Rules',
        filename: 'view-rule-result-ccr.html'
      },
      { content: 'content-view-rule-result-table.njk',
        title: 'Table Rule Results',
        link: 'Table Rules',
        filename: 'view-rule-result-table.html'
      },
      { content: 'content-view-rule-result-table-cell.njk',
        title: 'Table Cell Rule Results',
        link: 'Table Cell Rules',
        filename: 'view-rule-result-table-cell.html'
      },
      { content: 'content-view-rule-result-title.njk',
        title: 'Title Rule Results',
        link: 'Title Rules',
        filename: 'view-rule-result-title.html'
      }
    ]
  },
  { dropdown: 'Concepts and Terms',
    id: 'id-concepts-terms',
    pages: [
      { content: 'content-concepts-basic.njk',
        title: 'Basic Concepts',
        link: 'Basic Concepts',
        filename: 'concepts-basic.html'
      },
      { content: 'content-concepts-results.njk',
        title: 'Result Values',
        link: 'Result Values',
        filename: 'concepts-results.html'
      },
      { content: 'content-concepts-categories.njk',
        title: 'Rule Categories',
        link: 'Rule Categories',
        filename: 'concepts-categories.html'
      },
      { content: 'content-concepts-rulesets.njk',
        title: 'Rulesets',
        link: 'Rulesets',
        filename: 'concepts-rulesets.html'
      }
    ]
  },
  { content: 'content-faq.njk',
    title: 'Frequently Asked Questions',
    link: 'FAQ',
    filename: 'faq.html'
  },
  { dropdown: 'About',
    id: 'id-about',
    pages: [
      { content: 'content-about-history.njk',
        title: 'History',
        link: 'History',
        filename: 'about-history.html'
      },
      { content: 'content-about-privacy.njk',
        title: 'Privacy',
        link: 'Privacy',
        filename: 'about-privacy.html'
      },
      { content: 'content-about-feedback.njk',
        title: 'Feedback and Issues',
        link: 'Feedback',
        filename: 'about-feedback.html'
      },
      {
        spacer: ''
      },
      { url: 'https://opena11y.github.io/evaluation-library/',
        link: 'Evaluation Library'
      },
      { url: 'https://opena11y.github.io/h2l-side-panel/',
        link: 'H2L Side Panel'
      },
      { url: 'https://skipto-landmarks-headings.github.io/page-script-5/',
        link: 'SkipTo.js'
      }
    ]
  }
  ];

const supportPages = [
];


// Create content files

function createNavigation(pages) {
  console.log(`[create Navigation]`);
  let html = '\n';
  pages.forEach( item => {
    console.log(`[create Navigation]: ${item.dropdown} ${item.filename}`);
    if (item.dropdown) {
      html += `
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle"
             data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-expanded="false"
            aria-controls="${item.id}">${item.dropdown}</a>
          <ul class="dropdown-menu" id="${item.id}">`;

      item.pages.forEach( p => {
        console.log(`[dropdown][page]: ${p.filename}`);
        if (p.filename) {
          html += `<li><a class="dropdown-item" href="${p.filename}">${p.link}</a></li>`;
        }
        else {
          if (p.url) {
          html += `<li><a class="dropdown-item" href="${p.url}">${p.link}</a></li>`;
          }
          else {
            html += `<li><hr class="dropdown-divider"></li>`;
          }
        }
      });

      html += `
          </ul>
        </li>
      `;
    }
    else {
      html += `
        <li class="nav-item">
          <a class="nav-link" href="${item.filename}">${item.link}</a>
        </li>
      `;
    }
  });
  html += '\n';

  return html;
}

const mainNav = createNavigation(mainPages);


function createPage(page, mainNav, dropdownName='', dropdownPages=false) {
  if (page.filename) {
    console.log(`  [createPage]: ${page.filename}`);

    outputFile(page.filename,
      nunjucks.render('./src-docs/templates/page.njk',{
        content: page.content,
        navigation: mainNav,
        dropdownName: dropdownName,
        dropdownPages: dropdownPages,
        websiteURL: websiteURL,
        repositoryURL: repositoryURL,
        projectName: projectName,
        tagLineName: tagLineName,
        issuesURL: issuesURL,
        issuesEmail: issuesEmail,
        version: version,
        title: page.title
      })
    );
  }
}


// createPages(supportPages);

function createPages(pages) {
  console.log(`[create pages]`);
  pages.forEach( item => {
    if (item.dropdown) {
      item.pages.forEach( p => {
        createPage(p, mainNav, item.dropdown, item.pages);
      });
    }
    else {
      createPage(item, mainNav);
    }
  });
}

createPages(mainPages);

