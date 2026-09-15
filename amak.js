(() => {
  const config = window.__AMAK_CONFIG__;
  const createView = document.querySelector('.create-view');
  const pagesView = document.querySelector('.pages-view');
  const form = document.querySelector('#branch-form');
  const input = document.querySelector('#branch-name');
  const error = document.querySelector('#branch-error');
  const projectError = document.querySelector('#project-error');

  const toSlug = (value) => value
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);

  const loadSession = async () => {
    const response = await fetch('/api/amak/session', { cache: 'no-store' });
    const session = await response.json();
    if (!session.ok) throw new Error(session.error);
    return session;
  };

  const showPages = async () => {
    createView.hidden = true;
    pagesView.hidden = false;
    const session = await loadSession();
    const slug = config.slug || session.branchSlug;
    document.title = `AMAK — ${slug}`;
    document.querySelector('#crumb-branch').textContent = slug;
    document.querySelector('#active-branch').textContent = session.branch;
    const grid = document.querySelector('#page-grid');
    const template = document.querySelector('#page-card-template');
    Object.entries(config.pages).forEach(([pageId, [title]]) => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.href = `/${encodeURIComponent(slug)}/${pageId}`;
      card.querySelector('strong').textContent = title;
      card.setAttribute('aria-label', `Ouvrir ${title}`);
      grid.append(card);
    });
  };

  const prepareForm = async () => {
    const session = await loadSession();
    const list = document.querySelector('#project-list');
    const template = document.querySelector('#project-card-template');
    document.querySelector('#project-empty').hidden = session.projects.length > 0;
    session.projects.forEach((project) => {
      const card = template.content.firstElementChild.cloneNode(true);
      card.querySelector('strong').textContent = project.slug;
      card.querySelector('.project-branch').textContent = project.branch;
      card.querySelector('.project-status').textContent = project.status;
      const button = card.querySelector('button');
      button.textContent = project.active ? 'Ouvrir' : 'Reprendre';
      button.addEventListener('click', async () => {
        projectError.textContent = '';
        button.disabled = true;
        const initialLabel = button.textContent;
        button.textContent = project.active ? 'Ouverture…' : 'Reprise…';
        try {
          const response = await fetch('/api/amak/resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Amak-Token': config.token },
            body: JSON.stringify({ branch: project.branch }),
          });
          const result = await response.json();
          if (!result.ok) throw new Error(result.error);
          window.location.assign(result.url);
        } catch (requestError) {
          projectError.textContent = requestError.message || 'Le projet n’a pas pu être ouvert.';
          button.disabled = false;
          button.textContent = initialLabel;
        }
      });
      list.append(card);
    });
    document.querySelector('#branch-prefix').textContent = `feature/${session.collaborator}/`;
    if (!session.identityConfigured) {
      error.textContent = 'Ton identité Git n’est pas configurée. Demande à Codex de renseigner ton identifiant avant de continuer.';
    } else if (!session.isMain) {
      error.textContent = `La branche active est « ${session.branch} ». Demande à Codex de revenir sur main pour démarrer un nouveau prototype.`;
    } else if (!session.clean) {
      error.textContent = 'Le dépôt contient des changements locaux. Demande à Codex de les préserver avant de continuer.';
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.textContent = '';
    const slug = toSlug(input.value);
    if (!slug) {
      error.textContent = 'Saisis un nom de branche.';
      input.focus();
      return;
    }
    input.value = slug;
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true;
    submit.textContent = 'Création…';
    try {
      const response = await fetch('/api/amak/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Amak-Token': config.token },
        body: JSON.stringify({ name: slug }),
      });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error);
      window.location.assign(result.url);
    } catch (requestError) {
      error.textContent = requestError.message || 'La branche n’a pas pu être créée.';
      submit.disabled = false;
      submit.textContent = 'Créer la branche';
      input.focus();
    }
  });

  (config.view === 'pages' ? showPages() : prepareForm()).catch((startupError) => {
    error.textContent = startupError.message;
  });
})();
