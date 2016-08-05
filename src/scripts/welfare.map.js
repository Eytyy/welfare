welfare.map = (() => {
  const configMap = {
    mapStyles: {
      strokeWeight: 2,
      strokeColor: 'transparent',
      fillColor: '#e2cd57',
      fillOpacity: 1,
    },
    mapOptions: {
      center: { lat: 31.777, lng: 35.234 },
      zoom: 16,
    },
  };

  const stateMap = {
    $container: null,
    activeProject: undefined,
    activeProjectName: undefined,
  };
  const layers = {};
  const domMap = {};
  let map;

  const setupMap = (layerObj) => {
    map = new google.maps.Map(domMap.canvas, configMap.mapOptions);
    Object.keys(layerObj).forEach(key => {
      const obj = {};
      obj.dataLayer = new google.maps.Data();
      obj.dataLayer.setStyle(configMap.mapStyles);
      obj.url = layerObj[key].url;
      obj.eventActive = false;
      obj.visible = false;
      layers[key] = obj;
    });
  };

  const loadMap = (active, previous) => {
    // If previousLayer & activeLayer are the same or
    // activeLayer === '/' &  previousLayer has a value other than '/'
    // Then Unset the map and return
    if ((active === previous && active !== undefined && layers[active].visible) ||
       ((previous && previous !== '/') &&
       (active === '/' || !active))) {
      layers[previous].dataLayer.setMap(null);
      layers[previous].visible = false;
      return true;
    }
    // If the active layer is empty or
    // activeLayer is the root and previous is Empty
    // It means no layer is active -- there is nothing to load. Just return.
    if (!active ||
      (active === '/' && !previous)) {
      return true;
    }
    // If we are here it means we need to load the map.
    // 1. Fetch data only if it doesn't exist then set map
    const data = welfare.shell.getLayerData(active);
    if (!data) {
      const promise = new Promise((resolve, reject) => {
        try {
          layers[active].dataLayer.loadGeoJson(layers[active].url, {}, (features) => {
            resolve(features);
          });
        } catch (err) {
          reject(err);
        }
      });

      promise.then((features) => {
        console.log('loaded');
        welfare.shell.updateLayerData(features);
      }).catch((err) => {
        console.log(err);
      });
    }
    // 2. Otherwise just set the map for the active layer
    // and unset for the previous one
    if (previous && previous !== '/' && previous !== active) {
      console.log('yo');
      layers[previous].dataLayer.setMap(null);
      layers[previous].visible = false;
    }
    layers[active].dataLayer.setMap(map);
    layers[active].visible = true;
    // 3. Check if the layer already have a click event Listeners
    // to avoid adding it more than once
    if (!layers[active].eventActive) {
      // Add click listenr to layer data
      layers[active].dataLayer.addListener('click', (event) => {
        // Create custom event and pass the clicked layer data to it
        const projectUpdateEvent = new CustomEvent('updateProject', {
          detail: {
            project: event,
          },
        });
        // Then fire the event
        document.dispatchEvent(projectUpdateEvent);
      });
    }
    return true;
  };

  const setDOMmap = () => {
    const mapCanvas = document.querySelector('.map');
    domMap.canvas = mapCanvas;
  };

  const getDataLayer = () => layers[stateMap.activeLayer].dataLayer;

  const isLayerVisible = id => layers[id].visible;

  const updateMapState = event => {
    stateMap.activeLayer = event.detail.activeLayer;
    stateMap.previousLayer = event.detail.previousLayer;
    loadMap(stateMap.activeLayer, stateMap.previousLayer);
  };

  const onUpdateProject = event => {
    const feature = event.detail.project.feature;
    const dataLayer = layers[stateMap.activeLayer].dataLayer;
    // remove active styles from previous active project
    if (stateMap.activeProject) {
      dataLayer.overrideStyle(stateMap.activeProject, configMap.mapStyles);
    }
    // update active project
    stateMap.activeProject = feature;
    stateMap.activeProjectName = feature.getProperty('RelatedEnglishTitle');

    // and add the active project style
    dataLayer.overrideStyle(stateMap.activeProject, {
      fillColor: '#BE4459',
      fillOpacity: 1,
    });

    // reposition map and set zeft
    map.panTo(event.detail.project.latLng);
    map.setZoom(18);
  };

  const initModule = layerObj => {
    setDOMmap();
    setupMap(layerObj);

    document.addEventListener('initLayerState', updateMapState);
    document.addEventListener('layerStateUpdate', updateMapState);
    document.addEventListener('updateProject', onUpdateProject);
    welfare.overlay.initModule(map);
  };

  return {
    initModule,
    isLayerVisible,
    getDataLayer,
  };
})();
