document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando carga de página de clientes...');
    
    // Verificar autenticación
    if (!window.auth.verificarAutenticacion()) {
        return;
    }

    // Elementos del DOM
    const clientesTableBody = document.getElementById('clientesTableBody');
    const clienteForm = document.getElementById('clienteForm');
    const clienteModal = new bootstrap.Modal(document.getElementById('clienteModal'));
    const modalTitle = document.getElementById('modalTitle');
    const guardarClienteBtn = document.getElementById('guardarCliente');

    // Variables globales
    let clienteActual = null;

    // Cargar clientes
    const cargarClientes = async () => {
        try {
            console.log('Iniciando carga de clientes...');
            const response = await window.auth.peticionAutenticada('/api/clientes');
            const clientes = await response.json();
            console.log('Clientes cargados:', clientes.length);
            mostrarClientes(clientes);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            if (error.message !== 'No autorizado') {
                mostrarMensaje('Error al cargar los clientes: ' + error.message, 'error');
            }
        }
    };

    // Mostrar clientes en la tabla
    const mostrarClientes = (clientes) => {
        console.log('Mostrando clientes en la tabla...');
        clientesTableBody.innerHTML = '';
        
        if (clientes.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="6" class="text-center">No hay clientes registrados</td>';
            clientesTableBody.appendChild(tr);
            return;
        }

        clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefono || '-'}</td>
                <td>${cliente.empresa || '-'}</td>
                <td>
                    <span class="badge bg-${getEstadoColor(cliente.estado)}">
                        ${formatearEstado(cliente.estado)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editarCliente('${cliente._id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarCliente('${cliente._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            clientesTableBody.appendChild(tr);
        });
    };

    // Formatear estado
    const formatearEstado = (estado) => {
        return estado.charAt(0).toUpperCase() + estado.slice(1);
    };

    // Obtener color del estado
    const getEstadoColor = (estado) => {
        switch (estado.toLowerCase()) {
            case 'activo': return 'success';
            case 'inactivo': return 'danger';
            case 'prospecto': return 'warning';
            default: return 'secondary';
        }
    };

    // Mostrar mensaje
    const mostrarMensaje = (mensaje, tipo) => {
        // Aquí podrías implementar un sistema de notificaciones más elegante
        // Por ahora usamos alert pero podrías usar toastr, sweetalert2, etc.
        if (tipo === 'error') {
            console.error(mensaje);
        }
        alert(mensaje);
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        clienteForm.reset();
        document.getElementById('clienteId').value = '';
        clienteActual = null;
        modalTitle.textContent = 'Nuevo Cliente';
    };

    // Cargar cliente en el formulario
    const cargarClienteEnFormulario = (cliente) => {
        console.log('Cargando cliente en formulario:', cliente);
        document.getElementById('clienteId').value = cliente._id;
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('email').value = cliente.email;
        document.getElementById('telefono').value = cliente.telefono || '';
        document.getElementById('empresa').value = cliente.empresa || '';
        document.getElementById('direccion').value = cliente.direccion || '';
        document.getElementById('estado').value = cliente.estado;
        document.getElementById('notas').value = cliente.notas || '';
        clienteActual = cliente;
        modalTitle.textContent = 'Editar Cliente';
    };

    // Guardar cliente
    const guardarCliente = async () => {
        try {
            console.log('Iniciando guardado de cliente...');
            const clienteId = document.getElementById('clienteId').value;
            const clienteData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                empresa: document.getElementById('empresa').value,
                direccion: document.getElementById('direccion').value,
                estado: document.getElementById('estado').value,
                notas: document.getElementById('notas').value
            };

            const url = clienteId ? `/api/clientes/${clienteId}` : '/api/clientes';
            const method = clienteId ? 'PUT' : 'POST';

            console.log('Enviando solicitud:', { url, method, clienteData });

            const response = await window.auth.peticionAutenticada(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clienteData)
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            clienteModal.hide();
            limpiarFormulario();
            cargarClientes();
            mostrarMensaje(clienteId ? 'Cliente actualizado exitosamente' : 'Cliente creado exitosamente', 'success');
        } catch (error) {
            console.error('Error al guardar cliente:', error);
            if (error.message !== 'No autorizado') {
                mostrarMensaje('Error al guardar el cliente: ' + error.message, 'error');
            }
        }
    };

    // Event Listeners
    guardarClienteBtn.addEventListener('click', guardarCliente);
    document.getElementById('clienteModal').addEventListener('hidden.bs.modal', limpiarFormulario);

    // Funciones globales para los botones de la tabla
    window.editarCliente = async (id) => {
        try {
            console.log('Cargando cliente para editar:', id);
            const response = await window.auth.peticionAutenticada(`/api/clientes/${id}`);
            const cliente = await response.json();
            cargarClienteEnFormulario(cliente);
            clienteModal.show();
        } catch (error) {
            console.error('Error al cargar cliente:', error);
            if (error.message !== 'No autorizado') {
                mostrarMensaje('Error al cargar el cliente: ' + error.message, 'error');
            }
        }
    };

    window.eliminarCliente = async (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            return;
        }

        try {
            console.log('Eliminando cliente:', id);
            const response = await window.auth.peticionAutenticada(`/api/clientes/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            cargarClientes();
            mostrarMensaje('Cliente eliminado exitosamente', 'success');
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            if (error.message !== 'No autorizado') {
                mostrarMensaje('Error al eliminar el cliente: ' + error.message, 'error');
            }
        }
    };

    // Cargar clientes al iniciar
    cargarClientes();
}); 