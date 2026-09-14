(() => {
  const excludedPages = new Set([
    'canalplus-live.html',
    'canalplus-logged-out-live.html',
    'canalplus-channels.html'
  ]);
  const pageName = window.location.pathname.split('/').pop();
  if (excludedPages.has(pageName)) return;

  const programmeSelector = [
    '.hero-row > .poster',
    '.continue-card',
    '.cinema-card',
    '.playlist-card',
    '.poster-card',
    '.series-card',
    '.related-card',
    '.hero-card',
    '.sport-card',
    '.summary-card',
    '#featured .card:not(.category-card)',
    '#top .card:not(.category-card)',
    '#essentials .card:not(.category-card)',
    '.video-card',
    '.search-result-card'
  ].join(',');

  const relatedItems = [
    ['Pour Emma', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/122584948'],
    ['Dossier 137', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/30902170/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-Je4Z'],
    ['Crimes à Cluny', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/31456130/canal-ouah_50027/STD169LT/CRIMES_A_CLUNY__MYCANAL_STD169LT-QHOD'],
    ['Sœurs et demie', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/31172242/canal-ouah_50026/STD169LT/SOEURS_ET_DEMIE__MYCANAL_STD169LT-cZjs'],
    ['Vie privée', 'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/unit/30720051/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-CnVV']
  ];

  const createModal = () => {
    const modal = document.createElement('div');
    modal.className = 'detail-modal';
    modal.id = 'programme-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'programme-modal-title');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <article class="detail-modal-panel">
        <button class="detail-close" type="button" aria-label="Fermer">×</button>
        <div class="detail-hero"></div>
        <div class="detail-copy">
          <h2 class="detail-title" id="programme-modal-title" tabindex="-1">Programme</h2>
          <div class="detail-left">
            <p class="detail-meta">Film Drame &nbsp; 2h03 &nbsp; 2025 &nbsp; 10 &nbsp; HD</p>
            <button class="detail-play" type="button">▶ &nbsp; LECTURE</button>
            <div class="detail-actions" aria-label="Actions du programme"><span>Télécharger</span><span>Playlist</span><span>Opinion</span></div>
          </div>
          <p class="detail-description">Au lendemain de la Seconde Guerre mondiale, un jeune ingénieur polonais réfugié en France et un gangster s'associent pour fabriquer de faux billets.<span class="credits">De : <a href="https://www.canalplus.com/personne/jean-paul-salome/6742">Jean-Paul Salomé</a><br>Avec : <a href="https://www.canalplus.com/personne/reda-kateb/6781">Reda Kateb</a>, <a href="https://www.canalplus.com/personne/sara-giraudeau/74894">Sara Giraudeau</a>, <a href="https://www.canalplus.com/personne/bastien-bouillon/72760">Bastien Bouillon</a><br>Pays : France</span></p>
        </div>
        <nav class="detail-tabs" aria-label="Détails du programme"><span class="active">À VOIR AUSSI</span><span>BONUS</span><span>BANDES-ANNONCES</span><span>ACHETER</span><span>PLUS D’INFOS</span></nav>
        <section class="detail-related" aria-labelledby="programme-related-title">
          <h3 id="programme-related-title">À voir aussi</h3>
          <div class="related-rail"></div>
        </section>
      </article>`;
    const rail = modal.querySelector('.related-rail');
    relatedItems.forEach(([title, src]) => {
      const link = document.createElement('a');
      link.className = 'related-card';
      link.href = '#';
      link.dataset.programmeTitle = title;
      link.dataset.programmeImage = src;
      link.setAttribute('aria-label', `Voir ${title}`);
      link.innerHTML = `<img src="${src}" alt="${title}" loading="lazy">`;
      rail.append(link);
    });
    document.body.append(modal);
    return modal;
  };

  const modal = document.querySelector('.detail-modal') || createModal();
  modal.id = 'programme-modal';
  modal.setAttribute('aria-labelledby', 'programme-modal-title');
  modal.setAttribute('aria-hidden', 'true');
  const titleElement = modal.querySelector('.detail-title');
  const hero = modal.querySelector('.detail-hero');
  const closeButton = modal.querySelector('.detail-close');
  titleElement.id = 'programme-modal-title';
  titleElement.tabIndex = -1;

  let opener = null;
  let inertElements = [];

  const getTitle = (card) => {
    const explicitTitle = card.dataset.programmeTitle;
    const visibleTitle = card.querySelector('.card-title, .title, .sport-card-title, .live-title, strong')?.textContent;
    const imageTitle = [...card.querySelectorAll('img')].find((image) => image.alt && !image.matches('.channel-logo, .vod-channel'))?.alt;
    const accessibleTitle = card.getAttribute('aria-label')?.replace(/^Voir\s+(?:le programme\s+|le film\s+)?/i, '');
    return (explicitTitle || visibleTitle || imageTitle || accessibleTitle || 'Programme').trim();
  };

  const backgroundUrl = (element) => {
    if (!element) return '';
    const backgroundImage = getComputedStyle(element).backgroundImage;
    const quotedMatch = backgroundImage.match(/url\((["'])(.*)\1\)/);
    if (quotedMatch) return quotedMatch[2];
    return backgroundImage.match(/url\((.*)\)/)?.[1] || '';
  };

  const getImage = (card) => {
    if (card.dataset.programmeImage) return card.dataset.programmeImage;
    const image = [...card.querySelectorAll('img')].find((item) => !item.matches('.channel-logo, .vod-channel'));
    if (image) return image.currentSrc || image.src;
    return backgroundUrl(card) || backgroundUrl(card.querySelector('.continue-image, .sport-poster'));
  };

  const setBackgroundInert = (inert) => {
    if (inert) {
      inertElements = [...document.body.children].filter((element) => element !== modal && !element.matches('script'));
      inertElements.forEach((element) => { element.inert = true; });
      return;
    }
    inertElements.forEach((element) => { element.inert = false; });
    inertElements = [];
  };

  const open = (card) => {
    const wasOpen = modal.classList.contains('is-open');
    if (!wasOpen) opener = card;
    titleElement.textContent = getTitle(card);
    const image = getImage(card);
    hero.style.backgroundImage = image ? `linear-gradient(0deg, #181818 0%, transparent 52%), url("${image.replaceAll('"', '%22')}")` : '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (!wasOpen) setBackgroundInert(true);
    titleElement.focus();
  };

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setBackgroundInert(false);
    opener?.focus();
    opener = null;
  };

  document.querySelectorAll('.video-card').forEach((card) => {
    if (!card.hasAttribute('tabindex')) card.tabIndex = 0;
    if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
  });

  document.addEventListener('click', (event) => {
    const card = event.target.closest(programmeSelector);
    if (!card || card.matches('.category-card') || card.closest('.chips, .channel-grid, .program-grid, .grid')) return;
    event.preventDefault();
    open(card);
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) {
      const card = event.target.closest?.('.video-card');
      if (card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        open(card);
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, true);

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.closest('.detail-close')) {
      event.preventDefault();
      close();
    }
  }, true);

  closeButton.addEventListener('click', (event) => event.preventDefault());
})();
