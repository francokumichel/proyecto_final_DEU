// Datos de ejemplo para alertas activas y el historial
const alertasActivas = [
  {
    titulo: "Alerta roja: Inundación en Barrio Norte",
    fecha: "2025-08-05T15:40",
    nivel: "rojo",
    descripcion: "Se detectó desborde del Arroyo El Gato. Evacuación recomendada en calles 13 a 17 y 38 a 44.",
    zona: "Barrio Norte"
  },
  {
    titulo: "Alerta amarilla: Lluvias intensas en Zona Sur",
    fecha: "2025-08-05T12:10",
    nivel: "amarillo",
    descripcion: "Pronóstico de lluvias fuertes durante la tarde. Evitá circular por calles anegadas.",
    zona: "Zona Sur"
  }
];

const historialAlertas = [
  {
    titulo: "Alerta roja: Inundación en Zona Oeste",
    fecha: "2025-07-30T22:00",
    nivel: "rojo",
    descripcion: "Inundación en las inmediaciones de Av. 32 y 155. Se habilitó punto de encuentro en Sociedad de Fomento.",
    zona: "Zona Oeste"
  },
  {
    titulo: "Alerta amarilla: Crecida del Arroyo Maldonado",
    fecha: "2025-07-28T09:30",
    nivel: "amarillo",
    descripcion: "Nivel de agua superior al promedio. Vigilancia preventiva.",
    zona: "Centro"
  },
  {
    titulo: "Alerta azul: Mantenimiento de sumideros",
    fecha: "2025-07-27T15:00",
    nivel: "azul",
    descripcion: "Trabajos municipales de limpieza y mantenimiento de sumideros en toda la ciudad.",
    zona: "La ciudad completa"
  },
  {
    titulo: "Alerta roja: Evacuación preventiva por tormenta",
    fecha: "2025-07-20T19:45",
    nivel: "rojo",
    descripcion: "Evacuación recomendada en Barrio Norte y Zona Sur. Se habilitaron puntos de encuentro y asistencia.",
    zona: "Barrio Norte, Zona Sur"
  },
  {
    titulo: "Alerta amarilla: Lluvias fuertes previstas",
    fecha: "2025-07-18T08:30",
    nivel: "amarillo",
    descripcion: "Previsión de lluvias intensas y posibles anegamientos en el centro.",
    zona: "Centro"
  }
  // Puedes agregar más para varias páginas
];

const porPagina = 3;
let paginaActual = 1;

// Renderizar alertas activas
function mostrarAlertasActivas() {
  const lista = document.getElementById('alertas-activas-lista');
  lista.innerHTML = '';
  alertasActivas.forEach(alerta => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'mb-3', 'border-0', 'shadow-sm');
    li.innerHTML = `
      <article tabindex="0" aria-label="${alerta.titulo}">
        <div class="d-flex align-items-center mb-1">
          ${badgeNivel(alerta.nivel)}
          <h2 class="h6 ms-2 mb-0">${alerta.titulo}</h2>
        </div>
        <time datetime="${alerta.fecha}" class="d-block mb-1 text-muted">${formatearFecha(alerta.fecha)}</time>
        <p class="mb-1">${alerta.descripcion}</p>
        <span class="text-secondary small">Zona: ${alerta.zona}</span>
      </article>
    `;
    lista.appendChild(li);
  });
}

// Renderizar historial de alertas con paginación
function mostrarHistorialAlertas(pagina) {
  const lista = document.getElementById('alertas-historial-lista');
  lista.innerHTML = '';
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  const datos = historialAlertas.slice(inicio, fin);

  datos.forEach(alerta => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'mb-3', 'border-0', 'shadow-sm');
    li.innerHTML = `
      <article tabindex="0" aria-label="${alerta.titulo}">
        <div class="d-flex align-items-center mb-1">
          ${badgeNivel(alerta.nivel)}
          <h2 class="h6 ms-2 mb-0">${alerta.titulo}</h2>
        </div>
        <time datetime="${alerta.fecha}" class="d-block mb-1 text-muted">${formatearFecha(alerta.fecha)}</time>
        <p class="mb-1">${alerta.descripcion}</p>
        <span class="text-secondary small">Zona: ${alerta.zona}</span>
      </article>
    `;
    lista.appendChild(li);
  });
}

// Renderizar paginación del historial
function crearPaginacionHistorial() {
  const totalPaginas = Math.ceil(historialAlertas.length / porPagina);
  const paginacion = document.getElementById('alertas-historial-paginacion');
  paginacion.innerHTML = '';
  for (let i = 1; i <= totalPaginas; i++) {
    const li = document.createElement('li');
    li.classList.add('page-item');
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.classList.add('page-link');
    btn.setAttribute('aria-label', `Ir a la página ${i}`);
    if (i === paginaActual) {
      btn.setAttribute('aria-current', 'page');
      btn.classList.add('active');
    }
    btn.onclick = () => {
      paginaActual = i;
      mostrarHistorialAlertas(paginaActual);
      crearPaginacionHistorial();
      document.getElementById('main-content').focus();
    };
    li.appendChild(btn);
    paginacion.appendChild(li);
  }
}

// Utilidad para los badges de nivel
function badgeNivel(nivel) {
  if (nivel === "rojo")
    return '<span class="badge bg-danger" style="min-width:3rem;">Rojo</span>';
  if (nivel === "amarillo")
    return '<span class="badge bg-warning text-dark" style="min-width:3rem;">Amarillo</span>';
  return '<span class="badge bg-info text-dark" style="min-width:3rem;">Azul</span>';
}

// Utilidad para formatear fecha
function formatearFecha(fechaIso) {
  const fecha = new Date(fechaIso);
  return fecha.toLocaleString("es-AR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit"
  });
}

// Suscripción simulada
document.getElementById('suscripcion-formulario').addEventListener('submit', e => {
  e.preventDefault();
  const mensaje = document.getElementById('suscripcion-mensaje');
  mensaje.classList.remove('visually-hidden');
  mensaje.classList.add('alert', 'alert-success');
  mensaje.textContent =
    "¡Te suscribiste correctamente! Vas a recibir alertas en el medio seleccionado.";
  setTimeout(() => mensaje.classList.add('visually-hidden'), 4000);
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  mostrarAlertasActivas();
  mostrarHistorialAlertas(paginaActual);
  crearPaginacionHistorial();
});
