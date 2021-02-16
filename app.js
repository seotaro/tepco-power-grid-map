"use strict";

(function () {
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic2VvdGFybyIsImEiOiJjazA2ZjV2ODkzbmhnM2JwMGYycmc5OTVjIn0.5k-2FWYVmr5FH7E4Uk6V0g";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/seotaro/ckccx2ir32ft21ilprmbedyud",
    center: [139.5, 36.0],
    zoom: 8,
    antialias: true,
  });

  map.on("load", function () {
    map.addSource('blackout', {
      type: "geojson",
      data: "https://tepco-power-grid-hack-mrfbzypr4q-an.a.run.app/v1/blackout.geojson",
      attribution:
        '<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html" target="_blank">国土交通省国土数値情報ダウンロードサイト</a>',
    });

    map.addLayer({
      id: "blackout-fill",
      type: 'fill',
      source: 'blackout',

      layout: {},
      paint: {
        'fill-outline-color': '#111',
        'fill-color': '#FFA500',
        'fill-opacity': 0.75
      }
    });


    // map.addLayer({
    //   id: "blackout-line",
    //   type: 'line',
    //   source: 'blackout',

    //   layout: {},
    //   paint: {
    //     'line-width': 3,
    //     'line-color': '#000',
    //   }
    // });
  });
})();
