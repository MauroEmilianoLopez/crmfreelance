document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Elementos del DOM
    const proyectosTableBody = document.getElementById('proyectosTableBody');
    const proyectoForm = document.getElementById('proyectoForm');
    const proyectoModal = new bootstrap.Modal(document.getElementById('proyectoModal'));
    const modalTitle = document.getElementById('modalTitle');
    const guardarProyectoBtn = document.getElementById('guardarProyecto');
    const clienteSelect = document.getElementById('cliente');

    // Variables globales
    let proyectoActual = null;

    // Cargar clientes para el select
    const cargarClientes = async () => {
        try {
            const response = await fetch('/api/clientes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                throw new Error('Error al cargar clientes');
            }

            const clientes = await response.json();
            clienteSelect.innerHTML = '<option value="">Seleccionar cliente</option>';
            clientes.forEach(cliente => {
                clienteSelect.innerHTML += `
                    <option value="${cliente._id}">${cliente.nombre}</option>
                `;
            });
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al cargar los clientes', 'error');
        }
    };

    // Cargar proyectos
    const cargarProyectos = async () => {
        try {
            const response = await fetch('/api/proyectos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                throw new Error('Error al cargar proyectos');
            }

            const proyectos = await response.json();
            mostrarProyectos(proyectos);
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al cargar los proyectos', 'error');
        }
    };

    // Mostrar proyectos en la tabla
    const mostrarProyectos = (proyectos) => {
        proyectosTableBody.innerHTML = '';
        if (proyectos.length === 0) {
            proyectosTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No hay proyectos registrados</td>
                </tr>
            `;
            return;
        }

        proyectos.forEach(proyecto => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${proyecto.nombre}</td>
                <td>${proyecto.cliente ? proyecto.cliente.nombre : '-'}</td>
                <td>
                    <span class="badge bg-${getEstadoColor(proyecto.estado)}">
                        ${formatearEstado(proyecto.estado)}
                    </span>
                </td>
                <td>${formatearFecha(proyecto.fechaInicio)}</td>
                <td>${formatearFecha(proyecto.fechaEntrega)}</td>
                <td>$${proyecto.presupuesto.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editarProyecto('${proyecto._id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProyecto('${proyecto._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            proyectosTableBody.appendChild(tr);
        });
    };

    // Obtener color del estado
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'pendiente': return 'warning';
            case 'en_progreso': return 'primary';
            case 'completado': return 'success';
            case 'cancelado': return 'danger';
            default: return 'secondary';
        }
    };

    // Formatear estado para mostrar
    const formatearEstado = (estado) => {
        return estado.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString();
    };

    // Mostrar mensaje
    const mostrarMensaje = (mensaje, tipo) => {
        alert(mensaje); // Puedes mejorar esto usando un sistema de notificaciones más elegante
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        proyectoForm.reset();
        document.getElementById('proyectoId').value = '';
        proyectoActual = null;
        modalTitle.textContent = 'Nuevo Proyecto';
    };

    // Guardar proyecto
    const guardarProyecto = async () => {
        try {
            const proyectoId = document.getElementById('proyectoId').value;
            const proyectoData = {
                nombre: document.getElementById('nombre').value,
                cliente: document.getElementById('cliente').value,
                descripcion: document.getElementById('descripcion').value,
                fechaInicio: document.getElementById('fechaInicio').value,
                fechaEntrega: document.getElementById('fechaEntrega').value,
                presupuesto: parseFloat(document.getElementById('presupuesto').value),
                estado: document.getElementById('estado').value
            };

            const url = proyectoId ? `/api/proyectos/${proyectoId}` : '/api/proyectos';
            const method = proyectoId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(proyectoData)
            });

            if (!response.ok) {
                throw new Error('Error al guardar proyecto');
            }

            proyectoModal.hide();
            limpiarFormulario();
            cargarProyectos();
            mostrarMensaje(proyectoId ? 'Proyecto actualizado' : 'Proyecto creado', 'success');
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al guardar el proyecto', 'error');
        }
    };

    // Event Listeners
    guardarProyectoBtn.addEventListener('click', guardarProyecto);
    document.getElementById('proyectoModal').addEventListener('hidden.bs.modal', limpiarFormulario);
    document.getElementById('proyectoModal').addEventListener('show.bs.modal', cargarClientes);

    // Funciones globales
    window.editarProyecto = async (id) => {
        try {
            const response = await fetch(`/api/proyectos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar proyecto');

            const proyecto = await response.json();
            document.getElementById('proyectoId').value = proyecto._id;
            document.getElementById('nombre').value = proyecto.nombre;
            document.getElementById('cliente').value = proyecto.cliente._id;
            document.getElementById('descripcion').value = proyecto.descripcion || '';
            document.getElementById('fechaInicio').value = proyecto.fechaInicio.split('T')[0];
            document.getElementById('fechaEntrega').value = proyecto.fechaEntrega.split('T')[0];
            document.getElementById('presupuesto').value = proyecto.presupuesto;
            document.getElementById('estado').value = proyecto.estado;
            
            modalTitle.textContent = 'Editar Proyecto';
            proyectoModal.show();
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al cargar el proyecto', 'error');
        }
    };

    window.eliminarProyecto = async (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;

        try {
            const response = await fetch(`/api/proyectos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar proyecto');

            cargarProyectos();
            mostrarMensaje('Proyecto eliminado', 'success');
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al eliminar el proyecto', 'error');
        }
    };

    // Cargar proyectos al iniciar
    cargarProyectos();
}); 