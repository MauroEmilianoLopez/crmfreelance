document.addEventListener('DOMContentLoaded', () => {
    // Verificar si estamos en la página de login o registro
    const loginForm = document.getElementById('loginForm');
    const registroForm = document.getElementById('registroForm');

    // Verificar si el usuario está autenticado en páginas protegidas
    const token = localStorage.getItem('token');
    console.log('Token actual:', token ? 'Presente' : 'No presente');

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

                const data = await response.json();
                console.log('Respuesta del servidor:', data);

                if (response.ok) {
                    // Guardar token y datos del usuario
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    console.log('Login exitoso, redirigiendo...');
                    
                    // Redirigir al dashboard
                    window.location.href = '/';
                } else {
                    alert(data.mensaje);
                }
            } catch (error) {
                console.error('Error en login:', error);
                alert('Error al iniciar sesión');
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

                const data = await response.json();
                console.log('Respuesta del servidor:', data);

                if (response.ok) {
                    alert('Registro exitoso. Por favor, inicia sesión.');
                    window.location.href = '/login.html';
                } else {
                    alert(data.mensaje);
                }
            } catch (error) {
                console.error('Error en registro:', error);
                alert('Error al registrar usuario');
            }
        });
    }

    // Verificar si el usuario está autenticado en páginas protegidas
    if (!token && window.location.pathname !== '/login.html' && window.location.pathname !== '/registro.html') {
        console.log('No hay token, redirigiendo a login...');
        window.location.href = '/login.html';
    }
}); 