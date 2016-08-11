welfare.nav = (() => {
  const configMap = {};
  const stateMap = {
    $container: null,
    activeLayer: null,
    previousLayer: null,
    activeProject: null,
  };
  let domMap = {};

  const navMap = {};

  const filtered = {};

  const setDOMmap = () => {
    const $nav = document.querySelector('#map_nav');
    domMap = {
      $nav,
    };
  };

  const setNavMap = layers => {
    Object.keys(layers).forEach(key => {
      const obj = {};
      obj.populate = false;
      obj.parentEL = document.querySelector(`.map__nav__item--${key}`);
      obj.data = null;
      navMap[key] = obj;
    });
  };

  const setMainNav = layers => {
    const tpl = Handlebars.templates['nav.tpl.hbs'](layers);

    stateMap.$container.insertAdjacentHTML('beforeend', tpl);

    domMap.$navItemWrapper = document.querySelectorAll('.map__nav__item-wrapper');
    domMap.$navItem = document.querySelectorAll('.map__nav__item--layer');
  };

  const setLayerNav = layer => {
    let filteredData;
    const data = layer;
    const navWrapper = document.createElement('div');
    navWrapper.classList.add('map__nav__item__inner');

    // Function to remove duplicates from data object
    const removeDuplicates = () => {
      const obj = {};
      for (const el of data) {
        const category = el.getProperty('CatAName');
        const item = el.getProperty('RelatedEnglishTitle');

        if (!obj[category]) {
          obj[category] = {};
        }
        if (!obj[category][item]) {
          obj[category][item] = el;
        }
      }
      filtered[stateMap.activeLayer] = obj;
      return obj;
    };

    const buildNode = (catName, catData) => {
      const $catWrapper = document.createElement('div');
      $catWrapper.classList.add('map__nav__item--category', `map__nav__item--category--${catName}`);
      const $iconWrapper = Handlebars.templates['nav-cat.tpl.hbs']({ title: catName });
      $catWrapper.insertAdjacentHTML('beforeend', $iconWrapper);

      Object.keys(catData).forEach(key => {
        if (catData[key].getGeometry().getAt(0)) {
          const id = catData[key].getProperty('RelatedEnglishTitle');
          const item = Handlebars.templates['nav-layer.tpl.hbs']({ title: id, cat: catName });
          $catWrapper.insertAdjacentHTML('beforeend', item);
        } else {
          console.log('no geometry');
        }
      });
      return $catWrapper;
    };

    // filter duplicates
    if (!filtered[stateMap.activeLayer]) {
      filteredData = removeDuplicates();
    }

    // Loop through data to add an element/link for each project
    // in the layer navigation
    Object.keys(filteredData).forEach(key => {
      // Build the projects' navigation item
      const navGroup = buildNode(key, filteredData[key]);
      navWrapper.appendChild(navGroup);
    });

    document.querySelector(`.map__nav__item-wrapper--${stateMap.activeLayer}`)
      .appendChild(navWrapper);
  };

  // Updates The Main Navigation Items of first Level
  // ex: our projects, public buidlings ..etc
  const updateMainNav = () => {
    const data = navMap[stateMap.activeLayer].data;
    const populated = navMap[stateMap.activeLayer].populated;
    const activeEl = document.querySelector(`.map__nav__item-wrapper--${stateMap.activeLayer}`);

    // If layer has data and the navigation is not populated with layer links
    if (!populated && data) {
      // Set Layer navigation to populate the navigation
      setLayerNav(data);
      navMap[stateMap.activeLayer].populated = true;
    }
    // Remove active class from main navigation items
    for (const item of domMap.$navItemWrapper) {
      item.classList.remove('active');
    }
    // Check if the map layer is visible
    const isLayerActive = welfare.map.isLayerVisible(stateMap.activeLayer);
    // if active and previous layers are not the same; it's a new layer that we want to show
    // if active and previous layers are the same and the layer is visible it means we are just
    // toggling visibility of layer
    if (stateMap.activeLayer !== stateMap.previousLayer ||
      (stateMap.activeLayer === stateMap.previousLayer && isLayerActive)) {
      activeEl.classList.add('active');
    }
  };

  const updateLocalLayerState = event => {
    stateMap.activeLayer = event.detail.activeLayer;
    stateMap.previousLayer = event.detail.previousLayer;
  };

  const toggleLayerLinks = event => {
    if (event.type === 'layerStateUpdate') {
      if (stateMap.activeProject) {
        stateMap.activeProject.classList.remove('active');
      }
      return;
    }

    const project = event.detail.project.feature.getProperty('RelatedEnglishTitle');
    if (stateMap.activeProject) {
      stateMap.activeProject.classList.remove('active');
    }
    stateMap.activeProject = document.querySelector(`[data-target="${project}"]`);
    stateMap.activeProject.classList.add('active');
  };

  const onLayerLinkClick = event => {
    if (event.target.className === 'map__nav__item__icon' ||
      event.target.className === 'map__nav__item__name' ||
      event.target.classList.contains('map__nav__item--layer')) {
      return false;
    }

    if (event.currentTarget !== event.target) {
      const el = event.target.classList.contains('map__nav__item--project') ?
        event.target :
        event.target.parentNode;

      if (el.classList.contains('active')) {
        // el.classList.remove('active');
        // stateMap.$container.classList.remove('js-view-mode');
        // return true;
      }
      const item = filtered[stateMap.activeLayer][el.dataset.cat][el.dataset.target];
      const latLngs = item.getGeometry().getAt(0).getAt(0);

      // Defined an object for the google.maps.MouseEvent parameter
      const mev = {
        stop: null,
        latLng: latLngs,
        feature: item,
      };

      // Then trigger the click event and pass the previously constructed parameter
      const dataLayer = welfare.map.getDataLayer();
      google.maps.event.trigger(dataLayer, 'click', mev);
    }
    event.stopPropagation();
    return true;
  };

  const initModule = ($container, layerObj) => {
    stateMap.$container = $container;

    // Listen to layer state updates
    document.addEventListener('layerStateUpdate', event => {
      updateLocalLayerState(event);
      if (navMap[stateMap.activeLayer].data) {
        updateMainNav();
      }
    });

    document.addEventListener('initLayerState', event => {
      updateLocalLayerState(event);
    });

    // Build layers navigation
    setMainNav(layerObj);
    setNavMap(layerObj);
    domMap.$nav = document.querySelector('.map__nav');

    // Listen to data updates
    document.addEventListener('dataUpdate', event => {
      navMap[stateMap.activeLayer].data = event.detail.data;
      updateMainNav();
    });

    document.addEventListener('updateProject', toggleLayerLinks);
    document.addEventListener('layerStateUpdate', toggleLayerLinks);

    domMap.$nav.addEventListener('click', onLayerLinkClick, false);
  };

  return {
    initModule,
  };
})();
