'use strict';

welfare.shell = function () {
  var configMap = {
    template: function template() {
      var frag = document.createDocumentFragment();
      var map = document.createElement('div');
      var progressModule = document.createElement('div');
      map.classList.add('map');
      progressModule.classList.add('module-progress');
      frag.appendChild(progressModule);
      frag.appendChild(map);
      return frag;
    }
  };
  var stateMap = {
    $container: null,
    activeLayer: '',
    previousLayer: ''
  };
  var layersMap = {};
  var domMap = {};

  var setDOMmap = function setDOMmap() {
    var $container = stateMap.$container;
    var $progress = document.querySelector('.module-progress');
    // update DOM map.
    domMap = {
      $container: $container,
      $progress: $progress
    };
  };

  var getUrlHash = function getUrlHash() {
    var url = window.location.hash.substr(1);
    return url;
  };

  var updateProgress = function updateProgress(msg) {
    domMap.$progress.innerHTML = msg;
  };

  var getLayerData = function getLayerData(id) {
    if (layersMap[id]) {
      var data = layersMap[id].data;
      return data;
    }
    return false;
  };

  var getLayerState = function getLayerState() {
    return {
      previous_layer: stateMap.previousLayer,
      current_layer: stateMap.activeLayer
    };
  };

  // /updateLayerData/ serves as a custom event that gets dispatched
  // when new data is fetched.
  // Triggered by: welfare.map.loadMap()
  // Listeners:
  var updateLayerData = function updateLayerData(data) {
    layersMap[stateMap.activeLayer].data = data;
    var layerDataEvent = new CustomEvent('dataUpdate', {
      detail: {
        data: data
      }
    });
    document.dispatchEvent(layerDataEvent);
  };

  var initLayerState = function initLayerState() {
    stateMap.activeLayer = getUrlHash() || '/';

    var initLayerStateEvent = new CustomEvent('initLayerState', {
      detail: {
        previousLayer: stateMap.previousLayer,
        activeLayer: stateMap.activeLayer
      }
    });
    document.dispatchEvent(initLayerStateEvent);
  };

  // /updateLayerData/ serves as a custom event that gets dispatched
  // when the stateMap.activeLayer value changes
  var updateLayerState = function updateLayerState(layerName) {
    stateMap.previousLayer = stateMap.activeLayer;
    stateMap.activeLayer = layerName;
    console.log('Layer Update | Previous: ' + stateMap.previousLayer, '| Active: ' + stateMap.activeLayer);

    var layerStateEvent = new CustomEvent('layerStateUpdate', {
      detail: {
        previousLayer: stateMap.previousLayer,
        activeLayer: stateMap.activeLayer
      }
    });
    document.dispatchEvent(layerStateEvent);
  };

  var initModule = function initModule($container, layers) {
    // set stateMap properties
    stateMap.$container = $container;
    layersMap = layers;
    $container.appendChild(configMap.template());
    setDOMmap();

    // Listen on History State /onpopstate/ Event
    window.onpopstate = function () {
      var state = getUrlHash() || '';
      updateLayerState(state);
    };

    // then initialize both the map and navigation
    welfare.map.initModule(layersMap);
    welfare.nav.initModule($container, layersMap);
    welfare.info.initModule($container);

    initLayerState(stateMap.activeLayer);
  };

  return {
    initModule: initModule,
    getLayerState: getLayerState,
    updateLayerState: updateLayerState,
    updateLayerData: updateLayerData,
    getLayerData: getLayerData,
    updateProgress: updateProgress
  };
}();