document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Elementos del DOM
    const facturasTableBody = document.getElementById('facturasTableBody');
    const facturaForm = document.getElementById('facturaForm');
    const facturaModal = new bootstrap.Modal(document.getElementById('facturaModal'));
    const modalTitle = document.getElementById('modalTitle');
    const guardarFacturaBtn = document.getElementById('guardarFactura');
    const clienteSelect = document.getElementById('cliente');
    const proyectoSelect = document.getElementById('proyecto');
    const itemsContainer = document.getElementById('itemsContainer');
    const agregarItemBtn = document.getElementById('agregarItem');
    const itemTemplate = document.getElementById('itemTemplate');

    // Variables globales
    let facturaActual = null;

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

    // Cargar proyectos del cliente seleccionado
    const cargarProyectos = async (clienteId) => {
        try {
            const response = await fetch('/api/proyectos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar proyectos');

            const proyectos = await response.json();
            proyectoSelect.innerHTML = '<option value="">Seleccionar proyecto</option>';
            proyectos
                .filter(proyecto => proyecto.cliente._id === clienteId)
                .forEach(proyecto => {
                    proyectoSelect.innerHTML += `
                        <option value="${proyecto._id}">${proyecto.nombre}</option>
                    `;
                });
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al cargar los proyectos', 'error');
        }
    };

    // Cargar facturas
    const cargarFacturas = async () => {
        try {
            const response = await fetch('/api/facturas', {
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
                throw new Error('Error al cargar facturas');
            }

            const facturas = await response.json();
            mostrarFacturas(facturas);
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al cargar las facturas', 'error');
        }
    };

    // Mostrar facturas en la tabla
    const mostrarFacturas = (facturas) => {
        facturasTableBody.innerHTML = '';
        if (facturas.length === 0) {
            facturasTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">No hay facturas registradas</td>
                </tr>
            `;
            return;
        }

        facturas.forEach(factura => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${factura.numero}</td>
                <td>${factura.cliente ? factura.cliente.nombre : '-'}</td>
                <td>${factura.proyecto ? factura.proyecto.nombre : '-'}</td>
                <td>${formatearFecha(factura.fecha)}</td>
                <td>${formatearFecha(factura.fechaVencimiento)}</td>
                <td>$${factura.total.toFixed(2)}</td>
                <td>
                    <span class="badge bg-${getEstadoColor(factura.estado)}">
                        ${formatearEstado(factura.estado)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary me-1" onclick="editarFactura('${factura._id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarFactura('${factura._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            facturasTableBody.appendChild(tr);
        });
    };

    // Obtener color del estado
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'pendiente': return 'warning';
            case 'pagada': return 'success';
            case 'vencida': return 'danger';
            case 'cancelada': return 'secondary';
            default: return 'secondary';
        }
    };

    // Formatear estado para mostrar
    const formatearEstado = (estado) => {
        return estado.charAt(0).toUpperCase() + estado.slice(1);
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString();
    };

    // Mostrar mensaje
    const mostrarMensaje = (mensaje, tipo) => {
        alert(mensaje); // Puedes mejorar esto usando un sistema de notificaciones más elegante
    };

    // Agregar item a la factura
    const agregarItem = () => {
        const itemNode = document.importNode(itemTemplate.content, true);
        const itemRow = itemNode.querySelector('.item-row');
        
        // Event listeners para cálculos automáticos
        const cantidad = itemRow.querySelector('.cantidad');
        const precio = itemRow.querySelector('.precio');
        const subtotal = itemRow.querySelector('.subtotal');
        
        const calcularSubtotal = () => {
            const cantidadVal = parseFloat(cantidad.value) || 0;
            const precioVal = parseFloat(precio.value) || 0;
            subtotal.value = (cantidadVal * precioVal).toFixed(2);
            calcularTotales();
        };
        
        cantidad.addEventListener('input', calcularSubtotal);
        precio.addEventListener('input', calcularSubtotal);
        
        // Botón eliminar
        itemRow.querySelector('.eliminar-item').addEventListener('click', () => {
            itemRow.remove();
            calcularTotales();
        });
        
        itemsContainer.appendChild(itemRow);
    };

    // Calcular totales de la factura
    const calcularTotales = () => {
        const items = itemsContainer.querySelectorAll('.item-row');
        let subtotal = 0;
        
        items.forEach(item => {
            subtotal += parseFloat(item.querySelector('.subtotal').value) || 0;
        });
        
        document.getElementById('subtotal').value = subtotal.toFixed(2);
        const impuestos = parseFloat(document.getElementById('impuestos').value) || 0;
        const total = subtotal * (1 + impuestos / 100);
        document.getElementById('total').value = total.toFixed(2);
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        facturaForm.reset();
        document.getElementById('facturaId').value = '';
        itemsContainer.innerHTML = '';
        facturaActual = null;
        modalTitle.textContent = 'Nueva Factura';
        calcularTotales();
    };

    // Obtener datos de los items
    const obtenerItems = () => {
        const items = [];
        itemsContainer.querySelectorAll('.item-row').forEach(row => {
            items.push({
                descripcion: row.querySelector('.descripcion').value,
                cantidad: parseFloat(row.querySelector('.cantidad').value),
                precioUnitario: parseFloat(row.querySelector('.precio').value),
                subtotal: parseFloat(row.querySelector('.subtotal').value)
            });
        });
        return items;
    };

    // Guardar factura
    const guardarFactura = async () => {
        try {
            const facturaId = document.getElementById('facturaId').value;
            const facturaData = {
                cliente: document.getElementById('cliente').value,
                proyecto: document.getElementById('proyecto').value || undefined,
                fecha: document.getElementById('fecha').value,
                fechaVencimiento: document.getElementById('fechaVencimiento').value,
                items: obtenerItems(),
                subtotal: parseFloat(document.getElementById('subtotal').value),
                impuestos: parseFloat(document.getElementById('impuestos').value),
                total: parseFloat(document.getElementById('total').value),
                estado: document.getElementById('estado').value
            };

            const url = facturaId ? `/api/facturas/${facturaId}` : '/api/facturas';
            const method = facturaId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(facturaData)
            });

            if (!response.ok) {
                throw new Error('Error al guardar factura');
            }

            facturaModal.hide();
            limpiarFormulario();
            cargarFacturas();
            mostrarMensaje(facturaId ? 'Factura actualizada' : 'Factura creada', 'success');
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al guardar la factura', 'error');
        }
    };

    // Event Listeners
    guardarFacturaBtn.addEventListener('click', guardarFactura);
    document.getElementById('facturaModal').addEventListener('hidden.bs.modal', limpiarFormulario);
    document.getElementById('facturaModal').addEventListener('show.bs.modal', cargarClientes);
    agregarItemBtn.addEventListener('click', agregarItem);
    document.getElementById('impuestos').addEventListener('input', calcularTotales);
    clienteSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            cargarProyectos(e.target.value);
        } else {
            proyectoSelect.innerHTML = '<option value="">Seleccionar proyecto</option>';
        }
    });

    // Funciones globales
    window.editarFactura = async (id) => {
        try {
            const response = await fetch(`/api/facturas/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar factura');

            const factura = await response.json();
            document.getElementById('facturaId').value = factura._id;
            document.getElementById('cliente').value = factura.cliente._id;
            await cargarProyectos(factura.cliente._id);
            if (factura.proyecto) {
                document.getElementById('proyecto').value = factura.proyecto._id;
            }
            document.getElementById('fecha').value = factura.fecha.split('T')[0];
            document.getElementById('fechaVencimiento').value = factura.fechaVencimiento.split('T')[0];
            document.getElementById('impuestos').value = factura.impuestos;
            document.getElementById('estado').value = factura.estado;

            // Cargar items
            itemsContainer.innerHTML = '';
            factura.items.forEach(item => {
                const itemNode = document.importNode(itemTemplate.content, true);
                const itemRow = itemNode.querySelector('.item-row');
                
                itemRow.querySelector('.descripcion').value = item.descripcion;
                itemRow.querySelector('.cantidad').value = item.cantidad;
                itemRow.querySelector('.precio').value = item.precioUnitario;
                itemRow.querySelector('.subtotal').value = item.subtotal;
                
                // Event listeners para cálculos
                const cantidad = itemRow.querySelector('.cantidad');
                const precio = itemRow.querySelector('.precio');
                const subtotal = itemRow.querySelector('.subtotal');
                
                const calcularSubtotal = () => {
                    const cantidadVal = parseFloat(cantidad.value) || 0;
                    const precioVal = parseFloat(precio.value) || 0;
                    subtotal.value = (cantidadVal * precioVal).toFixed(2);
                    calcularTotales();
                };
                
                cantidad.addEventListener('input', calcularSubtotal);
                precio.addEventListener('input', calcularSubtotal);
                
                // Botón eliminar
                itemRow.querySelector('.eliminar-item').addEventListener('click', () => {
                    itemRow.remove();
                    calcularTotales();
                });
                
                itemsContainer.appendChild(itemRow);
            });
            
            calcularTotales();
            modalTitle.textContent = 'Editar Factura';
            facturaModal.show();
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al cargar la factura', 'error');
        }
    };

    window.eliminarFactura = async (id) => {
        if (!confirm('¿Estás seguro de que deseas eliminar esta factura?')) return;

        try {
            const response = await fetch(`/api/facturas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar factura');

            cargarFacturas();
            mostrarMensaje('Factura eliminada', 'success');
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error al eliminar la factura', 'error');
        }
    };

    // Cargar facturas al iniciar
    cargarFacturas();
}); 