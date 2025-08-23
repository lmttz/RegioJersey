const catalogoContainer = document.getElementById("catalogo");
const searchInput = document.getElementById("searchInput");
const adminAccess = document.getElementById("adminAccess");
const adminModal = document.getElementById("adminModal");
const closeAdminModal = document.getElementById("closeAdminModal");
const cancelAdmin = document.getElementById("cancelAdmin");
const jerseyForm = document.getElementById("jerseyForm");
const tallasContainer = document.getElementById("tallasContainer");
const addTalla = document.getElementById("addTalla");
const categories = document.querySelectorAll(".tab");

let catalogo = JSON.parse(localStorage.getItem("catalogo")) || [];
let modoAdmin = false;
let categoriaActiva = "todos";
let editIndex = null;

// ADMIN PASSWORD
const ADMIN_PASSWORD = "1234";

// FUNCIONES MODAL
function abrirModal() { adminModal.classList.remove("hidden"); }
function cerrarModal() {
  adminModal.classList.add("hidden");
  jerseyForm.reset();
  editIndex = null;
  tallasContainer.innerHTML = `<h3>Tallas</h3>
    <div class="talla">
      <input type="text" placeholder="Talla (ej: M)" class="tallaNombre" required>
      <input type="text" placeholder="Ancho (cm)" class="tallaAncho" required>
      <input type="text" placeholder="Largo (cm)" class="tallaLargo" required>
    </div>`;
}

// EVENTOS CIERRE
closeAdminModal.addEventListener("click", cerrarModal);
cancelAdmin.addEventListener("click", cerrarModal);
adminModal.addEventListener("click", e => { if(e.target===adminModal) cerrarModal(); });
document.addEventListener("keydown", e => { if(e.key==="Escape") cerrarModal(); });

// ADMIN MODE
adminAccess.addEventListener("click", ()=>{
  const pass = prompt("Ingrese contraseña de admin:");
  if(pass === ADMIN_PASSWORD){
    modoAdmin = true;
    alert("Modo admin activado");
  }else alert("Contraseña incorrecta");
  renderCatalogo();
});

// AGREGAR/ELIMINAR TALLAS
addTalla.addEventListener("click", ()=>{
  const div = document.createElement("div");
  div.className="talla";
  div.innerHTML = `
    <input type="text" placeholder="Talla (ej: M)" class="tallaNombre" required>
    <input type="text" placeholder="Ancho (cm)" class="tallaAncho" required>
    <input type="text" placeholder="Largo (cm)" class="tallaLargo" required>
    <button type="button" class="btn delete">❌</button>`;
  tallasContainer.appendChild(div);
  div.querySelector(".delete").addEventListener("click",()=>div.remove());
});

// FUNCION OBTENER TALLAS
function obtenerTallas(){
  return [...tallasContainer.querySelectorAll(".talla")].map(t=>({
    nombre: t.querySelector(".tallaNombre").value,
    ancho: t.querySelector(".tallaAncho").value,
    largo: t.querySelector(".tallaLargo").value
  }));
}

// GUARDAR JERSEY
jerseyForm.addEventListener("submit", e=>{
  e.preventDefault();
  const jerseyData = {
    nombre: document.getElementById("jerseyNombre").value,
    equipo: document.getElementById("jerseyEquipo").value,
    version: document.getElementById("jerseyVersion").value,
    categoria: document.getElementById("jerseyCategoria").value.toLowerCase(),
    foto: document.getElementById("jerseyFoto").value || "default.png",
    tallas: obtenerTallas()
  };
  
  if(editIndex !== null){
    catalogo[editIndex] = jerseyData;
  } else {
    catalogo.push(jerseyData);
  }

  localStorage.setItem("catalogo", JSON.stringify(catalogo));
  renderCatalogo();
  cerrarModal();
});

// FILTRO Y CATEGORIAS
searchInput.addEventListener("input", e=>renderCatalogo(e.target.value));
categories.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    categories.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    categoriaActiva = btn.dataset.category;
    renderCatalogo(searchInput.value);
  });
});

// RENDER CATALOGO
function renderCatalogo(filtro=""){
  catalogoContainer.innerHTML="";
  catalogo
    .filter(j=>j.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .filter(j=>categoriaActiva==="todos" || j.categoria.includes(categoriaActiva))
    .forEach((j,i)=>{
      const card = document.createElement("div");
      card.className="card";
      card.innerHTML = `
        <img src="${j.foto}" alt="${j.nombre}">
        <h2>${j.nombre}</h2>
        <p><b>Equipo:</b> ${j.equipo}</p>
        <p><b>Versión:</b> ${j.version}</p>
        <p><b>Categoría:</b> ${j.categoria}</p>
        <button class="btn verTallas">Ver Tallas</button>
        <div class="tallasLista hidden">
          <table border="1" style="width:100%; border-collapse:collapse; text-align:center;">
            <thead>
              <tr>
                <th>Talla</th>
                <th>Ancho (cm)</th>
                <th>Largo (cm)</th>
              </tr>
            </thead>
            <tbody>
              ${j.tallas.map(t=>`
                <tr>
                  <td>${t.nombre}</td>
                  <td>${t.ancho}</td>
                  <td>${t.largo}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <button class="btn copyTabla" style="margin-top:0.5rem;">Copiar Tabla</button>
        </div>
        ${modoAdmin?`<div style="display:flex; gap:0.3rem; justify-content:center; margin-top:0.5rem;">
          <button class="btn" onclick="editarJersey(${i})">✏️</button>
          <button class="btn" onclick="eliminarJersey(${i})">🗑️</button>
        </div>`:""}`;
      catalogoContainer.appendChild(card);

      // Ver/ocultar tallas
      const btnTallas = card.querySelector(".verTallas");
      const ulTallas = card.querySelector(".tallasLista");
      btnTallas.addEventListener("click", ()=>{
        ulTallas.classList.toggle("hidden");
        btnTallas.textContent = ulTallas.classList.contains("hidden") ? "Ver Tallas" : "Ocultar Tallas";
      });

      // Copiar tabla completa
      const btnCopiarTabla = card.querySelector(".copyTabla");
      btnCopiarTabla.addEventListener("click", ()=>{
        let tablaTexto = "Talla\tAncho (cm)\tLargo (cm)\n";
        j.tallas.forEach(t=>{
          tablaTexto += `${t.nombre}\t${t.ancho}\t${t.largo}\n`;
        });
        navigator.clipboard.writeText(tablaTexto).then(()=>alert("Tabla copiada al portapapeles"));
      });
    });
}

// FUNCIONES EDITAR/ELIMINAR
window.editarJersey = i=>{
  editIndex = i;
  const j = catalogo[i];
  abrirModal();
  document.getElementById("jerseyNombre").value=j.nombre;
  document.getElementById("jerseyEquipo").value=j.equipo;
  document.getElementById("jerseyVersion").value=j.version;
  document.getElementById("jerseyCategoria").value=j.categoria;
  document.getElementById("jerseyFoto").value=j.foto;
  tallasContainer.innerHTML="<h3>Tallas</h3>";
  j.tallas.forEach(t=>{
    const div=document.createElement("div");
    div.className="talla";
    div.innerHTML=`
      <input type="text" value="${t.nombre}" class="tallaNombre" required>
      <input type="text" value="${t.ancho}" class="tallaAncho" required>
      <input type="text" value="${t.largo}" class="tallaLargo" required>
      <button type="button" class="btn delete">❌</button>`;
    tallasContainer.appendChild(div);
    div.querySelector(".delete").addEventListener("click",()=>div.remove());
  });
}

window.eliminarJersey = i=>{
  if(confirm("¿Eliminar este jersey?")){
    catalogo.splice(i,1);
    localStorage.setItem("catalogo",JSON.stringify(catalogo));
    renderCatalogo();
  }
}

// Inicializar
renderCatalogo();
