//var parsedInfo = JSON.parse(information.then(function(Response){console.log(Response)}));
const url2 = "https://agile-beyond-24167.herokuapp.com/API/data"
// function genInfo() {
//     d3.json(url2).then(function(data) {
//     var lats = [];
//     var longs = [];
//     var years = [];
//     var names = [];
//     var engs = [];
//     var elects = [];
//     console.log(data);
//     // console.log(data.data.length);
//     for (i = 0; i < data.data.length; i++) {
//         lats.push(data.data[i].latitude);
//         longs.push(data.data[i].longitude);
//         years.push(data.data[i].year_built);
//         addresses.push(data.data[i].address);
//         engs.push(data.data[i].site_eui_kbtu_sq_ft);
//         elects.push(data.data[i].electricity_use_kbtu)
//     }
// console.log(lats)
//   })}
//   genInfo()
var streets = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});
var url = "https://raw.githubusercontent.com/ShaleshK/project-two/master/Buildings.csv";
d3.json(url2).then( function(response) {
  // create empty arrays
  response = response.data
  console.log(response)
  var heat1Array = [];
  var heat2Array = [];
  var heat3Array = [];
  var heat4Array = []
  var heat5Array = [];
  // totalHeatArray
  for (let i = 0; i < response.length; i++) {
    const location = response[i].Location;
    const Lat = response[i]['latitude'];
    const Long = response[i]['longitude'];
    // var total_eng = response[i]["Electricity Use (kBtu)"]
    var total_eng = response[i]["electricity_use_kbtu"] || 10
    if (total_eng < 500000) {
      heat1Array.push([Lat,Long,total_eng]);
    } else if (total_eng < 1000000) {
      heat2Array.push([Lat,Long,total_eng]);
    } else if (total_eng < 5000000) {
      heat3Array.push([Lat,Long,total_eng]);
    } else if (total_eng < 10000000) {
      heat4Array.push([Lat,Long,total_eng])
    } else if (total_eng > 10000000) {
      heat5Array.push([Lat,Long,total_eng])}
  }
  console.log(heat1Array)
  var heat1 = L.heatLayer(heat1Array, {
    radius: 20,
    blur: 35
  })
  var heat2 = L.heatLayer(heat2Array, {
    radius: 20,
    blur: 35
  })
  var heat3 = L.heatLayer(heat3Array, {
    radius: 20,
    blur: 35
  })
  var heat4 = L.heatLayer(heat4Array, {
    radius: 20,
    blur: 35
  })
  var heat5 = L.heatLayer(heat5Array, {
    radius: 20,
    blur: 35
  })
  var basemaps = {
    "Electricity Use < 500,000 kBtu": heat1,
    "Electricity Use < 1,000,000 kBtu": heat2,
    "Electricity Use < 5,000,000 kBtu": heat3,
    "Electricity Use < 10,000,000 kBtu": heat4,
    "Electricity Use > 10,000,000 kBtu": heat5
  }
  var overlays = {
    "Streets": streets
  }
  var myMap = L.map("map3", {
  center: [41.8781, -87.6298],
  zoom: 10.5,
  layers:[streets,heat1]
});
  var layerDiv = L.control.layers(basemaps, overlays,{collapsed:false});
  layerDiv.addTo(myMap);
});