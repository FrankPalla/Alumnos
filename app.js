//  Datos de ejemplo
let estudiantes = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    fechaMatricula: '2023-06-01',
    fechaProximoPago: '2023-07-01',
    montoPagado: 1000,
    montoPendiente: 500,
    estado: 'activo'
  },
  {
    id: '2',
    nombre: 'María García',
    email: 'maria@ejemplo.com',
    fechaMatricula: '2023-05-15',
    fechaProximoPago: '2023-06-15',
    montoPagado: 1500,
    montoPendiente: 0,
    estado: 'activo'
  }
];

let estudianteEditando = null;

// Gestión de vistas
function mostrarTablero() {
  document.getElementById('tablero').classList.remove('oculto');
  document.getElementById('listaEstudiantes').classList.add('oculto');
  renderizarTablaEstudiantes('contenedorTablaEstudiantes', estudiantes.slice(0, 5));
}

function mostrarListaEstudiantes() {
  document.getElementById('tablero').classList.add('oculto');
  document.getElementById('listaEstudiantes').classList.remove('oculto');
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
    <div class="contenedor-tabla">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Próximo Pago</th>
            <th>Monto Pendiente</th>
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
              <td>
                <span class="badge-estado ${estudiante.estado}">
                  ${estudiante.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>${formatearFecha(estudiante.fechaProximoPago)}</td>
              <td>$${estudiante.montoPendiente}</td>
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
    </div>
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
    estado: document.getElementById('estado').value
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
  mostrarTablero();
}

// Eliminar estudiante
function eliminarEstudiante(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
    estudiantes = estudiantes.filter(e => e.id !== id);
    mostrarTablero();
  }
}

// Funciones auxiliares
function formatearFecha(fechaString) {
  const fecha = new Date(fechaString);
  return fecha.toLocaleDateString('es-ES', { 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function calcularFechaProximoPago(fechaMatricula) {
  const fecha = new Date(fechaMatricula);
  fecha.setMonth(fecha.getMonth() + 1);
  return fecha.toISOString().split('T')[0];
}

function filtrarEstudiantes() {
  const terminoBusqueda = document.querySelector('.caja-busqueda input').value.toLowerCase();
  const filtroEstado = document.querySelector('.filtros select').value;
  
  const estudiantesFiltrados = estudiantes.filter(estudiante => {
    const coincideBusqueda = estudiante.nombre.toLowerCase().includes(terminoBusqueda) || 
                            estudiante.email.toLowerCase().includes(terminoBusqueda);
    const coincideEstado = filtroEstado === 'todos' || estudiante.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  renderizarTablaEstudiantes('contenedorTablaCompleta', estudiantesFiltrados);
}

// Inicializar la vista del tablero
mostrarTablero();
 