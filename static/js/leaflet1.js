// var information = d3.json("https://agile-beyond-24167.herokuapp.com/API/data");

// var parsedInfo = JSON.parse(information.then(function(Response){console.log(Response)}));
const url = "https://agile-beyond-24167.herokuapp.com/API/data"

// Pull data from heroku
function genInfo() {
    d3.json(url).then(function(data) {
    
    var lats = [];
    var longs = [];
    var years = [];
    var ages = [];
    var names = [];
    var engs = [];
    var elects = [];
    var addresses = [];
    // var sizes = [];
    
    // push heroku data into arrays
    for (i = 0; i < data.data.length; i++) {
        lats.push(data.data[i].latitude);
        longs.push(data.data[i].longitude);
        years.push(data.data[i].data_year);
        ages.push(data.data[i].year_built);
        addresses.push(data.data[i].address);
        engs.push(data.data[i].site_eui_kbtu_sq_ft);
        names.push(data.data[i].property_name);
        elects.push(data.data[i].electricity_use_kbtu);
    }

    // Create tile layer
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    maxZoom: 18,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

    // Creating map object
    // Chose Merch Mart as the center coordinate
    var map = L.map("map", {
        center: [41.8885, -87.6355],
        zoom: 12,
    });

    lightmap.addTo(map);


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
    
    // Keeping .csv function in case heroku ever goes down
    // d3.csv("Buildings.csv").then((data) => {
            // Create an object to keep of the number of markers in each layer
        var buildingCount = {
            age_less_1900: 0,
            age_less_1920: 0,
            age_less_1940: 0,
            age_less_1960: 0,
            age_less_1980: 0,
            age_less_2000: 0,
            age_less_2020: 0
        };
        
            // Initialize a buildingAge, which will be used as a key to access the appropriate layers, icons, and building age for layer group
            var buildingAge;
        
        // Create a new marker cluster group
        var markers = L.markerClusterGroup();

        //Keeping in case heroku ever goes down
        // locations = [];
        for (j = 0; j < data.data.length; j++) {

            if (Number(years[j]) >= 2017) {
                //Keeping in case heroku ever goes down
                // var dataItem = data[i];
                var lat = lats[j];
                var long = longs[j];
                var energy = engs[j];
                var age = ages[j];
                var color;

                if (age < 1900) {
                    buildingAge = "age_less_1900";
                    color = "red";
                }
                else if (age < 1920) {
                    buildingAge = "age_less_1920";
                    color = "orange";
                }
                else if (age < 1940) {
                    buildingAge = "age_less_1940";
                    color = "blue";
                }
                else if (age < 1960) {
                    buildingAge = "age_less_1960";
                    color = "cyan";
                }
                else if (age < 1980) {
                    buildingAge = "age_less_1980";
                    color = "violet";
                }
                else if (age < 2000) {
                    buildingAge = "age_less_2000";
                    color = "green-dark";
                }
                else {
                    buildingAge = "age_less_2020";
                    color = "black";
                }
                buildingCount[buildingAge]++;
                //Keeping in case heroku ever goes down
                // var latLong = [lat, long];

                var newIcon = L.ExtraMarkers.icon({
                    icon: "ion-settings",
                    iconColor: "white",
                    markerColor: color,
                    shape: "circle"
                });

                markers.addLayer(L.marker([lat, long]
                    ,
                    {icon: newIcon}
                    )
                
                    .bindPopup("<h1>" + names[j] 
                + "</h1> <hr> <h5>" 
                + "Energy Consumption: " 
                + energy
                + " kBtu/sq ft </h5> <h5>" 
                // Will uncomment once Corry fixes api
                // + "Square Footage: "
                // + sqFt
                // + " ft^2</h5>"
                + "<h5>"
                + "Year Built: "
                + age
                + "</h5>"
                ));
                //Keeping in case heroku ever goes down
                // locations.push(latLong);
            }
        }
        // Call the updateLegend function, which will... update the legend!
        updateLegend(buildingCount);


    map.addLayer(markers);
    // End of .csv function
    // });

    // Update the legend's innerHTML with the last updated time and station count
    function updateLegend(buildingCount) {
        document.querySelector(".legend").innerHTML = [
       " <div class='my-legend'>" +
            "<div class='legend-title'>Legend</div>" +
            "<div class='legend-scale'>" +
                "<ul class='legend-labels'>" +
                    "<li><span style='background:#b50e0e;'></span> Buildings Built Before 1900: " + buildingCount.age_less_1900 + "</li>" +
                    "<li><span style='background:#e37a09;'></span>Buildings Built Between 1900 and 1920: " + buildingCount.age_less_1920 + "</li>" +
                    "<li><span style='background:#0964e3;'></span>Buildings Built Between 1920 and 1940: " + buildingCount.age_less_1940 + "</li>" +
                    "<li><span style='background:#09bfe3;'></span>Buildings Built Between 1940 and 1960: " + buildingCount.age_less_1960 + "</li>" +
                    "<li><span style='background:#610d91;'></span>Buildings Built Between 1960 and 1980: " + buildingCount.age_less_1980 + "</li>" + 
                    "<li><span style='background:#047836;'></span>Buildings Built Between 1980 and 2000: " + buildingCount.age_less_2000 + "</li>" + 
                    "<li><span style='background:#000000;'></span>Buildings Built Between 2000 and 2020: " + buildingCount.age_less_2020 + "</li>" + 
                "</ul>"+
            "</div>"+
            "<div class='legend-source'>Source: <a href='https://data.cityofchicago.org/Environment-Sustainable-Development/Chicago-Energy-Benchmarking/xq83-jr8c target='blank_'>Chicago Energy Benchmarking</a></div>"+
            "</div>"]
        .join("");
    }
})};

//Actually call the function
genInfo();