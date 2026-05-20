# 42 Project Hub

Visor de proyectos de GitHub dividido en dos secciones: **42 Projects** y **Other Projects**.

## Demo

`https://<tu-usuario>.github.io/42_project_hub/`

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de la web |
| CSS3 (Flexbox/Grid) | Estilos responsive |
| JavaScript (Vanilla) | Lógica del frontend |
| GitHub REST API v3 | Datos en vivo de repos (stars, lenguaje, descripción) |
| JSON | Almacenamiento local de proyectos (en el repo) |
| GitHub Pages | Hosting estático gratuito |
| GitHub Issues | Sistema de submission de proyectos |

## Arquitectura General

```
Usuario → GitHub Pages (sitio estático)
              ↓
         JS (fetch)
          ↓         ↓
   GitHub API    projects.json
   (datos vivos) (catálogo)
```

- **Sin backend**: Todo el código se ejecuta en el navegador del cliente.
- **GitHub API**: Se usa para obtener datos en tiempo real (stars, forks, language, description, topics) de cada repo.
- **projects.json**: Archivo estático en el repo que actúa como base de datos. Contiene la lista de repositorios registrados.

## Estructura de Archivos

```
/
├── index.html              # Página principal (single page)
├── css/
│   └── styles.css          # Estilos globales
├── js/
│   ├── app.js              # Lógica principal (init, tabs, render)
│   ├── api.js              # Llamadas a GitHub REST API
│   ├── data.js             # Carga de projects.json y parseo
│   └── submit.js           # Lógica del formulario de submission
├── data/
│   └── projects.json       # Catálogo de proyectos registrados
├── assets/
│   └── images/             # Iconos, logos, etc.
├── _config.yml             # Configuración de GitHub Pages
└── README.md               # Documentación del proyecto
```

## Flujo de Submission de Proyectos

1. El usuario rellena un formulario en la web con la URL de su repo de GitHub.
2. Al enviar, se abre una **GitHub Issue** con los datos del proyecto (usando `window.open` a una URL predefinida con template).
3. El mantenedor revisa la Issue y, si es válida, añade el repo a `data/projects.json` manualmente.
4. La web se actualiza automáticamente al próximo deploy (o el usuario refresca).

### Estructura de una Issue (template)

```
## Nuevo Proyecto

**URL del Repositorio:** https://github.com/usuario/repo
**Categoría:** 42 Projects | Other Projects
**Email (opcional):** usuario@example.com
```

## Formato de projects.json

```json
{
  "projects": [
    {
      "repo": "usuario/nombre-del-repo",
      "category": "42",
      "title": "Nombre del Proyecto",
      "description": "Breve descripción",
      "added": "2026-05-20"
    },
    {
      "repo": "otro-usuario/otro-repo",
      "category": "other",
      "title": "Otro Proyecto",
      "description": "Descripción breve",
      "added": "2026-05-19"
    }
  ]
}
```

### Campos de projects.json

| Campo | Tipo | Descripción |
|---|---|---|
| `repo` | string | Formato `usuario/repo` (obligatorio) |
| `category` | string | `"42"` o `"other"` (obligatorio) |
| `title` | string | Nombre visible del proyecto (obligatorio) |
| `description` | string | Descripción corta (opcional) |
| `added` | string | Fecha en formato ISO (YYYY-MM-DD) |

## API de GitHub (Endpoints Utilizados)

### `GET /repos/{owner}/{repo}`

Obtiene información de un repositorio.

**Respuesta relevante:**

```json
{
  "name": "repo-name",
  "description": "...",
  "html_url": "https://github.com/usuario/repo",
  "stargazers_count": 42,
  "forks_count": 10,
  "language": "C",
  "topics": ["42", "school"],
  "updated_at": "2026-05-20T12:00:00Z"
}
```

**Rate Limiting:** 60 requests/hora para IPs no autenticadas.
**Headers recomendados:** `Accept: application/vnd.github.v3+json`

## Categorías y Visualización

### 42 Projects
- Filtro: repos cuyo dueño sea alumno/ex-alumno de 42, o proyectos curriculares.
- Identificación: se marca manualmente en `projects.json` con `"category": "42"`.
- Badge visual: "42" con colores de la escuela.

### Other Projects
- Cualquier otro proyecto open-source.
- Se muestra en pestaña separada.

### Vistas

- **Tab 1: 42 Projects** — Mosaico de proyectos con badge "42".
- **Tab 2: Other Projects** — Mosaico de proyectos generales.
- **Tab 3: Submit** — Formulario para añadir proyecto.

Cada tarjeta de proyecto muestra:
- Avatar/logo del repo
- Nombre del proyecto
- Descripción
- Lenguaje (con badge de color)
- Estrellas ⭐
- Forks 🍴
- Badge de categoría (42 / Other)
- Enlace al repo

## Diseño UI/UX

- **Layout**: Single Page Application (SPA) minimalista.
- **Tabs**: Navegación por pestañas (42 Projects | Other Projects | Submit).
- **Colores 42**: Azul oscuro (#0a1a3a) y azul claro (#2d6cc0) como acento.
- **Responsive**: Desktop-first con adaptación a móvil.
- **Búsqueda**: Filtro por nombre/lenguaje dentro de cada pestaña.
- **Loading states**: Spinner mientras se cargan datos de la API.

## Plan de Implementación

### Fase 1: Base
- [ ] Crear `index.html` con estructura de pestañas
- [ ] Crear `css/styles.css` con diseño responsive
- [ ] Crear `data/projects.json` con proyectos de ejemplo
- [ ] Configurar `_config.yml` para GitHub Pages
- [ ] Publicar en GitHub Pages

### Fase 2: Funcionalidad
- [ ] `js/data.js` — Carga y parseo de projects.json
- [ ] `js/api.js` — Fetch a GitHub API con caché en sessionStorage
- [ ] `js/app.js` — Renderizado de tarjetas, tabs, búsqueda
- [ ] `js/submit.js` — Formulario de submission via GitHub Issues

### Fase 3: Pulido
- [ ] Animaciones y transiciones
- [ ] Manejo de errores (rate limiting, repos no encontrados)
- [ ] Modo oscuro (opcional)
- [ ] Tests manuales

## Notas Técnicas

- **No hay backend**: Todo es estático. GitHub Pages sirve archivos planos.
- **Caché**: Las respuestas de la API de GitHub se cachean en `sessionStorage` para evitar rate limiting.
- **Rate Limiting**: Si se superan las 60 requests/hora, se muestran los datos cacheados.
- **Sin dependencias externas**: No se usan librerías JS ni CDNs (salvo Font Awesome opcional para iconos).
- **GitHub Pages**: Usa `username.github.io/repo-name` como dominio. El contenido estático se sirve desde la rama `main` (o `gh-pages`).

## Cómo Añadir un Proyecto (para el mantenedor)

1. Editar `data/projects.json`
2. Añadir entrada con el formato especificado
3. Hacer commit y push
4. GitHub Pages despliega automáticamente

## Cómo Contribuir (para usuarios)

1. Ir a la pestaña "Submit" en la web
2. Rellenar el formulario con la URL del repo y categoría
3. Se abre automáticamente una GitHub Issue con los datos
4. El mantenedor revisa y añade el proyecto al catálogo
