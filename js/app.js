const b=document.querySelector('.toggle'),n=document.querySelector('nav');if(b&&n){b.addEventListener('click',()=>{const open=n.classList.toggle('open');b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{n.classList.remove('open');b.setAttribute('aria-expanded','false')}))}const r=document.querySelectorAll('.reveal');if('IntersectionObserver'in window){const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');o.unobserve(e.target)}}),{threshold:.08});r.forEach(x=>o.observe(x))}else r.forEach(x=>x.classList.add('visible'));
// SILAJ CATALOGO COMERCIAL WEB-001-O

const catalogGrid = document.querySelector("#product-grid");
const catalogFilters = document.querySelectorAll(".catalog-filter");

const escapeHTML = (value = "") => {
  const entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };

  return String(value).replace(
    /[&<>"']/g,
    (character) => entities[character]
  );
};

const buildProductCard = (product) => {
  const deliverables = (product.deliverables || [])
    .map((item) => `<li>${escapeHTML(item)}</li>`)
    .join("");

  const subject = encodeURIComponent(
    `Solicitud de información ${product.id} ${product.name}`
  );

  return `
    <article
      class="product-card reveal visible ${product.featured ? "featured" : ""}"
      data-family="${escapeHTML(product.family)}"
    >
      <span class="product-code">${escapeHTML(product.id)}</span>

      <p class="product-family">
        ${escapeHTML(product.familyLabel)}
      </p>

      <h4>${escapeHTML(product.name)}</h4>

      <p class="product-summary">
        ${escapeHTML(product.summary)}
      </p>

      <h5>Entregables principales</h5>

      <ul class="product-deliverables">
        ${deliverables}
      </ul>

      <p class="product-audience">
        <strong>Dirigido a:</strong>
        ${escapeHTML(product.audience || "")}
      </p>

      <a
        class="product-link"
        href="mailto:hgarcia@silaj.mx?subject=${subject}"
      >
        Solicitar información
      </a>
    </article>
  `;
};

const renderProducts = (products, family = "all") => {
  if (!catalogGrid) {
    return;
  }

  const filtered = products
    .filter((product) => product.available !== false)
    .filter(
      (product) =>
        family === "all" || product.family === family
    )
    .sort(
      (firstProduct, secondProduct) =>
        (firstProduct.order || 0) -
        (secondProduct.order || 0)
    );

  catalogGrid.innerHTML = filtered.length
    ? filtered.map(buildProductCard).join("")
    : `
      <p class="catalog-status">
        No hay soluciones disponibles en esta categoría.
      </p>
    `;
};

if (catalogGrid) {
  fetch("data/products.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `No fue posible cargar el catálogo: ${response.status}`
        );
      }

      return response.json();
    })
    .then((products) => {
      renderProducts(products);

      catalogFilters.forEach((button) => {
        button.addEventListener("click", () => {
          catalogFilters.forEach((item) => {
            item.classList.remove("active");
          });

          button.classList.add("active");

          renderProducts(
            products,
            button.dataset.family
          );
        });
      });
    })
    .catch((error) => {
      console.error(error);

      catalogGrid.innerHTML = `
        <p class="catalog-status">
          El catálogo no pudo cargarse. Intente nuevamente
          o escriba a hgarcia@silaj.mx.
        </p>
      `;
    });
}
