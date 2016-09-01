'use strict';

welfare.nav = function () {
  var stateMap = {
    $container: null,
    activeLayer: null,
    previousLayer: null,
    activeProject: null,
    lastActiveCategory: null
  };
  var domMap = {};

  var navMap = {};

  var filtered = {};

  var setNavMap = function setNavMap(layers) {
    Object.keys(layers).forEach(function (key) {
      var obj = {};
      obj.populate = false;
      obj.parentEL = document.querySelector('.map__nav__item--' + key);
      obj.data = null;
      navMap[key] = obj;
    });
  };

  var setMainNav = function setMainNav(layers) {
    var tpl = Handlebars.templates['nav.tpl.hbs'](layers);

    stateMap.$container.insertAdjacentHTML('beforeend', tpl);

    domMap.$navItemWrapper = document.querySelectorAll('.map__nav__item-wrapper');
    domMap.$navItem = document.querySelectorAll('.map__nav__item--layer');
  };

  var setLayerNav = function setLayerNav(layer) {
    var filteredData = void 0;
    var data = layer;
    var navWrapper = document.createElement('div');
    navWrapper.classList.add('map__nav__item__inner');

    // Function to remove duplicates from data object
    var removeDuplicates = function removeDuplicates() {
      var obj = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var el = _step.value;

          var category = el.getProperty('CatAName');
          var item = el.getProperty('RelatedEnglishTitle');

          if (!obj[category]) {
            obj[category] = {};
          }
          if (!obj[category][item]) {
            obj[category][item] = el;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      filtered[stateMap.activeLayer] = obj;
      return obj;
    };

    var buildNode = function buildNode(catName, catData) {
      var $catWrapper = document.createElement('div');
      var $catInner = document.createElement('div');
      var $iconWrapper = Handlebars.templates['nav-cat.tpl.hbs']({ title: catName });

      $catWrapper.classList.add('map__nav__item--category', 'map__nav__item--category--' + catName);
      $catInner.classList.add('category__inner');

      $catWrapper.insertAdjacentHTML('beforeend', $iconWrapper);
      $catWrapper.appendChild($catInner);

      Object.keys(catData).forEach(function (key) {
        if (catData[key].getGeometry().getAt(0)) {
          var id = catData[key].getProperty('RelatedEnglishTitle');
          var item = Handlebars.templates['nav-layer.tpl.hbs']({ title: id, cat: catName });
          $catInner.insertAdjacentHTML('beforeend', item);
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
    Object.keys(filteredData).forEach(function (key) {
      // Build the projects' navigation item
      var navGroup = buildNode(key, filteredData[key]);
      navWrapper.appendChild(navGroup);
    });

    document.querySelector('.map__nav__item-wrapper--' + stateMap.activeLayer).appendChild(navWrapper);
  };

  // Updates The Main Navigation Items of first Level
  // ex: our projects, public buidlings ..etc
  var updateMainNav = function updateMainNav() {
    var data = navMap[stateMap.activeLayer].data;
    var populated = navMap[stateMap.activeLayer].populated;
    var activeEl = document.querySelector('.map__nav__item-wrapper--' + stateMap.activeLayer);

    // If layer has data and the navigation is not populated with layer links
    if (!populated && data) {
      // Set Layer navigation to populate the navigation
      setLayerNav(data);
      navMap[stateMap.activeLayer].populated = true;
    }
    // Remove active class from main navigation items
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = domMap.$navItemWrapper[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var item = _step2.value;

        item.classList.remove('js-active');
        domMap.$nav.classList.remove('js-layerIsOpened');
      }
      // Check if the map layer is visible
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    var isLayerActive = welfare.map.isLayerVisible(stateMap.activeLayer);
    // if active and previous layers are not the same; it's a new layer that we want to show
    // if active and previous layers are the same and the layer is visible it means we are just
    // toggling visibility of layer
    if (stateMap.activeLayer !== stateMap.previousLayer || stateMap.activeLayer === stateMap.previousLayer && isLayerActive) {
      activeEl.classList.add('js-active');
      domMap.$nav.classList.add('js-layerIsOpened');
    }
  };

  var updateLocalLayerState = function updateLocalLayerState(event) {
    stateMap.activeLayer = event.detail.activeLayer;
    stateMap.previousLayer = event.detail.previousLayer;
  };

  var toggleProject = function toggleProject(el) {
    var item = filtered[stateMap.activeLayer][el.dataset.cat][el.dataset.target];
    var latLngs = item.getGeometry().getAt(0).getAt(0);

    // Defined an object for the google.maps.MouseEvent parameter
    var mev = {
      stop: null,
      latLng: latLngs,
      feature: item
    };

    // Then trigger the click event and pass the previously constructed parameter
    var dataLayer = welfare.map.getDataLayer();
    google.maps.event.trigger(dataLayer, 'click', mev);
  };

  var adjustProjectInnerPosition = function adjustProjectInnerPosition(el, left, width, content) {
    var element = el;
    var categoryInner = content;
    // If any of the categories expanded except for the first category
    // update the styles of the project navigation
    if (left > '150') {
      // reset map nav inner scroll position
      element.parentNode.scrollLeft = 0;
      // reposition map nav inner and adjust width
      setTimeout(function () {
        element.parentNode.style.transform = 'translate3d(' + (-left + width) + 'px, 0, 0)';
        element.parentNode.style.width = 'calc(100% + ' + (left + width) + 'px)';
      }, 100);
      // Adjust category inner wrapper width
      var categoryInnerWidth = left + width + 300;
      categoryInner.style.width = 'calc(100% - ' + categoryInnerWidth + 'px)';
    }
  };

  var resetProjectInnerPosition = function resetProjectInnerPosition(el, content) {
    var element = el;
    var categoryInner = content;
    categoryInner.scrollLeft = 0;
    element.parentNode.removeAttribute('style');
    categoryInner.removeAttribute('style');
  };

  var closeCategory = function closeCategory(el, content) {
    var element = el || stateMap.lastActiveCategory;
    if (!element) return;
    if (element && content) {
      resetProjectInnerPosition(element, content);
    }
    element.classList.remove('js-active');
    domMap.$nav.classList.remove('js-catIsOpened');
    welfare.info.hideInfoWindow();
    document.querySelector('.map-info').classList.remove('js-infoExpanded');
  };

  var openCategory = function openCategory(el, content) {
    var element = el || stateMap.lastActiveCategory;

    // Reset navigation scroll first
    if (domMap.$nav.scrollLeft > 0) {
      domMap.$nav.scrollLeft = 0;
    }
    var elLeft = element.offsetLeft;
    var elWidth = element.offsetWidth;

    element.classList.add('js-active');
    domMap.$nav.classList.add('js-catIsOpened');
    adjustProjectInnerPosition(element, elLeft, elWidth, content);
  };

  var toggleCategory = function toggleCategory(el, content) {
    // If last active category is the same as the clicked category
    // Then we are clicking the same category either show it or hide it depnding
    // on state and return
    if (stateMap.lastActiveCategory && stateMap.lastActiveCategory === el) {
      if (el.classList.contains('js-active')) {
        closeCategory(el, content);
      } else {
        openCategory(el, content);
      }
      return true;
    } else if (stateMap.lastActiveCategory) {
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

  var resetNavStyles = function resetNavStyles() {
    closeCategory();
  };

  var toggleLayerLinks = function toggleLayerLinks(event) {
    if (event.type === 'layerStateUpdate') {
      if (stateMap.activeProject) {
        stateMap.activeProject.classList.remove('js-active');
        domMap.$nav.classList.remove('js-layerIsOpened');
      }
      return;
    }

    var project = event.detail.project.feature.getProperty('RelatedEnglishTitle');
    if (stateMap.activeProject) {
      stateMap.activeProject.classList.remove('js-active');
      domMap.$nav.classList.remove('js-layerIsOpened');
    }
    stateMap.activeProject = document.querySelector('[data-target="' + project + '"]');
    stateMap.activeProject.classList.add('js-active');
    domMap.$nav.classList.add('js-layerIsOpened');
  };

  var onNavClick = function onNavClick(event) {
    var el = void 0;
    var content = void 0;
    var classes = event.target.classList; // alias classList
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
        else if (classes.contains('map__nav__item__icon') || classes.contains('map__nav__item__name')) {
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

  var initModule = function initModule($container, layerObj) {
    stateMap.$container = $container;

    // Listen to layer state updates
    document.addEventListener('layerStateUpdate', function (event) {
      updateLocalLayerState(event);
      if (navMap[stateMap.activeLayer].data) {
        updateMainNav();
      }
      toggleLayerLinks(event);
      resetNavStyles();
    });

    document.addEventListener('initLayerState', function (event) {
      updateLocalLayerState(event);
    });

    // Build layers navigation
    setMainNav(layerObj);
    setNavMap(layerObj);
    domMap.$nav = document.querySelector('.map__nav');
    domMap.$info = document.querySelector('.map-info');

    // Listen to data updates
    document.addEventListener('dataUpdate', function (event) {
      navMap[stateMap.activeLayer].data = event.detail.data;
      updateMainNav();
    });

    document.addEventListener('updateProject', toggleLayerLinks);

    domMap.$nav.addEventListener('click', onNavClick, false);
  };

  return {
    initModule: initModule
  };
}();