
// Initialize heroku url
const url = "https://agile-beyond-24167.herokuapp.com/API/data"

// Get info from heroku
function genInfo() {
    d3.json(url).then(function(data) {
    
    // Create arrays for function
    var lats = [];
    var longs = [];
    var years = [];
    var ages = [];
    var names = [];
    var engs = [];
    var elects = [];
    var addresses = [];
    // Will uncomment once Corry fixes api
    // var sizes = [];
    
    // Add heroku data to arrays
    for (i = 0; i < data.data.length; i++) {
        lats.push(data.data[i].latitude);
        longs.push(data.data[i].longitude);
        years.push(data.data[i].data_year);
        ages.push(data.data[i].year_built);
        addresses.push(data.data[i].address);
        engs.push(data.data[i].site_eui_kbtu_sq_ft);
        names.push(data.data[i].property_name);
        elects.push(data.data[i].electricity_use_kbtu);
        // Will uncomment once Corry fixes api
        // sizes.push(data.data[i].whateverthesizeis);
    }
    // Create tilelayer
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
      });

  // Initialize all of the LayerGroups we'll be using
  var layers = {
      eng_less_100: new L.LayerGroup(),
      eng_less_200: new L.LayerGroup(),
      eng_less_300: new L.LayerGroup(),
      eng_less_400: new L.LayerGroup(),
      eng_great_400: new L.LayerGroup()
    };

// Creating map object
// Chose Merch Mart as the center coordinate
var map = L.map("map2", {
    center: [41.8885, -87.6355],
    zoom: 11,
    layers: [
        layers.eng_less_300,
        layers.eng_less_400,
        layers.eng_great_400
    ]
  });

lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
    "kBTU/sq ft < 100": layers.eng_less_100,
    "kBTU/sq ft < 200": layers.eng_less_200,
    "kBTU/sq ft < 300": layers.eng_less_300,
    "kBTU/sq ft < 400": layers.eng_less_400,
    "kBTU/sq ft >= 400": layers.eng_great_400
  };

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
    position: "bottomleft"
  });
  
  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map
  info.addTo(map);
  
// Initialize an object containing icons for each layer group
var icons = {
    eng_less_100: L.ExtraMarkers.icon({
      icon: "ion-settings",
      iconColor: "white",
      markerColor: "red",
      shape: "circle"
    }),
    eng_less_200: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "orange",
        shape: "circle"
      }),
    eng_less_300: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "green",
        shape: "circle"
    }),
    eng_less_400: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "blue",
        shape: "circle"
        }),
    eng_great_400: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "violet",
        shape: "circle"
        })
}
//Keeping in case heroku ever goes down
// d3.csv("Buildings.csv").then((data) => {
        // Create an object to keep of the number of markers in each layer
        var buildingCount = {
            eng_less_100: 0,
            eng_less_200: 0,
            eng_less_300: 0,
            eng_less_400: 0,
            eng_great_400: 0
          };
      
          // Initialize a buildingAge, which will be used as a key to access the appropriate layers, icons, and building age for layer group
          var buildingEff;
      
    //Keeping in case heroku ever goes down
    // locations = [];
    // for (i = 0; i < data.length; i++) {
    //     if (data[i].Data_Year >= 2017 && Number(data[i].Site_EUI_kBtu_sqft)<=500) {
    //         var dataItem = data[i];
    //         var lat = dataItem.Latitude;
    //         var long = dataItem.Longitude;
    //         var energy = parseInt(dataItem.Site_EUI_kBtu_sqft);
    //         var sqFt = dataItem.SqFt;
    //         var age = dataItem.Year_Built;
    //         var color;


    // Plot data from heroku arrays
    for (j = 0; j < data.data.length; j++) {
      if (Number(years[j]) >= 2017 
      && engs[j] != null
      ) {
          // console.log(j);
          // var dataItem = data[i];
          var lat = lats[j];
          // console.log(lat);
          var long = longs[j];
          // console.log(long)
          var energy = engs[j];
          // var sqFt = sizes[j];
          var age = ages[j];
          // console.log(age);
          var color;
            if (energy > 0) {

              if (energy < 100) {
                  buildingEff = "eng_less_100";
                  color = "#edf8fb";
              }
              else if (energy < 200) {
                  buildingEff = "eng_less_200";
                  color = "#ccece6";
              }
              else if (energy < 300) {
                  buildingEff = "eng_less_300";
                  color = "#99d8c9";
              }
              else if (energy < 400) {
                  buildingEff = "eng_less_400";
                  color = "#66c2a4";
              }
              else {
                  buildingEff = "eng_great_400";
                  color = "#005824";
              }
            }
            buildingCount[buildingEff]++;
            //Keeping in case heroku ever goes down
            // var latLong = [lat, long];
            var newMarker = L.marker([lat, long]
              , {
            icon: icons[buildingEff]
            }
            )
              // Add the new marker to the appropriate layer
            newMarker.addTo(layers[buildingEff]);

            // Add popup
            newMarker.bindPopup("<h1>" + names[j] 
            + "</h1> <hr> <h5>" 
            + "Energy Consumption: " 
            + engs[j]
            + " kBtu/sq ft </h5> <h5>" 
            // Will uncomment once Corry fixes heroku
            // + "Square Footage: "
            // + sqFt
            // + " ft^2</h5>"
            // + "<h5>"
            + "Year Built: "
            + age
            + "</h5>"
            );
            //Keeping in case heroku ever goes down
            // locations.push(latLong);
        }
    }
    // Call the updateLegend function, which will... update the legend!
    updateLegend(buildingCount);


//Keeping in case heroku ever goes down
// });

// Update the legend's innerHTML with the last updated time and station count
function updateLegend(buildingCount) {
    document.querySelector(".legend").innerHTML = [
      " <div class='my-legend'>" +
      "<div class='legend-title'>Legend</div>" +
      "<div class='legend-scale'>" +
          "<ul class='legend-labels'>" +
              "<li><span style='background:#b50e0e;'></span> Buildings Where kBTU/sq ft < 100: " + buildingCount.eng_less_100 + "</li>" +
              "<li><span style='background:#e37a09;'></span>Buildings Where kBTU/sq ft Between 100 & 200: " + buildingCount.eng_less_200 + "</li>" +
              "<li><span style='background:#108f07;'></span>Buildings Where kBTU/sq ft Between 200 & 300: " + buildingCount.eng_less_300 + "</li>" +
              "<li><span style='background:#0964e3;'></span>Buildings Where kBTU/sq ft Between 300 & 400: " + buildingCount.eng_less_400 + "</li>" +
              "<li><span style='background:#610d91;'></span>Buildings Where kBTU/sq ft > 400: " + buildingCount.eng_great_400 + "</li>" + 
          "</ul>"+
      "</div>"+
      "<div class='legend-source'>Source: <a href='https://data.cityofchicago.org/Environment-Sustainable-Development/Chicago-Energy-Benchmarking/xq83-jr8c' target='blank_'>Chicago Energy Benchmarking</a></div>"+
      "</div>"
    ].join("");
  }
})};

// Actually call the function
genInfo();