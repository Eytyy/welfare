welfare.nav = (() => {
  const configMap = {};
  const stateMap = {
    $container: null,
  };
  let domMap = {};

  const setDOMmap = () => {
  };

  const initModule = ($container) => {
    stateMap.$container = $container;
  };

  return {
    initModule,
  };
})();
