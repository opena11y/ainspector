/* opena11y.js */

window.addEventListener('load', () => {


  console.log (`[href]: ${window.location.href}`);

  const pathname = new URL(window.location.href).pathname;
  console.log (`[pathname]: ${pathname}`);

  let filename = pathname.substring(pathname.lastIndexOf('/')+1);

  filename = filename ? filename : 'index.html';

  console.log (`[filename]: ${filename}`);

  const links = document.querySelectorAll('a');

  links.forEach( (link) => {
    if (link.href.includes(filename)) {
      console.log(`${link.href.includes(filename)} ${filename} ${link.href}`);
      link.setAttribute('aria-current', 'page');
    }
  })


});
