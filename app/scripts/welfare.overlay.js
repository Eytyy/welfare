'use strict';

welfare.overlay = function () {
  var createOverlay = function createOverlay(map) {
    var bounds = new google.maps.LatLngBounds(new google.maps.LatLng(31.77278, 35.225652), new google.maps.LatLng(31.783742, 35.237573));

    var overlayImg = '../images/basemap.png';

    // Overlay constructor function
    function WELFAREOverlay(image) {
      // initialize all properties.
      this.bounds = bounds;
      this.image = image;
      this.map = map;

      // Define a property to hold the image's div. We'll
      // actually create this div upon recipt of the onAdd()
      // method so we'll leav it null for now.
      this.div = null;

      // Explicitly call setMap on this overlay.
      this.setMap(map);
    }

    WELFAREOverlay.prototype = new google.maps.OverlayView();

    /*
    onAdd is called when the map's panes are ready and the overlay has been
    added to the map
    */
    WELFAREOverlay.prototype.onAdd = function () {
      var div = document.createElement('div');
      div.style.borderStyle = 'none';
      div.style.borderWidth = '0px';
      div.style.position = 'absolute';

      // Create the img element and attach it to the div.
      var img = document.createElement('img');
      img.src = this.image;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.position = 'absolute';
      div.appendChild(img);

      this.div = div;

      // Add the element to the 'overlayLayer' pane.
      var panes = this.getPanes();
      panes.overlayLayer.appendChild(div);
    };

    WELFAREOverlay.prototype.draw = function () {
      // We use the south-west and north-east coordinates
      // of the overlay to peg it to the correct position and size.
      // To do this, we need to retrieve the projection from the overlay.
      var overlayProjection = this.getProjection();

      // Retrieve the south-west and north-east coordinates of this overlay
      // in LatLngs and covert them to pixel coordinates.
      // We'll use these coordintes to resize the div.
      var sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
      var ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());

      // Resize the image's div to fit the indicated dimensions
      var div = this.div;
      div.className = 'overlay';
      div.style.left = sw.x + 'px';
      div.style.top = ne.y + 'px';
      div.style.width = ne.x - sw.x + 'px';
      div.style.height = sw.y - ne.y + 'px';
    };

    // The onRemove() method will be called automatically from the API
    // If we ever set the overlay's map property to 'null'.
    WELFAREOverlay.prototype.onRemove = function () {
      this.div.parentNode.removeChild(this.div);
      this.div = null;
    };

    var overlay = new WELFAREOverlay(overlayImg);
  };

  var initModule = function initModule(map) {
    createOverlay(map);
  };

  return {
    initModule: initModule
  };
}();