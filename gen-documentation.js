  /*  gen-documentation.js */

/* Requirements */

const fs = require('fs');
const path = require('path');
const nunjucks  = require('nunjucks');

const version     = "4.1";
const tagLineName = "Accessibility Inspector for WCAG Evaluation";
const extName     = "AInspector for WCAG Evaluation";

/* Constants */

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

function outputTemplate(fname, data) {
  fs.writeFile(path.join(templateDirectory, fname), data, err => {
      if (err) {
        console.error(err)
        return
      }
  })
}

const pages = [
  { content: 'content-home.njk',
    title: 'Browser Extension',
    link: 'Home',
    filename: 'index.html'
  },
  {
    dropdown: 'Getting Started',
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
    pages: [
      { content: 'content-view-all-rules.njk',
        title: 'All Rules View',
        link: 'All Rules',
        filename: 'view-all-rules.html'
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
        title: 'Rule Result View: Color Contrast Rules',
        link: 'Color Contrast Rules',
        filename: 'view-rule-result-ccr.html'
      },
      { content: 'content-view-rule-result-table.njk',
        title: 'Rule Result View: Table Rule Results',
        link: 'Table Rules',
        filename: 'view-rule-result-table.html'
      },
      { content: 'content-view-rule-result-table-cell.njk',
        title: 'Rule Result View: Table Cell Rule Results',
        link: 'Table Cell Rules',
        filename: 'view-rule-result-table-cell.html'
      },
      { content: 'content-view-rule-result-title.njk',
        title: 'Rule Result View: Title Rule Results',
        link: 'Title Rules',
        filename: 'view-rule-result-title.html'
      }
    ]
  },
  { dropdown: 'Concepts and Terms',
    pages: [
      { content: 'content-concepts-basic.njk',
        title: 'Basic Concepts and Terms',
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
  { content: 'content-about.njk',
    title: 'About',
    link: 'About',
    filename: 'about.html'
  }
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
          <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">${item.dropdown}</a>
          <ul class="dropdown-menu">`;

      item.pages.forEach( p => {
        console.log(`[dropdown][page]: ${p.filename}`);
        if (p.filename) {
          html += `<li><a class="dropdown-item" href="${p.filename}">${p.link}</a></li>`;
        }
        else {
          html += `<li><hr class="dropdown-divider"></li>`;
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

function createPage(page, navigation) {
  if (page.filename) {
    console.log(`  [createPage]: ${page.filename}`);
    outputFile(page.filename,
      nunjucks.render('./src-docs/templates/page.njk',{
        content: page.content,
        navigation: navigation,
        websiteURL: websiteURL,
        repositoryURL: repositoryURL,
        extName: extName,
        tagLineName: tagLineName,
        version: version,
        title: page.title
      })
    );
  }
}

const navigation = createNavigation(pages);

function createPages(pages) {
  console.log(`[create pages]`);
  pages.forEach( item => {
    if (item.dropdown) {
      item.pages.forEach( p => {
        createPage(p, navigation);
      });
    }
    else {
      createPage(item, navigation);
    }
  });

}

createPages(pages);

