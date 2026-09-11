(() => {
  const searchIcon = document.querySelector('.search');
  if (searchIcon && searchIcon.tagName.toLowerCase() !== 'button') {
    const searchButton = document.createElement('button');
    searchButton.className = 'search';
    searchButton.type = 'button';
    searchButton.setAttribute('aria-label', 'Rechercher');
    searchButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true" class="size-dt-size-24 text-dt-button-icon-icon-ghost-tertiary-default group-hover:text-dt-button-icon-icon-ghost-tertiary-hover group-active:text-dt-button-icon-icon-ghost-tertiary-active"><path fill="currentColor" fill-rule="evenodd" d="M17.762 14.07a5.52 5.52 0 0 0-3.917 1.622 5.539 5.539 0 1 0 3.917-1.623m1.821-9.653A8.2 8.2 0 0 0 13.75 2a8.2 8.2 0 0 0-5.834 2.417 8.2 8.2 0 0 0-2.417 5.835 8.2 8.2 0 0 0 1.527 4.78l-4.623 4.624a1.372 1.372 0 0 0 1.94 1.941l4.625-4.623a8.2 8.2 0 0 0 4.78 1.526 8.2 8.2 0 0 0 5.836-2.415A8.2 8.2 0 0 0 22 10.25a8.2 8.2 0 0 0-2.417-5.834" clip-rule="evenodd"></path><path fill="currentColor" fill-rule="evenodd" d="M17.762 14.07a5.52 5.52 0 0 0-3.917 1.622 5.539 5.539 0 1 0 3.917-1.623m1.821-9.653A8.2 8.2 0 0 0 13.75 2a8.2 8.2 0 0 0-5.834 2.417 8.2 8.2 0 0 0-2.417 5.835 8.2 8.2 0 0 0 1.527 4.78l-4.623 4.624a1.372 1.372 0 0 0 1.94 1.941l4.625-4.623a8.2 8.2 0 0 0 4.78 1.526 8.2 8.2 0 0 0 5.836-2.415A8.2 8.2 0 0 0 22 10.25a8.2 8.2 0 0 0-2.417-5.834" clip-rule="evenodd"></path></svg>';
    searchIcon.replaceWith(searchButton);
  }
  const avatarIcon = document.querySelector('.avatar');
  if (avatarIcon && avatarIcon.tagName.toLowerCase() !== 'button') {
    const avatarButton = document.createElement('button');
    avatarButton.className = 'avatar';
    avatarButton.type = 'button';
    avatarButton.setAttribute('aria-label', 'Ouvrir le menu utilisateur');
    avatarButton.setAttribute('aria-expanded', 'false');
    avatarButton.setAttribute('aria-controls', 'user-menu');
    for (const attribute of avatarIcon.attributes) {
      if (attribute.name !== 'class' && attribute.name !== 'aria-label') avatarButton.setAttribute(attribute.name, attribute.value);
    }
    avatarIcon.replaceWith(avatarButton);
  }
  if (document.querySelector('#user-menu')) return;
  const avatar = document.querySelector('.avatar');
  if (!avatar) return;
  const style = document.createElement('style');
  style.textContent = '.shared-user-menu{position:absolute;z-index:30;top:calc(100% + 12px);right:26px;width:320px;max-height:calc(100vh - 76px);display:none;overflow:auto;border-radius:12px;background:#181818;color:#fff;box-shadow:0 14px 32px #0008;font-family:Hind,Arial,sans-serif}.shared-user-menu.is-open{display:block}.shared-user-menu .profile-rail{display:flex;gap:16px;overflow:hidden;padding:28px 24px 0}.shared-user-menu .profile-card{flex:0 0 76px;padding:0;border:0;background:none;color:#fff;font:400 16px/24px Hind,Arial,sans-serif;text-align:center;cursor:pointer}.shared-user-menu .profile-avatar{display:block;width:76px;height:76px;margin-bottom:4px;border-radius:50%;background-image:url("./profile-avatars-v1.png");background-size:228px 76px;background-position:0 0}.shared-user-menu .profile-card:nth-child(2) .profile-avatar{background-position:-76px 0}.shared-user-menu .profile-card:nth-child(3) .profile-avatar{background-position:-152px 0}.shared-user-menu .manage-profiles{display:block;width:max-content;margin:12px auto 24px;color:#e91c4e;font:600 18px/22px Hind,Arial,sans-serif;text-decoration:none}.shared-user-menu .menu-divider{height:1px;background:#292929}.shared-user-menu .menu-links{display:grid;gap:4px;padding:28px 24px 20px}.shared-user-menu .menu-link{display:flex;align-items:center;gap:14px;color:#fff;font:400 16px/26px Hind,Arial,sans-serif;text-decoration:none}.shared-user-menu .menu-icon{width:26px;height:26px;display:grid;place-items:center;flex:none;border-radius:3px;background:#c3d4df;color:#fff;font:700 16px/1 Arial,sans-serif}.shared-user-menu .menu-link:nth-child(1) .menu-icon,.shared-user-menu .menu-link:nth-child(2) .menu-icon{background:#2ec2db}.shared-user-menu .menu-link:nth-child(3) .menu-icon{background:#ffb900}.shared-user-menu .logout{display:block;width:272px;height:50px;margin:0 auto 16px;border:0;border-radius:6px;background:#272727;color:#fff;font:600 18px/24px Hind,Arial,sans-serif;cursor:pointer}.shared-user-menu :is(a,button):focus-visible{outline:2px solid #fff;outline-offset:3px}@media(max-width:850px){.shared-user-menu{right:12px}}';
  document.head.append(style);
  avatar.setAttribute('aria-expanded', 'false');
  avatar.setAttribute('aria-label', 'Ouvrir le menu utilisateur');
  const menu = document.createElement('aside');
  menu.className = 'shared-user-menu';
  menu.setAttribute('aria-label', 'Menu utilisateur');
  menu.innerHTML = '<div class="profile-rail"><button class="profile-card" type="button"><span class="profile-avatar" aria-hidden="true"></span>Amé</button><button class="profile-card" type="button"><span class="profile-avatar" aria-hidden="true"></span>Profil 2</button><button class="profile-card" type="button"><span class="profile-avatar" aria-hidden="true"></span>Les enfants</button></div><a class="manage-profiles" href="#">Gérer les profils</a><div class="menu-divider"></div><nav class="menu-links" aria-label="Services du compte"><a class="menu-link" href="./canalplus-account.html"><span class="menu-icon">●</span>Mon compte</a><a class="menu-link" href="#"><span class="menu-icon">⌂</span>Espace client</a><a class="menu-link" href="#"><span class="menu-icon">▰</span>CANAL+ LE CLUB</a><a class="menu-link" href="#"><span class="menu-icon">?</span>Assistance</a><a class="menu-link" href="#"><span class="menu-icon">☀</span>Astuces</a><a class="menu-link" href="#"><span class="menu-icon">♧</span>CANAL+ Responsable</a><a class="menu-link" href="./canalplus-settings.html"><span class="menu-icon">⚙</span>Réglages</a></nav><button class="logout" type="button">Se déconnecter</button>';
  const header = avatar.closest('header');
  header.style.position = 'relative';
  header.append(menu);
  const setOpen = (open) => { menu.classList.toggle('is-open', open); avatar.setAttribute('aria-expanded', String(open)); avatar.setAttribute('aria-label', open ? 'Fermer le menu utilisateur' : 'Ouvrir le menu utilisateur'); };
  avatar.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  avatar.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); avatar.click(); } });
  document.addEventListener('pointerdown', (event) => { if (menu.classList.contains('is-open') && !menu.contains(event.target) && !avatar.contains(event.target)) setOpen(false); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
  menu.querySelector('.logout').addEventListener('click', () => window.location.assign('./canalplus-home-improved.html'));
})();
