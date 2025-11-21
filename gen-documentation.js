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
        filename: 'getting-started-chrome.html',
        breadcrumb: 'Getting Started'
      },
      { content: 'content-getting-started-edge.njk',
        title: 'Edge Browser',
        link: 'Edge',
        filename: 'getting-started-edge.html',
        breadcrumb: 'Getting Started'
      },
      { content: 'content-getting-started-firefox.njk',
        title: 'Firefox Browser',
        link: 'Firefox',
        filename: 'getting-started-firefox.html',
        breadcrumb: 'Getting Started'
      },
      { content: 'content-getting-started-opera.njk',
        title: 'Opera Browser',
        link: 'Opera',
        filename: 'getting-started-opera.html',
        breadcrumb: 'Getting Started'
      }
    ]
  },
  {
    dropdown: 'Options',
    pages: [
      { content: 'content-option-ruleset.njk',
        title: 'Ruleset Options',
        link: 'Rulesets',
        filename: 'option-rulesets.html',
        breadcrumb: 'Options'
      },
      { content: 'content-option-general.njk',
        title: 'General Options',
        link: 'General',
        filename: 'option-general.html',
        breadcrumb: 'Options'
      },
      { content: 'content-option-export.njk',
        title: 'Export Options',
        link: 'Export',
        filename: 'option-export.html',
        breadcrumb: 'Options'
      },
      { content: 'content-option-shortcuts.njk',
        title: 'Shortcut Options',
        link: 'Shortcuts',
        filename: 'option-shortcuts.html',
        breadcrumb: 'Options'
      }
    ]
  },
  {
    dropdown: 'Views',
    pages: [
      { content: 'content-view-all-rules.njk',
        title: 'All Rules View',
        link: 'All Rules',
        filename: 'view-all-rules.html',
        breadcrumb: 'Views'
      },
      { content: 'content-view-rule-group.njk',
        title: 'Rule Group View',
        link: 'Rule Group',
        filename: 'view-rule-group.html',
        breadcrumb: 'Views'
      },
      { content: 'content-view-rule-result.njk',
        title: 'Rule Result View',
        link: 'Rule Result',
        filename: 'view-rule-result.html',
        breadcrumb: 'Views'
      },
      {
        spacer: ''
      },
      { content: 'content-view-rule-result-ccr.njk',
        title: 'Color Contrast Rule',
        link: 'Color Contrast Rules',
        filename: 'view-rule-result-ccr.html',
        breadcrumb: 'Views'
      },
      { content: 'content-view-rule-result-table.njk',
        title: 'Table Rule Results',
        link: 'Table Rules',
        filename: 'view-rule-result-table.html',
        breadcrumb: 'Views'
      },
      { content: 'content-view-rule-result-table-cell.njk',
        title: 'Table Cell Rule Result',
        link: 'Table Cell Rules',
        filename: 'view-rule-result-table-cell.html',
        breadcrumb: 'Views'
      },
      { content: 'content-view-rule-result-title.njk',
        title: 'Title Rule Results',
        link: 'Title Rules',
        filename: 'view-rule-result-title.html',
        breadcrumb: 'Views'
      }
    ]
  },
  { dropdown: 'Concepts and Terms',
    pages: [
      { content: 'content-concepts-basic.njk',
        title: 'Basic Concepts',
        link: 'Basic Concepts',
        filename: 'concepts-basic.html',
        breadcrumb: 'Concepts and Terms'
      },
      { content: 'content-concepts-results.njk',
        title: 'Result Values',
        link: 'Result Values',
        filename: 'concepts-results.html',
        breadcrumb: 'Concepts and Terms'
      },
      { content: 'content-concepts-categories.njk',
        title: 'Rule Categories',
        link: 'Rule Categories',
        filename: 'concepts-categories.html',
        breadcrumb: 'Concepts and Terms'
      },
      { content: 'content-concepts-rulesets.njk',
        title: 'Rulesets',
        link: 'Rulesets',
        filename: 'concepts-rulesets.html',
        breadcrumb: 'Concepts and Terms'
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
          <a class="nav-link dropdown-toggle"
             data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-expanded="false">${item.dropdown}</a>
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

function createPage(page, mainNav, dropdownPages=false) {
  if (page.filename) {
    console.log(`  [createPage]: ${page.filename}`);

    const breadcrumb =  page.breadcrumb ?
                        page.breadcrumb :
                        page.filename !== 'index.html' ?
                          page.title :
                          '';

    outputFile(page.filename,
      nunjucks.render('./src-docs/templates/page.njk',{
        content: page.content,
        navigation: mainNav,
        dropdownPages: dropdownPages,
        websiteURL: websiteURL,
        repositoryURL: repositoryURL,
        extName: extName,
        tagLineName: tagLineName,
        version: version,
        title: page.title,
        breadcrumb: breadcrumb
      })
    );
  }
}

const mainNav = createNavigation(pages);

function createPages(pages) {
  console.log(`[create pages]`);
  pages.forEach( item => {
    if (item.dropdown) {
      item.pages.forEach( p => {
        createPage(p, mainNav, item.pages);
      });
    }
    else {
      createPage(item, mainNav);
    }
  });

}

createPages(pages);

