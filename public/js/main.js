document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Función para actualizar el dashboard
    const actualizarDashboard = async () => {
        try {
            const response = await fetch('/api/dashboard', {
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
                throw new Error('Error al obtener datos del dashboard');
            }

            const data = await response.json();
            
            // Actualizar contadores
            document.querySelector('.bg-primary .display-4').textContent = data.clientesActivos;
            document.querySelector('.bg-success .display-4').textContent = data.proyectosActivos;
            document.querySelector('.bg-warning .display-4').textContent = data.facturasPendientes;
            document.querySelector('.bg-info .display-4').textContent = `$${data.ingresosMensuales}`;
        } catch (error) {
            console.error('Error al actualizar el dashboard:', error);
        }
    };

    // Actualizar dashboard cada 5 minutos
    actualizarDashboard();
    setInterval(actualizarDashboard, 300000);
}); 