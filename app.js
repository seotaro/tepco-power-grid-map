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
    document.body.style.cursor = "progress";

    fetch(
      "https://tepco-power-grid-hack-mrfbzypr4q-an.a.run.app/v1/blackout.geojson"
    )
      .then((res) => res.json())
      .then((geojson) => {

        map.addSource('blackout', {
          type: "geojson",
          data: geojson,
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

        let datetime = (function (yyyymmddHHMM) {
          let yyyy = yyyymmddHHMM.substr(0, 4)
          let mm = yyyymmddHHMM.substr(4, 2)
          let dd = yyyymmddHHMM.substr(6, 2)
          let HH = yyyymmddHHMM.substr(8, 2)
          let MM = yyyymmddHHMM.substr(10, 2)

          let date = new Date();
          date.setFullYear(Number(yyyy))
          date.setMonth(Number(mm) - 1)
          date.setDate(Number(dd))
          date.setHours(Number(HH))
          date.setMinutes(Number(MM))
          date.setSeconds(0)
          return date;
        })(geojson.datetime.toString());

        {
          var element = document.getElementById("datetime");
          element.innerText = datetime.toLocaleString('ja-JP');
        }

        {
          var element = document.getElementById("count");
          element.innerText = geojson.count ? geojson.count : '-';
        }

        document.body.style.cursor = "auto";
      });
  });


  map.on('click', 'blackout-fill', function (e) {
    new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(e.lngLat)
      .setHTML(e.features[0].properties.N03_001 + " " + e.features[0].properties.N03_004 + "<br/>停電 " + e.features[0].properties.count + "軒")
      .addTo(map);
  });

  map.on('mouseenter', 'blackout-fill', function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'blackout-fill', function () {
    map.getCanvas().style.cursor = '';
  });

})();
