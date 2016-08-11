welfare.info = (() => {
  const configMap = {
  };

  const stateMap = {
    $container: null,
  };

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

  const updateState = (event) => {
    if (!domMap.$info.classList.contains('js-view-mode')
      && event.type === 'updateProject') {
      domMap.$info.classList.add('js-view-mode');
    }
    if (domMap.$info.classList.contains('js-view-mode')
      && event.type === 'layerStateUpdate') {
      domMap.$info.classList.remove('js-view-mode');
      if (domMap.$info) {
        domMap.$info.classList.remove('js-infoExpanded');
        stateMap.tick = true;
      }
    }
  };

  const updateInfoWindow = (data) => {
    const activeLayer = welfare.shell.getLayerState().current_layer;

    function fetchImages() {
      const url = `resources/${activeLayer}/${data.ukey}`;
      const req = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        req.open('GET', url);

        req.onload = () => {
          const files = JSON.parse(req.response).data;
          if (!files) {
            reject('dosen\'t have images');
          } else {
            resolve(files);
          }
        };

        req.send(null);
      });
    }
    // Add Project info to html
    function appendInfo(info) {
      const tpl = tplMap[activeLayer];
      const rendered = Handlebars.templates[tpl](info);
      domMap.$infoInner.innerHTML = rendered;
    }
    // Fetch Project Images
    fetchImages().then((files) => {
      const obj = {
        miscImages: [],
      };
      files.forEach(item => {
        if (/before.jpg/i.test(item)) {
          obj.beforeImage = item;
        } else if (/after.jpg/i.test(item)) {
          obj.afterImage = item;
        } else if (/main.jpg/i.test(item)) {
          obj.mainImage = item;
        } else {
          obj.miscImages.push(item);
        }
      });
      const completeData = Object.assign(data, obj);
      // console.log(completeData);
      appendInfo(completeData);
    }).catch(error => {
      console.log(error);
      appendInfo(data);
    });
  };

  const onUpdateProject = event => {
    const info = event.detail.project.feature.f;
    updateInfoWindow(info);
    updateState(event);
  };

  const toggleInfoExpand = () => {
    if (!domMap.$info.classList.contains('js-infoExpanded')) {
      domMap.$info.classList.add('js-infoExpanded');
    } else {
      domMap.$info.classList.remove('js-infoExpanded');
      stateMap.tick = true;
    }
  };

  const wheelo = () => {
    setTimeout(() => {
      domMap.$info.classList.add('js-infoExpanded');
    }, 500);
    stateMap.tick = false;
  };
  const initModule = ($container) => {
    stateMap.$container = $container;
    setupInfoWindow();
    document.addEventListener('updateProject', onUpdateProject);
    document.addEventListener('layerStateUpdate', updateState);
    stateMap.tick = true;
    // domMap.$info.addEventListener('wheel', (event) => {
    //   if (stateMap.tick) {
    //     wheelo(event);
    //   }
    // });
    document.querySelector('.map-info__grabber').addEventListener('click', toggleInfoExpand);
  };

  return {
    initModule,
  };
})();
