document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('submit-form');
    
    if (submitForm) {
        submitForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const repoUrl = document.getElementById('repo-url').value;
            const category = document.getElementById('project-category').value;
            const title = document.getElementById('project-title').value || 'Proyecto sugerido';
            const description = document.getElementById('project-description').value || 'Sin descripción';
            
            // Obtener usuario guardado
            const storedUser = localStorage.getItem('42_user');
            const author = storedUser ? JSON.parse(storedUser).login : 'Anonimo';
            
            // Construir URL para la GitHub Issue
            const issueTitle = `Nuevo proyecto: ${title}`;
            const issueBody = `
## Nuevo Proyecto Sugerido
- **Autor:** ${author}
- **URL del Repositorio:** ${repoUrl}
- **Categoría:** ${category}
- **Descripción:** ${description}
            `;
            
            // Debes cambiar 'tu-usuario/42_project_hub' por el nombre de tu repositorio real
            const repoIssuesUrl = `https://github.com/IntRogerYT/42projecthub/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;
            
            window.open(repoIssuesUrl, '_blank');
        });
    }
});
