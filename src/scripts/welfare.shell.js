welfare.shell = (() => {
  const configMap = {
    template: function() {
      const frag = document.createDocumentFragment();
      const map = document.createElement('div');
      const progressModule = document.createElement('div');
      map.classList.add('map');
      progressModule.classList.add('module-progress');
      frag.appendChild(progressModule);
      frag.appendChild(map);
      return frag;
    },
  };
  const stateMap = {
    $container: null,
    activeLayer: '',
    previousLayer: '',
  };
  let layersMap = {};
  let domMap = {};

  const setDOMmap = () => {
    const $container = stateMap.$container;
    const $progress = document.querySelector('.module-progress');
    // update DOM map.
    domMap = {
      $container,
      $progress,
    };
  };

  const getUrlHash = () => {
    const url = window.location.hash.substr(1);
    return url;
  };

  const updateProgress = (msg) => {
    domMap.$progress.innerHTML = msg;
  };

  const getLayerData = id => {
    if (layersMap[id]) {
      const data = layersMap[id].data;
      return data;
    }
    return false;
  };

  const getLayerState = () => ({
    previous_layer: stateMap.previousLayer,
    current_layer: stateMap.activeLayer,
  });

  // /updateLayerData/ serves as a custom event that gets dispatched
  // when new data is fetched.
  // Triggered by: welfare.map.loadMap()
  // Listeners:
  const updateLayerData = data => {
    layersMap[stateMap.activeLayer].data = data;
    const layerDataEvent = new CustomEvent('dataUpdate', {
      detail: {
        data,
      },
    });
    document.dispatchEvent(layerDataEvent);
  };

  const initLayerState = () => {
    stateMap.activeLayer = getUrlHash() || '/';

    const initLayerStateEvent = new CustomEvent('initLayerState', {
      detail: {
        previousLayer: stateMap.previousLayer,
        activeLayer: stateMap.activeLayer,
      },
    });
    document.dispatchEvent(initLayerStateEvent);
  };

  // /updateLayerData/ serves as a custom event that gets dispatched
  // when the stateMap.activeLayer value changes
  const updateLayerState = layerName => {
    stateMap.previousLayer = stateMap.activeLayer;
    stateMap.activeLayer = layerName;
    console.log(`Layer Update | Previous: ${stateMap.previousLayer}`,
                `| Active: ${stateMap.activeLayer}`);

    const layerStateEvent = new CustomEvent('layerStateUpdate', {
      detail: {
        previousLayer: stateMap.previousLayer,
        activeLayer: stateMap.activeLayer,
      },
    });
    document.dispatchEvent(layerStateEvent);
  };

  const initModule = ($container, layers) => {
    // set stateMap properties
    stateMap.$container = $container;
    layersMap = layers;
    $container.appendChild(configMap.template());
    setDOMmap();

    // Listen on History State /onpopstate/ Event
    window.onpopstate = () => {
      const state = getUrlHash() || '';
      updateLayerState(state);
    };

    // then initialize both the map and navigation
    welfare.map.initModule(layersMap);
    welfare.nav.initModule($container, layersMap);

    initLayerState(stateMap.activeLayer);
  };

  return {
    initModule,
    getLayerState,
    updateLayerState,
    updateLayerData,
    getLayerData,
    updateProgress,
  };
})();
