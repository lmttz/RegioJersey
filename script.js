// Elementos principales
const catalogoContainer = document.getElementById("catalogo");
const searchInput = document.getElementById("searchInput");
const catalogoSection = document.getElementById("catalogo");
const sucursalesSection = document.getElementById("sucursales");
const contactoSection = document.getElementById("contacto");

let categoriaActiva = "todos";

// Catálogo
const catalogo = [
  {
    nombre: "Rayados Local 25/26",
    equipo: "Rayados",
    version: "Jugador",
    categoria: "locales",
    foto: "Images/rayadoslocal2526.jpeg",
    tallas: [
      { nombre:"S", ancho:50, largo:70 },
      { nombre:"M", ancho:55, largo:72 },
      { nombre:"L", ancho:50, largo:70 },
      { nombre:"XL", ancho:55, largo:72 },
      { nombre:"2XL", ancho:50, largo:70 },
      { nombre:"3XL", ancho:55, largo:72 },
      { nombre:"4XL", ancho:60, largo:74 }
    ]
  },
  {
    nombre: "Rayados MDC Local 2025",
    equipo: "Rayados",
    version: "Jugador",
    categoria: "locales",
    foto: "Images/rayadosmdclocal2025.jpeg",
    tallas: [
      { nombre:"M", ancho:54, largo:72 },
      { nombre:"L", ancho:58, largo:74 }
    ]
  },
  {
    nombre: "Tigres Local 25/26",
    equipo: "Tigres",
    version: "Jugador",
    categoria: "locales",
    foto: "Images/tigreslocal2526.jpeg",
    tallas: [
      { nombre:"S", ancho:51, largo:69 },
      { nombre:"M", ancho:56, largo:71 },
      { nombre:"L", ancho:60, largo:73 }
    ]
  },
  {
    nombre: "America Local 25/26",
    equipo: "America",
    version: "Jugador",
    categoria: "locales",
    foto: "Images/americalocal2526.jpeg",
    tallas: [
      { nombre:"M", ancho:53, largo:70 },
      { nombre:"L", ancho:57, largo:72 }
    ]
  },
  {
    nombre: "Jersey Retro Internacional 2005",
    equipo: "Equipo E",
    version: "Jugador",
    categoria: "retro_internacionales",
    foto: "Images/jersey5.png",
    tallas: [
      { nombre:"S", ancho:50, largo:68 },
      { nombre:"M", ancho:55, largo:71 },
      { nombre:"L", ancho:59, largo:74 }
    ]
  }
];

// Mostrar secciones
function mostrarSeccion(id) {
  catalogoSection.classList.add("hidden");
  sucursalesSection.classList.add("hidden");
  contactoSection.classList.add("hidden");
  document.getElementById(id).classList.remove("hidden");
}

// Menú principal
document.querySelectorAll(".main-nav .tab[data-menu]").forEach(btn => {
  btn.addEventListener("click", () => {
    const menu = btn.dataset.menu;
    mostrarSeccion(menu);

    if(menu === "catalogo") {
      const submenu = btn.parentElement.querySelector(".submenu-content");
      if(submenu) submenu.classList.toggle("hidden");
    }
  });
});

// Submenú categorías
document.querySelectorAll(".submenu-content .tab[data-category]").forEach(btn => {
  btn.addEventListener("click", () => {
    categoriaActiva = btn.dataset.category;
    mostrarSeccion("catalogo");
    const submenu = btn.closest(".submenu-content");
    if(submenu) submenu.classList.add("hidden");
    renderCatalogo(searchInput.value);
  });
});

// Renderizar catálogo
function renderCatalogo(filtro="") {
  catalogoContainer.innerHTML = "";

  catalogo
    .filter(j => j.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .filter(j => categoriaActiva === "todos" || j.categoria === categoriaActiva)
    .forEach(j => {
      const card = document.createElement("div");
      card.className = "card";

      const inner = document.createElement("div");
      inner.className = "card-inner";

      inner.innerHTML = `
        <img src="${j.foto}" alt="${j.nombre}" loading="lazy">
        <h2>${j.nombre}</h2>
        <p><b>Equipo:</b> ${j.equipo}</p>
        <p><b>Version:</b> ${j.version}</p>
        <button class="btn verTallas">Ver Tallas</button>
        <div class="tallasLista hidden">
          <table>
            <thead>
              <tr>
                <th>Talla</th>
                <th>Ancho (cm)</th>
                <th>Largo (cm)</th>
              </tr>
            </thead>
            <tbody>
              ${j.tallas.map(t => `
                <tr class="fila-talla" data-img="Images/guia_tallas.png">
                  <td>${t.nombre}</td>
                  <td>${t.ancho}</td>
                  <td>${t.largo}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      `;

      card.appendChild(inner);
      catalogoContainer.appendChild(card);

      // Toggle tallas con botón "X"
      const btnTallas = inner.querySelector(".verTallas");
      const tallasLista = inner.querySelector(".tallasLista");

      btnTallas.addEventListener("click", () => {
        if(!tallasLista.querySelector(".close-tallas")){
          const closeBtn = document.createElement("button");
          closeBtn.textContent = "✖";
          closeBtn.className = "close-tallas";
          tallasLista.prepend(closeBtn);
          closeBtn.addEventListener("click", () => {
            tallasLista.classList.add("hidden");
            card.classList.remove("tallas-abiertas");
            btnTallas.textContent = "Ver Tallas";
          });
        }

        tallasLista.classList.toggle("hidden");
        card.classList.toggle("tallas-abiertas");
        btnTallas.textContent = tallasLista.classList.contains("hidden") ? "Ver Tallas" : "Ocultar Tallas";
      });

      // Modal de jersey + tallas + guía
      inner.querySelector("img").addEventListener("click", () => {
        const modal = document.createElement("div");
        modal.className = "modal";

        const tallasTabla = `
          <table>
            <thead>
              <tr>
                <th>Talla</th>
                <th>Ancho (cm)</th>
                <th>Largo (cm)</th>
              </tr>
            </thead>
            <tbody>
              ${j.tallas.map(t => `
                <tr>
                  <td>${t.nombre}</td>
                  <td>${t.ancho}</td>
                  <td>${t.largo}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        `;

        modal.innerHTML = `
          <div class="modal-content modal-responsive">
            <button class="close-modal">✖</button>
            <div class="modal-body">
              <img src="${j.foto}" alt="${j.nombre}">
              <div class="modal-tallas">
                ${tallasTabla}
                <img src="Images/guia_tallas.png" class="guia-tallas" alt="Guía de tallas">
              </div>
            </div>
          </div>
        `;

        document.body.appendChild(modal);

        // Cerrar modal al clic en fondo
        modal.addEventListener("click", (e) => { if(e.target === modal) modal.remove(); });
        modal.querySelector(".close-modal").addEventListener("click", () => modal.remove());

        // Click en imagen de guía de tallas para abrir en grande
        const guiaImg = modal.querySelector(".guia-tallas");
        if(guiaImg){
          guiaImg.addEventListener("click", () => {
            const modalGuia = document.createElement("div");
            modalGuia.className = "modal";

            modalGuia.innerHTML = `
              <div class="modal-content">
                <button class="close-modal">✖</button>
                <img src="${guiaImg.src}" alt="Guía de tallas">
              </div>
            `;

            document.body.appendChild(modalGuia);

            modalGuia.addEventListener("click", (e) => { if(e.target === modalGuia) modalGuia.remove(); });
            modalGuia.querySelector(".close-modal").addEventListener("click", () => modalGuia.remove());
          });
        }
      });
    });
}

// Click logo
document.getElementById('logo').addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Filtrado por búsqueda
searchInput.addEventListener("input", e => renderCatalogo(e.target.value));

// Inicializar
mostrarSeccion("catalogo");
renderCatalogo();
