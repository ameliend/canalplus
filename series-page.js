(() => {
  const logos = {
    canal: 'https://thumb.canalplus.pro/http/unsafe/48x36/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/68603655',
    apple: 'https://thumb.canalplus.pro/http/unsafe/48x36/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/channel/50696/canal-ouah/CHN43FN/CHN43FN_50696_20251103-TQAq',
    hbo: 'https://thumb.canalplus.pro/http/unsafe/48x36/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/channel/50889/canal-ouah/CHN43FN/CHN43FN_50889_20250713-Zbk4',
    netflix: 'https://thumb.canalplus.pro/http/unsafe/fit-in/48x36/img-hapi.canalplus.pro:80/ServiceImage/ImageID/92926350',
    paramount: 'https://thumb.canalplus.pro/http/unsafe/48x36/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/channel/50662/canal-ouah/CHN43FN/CHN43FN_50662_20221013',
    polar: 'https://thumb.canalplus.pro/http/unsafe/48x36/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/68304628',
    france2: 'https://thumb.canalplus.pro/http/unsafe/48x36/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/channel/50026/canal-ouah/CHN43FN/CHN43FN_50026_20250603-e3zW'
  };

  const featured = [
    ['Has Fallen','https://thumb.canalplus.pro/http/unsafe/460x259/filters:quality(55):catchline_canal(Nouvelle%20saison%20%C2%A7%C2%A7Un%20nouvel%20%C3%A9pisode%20chaque%20lundi,WHITE,16:9):watermark(canalplus-cdn.canal-plus.io/p1/editoLabelTag/-localized0/canal-ouah/STD169FN/myCANAL_16x9_Logotype_MEA_Label_1920x1080-XDek,0,0,0,100,100)/canalplus-cdn.canal-plus.io/p1/brand/26153428/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-3G2E','canal'],
    ['The Agency','https://thumb.canalplus.pro/http/unsafe/460x259/filters:quality(55):catchline_canal(SAISON%202%C2%A7%C2%A7En%20int%C3%A9gralit%C3%A9,WHITE,16:9):watermark(canalplus-cdn.canal-plus.io/p1/editoLabelTag/-localized0/canal-ouah/STD169FN/myCANAL_16x9_Logotype_Info_MEA_1920x1080_Une_serie_Canal_Blanc-SQSx,0,0,0,100,100)/canalplus-cdn.canal-plus.io/p1/brand/28538818/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-zFb0','canal'],
    ['The Gentlemen - Saison 2','https://thumb.canalplus.pro/bran/unsafe/460x259/filters:quality(55)/image/6a984c275a172/uploads/media/myCANAL_16x9_Logotype_MEA_1920x1080.jpg','netflix'],
    ['Portée disparue','https://thumb.canalplus.pro/http/unsafe/460x259/filters:quality(55):catchline_canal(Un%20nouvel%20%C3%A9pisode%C2%A7%C2%A7chaque%20mercredi,WHITE,16:9)/media.prod.hawc.canal.aws.io-cplus.net/3a45f93189c1b03a24c0890184ec293d.jpg','apple'],
    ['Gomorra : les origines','https://thumb.canalplus.pro/http/unsafe/460x259/filters:quality(55):catchline_canal(EN%20INT%C3%89GRALIT%C3%89,WHITE,16:9):watermark(canalplus-cdn.canal-plus.io/p1/editoLabelTag/-localized0/canal-ouah/STD169FN/myCANAL_16x9_Logotype_Info_MEA_1920x1080_Une_serie_Canal_Blanc-SQSx,0,0,0,100,100)/canalplus-cdn.canal-plus.io/p1/brand/31696227/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-2SCV','canal'],
    ['Watson','https://thumb.canalplus.pro/http/unsafe/460x259/filters:quality(55):catchline_canal(SAISON%202,WHITE,16:9)/canalplus-cdn.canal-plus.io/p1/brand/30121178/canal-ouah_50662/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-TKna','paramount'],
    ['Hildur','https://thumb.canalplus.pro/http/unsafe/460x259/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/32144018/canal-ouah/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-AzFh','polar'],
    ["La mère et l'assassin",'https://thumb.canalplus.pro/http/unsafe/460x259/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/31985360/canal-ouah_50026/STD169LT/LA_MERE_ET_L_ASSASSIN__MYCANAL_STD169LT-9Nfh','france2'],
    ['Lioness','https://thumb.canalplus.pro/http/unsafe/460x259/filters:quality(55):catchline_canal(SAISON%203%C2%A7%C2%A7Nouvel%20%C3%A9pisode%20chaque%20dimanche,WHITE,16:9)/canalplus-cdn.canal-plus.io/p1/brand/22392067/canal-ouah_50662/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-Ue0q','paramount'],
    ['Dark Matter','https://thumb.canalplus.pro/http/unsafe/460x259/filters:quality(55):catchline_canal(SAISON%202%C2%A7%C2%A7Nouvel%20%C3%A9pisode%20chaque%20vendredi,WHITE,16:9)/canalplus-cdn.canal-plus.io/p1/brand/40330121/canal-ouah_50696/STD169LT/Canal_Plus-DRNG2_Dark_Matter_S2-Scifi_WorldsCanalSTD169LT1920x1080-T7WH','apple'],
    ['Silo','https://thumb.canalplus.pro/http/unsafe/460x259/filters:quality(55):catchline_canal(SAISON%203%C2%A7%C2%A7En%20int%C3%A9gralit%C3%A9,WHITE,16:9)/media.prod.hawc.canal.aws.io-cplus.net/3ff23ae8be9f7a984cc54101ec81bec9.jpg','apple']
  ];

  const categories = [
    ['Toutes les séries','https://thumb.canalplus.pro/http/unsafe/137x103/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/93733341'],
    ['Pour vous','https://thumb.canalplus.pro/bran/unsafe/137x103/filters:quality(55)/image/6a59faaa0aca2/uploads/media/TUILES_4x3_1440x1080_pour_vous.serie.jpg'],
    ['Les séries de CANAL+','https://thumb.canalplus.pro/http/unsafe/137x103/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/list/creplay-them-series-series-canal/canal-ouah/STD/MicrosoftTeams-image'],
    ['Création originale','https://thumb.canalplus.pro/http/unsafe/137x103/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/list/creplay-them-series-creation-originale-series/canal-ouah/STD/MicrosoftTeams-image'],
    ['Policier','https://thumb.canalplus.pro/bran/unsafe/137x103/filters:quality(55)/image/66f67332e83fd/uploads/media/9_POLICIER_SERIES.png'],
    ['Drame','https://thumb.canalplus.pro/http/unsafe/137x103/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/93733776'],
    ['Humour','https://thumb.canalplus.pro/http/unsafe/137x103/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/93733774'],
    ['Fantastique','https://thumb.canalplus.pro/http/unsafe/137x103/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/93733793'],
    ['Amour','https://thumb.canalplus.pro/bran/unsafe/137x103/filters:quality(55)/image/65eecd680411d/uploads/media/TUILES_4x3_1440x1080.jpg'],
    ['Action-Aventure','https://thumb.canalplus.pro/http/unsafe/137x103/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/93733712'],
    ['Formats courts','https://thumb.canalplus.pro/http/unsafe/137x103/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/list/creplay-them-series-formats-courts/canal-ouah/STD/MicrosoftTeams-image1'],
    ['Animation','https://thumb.canalplus.pro/http/unsafe/137x103/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/94768399']
  ];

  const continuing = [
    ['Fleur bleue - Saison 1','Episode 1 : Fleur & le mec patri...','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/24117862/canal-ouah/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-swxA',59,'canal'],
    ['Ted Lasso - Saison 4','Episode 1 : Chez soi','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/media.prod.hawc.canal.aws.io-cplus.net/de15f6895dbf90b21809fdd7ac0a5c67.jpg',0,'apple'],
    ['Euphoria - Saison 3',"Episode 7 : Qu'il pleuve ou qu'i...",'https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/40421764/canal-ouah/STD169LT/SCRID-ShowSCRID_SNorProgramSCRID__TitleHereS__1920x1080_LAN-en-US_PUR-tileburnedin-z1kr',48,'hbo'],
    ['Les frères Scott - Saison 1','Episode 9 : Services rendus','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/media.prod.hawc.canal.aws.io-cplus.net/fd05e299e19e126f41174c060b1d6b0f.jpg',87,'hbo'],
    ['Les Sentinelles - Saison 1','Episode 2','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/29582022/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-aDhR',37,'canal'],
    ['Possessions - Saison 1','Episode 5 : Love and Other Demons','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/109718704',82,'canal'],
    ['Paris Police 1900 - Saison 1','Episode 2','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/110174021',1,'canal'],
    ['Pamela Rose, la série - Saison 1','Episode 4','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/23124540/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-iusA',8,'canal'],
    ['La Flamme - Saison 1','Episode 3','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/110174503',1,'canal'],
    ['Les Gouttes de Dieu - Saison 2','Episode 2 : La Quête','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/media.prod.hawc.canal.aws.io-cplus.net/0bbd956d89f1960e29fe53b06ccc7d88.jpg',0,'apple'],
    ['Dexter - Saison 4','Episode 5 : Inspecteur Harry','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/118984960',61,'paramount'],
    ['Yellowjackets - Saison 1','Episode 9 : Apocalypse','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/18138310/canal-ouah_50001/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-IzY_',88,'paramount'],
    ['Les frères Scott','Saison 6','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/img-hapi.canalplus.pro:80/ServiceImage/ImageID/114137905',0,'hbo'],
    ['Dexter : Les Origines - Saison 1','Episode 3 : Deux flics à Miami','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/27664830/canal-ouah/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-AqEA',0,'paramount'],
    ['Broute 24','Episode 4 : Coach en séduction','https://thumb.canalplus.pro/http/unsafe/254x143/filters:quality(55)/canalplus-cdn.canal-plus.io/p1/brand/24658625/canal-ouah/STD169LT/myCANAL_16x9_Logotype_MEA_1920x1080-ERGH',45,'canal']
  ];

  const featuredRail = document.querySelector('#series-featured');
  featured.forEach(([title,image,provider],index) => {
    const card = document.createElement('a');
    card.className = 'series-card series-feature-card';
    card.href = '#';
    card.dataset.programmeTitle = title;
    card.dataset.programmeImage = image;
    card.setAttribute('aria-label', `Voir ${title}`);
    card.innerHTML = `<img src="${image}" alt="" ${index < 4 ? '' : 'loading="lazy"'}><img class="channel-logo" src="${logos[provider]}" alt="">`;
    featuredRail.append(card);
  });

  const categoriesRail = document.querySelector('#series-categories');
  categories.forEach(([title,image]) => {
    const card = document.createElement('a');
    card.className = 'series-category-card category-card';
    card.href = '#';
    card.setAttribute('aria-label', title);
    card.innerHTML = `<img src="${image}" alt="" loading="lazy">`;
    categoriesRail.append(card);
  });

  const continueRail = document.querySelector('#series-continue');
  continuing.forEach(([title,meta,image,progress,provider]) => {
    const card = document.createElement('article');
    card.className = 'series-card series-continue-card';
    card.dataset.programmeTitle = title;
    card.dataset.programmeImage = image;
    card.innerHTML = `<div class="series-continue-media"><img src="${image}" alt="" loading="lazy"><img class="channel-logo" src="${logos[provider]}" alt=""><button class="series-open" type="button" aria-label="Voir ${title}"></button><button class="series-remove" type="button" aria-label="Retirer ${title}">×</button>${progress ? `<span class="series-progress" role="progressbar" aria-label="Progression de ${title}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progress}" style="--progress:${progress}%"></span>` : ''}</div><span class="series-card-title">${title}</span><span class="series-card-meta">${meta}</span>`;
    continueRail.append(card);
  });

  document.querySelectorAll('.series-arrow').forEach((button) => {
    button.addEventListener('click', () => button.previousElementSibling.scrollBy({ left: 3 * 280, behavior: 'smooth' }));
  });
  document.addEventListener('click', (event) => {
    const remove = event.target.closest('.series-remove');
    if (remove) {
      event.preventDefault();
      event.stopPropagation();
      remove.closest('.series-continue-card').remove();
      return;
    }
    if (event.target.closest('.series-category-card')) event.preventDefault();
  });
})();
