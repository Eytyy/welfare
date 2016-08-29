welfare.info = (() => {
  const configMap = {
  };

  const stateMap = {
    $container: null,
    activeLayer: null,
    previousActiveProject: null,
  };

  const dataCache = {};

  const domMap = {};

  const tplMap = {
    projects: 'map-info-projects.tpl.hbs',
    buildings: 'map-info-buildings.tpl.hbs',
    housing: 'map-info-housing.tpl.hbs',
  };

  const setupInfoWindow = () => {
    const tpl = 'map-info.tpl.hbs';
    const rendered = Handlebars.templates[tpl]();
    stateMap.$container.insertAdjacentHTML('beforeend', rendered);
    domMap.$infoGrabber = document.querySelector('.map-info__grabber');
    domMap.$infoInner = document.querySelector('.map-info__inner');
    domMap.$info = document.querySelector('.map-info');
  };

  const showInfoWindow = () => {
    domMap.$info.classList.add('js-view-mode');
  };

  const hideInfoWindow = () => {
    domMap.$info.classList.remove('js-view-mode');
  };

  const toggleInfoExpand = (event, hide) => {
    if (domMap.$info.classList.contains('js-infoExpanded')) {
      domMap.$info.classList.remove('js-infoExpanded');
      // stateMap.tick = true;
    }
    else {
      domMap.$info.classList.add('js-infoExpanded');
    }
  };

  const updateLayerState = () => {
    stateMap.activeLayer = welfare.shell.getLayerState().current_layer;
    // hide info
    domMap.$info.classList.remove('js-view-mode');
  };

  const updateInfoWindow = (data) => {
    if (stateMap.previousActiveProject === data.OBJECTID) {
      return true;
    }
    const activeLayer = stateMap.activeLayer || welfare.shell.getLayerState().current_layer;
    domMap.$infoInner.scrollTop = 0;
    domMap.$info.classList.remove('js-infoExpanded');

    // Add Project info to html
    function appendInfo(info) {
      const tpl = tplMap[activeLayer];
      Handlebars.registerHelper({
        or: (v1, v2) => {
          const rval = v1 || v2;
          return rval;
        },
        and: (v1, v2) => {
          const rval = v1 && v2;
          return rval;
        },
        eq: (v1, v2) => {
          const rval = v1 === v2;
          return rval;
        },
        ne: (v1, v2) => {
          const rval = v1 !== v2;
          return rval;
        },
        formatCurr: (v) => {
          const val = v.toString().split('.');
          val[0] = val[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return val;
        },
        formatFileName: (v) => {
          const val = v.match(/[^\\/]+$/)[0];
          return val;
        },
      });
      const rendered = Handlebars.templates[tpl](info);
      domMap.$infoInner.innerHTML = rendered;
    }

    if (dataCache[data.OBJECTID]) {
      console.log('cached data');
      // Update Info
      appendInfo(dataCache[data.OBJECTID]);
      showInfoWindow();
      return true;
    }

    function fetchImages() {
      const url = `resources/images/${activeLayer}/${data.ukey}`;
      const req = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        req.open('GET', url);

        req.onload = () => {
          const files = JSON.parse(req.response).data;
          if (!files) { reject('doesn\'t have images'); }
          else { resolve(files); }
        };

        req.send(null);
      });
    }
    function fetchExtraResources() {
      const url = `resources/other/${activeLayer}/${data.ukey}`;
      const req = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        req.open('GET', url);

        req.onload = () => {
          const files = JSON.parse(req.response).data;
          if (!files) { reject('doesn\'t have resources'); }
          else { resolve(files); }
        };

        req.send(null);
      });
    }

    // Fetch Project Images
    const images = fetchImages();
    const others = fetchExtraResources();

    Promise.all([images, others]).then(allData => {
      const obj = {
        miscImages: [],
        otherFiles: [],
      };

      allData[0].forEach(item => {
        if (/before.jpg/i.test(item)) {
          obj.beforeImage = item;
        }
        else if (/after.jpg/i.test(item)) {
          obj.afterImage = item;
        }
        else if (/main.jpg/i.test(item)) {
          obj.mainImage = item;
        }
        else {
          obj.miscImages.push(item);
        }
      });

      allData[1].forEach(item => {
        obj.otherFiles.push(item);
      });

      const completeData = Object.assign(data, obj);
      // Update Cache
      dataCache[data.OBJECTID] = completeData;
      // Update Info
      appendInfo(completeData);
      showInfoWindow();
    }).catch(error => {
      console.log(error);
      // Update Cache
      dataCache[data.OBJECTID] = data;
      // Update Info
      appendInfo(data);
      showInfoWindow();
    });
    stateMap.previousActiveProject = data.OBJECTID;
  };

  const onUpdateProject = event => {
    const info = event.detail.project.feature.f;
    updateInfoWindow(info);
  };

  const initModule = ($container) => {
    stateMap.$container = $container;
    setupInfoWindow();
    document.addEventListener('layerStateUpdate', updateLayerState);
    document.addEventListener('updateProject', onUpdateProject);

    document.querySelector('.map-info__grabber').addEventListener('click', toggleInfoExpand);
  };

  return {
    initModule,
    hideInfoWindow,
  };
})();
