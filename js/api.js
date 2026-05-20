/**
 * Obtiene detalles de un repositorio desde la API de GitHub.
 * @param {string} repo - Formato 'owner/repo'
 * @returns {Promise<Object|null>} Datos del repo o null si falla.
 */
async function fetchRepoDetails(repo) {
    // Intentar obtener de sessionStorage primero
    const cachedData = sessionStorage.getItem(`repo_${repo}`);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.status === 403) {
            console.warn("GitHub API rate limit reached.");
            return { error: "rate_limit_exceeded" };
        }

        if (!response.ok) {
            throw new Error(`GitHub API error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Cachear resultado
        sessionStorage.setItem(`repo_${repo}`, JSON.stringify(data));
        
        return data;
    } catch (error) {
        console.error(`Error fetching repo ${repo}:`, error);
        return null;
    }
}

// Hacemos la función accesible globalmente
window.fetchRepoDetails = fetchRepoDetails;
