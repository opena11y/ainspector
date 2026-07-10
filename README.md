# AInspector for WCAG Evaluation

**AInspector for WCAG Evaluation** is a web accessibility evaluation tool that helps developers and testers verify web pages against WCAG and ARIA standards. Built as a browser extension for **Firefox**, **Chrome**, and **Edge**, it allows you to inspect the accessibility of the currently active web page directly within your browser's side panel.

## 📥 Installation

| Browser | Store Link |
| :--- | :--- |
| **Firefox** | [**Get AInspector WCAG for Firefox**](https://addons.mozilla.org/en-US/firefox/addon/ainspector-wcag/) |
| **Chrome** | [**Get AInspector WCAG for Chrome**](https://chromewebstore.google.com/detail/ainspector-for-wcag-evalu/dhllbiaionalkdpankidadkoaaenenie) |
| **Edge** | [**Get AInspector WCAG for Edge**](https://microsoftedge.microsoft.com/addons/detail/ainspector-for-wcag-evalu/enilnlbjbmnfleppphmbodnhkecoddhg) |
| **Opera** |AInspector WCAG for Opera is self-hosted see [documentation](https://opena11y.github.io/ainspector/) for installation |

## 🚀 Features

AInspector for WCAG Evaluation utilizes the [OpenA11y Evaluation Library](https://github.com/opena11y/evaluation-library) to provide comprehensive accessibility reports.

  * **Standards Support:**
      * **WCAG:** Evaluates compliance with WCAG 2.0, 2.1, and 2.2 (Level A and AA).
      * **ARIA:** Validates against ARIA 1.2, 1.3, and ARIA in HTML specifications.
  * **Detailed Evaluation:**
      * **Violations & Warnings:** Identifies automated failures.
      * **Manual Checks:** Highlights items that require human review (a critical step often missed by other tools).
      * **Pass:** Confirms rules that have been successfully met.
  * **Flexible Views:** Organize results by **Rule Categories** (e.g., Headings, Forms, Images) or by **WCAG Guidelines**.
  * **Visual Feedback:** Selectively highlight elements on the page based on their evaluation result.
  * **Data Export:** Export your evaluation results to **JSON** or **CSV** formats for reporting and tracking.
  * **Privacy:** AInspector operates entirely within your browser and does not collect, save, or communicate your browsing history or page data.

## 📖 Documentation

For full user guides, concepts, and advanced usage, visit the official documentation:
👉 **[https://opena11y.github.io/ainspector/](https://opena11y.github.io/ainspector/)**

## 🛠 Usage

1.  **Open the Side Panel:**
      * Click the **AI** extension icon in your browser toolbar.
      * *Alternatively, for Firefox and Opera use the keyboard shortcut:*
          * **Windows:** `Ctrl` + `Shift` + `U`
          * **Mac:** `Cmd` + `Shift` + `U
      * *Alternatively, Chrome and Edge allow the user to define their own keyboard shortcut*`
2.  **Analyze:** The extension will automatically evaluate the current page.
3.  **Inspect:** Drill down into Rule Categories to see specific element results.
4.  **Re-evaluate:** Use the "Rerun" button to check dynamic content changes or after making edits.

## 🤝 Contributing & Feedback

We welcome community feedback\!

  * **Report Bugs:** If you find an issue or inconsistency, please [file a new issue](https://github.com/opena11y/ainspector/issues) in this repository.
  * **Provide Details:** When reporting, please include the URL where the problem occurs, a description of the issue, and reproduction steps.

## 📜 License

This project is licensed under the [Mozilla Public License 2.0](https://www.google.com/search?q=LICENSE).

-----

*AInspector is developed by the [OpenA11y](https://github.com/opena11y) community in collaboration with the University of Illinois.*
