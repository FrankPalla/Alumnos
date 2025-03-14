//  Datos de ejemplo con más campos
let estudiantes = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    fechaMatricula: '2023-06-01',
    fechaProximoPago: '2023-07-01',
    montoPagado: 1000,
    montoPendiente: 500,
    estado: 'activo',
    curso: 'Desarrollo Web',
    asistencia: '85%'
  },
  {
    id: '2',
    nombre: 'María García',
    email: 'maria@ejemplo.com',
    fechaMatricula: '2023-05-15',
    fechaProximoPago: '2023-06-15',
    montoPagado: 1500,
    montoPendiente: 0,
    estado: 'activo',
    curso: 'Diseño UX/UI',
    asistencia: '92%'
  }
];

let estudianteEditando = null;

// Funciones de utilidad
function formatearFecha(fecha) {
  if (!fecha) return '-';
  const opciones = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(fecha).toLocaleDateString('es-ES', opciones);
}

function calcularFechaProximoPago(fechaInicio) {
  const fecha = new Date(fechaInicio);
  fecha.setMonth(fecha.getMonth() + 1);
  return fecha.toISOString().split('T')[0];
}

// Gestión de vistas
function mostrarTablero() {
  document.getElementById('tablero').classList.remove('oculto');
  document.getElementById('listaEstudiantes').classList.add('oculto');
  
  // Actualizar estado activo en el menú
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector('.nav-item:first-child').classList.add('active');
  
  actualizarEstadisticas();
  renderizarTablaEstudiantes('contenedorTablaEstudiantes', estudiantes.slice(0, 5));
}

function mostrarListaEstudiantes() {
  document.getElementById('tablero').classList.add('oculto');
  document.getElementById('listaEstudiantes').classList.remove('oculto');
  
  // Actualizar estado activo en el menú
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelector('.nav-item:last-child').classList.add('active');
  
  renderizarTablaEstudiantes('contenedorTablaCompleta', estudiantes);
}

// Gestión del modal
function mostrarModalAgregar() {
  estudianteEditando = null;
  document.getElementById('modalTitulo').textContent = 'Agregar Nuevo Estudiante';
  document.getElementById('btnSubmit').textContent = 'Agregar Estudiante';
  document.getElementById('formularioAgregar').reset();
  document.getElementById('modalAgregar').style.display = 'flex';
}

function mostrarModalEditar(id) {
  const estudiante = estudiantes.find(e => e.id === id);
  if (!estudiante) return;

  estudianteEditando = estudiante;
  document.getElementById('modalTitulo').textContent = 'Editar Estudiante';
  document.getElementById('btnSubmit').textContent = 'Guardar Cambios';
  
  // Llenar el formulario con los datos del estudiante
  document.getElementById('nombre').value = estudiante.nombre;
  document.getElementById('email').value = estudiante.email;
  document.getElementById('fechaMatricula').value = estudiante.fechaMatricula;
  document.getElementById('pagoInicial').value = estudiante.montoPagado;
  document.getElementById('estado').value = estudiante.estado;
  
  document.getElementById('modalAgregar').style.display = 'flex';
}

function ocultarModalAgregar() {
  document.getElementById('modalAgregar').style.display = 'none';
  document.getElementById('formularioAgregar').reset();
  estudianteEditando = null;
}

// Renderizado de tabla
function renderizarTablaEstudiantes(idContenedor, datos) {
  const contenedor = document.getElementById(idContenedor);
  contenedor.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Estudiante</th>
          <th>Curso</th>
          <th>Estado</th>
          <th>Próximo Pago</th>
          <th>Monto Pendiente</th>
          <th>Asistencia</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${datos.map(estudiante => `
          <tr>
            <td>
              <div>
                <div class="font-medium">${estudiante.nombre}</div>
                <div class="text-gray-500">${estudiante.email}</div>
              </div>
            </td>
            <td>${estudiante.curso || '-'}</td>
            <td>
              <span class="badge-estado ${estudiante.estado}">
                ${estudiante.estado === 'activo' ? 'Activo' : 'Inactivo'}
              </span>
            </td>
            <td>${formatearFecha(estudiante.fechaProximoPago)}</td>
            <td>$${estudiante.montoPendiente}</td>
            <td>${estudiante.asistencia || '-'}</td>
            <td>
              <div class="acciones">
                <button onclick="mostrarModalEditar('${estudiante.id}')" class="btn-icon" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onclick="eliminarEstudiante('${estudiante.id}')" class="btn-icon eliminar" title="Eliminar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Manejo del formulario
function manejarAgregarEstudiante(evento) {
  evento.preventDefault();
  
  const datosFormulario = {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    fechaMatricula: document.getElementById('fechaMatricula').value,
    fechaProximoPago: calcularFechaProximoPago(document.getElementById('fechaMatricula').value),
    montoPagado: Number(document.getElementById('pagoInicial').value),
    montoPendiente: 0,
    estado: document.getElementById('estado').value,
    curso: 'Nuevo Curso', // Valor por defecto
    asistencia: '100%' // Valor inicial
  };

  if (estudianteEditando) {
    // Actualizar estudiante existente
    Object.assign(estudianteEditando, datosFormulario);
  } else {
    // Agregar nuevo estudiante
    datosFormulario.id = String(Date.now());
    estudiantes.unshift(datosFormulario);
  }

  ocultarModalAgregar();
  actualizarVista();
}

// Eliminar estudiante
function eliminarEstudiante(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
    estudiantes = estudiantes.filter(e => e.id !== id);
    actualizarVista();
  }
}

// Filtrado de estudiantes
function filtrarEstudiantes() {
  const busqueda = document.querySelector('.search-box input').value.toLowerCase();
  const filtro = document.querySelector('.filter-select').value;
  
  const estudiantesFiltrados = estudiantes.filter(estudiante => {
    const coincideBusqueda = estudiante.nombre.toLowerCase().includes(busqueda) ||
                            estudiante.email.toLowerCase().includes(busqueda) ||
                            estudiante.curso.toLowerCase().includes(busqueda);
                            
    const coincideFiltro = filtro === 'todos' || estudiante.estado === filtro;
    
    return coincideBusqueda && coincideFiltro;
  });
  
  renderizarTablaEstudiantes('contenedorTablaCompleta', estudiantesFiltrados);
}

// Actualización de estadísticas
function actualizarEstadisticas() {
  const totalEstudiantes = estudiantes.length;
  const totalIngresos = estudiantes.reduce((sum, est) => sum + est.montoPagado, 0);
  const pagosPendientes = estudiantes.filter(est => est.montoPendiente > 0).length;
  
  document.querySelector('.stats-grid').innerHTML = `
    <div class="stat-card">
      <div class="stat-icon students">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      </div>
      <div class="stat-info">
        <h3>Total Estudiantes</h3>
        <p class="stat-value">${totalEstudiantes}</p>
        <span class="stat-trend positive">Actualizado</span>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon revenue">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </div>
      <div class="stat-info">
        <h3>Ingresos Totales</h3>
        <p class="stat-value">$${totalIngresos}</p>
        <span class="stat-trend positive">Actualizado</span>
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-icon pending">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>
      <div class="stat-info">
        <h3>Pagos Pendientes</h3>
        <p class="stat-value">${pagosPendientes}</p>
        <span class="stat-trend negative">Actualizado</span>
      </div>
    </div>
  `;
}

// Función de actualización general
function actualizarVista() {
  const vistaActual = document.getElementById('tablero').classList.contains('oculto') ? 
    'lista' : 'tablero';
    
  if (vistaActual === 'tablero') {
    actualizarEstadisticas();
    renderizarTablaEstudiantes('contenedorTablaEstudiantes', estudiantes.slice(0, 5));
  } else {
    filtrarEstudiantes();
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  mostrarTablero();
  
  // Event listeners para el filtrado
  document.querySelector('.search-box input')?.addEventListener('input', filtrarEstudiantes);
  document.querySelector('.filter-select')?.addEventListener('change', filtrarEstudiantes);
});
 