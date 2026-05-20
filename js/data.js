const PROJECTS_DATA_URL = './data/projects.json';

/**
 * Carga los datos de proyectos desde projects.json.
 * @returns {Promise<Array>} Un array de objetos de proyecto.
 */
async function loadProjectsData() {
    try {
        const response = await fetch(PROJECTS_DATA_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.projects || [];
    } catch (error) {
        console.error("Error loading projects data:", error);
        return [];
    }
}

// Hacemos la función accesible globalmente
window.loadProjectsData = loadProjectsData;
