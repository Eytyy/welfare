'use strict';

var welfare = function () {
  var data = {
    projects: {
      id: 1,
      name: 'projects',
      title: 'Our Projects',
      url: 'data/our-projects2.json',
      data: null
    },
    buildings: {
      id: 2,
      name: 'buildings',
      title: 'Public Buildings',
      url: 'data/public-buildings.json',
      data: null
    },
    housing: {
      id: 3,
      name: 'housing',
      title: 'Housing Study',
      url: 'data/housing-study.json',
      data: null
    }
  };

  var initModule = function initModule($container) {
    welfare.shell.initModule($container, data);
  };

  return {
    initModule: initModule
  };
}();