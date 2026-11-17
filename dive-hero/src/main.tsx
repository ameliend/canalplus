import { createRoot } from 'react-dom/client';
import HeroBillboardCarousel, { type HeroSlide } from './app/components/HeroBillboardCarousel';
import channelLogo from './imports/ChannelsCentered.svg';
import programmes from './slides.json';

const host = document.getElementById('dive-hero');
if (host) {
  const shadow = host.attachShadow({ mode: 'open' });
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('./hero.css', import.meta.url).href;
  const mount = document.createElement('div');
  shadow.append(stylesheet, mount);
  const slides: HeroSlide[] = programmes.map(programme => ({ ...programme, channelLogo }));
  const openProgramme = (slide: HeroSlide) => {
    const trigger = shadow.activeElement instanceof HTMLElement ? shadow.activeElement : host;
    // Bridge to the existing programme dialog, preserving the actual focus origin.
    const card = document.createElement('button');
    card.dataset.programmeTitle = slide.title;
    card.dataset.programmeImage = slide.backgroundImage || slide.tileImage;
    document.dispatchEvent(new CustomEvent('amak:open-programme', { detail: { card, trigger } }));
  };
  createRoot(mount).render(<HeroBillboardCarousel slides={slides} onSelect={openProgramme} />);
}
