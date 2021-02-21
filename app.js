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

  let blackout;

  map.on("load", function () {
    document.body.style.cursor = "progress";

    fetch(
      "https://tepco-power-grid-hack-mrfbzypr4q-an.a.run.app/v1/blackout.json"
    )
      .then((res) => res.json())
      .then((json) => {
        blackout = json;

        map.addSource('blackout', {
          type: "vector",
          tiles: ['https://storage.googleapis.com/tmp-20210220/tiles/tepco-areas/{z}/{x}/{y}.pbf'],
          attribution:
            '<a href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html" target="_blank">国土交通省国土数値情報ダウンロードサイト</a>',
        });

        const areas = Object.keys(blackout.areas);
        map.addLayer({
          id: "blackout-fill",
          type: 'fill',
          source: 'blackout',
          "source-layer": 'tepco-areas',

          layout: {},
          paint: {
            'fill-color': ["case",
              ["in", ["get", "N03_007"], ["literal", areas]], 'rgba(255, 170, 0, 0.5)',
              'rgba(255, 255, 255, 0.1)'
            ],
            'fill-opacity': 1.0
          }
        });

        map.addLayer({
          id: "blackout-line",
          type: 'line',
          source: 'blackout',
          "source-layer": 'tepco-areas',

          layout: {},
          paint: {
            'line-width': 0.5,
            'line-color': '#ccc',
          }
        });

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
        })(json.datetime.toString());

        {
          var element = document.getElementById("datetime");
          element.innerText = datetime.toLocaleString('ja-JP');
        }

        {
          var element = document.getElementById("count");
          element.innerText = json.count;
        }

        document.body.style.cursor = "auto";
      });
  });


  map.on('click', 'blackout-fill', function (e) {
    const area = blackout.areas[e.features[0].properties.N03_007];

    let html = `${e.features[0].properties.N03_004} 停電 ${area ? area.count : 0} 軒`;
    if (area) {
      const details = area.details;
      html += `<br/><ul>`;
      for (let detailArea in details) {
        html += `<li>${details[detailArea].name}（${details[detailArea].count}）</li>`
      }
      html += `</ul>`;
    }

    new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(e.lngLat)
      .setHTML(html)
      .addTo(map);
  });

  map.on('mouseenter', 'blackout-fill', function () {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'blackout-fill', function () {
    map.getCanvas().style.cursor = '';
  });

})();
