/* info-dialog-scopes.js */

const template = document.createElement('template');
template.innerHTML = `

  <div class="content">
   <h3 class="rules" id="id-scopes">
      Scope Definitions
    </h3>
    <table class="table" aria-labelledby="id-scopes">
      <tbody>
        <tr>
          <th class="text-start text-top term">
            element
          </th>
          <td class="text-start">
            A WCAG requirement for a specific html element or an element with an ARIA role, property or state.  For example, an img element must have an alt attribute.        </td>
        </tr>
        <tr>
          <th class="text-start text-top term">
            page
          </th>
          <td class="text-start">
            A WCAG requirement that applies to a feature of a web page.  For example, a web page must have a main landmark.
          </td>
        </tr>
        <tr>
          <th class="text-start text-top term">
            website
          </th>
          <td class="text-start">
            A WCAG requrement that applied to pages in a website.  For example, consistent navigational links in each web page.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
`;

export default class InfoDialogScopes extends HTMLElement {
  constructor () {

    super();
    this.attachShadow({ mode: 'open' });

    // Use external CSS stylesheets
    let link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'base.css');
    this.shadowRoot.appendChild(link);

    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', 'info-dialog-content.css');
    this.shadowRoot.appendChild(link);

    // Add DOM tree from template
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

window.customElements.define("info-dialog-scopes", InfoDialogScopes);


