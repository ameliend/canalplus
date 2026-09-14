(() => {
  if (!document.querySelector('link[href="./header-search.css"]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = './header-search.css';
    document.head.append(stylesheet);
  }

  const header = document.querySelector('header');
  if (!header || header.querySelector('.header-search')) return;

  let trigger = header.querySelector('button.search, button[aria-label="Rechercher"]');
  if (!trigger) {
    const searchIcon = header.querySelector('.search');
    if (searchIcon) {
      trigger = document.createElement('button');
      trigger.className = 'search';
      trigger.type = 'button';
      trigger.setAttribute('aria-label', 'Rechercher');
      trigger.innerHTML = searchIcon.outerHTML.replace(/ class="search"/, '');
      searchIcon.replaceWith(trigger);
    }
  }
  if (!trigger) return;

  const logo = header.querySelector('.logo, .brand, a:has(> img.logo)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reducedMotion ? 0 : 500;
  const shell = document.createElement('form');
  const inputId = `header-search-input-${Math.random().toString(36).slice(2, 8)}`;
  let readyTimer;
  let closingTimer;

  if (getComputedStyle(header).position === 'static') header.style.position = 'relative';

  shell.className = 'header-search';
  shell.setAttribute('role', 'search');
  shell.setAttribute('aria-label', 'Recherche CANAL+');
  shell.innerHTML = `<input class="header-search__input" id="${inputId}" type="search" autocomplete="off" placeholder="Rechercher un programme" aria-label="Rechercher un programme"><button class="header-search__close" type="button" aria-label="Fermer la recherche"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>`;

  trigger.classList.add('header-search__trigger');
  trigger.setAttribute('aria-controls', inputId);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.parentNode.insertBefore(shell, trigger);
  shell.insertBefore(trigger, shell.firstChild);

  const input = shell.querySelector('.header-search__input');
  const close = shell.querySelector('.header-search__close');
  const fallbackCatalogue = [
    ['L’affaire Bojarski', 'Film Drame', 'https://thumb.canalplus.pro/http/unsafe/650x366/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/31072813/canal-ouah_50001/BKDROP/myCANAL_16x9_Logotype_MEA_1920x1080-GSoU'],
    ['Nino', 'Film Drame', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/30354273/canal-ouah_50002/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-z5wS'],
    ['Lost Media', 'Saison 1', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/30932758/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-RNQS'],
    ['Planète préhistorique', 'Documentaire', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/media.prod.hawc.canal.aws.io-cplus.net/6d469e7f5f39a6f5d8febfa2296c4d49.jpg'],
    ['Pluribus', 'Saison 1', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/media.prod.hawc.canal.aws.io-cplus.net/9ceea49c00e2d881adc0625b5c75721f.jpg'],
    ['The Studio', 'Saison 1', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/media.prod.hawc.canal.aws.io-cplus.net/854a119551297fcc1278c62b51ee3997.jpg'],
    ['Marie-Antoinette', 'Saison 1', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/19966187/canal-ouah/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-27CM'],
    ['Pour Emma', 'Film Drame', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/122584948'],
    ['Dossier 137', 'Film Policier', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/30902170/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-Je4Z'],
    ['Crimes à Cluny', 'Téléfilm Policier', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/31456130/canal-ouah_50027/STD169LT/CRIMES_A_CLUNY__MYCANAL_STD169LT-QHOD'],
    ['Sœurs et demie', 'Film Comédie', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/31172242/canal-ouah_50026/STD169LT/SOEURS_ET_DEMIE__MYCANAL_STD169LT-cZjs'],
    ['Vie privée', 'Film Drame', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/30720051/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-CnVV'],
    ['Has Fallen', 'Série Action', 'https://thumb.canalplus.pro/http/unsafe/650x366/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/26153428/canal-ouah_50001/BKDROP/myCANAL_16x9_Logotype_MEA_1920x1080-3G2E'],
    ['La Femme de ménage', 'Film Suspense', 'https://thumb.canalplus.pro/http/unsafe/650x366/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/30970202/canal-ouah_50001/BKDROP/myCANAL_16x9_Logotype_MEA_1920x1080-dvM6'],
    ['Greenland : Migration', 'Film Action', 'https://thumb.canalplus.pro/http/unsafe/650x366/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/31203425/canal-ouah_50001/BKDROP/myCANAL_16x9_Logotype_MEA_1920x1080-tt8C']
  ];

  const collectCatalogue = () => {
    const items = [...fallbackCatalogue];
    const cards = document.querySelectorAll('main :is(.hero-card,.sport-card,.summary-card,.poster,.continue-card,.cinema-card,.playlist-card,.poster-card,.series-card,.video-card,.featured-card,.live-card)');
    cards.forEach((card) => {
      if (card.matches('.category-card') || card.closest('.chips, .channel-grid')) return;
      const image = [...card.querySelectorAll('img')].find((item) => !item.matches('.channel-logo, .vod-channel'));
      const src = card.dataset.programmeImage || image?.currentSrc || image?.src;
      const title = card.dataset.programmeTitle || card.querySelector('.title, .card-title, .sport-card-title, .live-title, strong')?.textContent || image?.alt || card.getAttribute('aria-label');
      const meta = card.querySelector('.subtitle, .card-subtitle, .live-subtitle')?.textContent || 'Programme CANAL+';
      if (src && title) items.push([title.replace(/^Voir\s+/i, '').trim(), meta.trim(), src]);
    });
    return [...new Map(items.map((item) => [item[0].trim().toLocaleLowerCase('fr'), item])).values()];
  };

  const renderResults = (query) => {
    document.querySelector('.search-results-view')?.remove();
    document.querySelectorAll('main').forEach((main) => { main.hidden = true; });
    const results = collectCatalogue().sort(() => Math.random() - .5).slice(0, 15);
    const section = document.createElement('section');
    section.className = 'search-results-view';
    section.setAttribute('aria-labelledby', 'search-results-title');
    section.innerHTML = `<h1 id="search-results-title">${query.replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]))}</h1><div class="search-results-grid"></div>`;
    const grid = section.querySelector('.search-results-grid');
    results.forEach(([title, meta, src]) => {
      const card = document.createElement('a');
      card.className = 'search-result-card';
      card.href = '#';
      card.dataset.programmeTitle = title;
      card.dataset.programmeImage = src;
      card.setAttribute('aria-label', `Voir ${title}`);
      card.innerHTML = `<img src="${src}" alt="" loading="lazy"><span class="search-result-card__title"></span><span class="search-result-card__meta"></span>`;
      card.querySelector('.search-result-card__title').textContent = title;
      card.querySelector('.search-result-card__meta').textContent = meta;
      grid.append(card);
    });
    section.addEventListener('click', (event) => {
      if (event.target.closest('.search-result-card')) event.preventDefault();
    });
    header.insertAdjacentElement('afterend', section);
    document.title = `${query} — Recherche CANAL+`;
  };

  const updateGeometry = () => {
    if (shell.classList.contains('is-open')) return;
    const headerRect = header.getBoundingClientRect();
    const logoRect = logo?.getBoundingClientRect();
    const tools = shell.parentElement;
    const nextControl = shell.nextElementSibling;
    const gap = Number.parseFloat(getComputedStyle(tools).columnGap) || 20;
    const rightEdge = nextControl ? nextControl.getBoundingClientRect().left - gap : headerRect.right - 20;
    const leftEdge = logoRect ? Math.min(logoRect.right + 20, rightEdge - 180) : headerRect.left + 20;
    shell.style.setProperty('--header-search-right', `${Math.max(0, headerRect.right - rightEdge)}px`);
    shell.style.setProperty('--header-search-open-width', `${Math.max(180, rightEdge - leftEdge)}px`);
  };

  const open = () => {
    updateGeometry();
    clearTimeout(readyTimer);
    clearTimeout(closingTimer);
    header.classList.add('is-searching');
    shell.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    trigger.setAttribute('aria-label', 'Recherche ouverte');
    readyTimer = window.setTimeout(() => {
      shell.classList.add('is-ready');
      input.focus();
    }, duration);
  };

  const closeSearch = () => {
    clearTimeout(readyTimer);
    shell.classList.remove('is-ready', 'is-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-label', 'Rechercher');
    trigger.focus();
    closingTimer = window.setTimeout(() => header.classList.remove('is-searching'), duration);
  };

  trigger.addEventListener('click', () => {
    if (!shell.classList.contains('is-open')) open();
  });
  close.addEventListener('click', closeSearch);
  shell.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = input.value.trim();
    if (query) renderResults(query);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && shell.classList.contains('is-open')) closeSearch();
  });
  window.addEventListener('resize', updateGeometry);
  updateGeometry();
})();
