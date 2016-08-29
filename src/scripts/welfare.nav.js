welfare.nav = (() => {
  const stateMap = {
    $container: null,
    activeLayer: null,
    previousLayer: null,
    activeProject: null,
    lastActiveCategory: null,
  };
  const domMap = {};

  const navMap = {};

  const filtered = {};

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
      const $catInner = document.createElement('div');
      const $iconWrapper = Handlebars.templates['nav-cat.tpl.hbs']({ title: catName });

      $catWrapper.classList.add('map__nav__item--category', `map__nav__item--category--${catName}`);
      $catInner.classList.add('category__inner');

      $catWrapper.insertAdjacentHTML('beforeend', $iconWrapper);
      $catWrapper.appendChild($catInner);

      Object.keys(catData).forEach(key => {
        if (catData[key].getGeometry().getAt(0)) {
          const id = catData[key].getProperty('RelatedEnglishTitle');
          const item = Handlebars.templates['nav-layer.tpl.hbs']({ title: id, cat: catName });
          $catInner.insertAdjacentHTML('beforeend', item);
        }
        else { console.log('no geometry'); }
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
      item.classList.remove('js-active');
      domMap.$nav.classList.remove('js-layerIsOpened');
    }
    // Check if the map layer is visible
    const isLayerActive = welfare.map.isLayerVisible(stateMap.activeLayer);
    // if active and previous layers are not the same; it's a new layer that we want to show
    // if active and previous layers are the same and the layer is visible it means we are just
    // toggling visibility of layer
    if (stateMap.activeLayer !== stateMap.previousLayer ||
      (stateMap.activeLayer === stateMap.previousLayer && isLayerActive)) {
      activeEl.classList.add('js-active');
      domMap.$nav.classList.add('js-layerIsOpened');
    }
  };

  const updateLocalLayerState = event => {
    stateMap.activeLayer = event.detail.activeLayer;
    stateMap.previousLayer = event.detail.previousLayer;
  };

  const toggleProject = (el) => {
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
  };

  const adjustProjectInnerPosition = (el, left, width, content) => {
    const element = el;
    const categoryInner = content;
    // If any of the categories expanded except for the first category
    // update the styles of the project navigation
    if (left > '150') {
      // reset map nav inner scroll position
      element.parentNode.scrollLeft = 0;
      // reposition map nav inner and adjust width
      setTimeout(() => {
        element.parentNode.style.transform = `translate3d(${-left + width}px, 0, 0)`;
        element.parentNode.style.width = `calc(100% + ${left + width}px)`;
      }, 100);
      // Adjust category inner wrapper width
      const categoryInnerWidth = left + width + 300;
      categoryInner.style.width = `calc(100% - ${categoryInnerWidth}px)`;
    }
  };

  const resetProjectInnerPosition = (el, content) => {
    const element = el;
    const categoryInner = content;
    categoryInner.scrollLeft = 0;
    element.parentNode.removeAttribute('style');
    categoryInner.removeAttribute('style');
  };

  const closeCategory = (el, content) => {
    const element = el || stateMap.lastActiveCategory;
    if (!element) return;
    if (element && content) {
      resetProjectInnerPosition(element, content);
    }
    element.classList.remove('js-active');
    domMap.$nav.classList.remove('js-catIsOpened');
    welfare.info.hideInfoWindow();
    document.querySelector('.map-info').classList.remove('js-infoExpanded');
  };

  const openCategory = (el, content) => {
    const element = el || stateMap.lastActiveCategory;

    // Reset navigation scroll first
    if (domMap.$nav.scrollLeft > 0) {
      domMap.$nav.scrollLeft = 0;
    }
    const elLeft = element.offsetLeft;
    const elWidth = element.offsetWidth;

    element.classList.add('js-active');
    domMap.$nav.classList.add('js-catIsOpened');
    adjustProjectInnerPosition(element, elLeft, elWidth, content);
  };

  const toggleCategory = (el, content) => {
    // If last active category is the same as the clicked category
    // Then we are clicking the same category either show it or hide it depnding
    // on state and return
    if (stateMap.lastActiveCategory && stateMap.lastActiveCategory === el) {
      if (el.classList.contains('js-active')) {
        closeCategory(el, content);
      }
      else {
        openCategory(el, content);
      }
      return true;
    }
    else if (stateMap.lastActiveCategory) {
      // Else if last active category exists and not
      // the same remove active from last active category
      stateMap.lastActiveCategory.classList.remove('js-active');
      domMap.$nav.classList.remove('js-catIsOpened');
    }
    // Update last active categroy
    stateMap.lastActiveCategory = el;
    openCategory(el, content);
    return true;
  };

  const resetNavStyles = () => {
    closeCategory();
  };

  const toggleLayerLinks = event => {
    if (event.type === 'layerStateUpdate') {
      if (stateMap.activeProject) {
        stateMap.activeProject.classList.remove('js-active');
        domMap.$nav.classList.remove('js-layerIsOpened');
      }
      return;
    }

    const project = event.detail.project.feature.getProperty('RelatedEnglishTitle');
    if (stateMap.activeProject) {
      stateMap.activeProject.classList.remove('js-active');
      domMap.$nav.classList.remove('js-layerIsOpened');
    }
    stateMap.activeProject = document.querySelector(`[data-target="${project}"]`);
    stateMap.activeProject.classList.add('js-active');
    domMap.$nav.classList.add('js-layerIsOpened');
  };

  const onNavClick = event => {
    let el;
    let content;
    const classes = event.target.classList; // alias classList
    if (event.currentTarget !== event.target) {
      // Click `Project`.
      if (classes.contains('map__nav__item--project')) {
        el = event.target;
        toggleProject(el);
      }
      // Click on `Category`.
      else if (classes.contains('category-wrapper')) {
        el = event.target.parentNode;
        content = event.target.nextElementSibling;
        toggleCategory(el, content);
      }
      // Click on either `Layer` or `Category` link.
      else if (classes.contains('map__nav__item__icon') ||
        classes.contains('map__nav__item__name')) {
        el = event.target.parentNode.parentNode;
        // We are only interested on click events on `Category` links.
        if (el.classList.contains('map__nav__item--category')) {
          content = event.target.parentNode.nextElementSibling;
          toggleCategory(el, content);
        }
      }
      // If it reaches here, click happened on `Project`.
      else if (classes.contains('map__nav__item__title')) {
        el = event.target.parentNode;
        toggleProject(el);
      }
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
      toggleLayerLinks(event);
      resetNavStyles();
    });

    document.addEventListener('initLayerState', event => {
      updateLocalLayerState(event);
    });

    // Build layers navigation
    setMainNav(layerObj);
    setNavMap(layerObj);
    domMap.$nav = document.querySelector('.map__nav');
    domMap.$info = document.querySelector('.map-info');

    // Listen to data updates
    document.addEventListener('dataUpdate', event => {
      navMap[stateMap.activeLayer].data = event.detail.data;
      updateMainNav();
    });

    document.addEventListener('updateProject', toggleLayerLinks);

    domMap.$nav.addEventListener('click', onNavClick, false);
  };

  return {
    initModule,
  };
})();
