document.addEventListener('DOMContentLoaded', async () => {
    // 1. Tab switching logic
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const loginBtn = document.getElementById('login-btn');

    // Lógica para mostrar/ocultar botón de filtro
    const filterBtn = document.getElementById('filter-my-projects');
    
    // Si hay usuario, mostrar botón
    const storedUser = localStorage.getItem('42_user');
    if (storedUser) {
        filterBtn.style.display = 'inline-block';
        const user = JSON.parse(storedUser);
        
        filterBtn.addEventListener('click', () => {
            const allCards = document.querySelectorAll('.project-card');
            allCards.forEach(card => {
                const badge = card.querySelector('.badge');
                if (!badge || badge.innerText !== user.login) {
                    card.style.display = 'none';
                }
            });
        });
    }

    loginBtn.addEventListener('click', () => {
        if (typeof window.login42 === 'function') {
            window.login42();
        } else {
            console.error("login42 no está definida");
        }
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // 2. Load and render projects
    const projects = await window.loadProjectsData();
    const grid42 = document.getElementById('grid-42-projects');
    const gridOther = document.getElementById('grid-other-projects');
    const loading42 = document.getElementById('loading-42');
    const loadingOther = document.getElementById('loading-other');

    for (const project of projects) {
        const details = await window.fetchRepoDetails(project.repo);
        
        // Manejo de errores de API (rate limit)
        if (details && details.error === 'rate_limit_exceeded') {
            const card = createProjectCard(project, null);
            card.innerHTML += `<p style="color:red;">Límite de API alcanzado.</p>`;
            if (project.category === '42') grid42.appendChild(card);
            else gridOther.appendChild(card);
            continue;
        }

        const card = createProjectCard(project, details);
        
        if (project.category === '42') {
            grid42.appendChild(card);
        } else {
            gridOther.appendChild(card);
        }
    }
    
    // Ocultar spinners
    loading42.style.display = 'none';
    loadingOther.style.display = 'none';
});

/**
 * Crea el elemento HTML de una tarjeta de proyecto.
 */
function createProjectCard(project, details) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Si tenemos datos de la API, los usamos; si no, caemos a datos locales
    const title = project.title || (details ? details.name : 'Sin título');
    const description = project.description || (details && details.description ? details.description : 'Sin descripción');
    const url = details ? details.html_url : `https://github.com/${project.repo}`;
    const stars = details ? details.stargazers_count : 'N/A';
    const forks = details ? details.forks_count : 'N/A';
    const language = details ? details.language : 'N/A';
    const authorBadge = project.author ? `<span class="badge">${project.author}</span>` : '';

    card.innerHTML = `
        <h3>${title}</h3>
        ${authorBadge}
        <p>${description}</p>
        <p><strong>Lenguaje:</strong> ${language}</p>
        <p>⭐ ${stars} | 🍴 ${forks}</p>
        <a href="${url}" class="repo-link" target="_blank">Ver en GitHub</a>
    `;
    return card;
}
