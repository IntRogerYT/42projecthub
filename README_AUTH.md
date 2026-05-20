# Configuración de Autenticación 42 Intra

Para que el login funcione en tu sitio, debes registrar una aplicación en la Intra de 42:

1.  Ve a tu perfil en la Intra de 42.
2.  Accede a **Settings** -> **API** -> **Register a new app**.
3.  Configura la aplicación con los siguientes datos:
    *   **Name:** El nombre de tu sitio (ej. `42 Project Hub`).
    *   **Redirect URI:** `https://tu-usuario.github.io/tu-repo/callback.html` (o la URL de tu GitHub Pages).
4.  Una vez registrada, obtendrás tu **UID** (`Client ID`).
5.  Abre `js/auth.js` y reemplaza `'TU_CLIENT_ID_AQUI'` por el UID que has obtenido.

¡Listo! Con esto, tu sitio web ya podrá autenticar usuarios y mostrar sus datos.
