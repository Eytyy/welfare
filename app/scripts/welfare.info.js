'use strict';

welfare.info = function () {
  var configMap = {};

  var stateMap = {
    $container: null,
    activeLayer: null,
    previousActiveProject: null
  };

  var dataCache = {};

  var domMap = {};

  var tplMap = {
    projects: 'map-info-projects.tpl.hbs',
    buildings: 'map-info-buildings.tpl.hbs',
    housing: 'map-info-housing.tpl.hbs'
  };

  var setupInfoWindow = function setupInfoWindow() {
    var tpl = 'map-info.tpl.hbs';
    var rendered = Handlebars.templates[tpl]();
    stateMap.$container.insertAdjacentHTML('beforeend', rendered);
    domMap.$infoGrabber = document.querySelector('.map-info__grabber');
    domMap.$infoInner = document.querySelector('.map-info__inner');
    domMap.$info = document.querySelector('.map-info');
  };

  var showInfoWindow = function showInfoWindow() {
    domMap.$info.classList.add('js-view-mode');
  };

  var hideInfoWindow = function hideInfoWindow() {
    domMap.$info.classList.remove('js-view-mode');
  };

  var toggleInfoExpand = function toggleInfoExpand(event, hide) {
    if (domMap.$info.classList.contains('js-infoExpanded')) {
      domMap.$info.classList.remove('js-infoExpanded');
      // stateMap.tick = true;
    } else {
      domMap.$info.classList.add('js-infoExpanded');
    }
  };

  var updateLayerState = function updateLayerState() {
    stateMap.activeLayer = welfare.shell.getLayerState().current_layer;
    // hide info
    domMap.$info.classList.remove('js-view-mode');
  };

  var updateInfoWindow = function updateInfoWindow(data) {
    if (stateMap.previousActiveProject === data.OBJECTID) {
      return true;
    }
    var activeLayer = stateMap.activeLayer || welfare.shell.getLayerState().current_layer;
    domMap.$infoInner.scrollTop = 0;
    domMap.$info.classList.remove('js-infoExpanded');

    // Add Project info to html
    function appendInfo(info) {
      var tpl = tplMap[activeLayer];
      Handlebars.registerHelper({
        or: function or(v1, v2) {
          var rval = v1 || v2;
          return rval;
        },
        and: function and(v1, v2) {
          var rval = v1 && v2;
          return rval;
        },
        eq: function eq(v1, v2) {
          var rval = v1 === v2;
          return rval;
        },
        ne: function ne(v1, v2) {
          var rval = v1 !== v2;
          return rval;
        },
        formatCurr: function formatCurr(v) {
          var val = v.toString().split('.');
          val[0] = val[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          return val;
        },
        formatFileName: function formatFileName(v) {
          var val = v.match(/[^\\/]+$/)[0];
          return val;
        }
      });
      var rendered = Handlebars.templates[tpl](info);
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
      var url = 'resources/images/' + activeLayer + '/' + data.ukey;
      var req = new XMLHttpRequest();

      return new Promise(function (resolve, reject) {
        req.open('GET', url);

        req.onload = function () {
          var files = JSON.parse(req.response).data;
          if (!files) {
            reject('doesn\'t have images');
          } else {
            resolve(files);
          }
        };

        req.send(null);
      });
    }
    function fetchExtraResources() {
      var url = 'resources/other/' + activeLayer + '/' + data.ukey;
      var req = new XMLHttpRequest();

      return new Promise(function (resolve, reject) {
        req.open('GET', url);

        req.onload = function () {
          var files = JSON.parse(req.response).data;
          if (!files) {
            reject('doesn\'t have resources');
          } else {
            resolve(files);
          }
        };

        req.send(null);
      });
    }

    // Fetch Project Images
    var images = fetchImages();
    var others = fetchExtraResources();

    Promise.all([images, others]).then(function (allData) {
      var obj = {
        miscImages: [],
        otherFiles: []
      };
      // console.log('images');
      // console.log(allData[0]);
      allData[0].forEach(function (item, index) {
        if (/before.jpg/i.test(item)) {
          obj.beforeImage = item;
        } else if (/after.jpg/i.test(item)) {
          obj.afterImage = item;
        } else if (/main.jpg/i.test(item)) {
          obj.mainImage = item;
        } else {
          if (index !== 0) {
            obj.miscImages.push(item);
          }
        }
      });

      // console.log('links');
      // console.log(allData[1]);
      allData[1].forEach(function (item, index) {
        if (index !== 0) {
          obj.otherFiles.push(item);
        }
      });

      var completeData = Object.assign(data, obj);
      // Update Cache
      dataCache[data.OBJECTID] = completeData;
      // Update Info
      appendInfo(completeData);
      showInfoWindow();
    }).catch(function (error) {
      console.log(error);
      // Update Cache
      dataCache[data.OBJECTID] = data;
      // Update Info
      appendInfo(data);
      showInfoWindow();
    });
    stateMap.previousActiveProject = data.OBJECTID;
  };

  var onUpdateProject = function onUpdateProject(event) {
    var info = event.detail.project.feature.f;
    updateInfoWindow(info);
  };

  var initModule = function initModule($container) {
    stateMap.$container = $container;
    setupInfoWindow();
    document.addEventListener('layerStateUpdate', updateLayerState);
    document.addEventListener('updateProject', onUpdateProject);

    document.querySelector('.map-info__grabber').addEventListener('click', toggleInfoExpand);
  };

  return {
    initModule: initModule,
    hideInfoWindow: hideInfoWindow
  };
}();