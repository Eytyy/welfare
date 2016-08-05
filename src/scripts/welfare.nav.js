welfare.nav = (() => {
  const configMap = {
    template: function() {
      const mapNav = document.createElement('nav');
      mapNav.classList.add('map__nav');
      mapNav.id = 'map_nav';
      return mapNav;
    },
  };
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

  const setNavMap = (layers) => {
    Object.keys(layers).forEach(key => {
      const obj = {};
      obj.populate = false;
      obj.parentEL = document.querySelector(`.map__nav__item--${key}`);
      obj.data = null;
      navMap[key] = obj;
    });
  };

  const setMainNav = (layers) => {
    const frag = document.createDocumentFragment();

    Object.keys(layers).forEach(key => {
      const item = layers[key];
      const mapNavItemWrapper = document.createElement('div');
      const mapNavItem = document.createElement('a');
      const mapNavItemIcon = document.createElement('i');
      const mapNavItemTitle = document.createElement('span');

      mapNavItemWrapper.classList.add('map__nav__item-wrapper', `map__nav__item-wrapper--${key}`);

      mapNavItem.classList.add(
        'map__nav__item',
        'map__nav__item--layer',
        `map__nav__item--${item.name}`
      );

      mapNavItemIcon.classList.add('map__nav__item__icon');
      mapNavItemTitle.innerHTML = `${item.title}`;
      mapNavItemTitle.classList.add('map__nav__item__name');
      mapNavItem.href = `#${item.name}`;

      mapNavItem.appendChild(mapNavItemIcon);
      mapNavItem.appendChild(mapNavItemTitle);
      mapNavItemWrapper.appendChild(mapNavItem);

      frag.appendChild(mapNavItemWrapper);
    });
    domMap.$nav.appendChild(frag);
    domMap.$navItemWrapper = document.querySelectorAll('.map__nav__item-wrapper');
    domMap.$navItem = document.querySelectorAll('.map__nav__item--layer');
  };

  const removeDuplicates = data => {
    const obj = {};
    for (const el of data) {
      const item = el.getProperty('RelatedEnglishTitle');
      if (obj[item]) continue;
      obj[item] = el;
    }
    filtered[stateMap.activeLayer] = obj;
    return obj;
  };

  const setLayerNav = layer => {
    const data = layer;
    const navWrapper = document.createElement('div');
    const navFrag = document.createDocumentFragment();
    let filteredData;

    const buildNodes = (project, idx) => {
      // NOTE: some entries don't have coordinates, clean json export
      if (project.getGeometry().getAt(0) === undefined) {
        console.log(project.getProperty('RelatedEnglishTitle'), '[Coordinates are missing].');
        return undefined;
      }

      // Construct the navigation item DOM element
      const navItem = document.createElement('span');
      const navItemTitleWrapper = document.createElement('span');
      const navItemTitle = document.createTextNode(idx);

      navItem.classList.add('map__nav__item', 'map__nav__item--project');
      navItem.dataset.target = idx;
      navItemTitleWrapper.classList.add('map__nav__item__title');
      navItemTitleWrapper.appendChild(navItemTitle);
      navItem.appendChild(navItemTitleWrapper);

      // Return the navigation item element
      return navItem;
    };

    // filter duplicates
    if (!filtered[stateMap.activeLayer]) {
      filteredData = removeDuplicates(data);
    }

    Object.keys(filteredData).forEach(key => {
      // use project name as the project id, this will be used as the data target
      // attribute value for the link, and the property for the project in the project's
      // map object
      const projectId = filteredData[key].getProperty('RelatedEnglishTitle');

      // Build the projects navigation item
      const navItem = buildNodes(filteredData[key], projectId);
      if (navItem) {
        navFrag.appendChild(navItem);
      }
    });

    navWrapper.classList.add('map__nav__item__inner');
    navWrapper.appendChild(navFrag);
    document.querySelector(`.map__nav__item-wrapper--${stateMap.activeLayer}`)
      .appendChild(navWrapper);
  };

  const updateMainNav = () => {
    const data = navMap[stateMap.activeLayer].data;
    const populated = navMap[stateMap.activeLayer].populated;
    const activeEl = document.querySelector(`.map__nav__item-wrapper--${stateMap.activeLayer}`);
    console.log(populated);
    if (!populated && data) {
      setLayerNav(data);
      navMap[stateMap.activeLayer].populated = true;
    }
    for (const item of domMap.$navItemWrapper) {
      item.classList.remove('active');
    }
    const isLayerActive = welfare.map.isLayerVisible(stateMap.activeLayer);
    if (stateMap.activeLayer !== stateMap.previousLayer ||
      (stateMap.activeLayer === stateMap.previousLayer && isLayerActive)) {
      activeEl.classList.add('active');
    }
  };

  const updateLocalLayerState = event => {
    stateMap.activeLayer = event.detail.activeLayer;
    stateMap.previousLayer = event.detail.previousLayer;
  };

  const onUpdateProject = event => {
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


      const item = filtered[stateMap.activeLayer][el.dataset.target];
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
    $container.appendChild(configMap.template());
    setDOMmap();

    // Listen to layer state updates
    document.addEventListener('layerStateUpdate', event => {
      updateLocalLayerState(event);
      if (navMap[stateMap.activeLayer].data) {
        console.log('update');
        updateMainNav();
      }
    });

    document.addEventListener('initLayerState', event => {
      updateLocalLayerState(event);
    });

    // Build layers navigation
    setMainNav(layerObj);
    setNavMap(layerObj);

    // Listen to data updates
    document.addEventListener('dataUpdate', event => {
      navMap[stateMap.activeLayer].data = event.detail.data;
      updateMainNav();
    });

    document.addEventListener('updateProject', onUpdateProject);

    domMap.$nav.addEventListener('click', onLayerLinkClick, false);
  };

  return {
    initModule,
  };
})();
