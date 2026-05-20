document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('submit-form');
    
    if (submitForm) {
        submitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const repoUrl = document.getElementById('repo-url').value;
            const category = document.getElementById('project-category').value;
            const title = document.getElementById('project-title').value || 'Proyecto sugerido';
            const description = document.getElementById('project-description').value || 'Sin descripción';
            
            // Construir URL para la GitHub Issue
            // Nota: Este formato asume que el repo tiene issues activadas.
            // Para un repo público, la URL sería: github.com/tu-usuario/42_project_hub/issues/new
            // Vamos a usar parámetros de query para rellenar el cuerpo
            
            const issueTitle = `Nuevo proyecto: ${title}`;
            const issueBody = `
## Nuevo Proyecto Sugerido
- **URL del Repositorio:** ${repoUrl}
- **Categoría:** ${category}
- **Descripción:** ${description}
            `;
            
            // Debes cambiar 'tu-usuario/42_project_hub' por el nombre de tu repositorio real
            const repoIssuesUrl = `https://github.com/IntRogerYT/42_project_hub/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;
            
            window.open(repoIssuesUrl, '_blank');
        });
    }
});
