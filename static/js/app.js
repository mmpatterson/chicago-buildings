var globalData;

// d3.json("https://agile-beyond-24167.herokuapp.com/API/data").then(test => console.log("test: ", test.data[0]));
function init(data) {
  // var parsedInfo = JSON.parse(information.then(function(Response){console.log(Response)}));
  const url = "https://agile-beyond-24167.herokuapp.com/API/data";
 
  d3.json(url).then(api_data => {
    data = api_data.data;
  // d3.csv("Buildings.csv").then(data => {
    console.log("data:", data[0]);
    globalData = data;
    var property = [];
    var sqFt = [];
    var age = [];
    var kBtuSqft = [];
    var propertyTypes = [];
    // var zipCodes = [];
    for (var i = 0; i < data.length; i++) {
      if (data[i].data_year >= 2017 && Number(data[i].site_eui_kbtu_sq_ft)<=500) {
        var dataItem = data[i];
        var feet = Number(dataItem.gross_floor_area_buildings_sq_ft)/100000;
        // var feet = 100;
        if (feet < 5) {
          feet = 10;
        }
        property.push(dataItem.property_name);
        sqFt.push(feet);
        age.push(dataItem.year_built);
        kBtuSqft.push(Number(dataItem.site_eui_kbtu_sq_ft));
        if (!propertyTypes.includes(data[i].primary_property_type)) {
          propertyTypes.push(data[i].primary_property_type)
        }   
        // if (!zipCodes.includes(data[i].zip_code)) {
        //   zipCodes.push(data[i].zip_code)
        }   
    }
   
    // console.log(zipCodes);
    var dropdown = d3.select("#selDataset");
    // var zipDropdown = d3.select("#selDataset2");
    
    dropdown.append("option")
      .text("All")
      .property("value", "all");

    propertyTypes.forEach(function(type) {
      dropdown.append("option")
      .text(type)
      .property("value", type.replace(/\s/g, ''));     
    })
    // dropdown.selectAll("option").data(propertyTypes).enter()
    //   .append("option")
    //   .text(d => d)
    //   .property("value", d => d.replace(/\s/g, ''));
    // zipDropdown.append("option")
    // .text("All")
    // .property("value", "all");

    // zipCodes.forEach(function(type) {
    //   dropdown.append("option")
    //   .text(type)
    //   .property("value");     
    // })
  
    // console.log(sqFt);  , type.replace(/\s/g, '')
    // console.log(kBtuSqft);
    // Bubble Chart
    var trace1 = {
        x: age,
        y: kBtuSqft,
        text: property,
        mode: 'markers',
        marker: {
        size: sqFt,
        color: age, 
        colorscale:"Earth"
        }
    };
    var data = [trace1];
    var layout = {
        title: 'Energy Efficiency (kBtu per SqFt) by Age of Building',
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"Age of Building"},
        margin: {t:30}
    };
    Plotly.newPlot('bubble', data, layout); 
  });
}

function buildChart(propertyType) {
  console.log("buildChart")
  if (propertyType == "all") {
    data = globalData;
  } else {
    data = globalData.filter(x => x.primary_property_type.replace(/\s/g, '') == propertyType)
  }
  console.log(data);
  var property = [];
  var sqFt = [];
  var age = [];
  var kBtuSqft = [];
  for (var i = 0; i < data.length; i++) {

    if (data[i].data_year >= 2017 && Number(data[i].site_eui_kbtu_sq_ft)<=500) {
      var dataItem = data[i];
      var feet = Number(dataItem.gross_floor_area_buildings_sq_ft)/100000;
      // var feet = 100;
      if (feet < 5) {
        feet = 10;
      }

      property.push(dataItem.property_name);
      sqFt.push(feet);
      age.push(dataItem.year_built);
      kBtuSqft.push(Number(dataItem.site_eui_kbtu_sq_ft));
    }
  }   
  console.log(sqFt);
  var trace1 = {
    x: age,
    y: kBtuSqft,
    text: property,
    mode: 'markers',
    marker: {
      size: sqFt,
      color: age, 
      colorscale:"Earth"
    }
  };

  var data = [trace1];
  var layout = {
    title: 'Energy Efficiency (kBtu per SqFt) by Age of Building',
    showlegend: false,
    hovermode: 'closest',
    xaxis: {title:"Age of Building"},
    margin: {t:30}
  };
  
  console.log("age: ", age);
  console.log("kBtuSqft", kBtuSqft);
  Plotly.restyle('bubble', {x:[age], y:[kBtuSqft], text:[property], marker:{size: sqFt, color: age}});
  
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildChart(newSample);
}
// Initialize the dashboard
init();
