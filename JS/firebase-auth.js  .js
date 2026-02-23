// Configuración de Firebase - ¡ACTUALIZA CON TUS DATOS!
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', function() {
    console.log('Firebase auth initialized');
    
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('login-form');
    
    // Buscar botones de login (pueden tener diferentes clases)
    const loginBtns = document.querySelectorAll('.login, .login-btn, #loginBtn');
    
    console.log('Login buttons found:', loginBtns.length);

    // Abrir modal - para CADA botón de login
    loginBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Login button clicked');
                if (loginModal) {
                    loginModal.classList.add('active');
                }
            });
        }
    });

    // Cerrar modal con X
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            loginModal.classList.remove('active');
        });
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal && loginModal.classList.contains('active')) {
            loginModal.classList.remove('active');
        }
    });

    // LOGIN con Firebase
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorMsg = document.getElementById('error-msg');
            
            // Crear elemento para errores si no existe
            let errorDiv = errorMsg;
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'error-msg';
                errorDiv.className = 'error';
                loginForm.appendChild(errorDiv);
            }

            if (!email || !password) {
                errorDiv.textContent = 'Please enter email and password';
                return;
            }

            console.log('Attempting login with:', email);

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    console.log('Login successful:', userCredential.user.email);
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('user', JSON.stringify({
                        uid: userCredential.user.uid,
                        email: userCredential.user.email
                    }));
                    
                    // Cerrar modal
                    if (loginModal) {
                        loginModal.classList.remove('active');
                    }
                    
                    // Redirigir si estamos en login.html
                    if (window.location.pathname.includes('login.html')) {
                        window.location.href = 'panel.html';
                    }
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    errorDiv.textContent = 'Error: ' + error.message;
                });
        });
    }

    // Verificar si hay usuario logueado
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('User is logged in:', user.email);
            localStorage.setItem('isAuthenticated', 'true');
        } else {
            console.log('No user logged in');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
        }
    });
});