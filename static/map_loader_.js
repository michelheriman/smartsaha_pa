require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/WFSLayer",
    "esri/layers/ogc/wfsUtils",
    "esri/widgets/Legend",
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
    "esri/layers/GeoJSONLayer",
    "esri/renderers/SimpleRenderer",
    "esri/symbols/SimpleFillSymbol",
    "esri/widgets/ScaleBar",
    "esri/widgets/Measurement",
    "esri/widgets/Expand",
    "esri/widgets/BasemapGallery",
    "esri/layers/support/LabelClass",
    "esri/widgets/Print",
    "esri/widgets/FeatureTable",
    "esri/Graphic",
    "esri/layers/GraphicsLayer"
  ], function (Map, MapView, WFSLayer, wfsUtils, Legend, supabase,GeoJSONLayer, SimpleRenderer, SimpleFillSymbol, ScaleBar,Measurement, Expand, BasemapGallery, LabelClass, Print, FeatureTable, Graphic, GraphicsLayer) {

    //load from supabase
    let apilink_ = window.location.origin + "/apikey/";

    async function l() {
        const response = await fetch(apilink_); //error here because of url conflict
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
        const data_ = await response.json();
        //console.log(data_.supabaseurl, data_.supabasekey);
        const supabase_ = supabase.createClient(data_.supabaseurl, data_.supabasekey);
        async function checker() {
            const session = await supabase_.auth.getSession();
                if (!session.data.session) {
                    // Redirect or block access
                    window.location.href = window.location.origin + "/signin/";
                }
                else {console.log("connected succefuly");
                    //const user = await getCurrentUser();
                    let us = document.getElementById('username_');

                    us.textContent = session.data.session.user.email;
                }
            };
    checker();

    //log out
    let logout = document.getElementById("logout");
    async function signOut() {
      const { error } = await supabase_.auth.signOut();
    
      if (error) {
        console.error("Sign-out error:", error.message);
      } else {
        alert("Signed out successfully!");
        window.location.href = window.location.origin + '/signin/';
      }
    };

    logout.addEventListener("click", signOut);
    

    const wfsLayer = new WFSLayer({
        //url: "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/Northern_and_Central_Africa/d5a1b4cbdcb790d6438a61e5b4240d18/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_snpp_24hrs&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=csv", // url to your WFS endpoint
        url : "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/Southern_Africa/d5a1b4cbdcb790d6438a61e5b4240d18/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_snpp_24hrs&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=csv",
        name: "fires_snpp_24hrs" // name of the FeatureType
      });
      //map.add(); // add the layer to the map
    
    const seven_days = new WFSLayer({
        url : "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/Southern_Africa/d5a1b4cbdcb790d6438a61e5b4240d18/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_snpp_7days&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=csv",
        name : "fires_snpp_7days"
    });

    const modis_24hr = new WFSLayer({
        url : "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/Southern_Africa/d5a1b4cbdcb790d6438a61e5b4240d18/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_modis_24hrs&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=csv",
        name : "fires_modis_24hrs"
    });

    const modis_7d = new WFSLayer({
        url : "https://firms.modaps.eosdis.nasa.gov/mapserver/wfs/Southern_Africa/d5a1b4cbdcb790d6438a61e5b4240d18/?SERVICE=WFS&REQUEST=GetFeature&VERSION=2.0.0&TYPENAME=ms:fires_modis_7days&STARTINDEX=0&COUNT=1000&SRSNAME=urn:ogc:def:crs:EPSG::4326&BBOX=-90,-180,90,180,urn:ogc:def:crs:EPSG::4326&outputformat=csv",
        name : "fires_modis_7days"
    })
    // Filter by date: Include only records from November 2024
    /*
    const startDate = "2024-09-01T00:00:00";
    const endDate = "2024-11-30T23:59:59";
    wfsLayer.definitionExpression = `
      datetime >= DATE '${startDate}' AND datetime <= DATE '${endDate}'
    `;
    */
     // Add custom symbology (renderer)
     modis_24hr.renderer = {
        type: "simple",
        symbol: {
        type: "simple-marker", // Applies to point data
        color: "orange",
        size: 10,
        outline: {
            color: "black",
            width: 1
        }
        }
    };

    modis_7d.renderer = {
        type: "simple",
        symbol: {
        type: "simple-marker", // Applies to point data
        color: "yellow",
        size: 10,
        outline: {
            color: "black",
            width: 1
        }
        }
    };

    wfsLayer.renderer = {
        type: "simple",
        symbol: {
        type: "simple-marker", // Applies to point data
        color: "red",
        size: 8,
        outline: {
            color: "white",
            width: 1
        }
        }
    };

    seven_days.renderer = {
        type: "simple",
        symbol: {
        type: "simple-marker", // Applies to point data
        color: "orange",
        size: 10,
        outline: {
            color: "white",
            width: 1
        }
        }
    };
  
    // Create map and view
    const map = new Map({
      basemap: "satellite",
      layers: [wfsLayer, seven_days, modis_24hr, modis_7d]
    });
  
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [47, -19], // Center the map (long, lat) 46.286224,-18.897805
      zoom: 6
    });

    // Watch for extent changes and update the spatial filter
    
    view.watch("extent", function(newExtent) {
        modis_24hr.spatialFilter = {
          geometry: newExtent,
          spatialRelationship: "intersects"
        };

        modis_7d.spatialFilter = {
            geometry: newExtent,
            spatialRelationship: "intersects"
        };

        wfsLayer.spatialFilter = {
            geometry: newExtent,
            spatialRelationship: "intersects"
          };
        
        seven_days.spatialFilter = {
            geometry: newExtent,
            spatialRelationship: "intersects"
          };
      });
      

    

    //LOAD THE POLYGONS
    async function fetcher_2(tableName, query, filter_col, filter_value) {
        const { data, error } = await supabase_
      .from(tableName)
      .select(query)
      .eq(filter_col, filter_value);
  
    if (error) {
      console.error(`Error fetching the data from ${tableName}`, error);
      return null; // Return null or handle error accordingly
    } else {
      let geojson = {
        type: "FeatureCollection",
        features: data.map(row => {
          // Construct the properties for each feature without the `geojson` key
          let properties = { ...row };
          delete properties.geojson;
  
          return {
            type: "Feature",
            properties: properties,
            geometry: JSON.parse(row.geojson)
          };
        })
      };
      let buttonContainer = document.getElementById("parcs_but");
        //console.log(geojsonLayer);
        geojson.features.forEach(feature => {
          const graphic = new Graphic({
            geometry: {
              type: "polygon",
              rings: feature.geometry.coordinates[0] // Esri uses "rings" instead of "coordinates"
            },
            attributes: feature.properties});
            let button = document.createElement("button");
            button.innerText = feature.properties.parcel_name;//feature.properties.uuid; // Change this field based on GeoJSON
            button.className = "w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition";
            button.onclick = function() {
              zoomToFeature(graphic);
                };
                buttonContainer.appendChild(button);
        });
      return geojson; // Return the geojson object
    }
      };

     // Function to zoom to a feature
    function zoomToFeature(feature) {
      console.log(feature);
      view.goTo({
          //target : feature,
          target: feature,

          zoom: 18
      });
  };

  const graphicsLayer = new GraphicsLayer();

  // Function to zoom to a feature
  function zoomToFeature(feature) {
    console.log(feature);
    view.goTo({
        //target : feature,
        target: feature,

        zoom: 18
    });
  };

  async function load_points_parcels() {

    const session = await supabase_.auth.getSession();
    let us = document.getElementById('username_');
    us.textContent = session.data.session.user.email;
    console.log(us.textContent);
    const { data, error } = await supabase_
      .from("main_parcels_smartsaha_xy")
      .select("*")
      .eq("owner_uuid", us.textContent);
      if (error) {
        console.error(`Error fetching the data from ${tableName}`, error);
        return null; // Return null or handle error accordingly
      } else {
        //console.log(`point table loaded successful for ${us}!`);
        // Convert to GeoJSON format
        let n_parcels_pts = data.length;
        console.log(n_parcels_pts);
    const geojson = {
      type: 'FeatureCollection',
      features: []
        };

    console.log(data);

    
    
    data.forEach(row => {
      if (row.owner_uuid != null) {
          geojson.features.push({
              type: 'Feature',
              properties: {
                  id: row.uuid,
                  name: row.owner_uuid,
                  longitude : row.longitude,
                  latitude : row.latitude,
                  name : row.parcel_name
              },
              geometry: {
                  type: 'Point',
                  coordinates: [row.longitude, row.latitude] // [lng, lat] order
              }
          });
          /*
          const point = {
            //Create a point
            type: "point",
            longitude: row.longitude,
            latitude: row.latitude
          };
      
          const simpleMarkerSymbol = {
            type: "simple-marker",
            color: [255, 0, 0], // Orange
            outline: {
                color: [255, 255, 255], // White
                width: 3
            }
            };
          
          const pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol
            });
          graphicsLayer.add(pointGraphic);
          */
          
      }});
    /*
    map.add(graphicsLayer);
    view.goTo({
        target: graphicsLayer,//pointGraphic,
        zoom:14
        });
    */
    
    //console.log(geojson);

    let buttonContainer = document.getElementById("parcs_but");
          //console.log(geojsonLayer);
    geojson.features.forEach(feature => {
      const graphic = new Graphic({
        geometry: {
          //Create a point
          type: "point",
          longitude: feature.properties.longitude,
          latitude: feature.properties.latitude
        },
        attributes: feature.properties});
        let button = document.createElement("button");
        button.innerText = feature.properties.name; // Change this field based on GeoJSON
        button.className = "w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition";
        button.onclick = function() {
        zoomToFeature(graphic);
            };
            buttonContainer.appendChild(button);
          });
        
    const blob = new Blob([JSON.stringify(geojson)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const renderer = {
      type: "simple",
      symbol: {
          type: "simple-marker",
          color: "blue",
          outline: {
              color: "white",
              width: 1
          },
          size: 10
      }
  };

    const geoJsonLayer = new GeoJSONLayer({
      url: url,
      //url : geojson,
      renderer : renderer
    });

    map.add(geoJsonLayer);

    /*
    view.goTo({target : geoJsonLayer,
      zoom : 10
    });
    */

        
      }      
  };

  load_points_parcels();

    async function load_test() {
        //let l = await fetcher_2(tableName = "view_one_parcels", query = "*", filter_col="owner_uuid", filter_value="client_1_"); 'main_parcels_smart_saha_poly
        const session = await supabase_.auth.getSession();
        let us = session.data.session.user.email

        let l = await fetcher_2(tableName = 'main_parcels_smart_saha_poly', query = "*", filter_col="owner_uuid", filter_value=us); 

        //console.log(l);
        const blob = new Blob([JSON.stringify(l)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        var renderer = new SimpleRenderer({
            symbol: new SimpleFillSymbol({
                color: [0, 255, 0, 0.2], // Green with 50% opacity
                outline: {
                color: [0, 0, 0, 1], // Black outline
                width: 1
                }
            })
            });

        //console.log(url);
            
        const geojsonLayer = new GeoJSONLayer({
            url: url,
            renderer: renderer,
            labelingInfo: [
                new LabelClass({
                    // Label expression: use an attribute from your GeoJSON
                    labelExpressionInfo: {
                        expression: "$feature.uuid" // Replace 'name' with your attribute field
                    },
                    symbol: {
                        type: "text", // Label type
                        color: "blue",
                        haloColor: "white",
                        haloSize: "1px",
                        font: {
                            size: 12,
                            family: "Arial",
                            weight: "bold"
                        }
                    },
                    labelPlacement: "above-center" // Position of the label
                })
            ],
            outFields : ["uuid", "owner"]
            });
        map.add(geojsonLayer);
        //
        /*
        let buttonContainer = document.getElementById("parcs_but");
        geojsonLayer.queryFeatures(query).then((results) => {
            results.features.forEach(feature => {
                let button = document.createElement("button");
                button.innerText = feature.attributes.uuid; // Change this field based on GeoJSON
                button.className = "w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition";
                const geo = view.center;
                geo.x = feature.attributes.longitude;
                geo.y = feature.attributes.latitude;

                button.onclick = function() {
                    zoomToFeature(geo);
                };

                buttonContainer.appendChild(button);
            });
            });
            //

        let buttonContainer = document.getElementById("parcs_but");
        //console.log(geojsonLayer);
        geojsonLayer.features.forEach(feature => {
            const graphic = new Graphic({
            geometry: {
                type: feature.geometry.type.toLowerCase(),
                longitude: feature.geometry.coordinates[0],
                latitude: feature.geometry.coordinates[1]
            },
            attributes: feature.properties});
            let button = document.createElement("button");
            button.innerText = feature.attributes.uuid; // Change this field based on GeoJSON
            button.className = "w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition";
            button.onclick = function() {
                zoomToFeature(graphic);
                };
                buttonContainer.appendChild(button);
        });

        */

            
            //
            

        /*  
        let featureTable = new FeatureTable({
            view: view,
            layer: geojsonLayer,
            container : "tableDiv",
            visibleElements: {
            selectionColumn: false, // Hide the selection column
            menu: true // Show the menu
            },
        });
        view.ui.add(featureTable, "top-right");
        */
        
    };

    load_test();

    const legend = new Expand({
        content: new Legend({
          view: view,
          //container : "legendDiv",
          style: "classic" // other styles include 'classic'
        }),
        view: view,
        expanded: true
      });

    // Add the legend to the bottom-right corner of the view
     view.ui.add(legend, "top-right");

    const scaleBar = new ScaleBar({
        view: view,
        unit: "dual" // Options: "metric", "non-metric", "dual"
      });
      view.ui.add(scaleBar, {
        position: "bottom-left" // Position on the map
      });
    /*
    const measurement = new Measurement({
    view: view,
    activeTool: "distance" // Options: "area", "distance", null
    });
    view.ui.add(measurement, {
    position: "top-left" // Position on the map
    });
    */

     //basemap
    const basemapGallery = new Expand({
      content : new BasemapGallery({
          view: view,
          container: document.createElement("div")
        })
        });
    
    // Add the widget to the top-right corner of the view
    view.ui.add(basemapGallery, {
      position: "top-right"
    });

    const printexp = new Expand({
      content : new Print({
        view: view, 
        printServiceUrl: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
      })
    });

    view.ui.add(printexp, {
      position: "top-right"
    });

    //let parcels = fetcher_2(tableName = "view_one_parcels", query = "*", filter_col="owner_uuid", filter_value="client_1_");
    async function fetc_4(tableName, query, filter_col, filter_value) {
      const { data, error } = await supabase_
      .from(tableName)
      .select(query)
      .eq(filter_col, filter_value);
  
    if (error) {
      console.error(`Error fetching the data from ${tableName}`, error);
      return null; // Return null or handle error accordingly
    } else {
      let props = data.map(row => {
        let properties = { ...row };
        return properties;
    });
      return props
    }
    };

    //const api = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2MDEW,T2MWET,TS,T2M_RANGE,T2M_MAX,T2M_MIN,PRECTOTCORR,EVLAND&community=RE&longitude=${longitude}&latitude=${latitude}&start=${start}&end=${end}&format=JSON`;
    
    //the date of today
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    let end = yyyy + mm + dd;

    //10 days earlier
    const currentDate = new Date();
    const tenDaysEarlier = new Date();
    tenDaysEarlier.setDate(currentDate.getDate() - 10);
    var d = String(tenDaysEarlier.getDate()).padStart(2, '0');
    var m = String(tenDaysEarlier.getMonth() + 1).padStart(2, '0'); //January is 0!
    var y = tenDaysEarlier.getFullYear();
    //console.log(y+m+d)
    let start = y+m+d
    //console.log(tenDaysEarlier.toDateString());


    //utils functions
    function getDateFromDayOfYear(year, dayOfYear) {
      // Create a new Date object starting from January 1 of the given year
      const startOfYear = new Date(year, 0, 1);
  
      // Add the day of the year (minus 1 because January 1 is day 1)
      startOfYear.setDate(startOfYear.getDate() + dayOfYear - 1);
  
      // Extract the month and day
      const month = startOfYear.getMonth() + 1; // Month is zero-based, so add 1
      const day = startOfYear.getDate();
  
      return { month, day };
    }

    function cumulativeArray(array) {
      let cumulative = [];
      array.reduce((acc, currentValue, index) => {
          cumulative[index] = acc + currentValue;
          return cumulative[index];
      }, 0);
      return cumulative;
    };

    function calculateMean(array) {
      if (array.length === 0) {
        return 0; // Handle empty array case
      }
      const sum = array.reduce((acc, val) => acc + val, 0);
      return sum / array.length;
    };

    function getDayOfYear(dateString) {
      // Parse the date string (YYYYMMDD)
      const year = parseInt(dateString.substring(0, 4), 10);
      const month = parseInt(dateString.substring(4, 6), 10) - 1; // Month is zero-based
      const day = parseInt(dateString.substring(6, 8), 10);
    
      // Create a Date object
      const date = new Date(year, month, day);
    
      // Get the start of the year
      const startOfYear = new Date(year, 0, 1);
    
      // Calculate the difference in days
      const dayOfYear = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
    
      return dayOfYear;
    };

    function selectTrunk(array, startIndex, length) {
      const endIndex = length !== undefined ? startIndex + length : undefined;
      return array.slice(startIndex, endIndex);
    };

    function transformDataForCSV(data) {
      const dates = Object.keys(data[0]).filter(key => key !== 'date'); // Get all date keys
      const transformedData = [];
    
      dates.forEach(date => {
        const row = { date: date }; // Initialize each row with the date
    
        data.forEach(item => {
          const parameter = item.date;
          row[parameter] = item[date]; // Add parameter values for this date
        });
    
        transformedData.push(row);
      });
    
      return transformedData;
    };

    function summer(array){
      const sum = array.reduce((acc, val) => acc + val, 0);
      return sum
    };

    function stdev (arr, usePopulation = false) {
      const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
      return Math.sqrt(
        arr
          .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
          .reduce((acc, val) => acc + val, 0) /
          (arr.length - (usePopulation ? 0 : 1))
      );
    };

    async function clim_fetcher(api) {
      response = await fetch(api);
      jsondata = await response.json();
      let fetchedData = [];
      fetchedData = Object.entries(jsondata.properties.parameter).map(([key, values]) => ({
            date: key,
            ...values
          }));
        let test = transformDataForCSV(fetchedData);

        let arr_prec = [];
        let land_ev =[];

        test.forEach((element) => {
          if (element.PRECTOTCORR >= 0) {
              //arr_t2m.push(element.T2M);
              //day.push(element.date);
              arr_prec.push(element.PRECTOTCORR);
              land_ev.push(element.EVLAND);
              //let bilan = summer(element.PRECTOTCORR) - summer(element.EVLAND)
          }
            });
        
        let bilan = summer(land_ev) - summer(arr_prec)
        return bilan;
      
    };

    const cards = document.getElementById("rcards");

    async function loader() {
      // Get the select element
      const session = await supabase_.auth.getSession();
      let us = session.data.session.user.email
      const tableBody = document.getElementById("table-body");
      let res = await fetc_4(tableName = 'main_parcels_smart_saha_poly', query = "*", filter_col="owner_uuid", filter_value=us);
      let res_ = await fetc_4(tableName = 'main_parcels_smartsaha_xy', query = "*", filter_col="owner_uuid", filter_value=us);


      /*
      const session = await supabase_.auth.getSession();
        let us = session.data.session.user.email

        let l = await fetcher_2(tableName = 'main_parcels_smart_saha_poly', query = "*", filter_col="owner_uuid", filter_value=us);
      */
    //console.log(res.longitude);
      res.forEach(row => {
        //console.log(element.longitude)
        const tr = document.createElement("tr");
        const idCell = document.createElement("td");
        idCell.textContent = row.uuid;
        idCell.className = "border border-gray-300 px-4 py-2 text-sm text-gray-700";

        const nCell = document.createElement("td");
        nCell.textContent = row.parcel_name;
        nCell.className = "border border-gray-300 px-4 py-2 text-sm text-gray-700";

        const nameCell = document.createElement("td");
        nameCell.textContent = row.owner;
        nameCell.className = "border border-gray-300 px-4 py-2 text-sm text-gray-700";

        const long = document.createElement("td");
        long.textContent = Math.round(row.longitude*10000)/10000;
        long.className = "border border-gray-300 px-4 py-2 text-sm text-gray-700";

        const lat = document.createElement("td");
        lat.textContent = Math.round(row.latitude*10000)/10000;;
        lat.className = "border border-gray-300 px-4 py-2 text-sm text-gray-700";

        // Append cells to the row
        tr.appendChild(idCell);
        tr.appendChild(nCell);
        tr.appendChild(nameCell);
        tr.appendChild(long);
        tr.appendChild(lat);


        // Append the row to the table body
        tableBody.appendChild(tr);

        

        const api = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2MDEW,T2MWET,TS,T2M_RANGE,T2M_MAX,T2M_MIN,PRECTOTCORR,EVLAND,GWETPROF&community=RE&longitude=${row.longitude}&latitude=${row.latitude}&start=${start}&end=${end}&format=JSON`;

        const container = document.createElement("div");
        container.className = "backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-xl p-6"; //"bg-white rounded-2xl shadow-lg p-4";
        const span = document.createElement("span");
        span.className = "text-lg font-bold text-gray-800"; //text-xl font-bold text-gray-900
        span.textContent = `Rain vs Land Evaporation for ${row.uuid}`;
        container.appendChild(span);

        async function clim_fetcher() {
          response = await fetch(api);
          jsondata = await response.json();
          let fetchedData = [];
          fetchedData = Object.entries(jsondata.properties.parameter).map(([key, values]) => ({
                date: key,
                ...values
              }));
            let test = transformDataForCSV(fetchedData);
    
            let arr_prec = [];
            let land_ev =[];
            let soil_moist = [];
            let day = [];
    
            test.forEach((element) => {
              if (element.PRECTOTCORR >= 0) {
                  //arr_t2m.push(element.T2M);
                  day.push(element.date);
                  arr_prec.push(element.PRECTOTCORR);
                  land_ev.push(element.EVLAND);
                  soil_moist.push(element.GWETPROF);
                  //let bilan = summer(element.PRECTOTCORR) - summer(element.EVLAND)
              }
                });
            
            
            let bilan =  summer(arr_prec) - summer(land_ev);
            let soil_moisture = calculateMean(soil_moist);
            const status = document.createElement("p");
            if (soil_moisture >= 0.4) {
              status.textContent = `the parcel has water excedent, no water stress detected, the soil humidity is ${Math.round(soil_moisture * 100 * 10000)/10000} %`;
              container.appendChild(status);

            }
            else{
              status.textContent = `the parcel has water deficit of ${bilan} (mm), there is a high risk of water stress  if some crops remains, the soil humidity is ${Math.round(soil_moisture * 100 * 10000)/10000} %`;
              container.appendChild(status);
            };

            //rain vs evaporation
            //const ctx = document.getElementById("climateChart").getContext("2d");
            const chart_cont = document.getElementById("rain_chart");
            const ctx_ = document.createElement("canvas");
            ctx_.width = 400;
            ctx_.length = 200;
            chart_cont.appendChild(ctx_);
            const ctx = ctx_.getContext("2d");
            new Chart(ctx, {
              type: "line", // You can use 'bar', 'line', 'pie', etc.
              data: {
                  labels: day, // X-axis labels (dates)
                  datasets: [
                  {
                      label: "Land Evaporation",
                      type : "line",
                      data: land_ev, // Y-axis data for temperature
                      borderColor: "rgb(167, 25, 25)",
                      backgroundColor: "rgba(210, 204, 14, 0.2)",
                      borderWidth: 2,
                      tension: 0.4, // Smooth lines
                  },
                  {
                      label: "Precipitations",
                      type : 'bar',
                      data: arr_prec, // Y-axis data for precipitation
                      borderColor: "rgb(18, 18, 19)",
                      backgroundColor: "rgba(29, 168, 214, 0.2)",
                      borderWidth: 2,
                      tension: 0.4, // Smooth lines
                  },
                  ],
              },
              options: {
                  responsive: true,
                  plugins: {
                  title: {
                      display: true, // Enables the title
                      text: `${row.uuid}`, // Title text
                      font: {
                        size: 9 // Font size for the title
                      }},
                  legend: {
                      display: true,
                      position: "top",
                  },
                  },
                  scales: {
                  x: {
                      title: {
                      display: true,
                      text: "Date",
                      },
                  },
                  y: {
                      title: {
                      display: true,
                      text: "Values-mm",
                      },
                  },
                  },
              },
              });

            
            //console.log(bilan);
            //return bilan;
          
        };

        clim_fetcher();
        cards.appendChild(container);
        
        //let bil = clim_fetcher(api);
        //console.log(bil);
    });

    res_.forEach(row => {
        //console.log(element.longitude)
        const tr = document.createElement("tr");
        const idCell = document.createElement("td");
        idCell.textContent = row.uuid;
        idCell.className = "border border-gray-300 px-4 py-2 text-sm text-gray-700";

        const nCell = document.createElement("td");
        nCell.textContent = row.parcel_name;
        nCell.className = "border border-gray-300 px-4 py-2 text-sm text-gray-700";

        const nameCell = document.createElement("td");
        nameCell.textContent = row.owner;
        nameCell.className = "border border-gray-300 px-4 py-2 text-sm text-gray-700";

        const long = document.createElement("td");
        long.textContent = Math.round(row.longitude*10000)/10000;
        long.className = "border border-gray-300 px-4 py-2 text-sm text-gray-700";

        const lat = document.createElement("td");
        lat.textContent = Math.round(row.latitude*10000)/10000;;
        lat.className = "border border-gray-300 px-4 py-2 text-sm text-gray-700";

        // Append cells to the row
        tr.appendChild(idCell);
        tr.appendChild(nCell);
        tr.appendChild(nameCell);
        tr.appendChild(long);
        tr.appendChild(lat);


        // Append the row to the table body
        tableBody.appendChild(tr);

        

        let api = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2MDEW,T2MWET,TS,T2M_RANGE,T2M_MAX,T2M_MIN,PRECTOTCORR,EVLAND,GWETPROF&community=RE&longitude=${row.longitude}&latitude=${row.latitude}&start=${start}&end=${end}&format=JSON`;

        const container = document.createElement("div");
        container.className = "backdrop-blur-md bg-white/30 border border-white/20 rounded-2xl shadow-xl p-6"; //"bg-white rounded-2xl shadow-lg p-4";
        const span = document.createElement("span");
        span.className = "text-lg font-bold text-gray-800"; //text-xl font-bold text-gray-900
        span.textContent = `Rain vs Land Evaporation for ${row.uuid}`;
        container.appendChild(span);

        async function clim_fetcher() {
          let response = await fetch(api);
          let jsondata = await response.json();
          let fetchedData = [];
          fetchedData = Object.entries(jsondata.properties.parameter).map(([key, values]) => ({
                date: key,
                ...values
              }));
            let test = transformDataForCSV(fetchedData);
    
            let arr_prec = [];
            let land_ev =[];
            let soil_moist = [];
            let day = [];
    
            test.forEach((element) => {
              if (element.PRECTOTCORR >= 0) {
                  //arr_t2m.push(element.T2M);
                  day.push(element.date);
                  arr_prec.push(element.PRECTOTCORR);
                  land_ev.push(element.EVLAND);
                  soil_moist.push(element.GWETPROF);
                  //let bilan = summer(element.PRECTOTCORR) - summer(element.EVLAND)
              }
                });
            
            
            let bilan =  summer(arr_prec) - summer(land_ev);
            let soil_moisture = calculateMean(soil_moist);
            const status = document.createElement("p");
            if (soil_moisture >= 0.4) {
              status.textContent = `the parcel has water excedent, no water stress detected, the soil humidity is ${Math.round(soil_moisture * 100 * 10000)/10000} %`;
              container.appendChild(status);

            }
            else{
              status.textContent = `the parcel has water deficit of ${bilan} (mm), there is a high risk of water stress  if some crops remains, the soil humidity is ${Math.round(soil_moisture * 100 * 10000)/10000} %`;
              container.appendChild(status);
            };

            //rain vs evaporation
            //const ctx = document.getElementById("climateChart").getContext("2d");
            const chart_cont = document.getElementById("rain_chart");
            const ctx_ = document.createElement("canvas");
            ctx_.width = 400;
            ctx_.length = 200;
            chart_cont.appendChild(ctx_);
            const ctx = ctx_.getContext("2d");
            new Chart(ctx, {
              type: "line", // You can use 'bar', 'line', 'pie', etc.
              data: {
                  labels: day, // X-axis labels (dates)
                  datasets: [
                  {
                      label: "Land Evaporation",
                      type : "line",
                      data: land_ev, // Y-axis data for temperature
                      borderColor: "rgb(167, 25, 25)",
                      backgroundColor: "rgba(210, 204, 14, 0.2)",
                      borderWidth: 2,
                      tension: 0.4, // Smooth lines
                  },
                  {
                      label: "Precipitations",
                      type : 'bar',
                      data: arr_prec, // Y-axis data for precipitation
                      borderColor: "rgb(18, 18, 19)",
                      backgroundColor: "rgba(29, 168, 214, 0.2)",
                      borderWidth: 2,
                      tension: 0.4, // Smooth lines
                  },
                  ],
              },
              options: {
                  responsive: true,
                  plugins: {
                  title: {
                      display: true, // Enables the title
                      text: `${row.uuid}`, // Title text
                      font: {
                        size: 9 // Font size for the title
                      }},
                  legend: {
                      display: true,
                      position: "top",
                  },
                  },
                  scales: {
                  x: {
                      title: {
                      display: true,
                      text: "Date",
                      },
                  },
                  y: {
                      title: {
                      display: true,
                      text: "Values-mm",
                      },
                  },
                  },
              },
              });

            
            //console.log(bilan);
            //return bilan;
          
        };

        clim_fetcher();
        cards.appendChild(container);
        
        //let bil = clim_fetcher(api);
        //console.log(bil);
    });
    };

    loader();

    

    //
    /*
    let buttonContainer = document.getElementById("parcs_but");
    map.layers.forEach(layer => {
      let query = layer.createQuery();
      query.where = "1=1"; // Get all features
      query.returnGeometry = true;
      query.outFields = ["*"];

      layer.queryFeatures(query).then((results) => {
        results.features.forEach(feature => {
          let button_ = document.createElement("button");
          button_.innerText = `Zoom to ${layer.extent}`;
          button_.className = "w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition";
          button_.onclick = function() {
            zoomToFeature(feature);
        };
          buttonContainer.appendChild(button_);
        })
      })
      
    })
      */

    // Simulate fetching data (replace with your actual data fetching logic)
    /*
    setTimeout(() => {
      const rain = 80;  // select the rainfall
      const evaporation = 70; // select the land evapotranspiration
      const period = "Last 30 Days"; // Example period

      const total = rain + evaporation;
      const rainPercentage = (rain / total) * 100;
      const evaporationPercentage = (evaporation / total) * 100;

      document.getElementById("rainValue").textContent = rain.toLocaleString();
      document.getElementById("evaporationValue").textContent = evaporation.toLocaleString();
      document.getElementById("period").textContent = period;

      document.getElementById("rainBar").style.width = `${rainPercentage}%`;
      document.getElementById("evaporationBar").style.width = `${evaporationPercentage}%`;

      document.getElementById("rainPercentage").textContent = `${rainPercentage.toFixed(0)}%`;
      document.getElementById("evaporationPercentage").textContent = `${evaporationPercentage.toFixed(0)}%`;

    }, 1000); // Simulate 1-second delay
    */
  
  const card_con = document.getElementById("cards_con");
  async function season_cl(longitude, latitude, name_parcel) {
    let start 
    let end 
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    end = yyyy + mm + dd;

    if (latitude > 0) {
      start = '19890101'
    } else {start = '19890701'};

    const api_link = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2MDEW,T2MWET,TS,T2M_RANGE,T2M_MAX,T2M_MIN,PRECTOTCORR,EVLAND&community=RE&longitude=${longitude}&latitude=${latitude}&start=${start}&end=${end}&format=JSON`;
    let response = await fetch(api_link);
    let jsondata = await response.json();
    let fetchedData = [];
        fetchedData = Object.entries(jsondata.properties.parameter).map(([key, values]) => ({
            date: key,
            ...values
          }));
    let test = transformDataForCSV(fetchedData);
    let arr_prec =[];
    let day =[];
    test.forEach((element) => {
      if (element.PRECTOTCORR >= 0) {
          //arr_t2m.push(element.T2M);
          day.push(element.date);
          arr_prec.push(element.PRECTOTCORR);
      }
        });
    //console.log(Math.round(arr_prec.length / 365));
    let netyear =  Math.round(arr_prec.length / 365) - 1;
    let d = 0;
    const y = 365;
    let trunked
    let y_mean
    let meaned
    let standev
    let creduit
    let results_max = []
    let result_min = []
    let result
    let fin_pluie
    let debut_pluie
    let preci_arr

    for (let step = 0; step < netyear; step++) {
      // Runs 5 times, with values of step 0 through 4.
      //console.log("Walking east one step");
      
      trunked = selectTrunk(arr_prec, d, y);
      //prec_y_mean.push(calculateMean(trunked))
      y_mean = calculateMean(trunked);
      meaned = trunked.map(item => item - y_mean); // reduit
      // standard deviation 
      standev = stdev(meaned, true);
      creduit = meaned.map(element => element / standev);
      result = cumulativeArray(creduit);
      fin_pluie = result.indexOf(Math.max(...result));
      preci_arr = selectTrunk(day, d, y)
      results_max.push(getDayOfYear(preci_arr[fin_pluie])); 
      debut_pluie = result.indexOf(Math.min(...result));
      result_min.push(getDayOfYear(preci_arr[debut_pluie]));
      d = d + y;
      //console.log(Math.max(...result));
      //console.log(day[debut_pluie])
    };

    let month_day = getDateFromDayOfYear(yyyy, Math.floor(calculateMean(result_min)));
    let cdiv = document.createElement("div");
    cdiv.className = "flex  bg-gray-100";
    let div_2 = document.createElement("div");
    div_2.className = "bg-white shadow-lg rounded-2xl p-6 w-80";
    let title = document.createElement("h2");
    title.className = "text-2xl font-semibold text-gray-800";
    title.textContent = `Rainy season debut for ${name_parcel}`;
    div_2.appendChild(title);
    let par = document.createElement("p");
    par.className = "text-gray-600 mt-2";
    par.textContent = `the mean day for rainy season is ${month_day.month}/${month_day.day} (month/day) and the stdv is ${Math.floor(stdev(result_min, true))} , that means that the rainy season debut can be delayed by ${Math.floor(stdev(result_min, true))} days.`;
    div_2.appendChild(par);
    cdiv.appendChild(div_2);
    card_con.appendChild(cdiv);
  };

  async function populate_card_rainy() {
    const session = await supabase_.auth.getSession();
    let us = session.data.session.user.email
    let res = await fetc_4(tableName = "main_parcels_smart_saha_poly", query = "*", filter_col="owner_uuid", filter_value=us);
    let res_ = await fetc_4(tableName = "main_parcels_smartsaha_xy", query = "*", filter_col="owner_uuid", filter_value=us);
    
    res.forEach(row => {
      season_cl(row.longitude, row.latitude, row.uuid);
    });
    res_.forEach(row => {
        season_cl(row.longitude, row.latitude, row.uuid);
      })
    
   //console.log(res[0].longitude);
   //season_cl(res[0].longitude, res[0].latitude, res[0].uuid);
  };

  let season_rb = document.getElementById("launch_c");
  season_rb.addEventListener("click", () => {
    populate_card_rainy();
  });

  //soil proprerties
    //soil type url : https://api.openepi.io/soil/type?lat=60.1&lon=9.58&top_k=3
    let soil_typ_card = document.getElementById("chart_soil");
    const soil_t_b = document.getElementById("launch_soil");

    soil_t_b.addEventListener('click', 
      async () => {
        const session = await supabase_.auth.getSession();
      let us = session.data.session.user.email
      let res = await fetc_4(tableName = "main_parcels_smart_saha_poly", query = "*", filter_col="owner_uuid", filter_value=us);
      let res_ = await fetc_4(tableName = "main_parcels_smartsaha_xy", query = "*", filter_col="owner_uuid", filter_value=us);
      res.forEach(row => {
        let mess = document.createElement("span");
        mess.className = "text-xl font-semibold text-gray-800";
        mess.textContent = row.uuid;
        let divc = document.createElement("div");
        divc.className = "max-w-md mx-auto border-4 border-blue-500 p-6 rounded-2xl shadow-lg bg-white";
        divc.appendChild(mess);
        let soil = document.createElement('p');
        soil.className = "text-sm text-gray-600";
        divc.appendChild(soil);
        soil_typ_card.appendChild(divc);
        console.log(row.uuid)
        async function loader () {
        //console.log((row.longitude).toFixed(4));
        let link = `https://api.openepi.io/soil/type?lat=${row.latitude}&lon=${row.longitude}&top_k=3`;
        try {
          const response = await fetch(link);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log(data.properties.most_probable_soil_type);
          soil.textContent = `the soil type is principaly ${data.properties.most_probable_soil_type} , however you could find ${data.properties.probabilities[1].soil_type} and ${data.properties.probabilities[2].soil_type}`;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        
      };
      loader();
      });

      res_.forEach(row => {
        let mess = document.createElement("span");
        mess.className = "text-xl font-semibold text-gray-800";
        mess.textContent = row.uuid;
        let divc = document.createElement("div");
        divc.className = "max-w-md mx-auto border-4 border-blue-500 p-6 rounded-2xl shadow-lg bg-white";
        divc.appendChild(mess);
        let soil = document.createElement('p');
        soil.className = "text-sm text-gray-600";
        divc.appendChild(soil);
        soil_typ_card.appendChild(divc);
        console.log(row.uuid)
        async function loader () {
        //console.log((row.longitude).toFixed(4));
        let link = `https://api.openepi.io/soil/type?lat=${row.latitude}&lon=${row.longitude}&top_k=3`;
        try {
          const response = await fetch(link);
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log(data.properties.most_probable_soil_type);
          soil.textContent = `the soil type is principaly ${data.properties.most_probable_soil_type} , however you could find ${data.properties.probabilities[1].soil_type} and ${data.properties.probabilities[2].soil_type}`;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        
      };
      loader();
      });
      }
    )

  //populate_card_rainy();

  const backToTopButton = document.getElementById('backToTop');

    // Show button on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      backToTopButton.classList.remove('hidden');
    } else {
      backToTopButton.classList.add('hidden');
    }
  });

  // Smooth scroll to top
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
    };

    //debut
    l();

  });
