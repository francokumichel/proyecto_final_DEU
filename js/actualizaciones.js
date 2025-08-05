// Ejemplo de datos de actualizaciones realistas sobre inundaciones, infraestructura y comunidad
const actualizaciones = [
  {
    titulo: "Nueva obra de desagüe pluvial en Barrio Norte",
    fecha: "2025-08-03",
    descripcion: "Se finalizó la construcción de un nuevo conducto de desagüe en la calle 13 entre 40 y 42, que ayudará a reducir el riesgo de inundaciones en la zona durante lluvias intensas."
  },
  {
    titulo: "Alerta meteorológica para el sur del partido de La Plata",
    fecha: "2025-08-02",
    descripcion: "El Servicio Meteorológico Nacional emitió una alerta amarilla por lluvias fuertes y posible acumulación de agua en la zona sur de La Plata. Se recomienda a los vecinos estar atentos a los canales oficiales."
  },
  {
    titulo: "Punto de encuentro habilitado en Plaza Moreno",
    fecha: "2025-07-28",
    descripcion: "La municipalidad habilitó un nuevo punto de encuentro en Plaza Moreno para casos de evacuación. Cuenta con asistencia médica y provisión de alimentos básicos."
  },
  {
    titulo: "Campaña de limpieza de arroyos",
    fecha: "2025-07-25",
    descripcion: "Vecinos junto a personal municipal realizaron una jornada de limpieza en el Arroyo El Gato para mejorar el escurrimiento y prevenir desbordes."
  },
  {
    titulo: "Actualización de datos de zonas inundables",
    fecha: "2025-07-20",
    descripcion: "Se incorporaron nuevos mapas de zonas inundables en el portal web, basados en información de la Agencia de Gestión Urbana y testimonios de vecinos afectados."
  },
  {
    titulo: "Corte preventivo en Avenida 32 por obras",
    fecha: "2025-07-18",
    descripcion: "Desde hoy y hasta el 22/07, se mantendrá cerrado el tránsito en Av. 32 entre 7 y 13 para permitir trabajos de limpieza de sumideros y reparación de pavimento."
  },
  {
    titulo: "Instalación de sensores de nivel de agua",
    fecha: "2025-07-15",
    descripcion: "Se instalaron sensores inteligentes en arroyos para monitorear el nivel de agua en tiempo real y emitir alertas tempranas ante crecidas."
  },
  {
    titulo: "Taller de prevención de inundaciones en escuelas",
    fecha: "2025-07-10",
    descripcion: "Más de 300 alumnos participaron de talleres sobre medidas de prevención ante inundaciones y uso responsable de recursos hídricos."
  },
  {
    titulo: "Donación de kits de emergencia",
    fecha: "2025-07-05",
    descripcion: "Organizaciones sociales entregaron kits de emergencia con alimentos, agua y linternas a familias de la zona oeste afectadas por las últimas lluvias."
  },
  {
    titulo: "Reporte colaborativo: calles anegadas tras tormenta",
    fecha: "2025-07-01",
    descripcion: "Se recibieron más de 50 reportes de vecinos sobre calles anegadas tras la tormenta del 30/06. Los datos fueron remitidos a obras públicas para su seguimiento."
  },
  // Puedes agregar más ejemplos para completar varias páginas...
];

// Configuración
const porPagina = 5;
let paginaActual = 1;

// Renderizar actualizaciones
function mostrarActualizaciones(pagina) {
  const lista = document.getElementById('actualizaciones-lista');
  lista.innerHTML = '';
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  const datos = actualizaciones.slice(inicio, fin);

  datos.forEach((act) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'mb-3', 'border-0', 'shadow-sm');
    li.innerHTML = `
      <article tabindex="0" aria-label="${act.titulo}">
        <h2 class="h5 text-primary mb-2">${act.titulo}</h2>
        <time datetime="${act.fecha}" class="d-block mb-1 text-muted">${act.fecha}</time>
        <p class="mb-0">${act.descripcion}</p>
      </article>
    `;
    lista.appendChild(li);
  });
}

// Renderizar paginación
function crearPaginacion() {
  const totalPaginas = Math.ceil(actualizaciones.length / porPagina);
  const paginacion = document.getElementById('paginacion');
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
      mostrarActualizaciones(paginaActual);
      crearPaginacion();
      // Enfocar el main para accesibilidad
      document.getElementById('main-content').focus();
    };
    li.appendChild(btn);
    paginacion.appendChild(li);
  }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  mostrarActualizaciones(paginaActual);
  crearPaginacion();
});

