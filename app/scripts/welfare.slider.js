"use strict";

welfare.nav = function () {
  var configMap = {};
  var stateMap = {
    $container: null
  };
  var domMap = {};

  var setDOMmap = function setDOMmap() {};

  var initModule = function initModule($container) {
    stateMap.$container = $container;
  };

  return {
    initModule: initModule
  };
}();