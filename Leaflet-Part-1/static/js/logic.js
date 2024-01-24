let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Creating the map object
let myMap = L.map("map", {
    center: [37.8, -95.2],
    zoom: 5
  });
  
  // Adding the tile layer
 let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
// Create a chooseradius function:
function chooseRadius(magnitude) {
    return magnitude * 4;
}

// Create a chooseColor function:
function chooseColor(depth) {
    if (depth > 90) {
        return "#993404";  
    }
    else if (depth > 70) {
        return "#d95f0e";
    }
    else if (depth > 50) {
        return "#fe9929";
    }
    else if (depth > 30) {
        return "#fec44f";
    }
    else if (depth > 10) {
        return  "#fee391";
    }
    else return "#ffffd4";
}
// Create layer group:
let earthquake = new L.layerGroup();

//Create base layers:
let baseMaps = {
    "Street Map": street,
    // "Topograph Map": topo,
}
// Get geoJson Data:
d3.json(url).then(data => { 
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: chooseRadius(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8  
            } 
                );
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`<h3>Location: </h3> ${feature.properties.place} <hr> <h3>Magnitude: </h3> ${feature.properties.mag} <hr> <h3>Depth: </h3> ${feature.geometry.coordinates[2]}`)
        }
    }).addTo(myMap); 
    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = [-10, 10, 30, 50, 70, 90];
        let colors = ["#ffffd4","#fee391", "#fec44f","#fe9929", "#d95f0e", "#993404"];
        let labels = [];

        // Add the minimum and maximum.
        let legendInfo =""

        div.innerHTML = legendInfo;

        for(let index=0; index<limits.length; index++) {
            if (index<limits.length-1) {
                let p = '<i style="background:'+ colors[index]+'></i>'+ (limits[index])+'-'+(limits[index]+20)
                console.log(p)
            div.innerHTML +=  '<i style="background:' + (colors[index]) + '"></i> '+(limits[index])+'-'+(limits[index]+20)+'<br>'
            
        }   
            else{
                div.innerHTML += '<i style="background:' + (colors[index]) + '"></i> '+(limits[index])+'+'
            }
        };
        return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);  
})  
