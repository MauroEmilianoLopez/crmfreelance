document.addEventListener('DOMContentLoaded', () => {
    // Verificar si estamos en la página de login o registro
    const loginForm = document.getElementById('loginForm');
    const registroForm = document.getElementById('registroForm');
    const cerrarSesionBtn = document.getElementById('cerrarSesion');

    // Rutas públicas que no requieren autenticación
    const rutasPublicas = ['/login.html', '/registro.html', '/login', '/registro'];

    // Función para verificar si una ruta es pública
    const esRutaPublica = (ruta) => {
        return rutasPublicas.some(rutaPublica => ruta.endsWith(rutaPublica));
    };

    // Función para verificar si el usuario está autenticado
    const verificarAutenticacion = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return false;
        }
        return true;
    };

    // Función para cerrar sesión
    const cerrarSesion = () => {
        console.log('Cerrando sesión...');
        // Limpiar localStorage
        localStorage.clear();
        // Limpiar sessionStorage
        sessionStorage.clear();
        // Redirigir al login
        window.location.href = '/login';
    };

    // Función para manejar errores de autenticación
    const manejarErrorAutenticacion = (error) => {
        console.error('Error de autenticación:', error);
        if (error.status === 401 || error.message === 'No autorizado') {
            cerrarSesion();
        }
    };

    // Función para hacer peticiones autenticadas
    const peticionAutenticada = async (url, opciones = {}) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No autorizado');
        }

        const headers = {
            ...opciones.headers,
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await fetch(url, { ...opciones, headers });
            
            if (response.status === 401) {
                throw new Error('No autorizado');
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.mensaje || 'Error en la petición');
            }

            return response;
        } catch (error) {
            manejarErrorAutenticacion(error);
            throw error;
        }
    };

    // Manejar el botón de cerrar sesión si existe
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                console.log('Intentando iniciar sesión...');
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.mensaje || 'Error al iniciar sesión');
                }

                const data = await response.json();
                console.log('Respuesta del servidor:', data);

                // Guardar token y datos del usuario
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                console.log('Login exitoso, redirigiendo...');
                
                // Redirigir al dashboard
                window.location.href = '/';
            } catch (error) {
                console.error('Error en login:', error);
                alert(error.message || 'Error al iniciar sesión');
            }
        });
    }

    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            try {
                console.log('Intentando registrar usuario...');
                const response = await fetch('/api/auth/registro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre, email, password })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.mensaje || 'Error al registrar usuario');
                }

                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                alert('Registro exitoso. Por favor, inicia sesión.');
                window.location.href = '/login';
            } catch (error) {
                console.error('Error en registro:', error);
                alert(error.message || 'Error al registrar usuario');
            }
        });
    }

    // Verificar autenticación en páginas protegidas
    const rutaActual = window.location.pathname;
    if (!esRutaPublica(rutaActual)) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No hay token, redirigiendo a login...');
            window.location.href = '/login';
            return;
        }
    }

    // Si hay token pero estamos en una página pública, redirigir al dashboard
    const token = localStorage.getItem('token');
    if (token && esRutaPublica(rutaActual)) {
        console.log('Usuario ya autenticado, redirigiendo al dashboard...');
        window.location.href = '/';
        return;
    }

    // Exportar funciones
    window.auth = {
        verificarAutenticacion,
        cerrarSesion,
        peticionAutenticada
    };
}); 