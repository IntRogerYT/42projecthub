/**
 * Gestión de autenticación OAuth 2.0 con PKCE para la API de 42.
 */

const CLIENT_ID = 'u-s4t2ud-a1d5b20c0471aa69f47abf502d0a534100bb2ebd55769a76b19d40867b56e940'; // UID correcto
const REDIRECT_URI = window.location.origin + '/index.html'; // Corregido para coincidir con lo registrado
const AUTH_URL = 'https://api.intra.42.fr/oauth/authorize';
const TOKEN_URL = 'https://api.intra.42.fr/oauth/token';

// Funciones para PKCE (generar code_verifier y code_challenge)
async function generateCodeVerifier() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return base64UrlEncode(array);
}

async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(buffer) {
    return btoa(String.fromCharCode.apply(null, buffer))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// Iniciar login
async function login42() {
    const verifier = await generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);
    
    sessionStorage.setItem('code_verifier', verifier);
    
    const url = `${AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&code_challenge=${challenge}&code_challenge_method=S256&scope=public`;
    window.location.href = url;
}

// Lógica de callback
async function handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const verifier = sessionStorage.getItem('code_verifier');

    // Solo ejecutar si hay un código en la URL (estamos en el callback)
    if (!code) {
        console.log("No estamos en el callback (no hay 'code').");
        return;
    }

    console.log("HandleCallback iniciada...");
    console.log("Code:", code, "Verifier:", verifier);

    // ... (resto de la lógica igual)
    const body = {
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code: code,
        redirect_uri: REDIRECT_URI
    };
    
    if (verifier) {
        body.code_verifier = verifier;
    }

    // Enviar a nuestro propio backend para evitar CORS
    console.log("Enviando petición a nuestro proxy...");

    const response = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("Token Response:", data);

    if (data.access_token) {
        localStorage.setItem('42_access_token', data.access_token);
        
        // Obtener datos del usuario
        const userResponse = await fetch('https://api.intra.42.fr/v2/me', {
            headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        const user = await userResponse.json();
        localStorage.setItem('42_user', JSON.stringify(user));
        
        // Redirigir a la raíz limpiando los parámetros de la URL
        window.location.href = window.location.origin;
    } else {
        console.error("Error en Token Response:", data);
    }
}

// Asegurarse de que se ejecute al cargar el DOM
window.addEventListener('DOMContentLoaded', handleCallback);
handleCallback(); // Ejecutar inmediatamente por si acaso
window.login42 = login42;
