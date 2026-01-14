require([ "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer","esri/rest/support/Query",
    "esri/Graphic", "esri/layers/GraphicsLayer", "esri/symbols/SimpleMarkerSymbol",
    "esri/widgets/ScaleBar", "esri/widgets/BasemapGallery", "esri/widgets/Expand", "esri/widgets/Search",
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
], (Map, MapView, FeatureLayer, Query, Graphic, GraphicsLayer, SimpleMarkerSymbol,
    ScaleBar, BasemapGallery, Expand, Search, supabase
) => {

    let apilink_ = window.location.origin + "/apikey/";
    let subb = document.getElementById("submit_point");
    let long = document.getElementById("long").value;
    let lat = document.getElementById("lat").value;
    const graphicsLayer = new GraphicsLayer();

    async function l() {
        const response = await fetch(apilink_); //error here because of url conflict
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
        const data_ = await response.json();
        //console.log(data_.supabaseurl, data_.supabasekey);
        const supabase_ = window.supabase.createClient(data_.supabaseurl, data_.supabasekey);
        async function checker() {
        const session = await supabase_.auth.getSession();
        if (!session.data.session) {
          // Redirect or block access
          //window.location.href = "/signin.html";
            window.location.href = window.location.origin + 'signin/';

        }
        else {console.log("connected succefulyy");
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
        window.location.href = window.location.origin + 'signin/';
        
    }
      };
  
    logout.addEventListener("click", signOut);


    //for developpament only
    //const owner = "Client_1";
    //const owner_uuid = document.getElementById('username_');
    //console.log(owner_uuid.innerHTML);

    async function counter() {
        const session = await supabase_.auth.getSession();
        let us = document.getElementById('username_');
        us.textContent = session.data.session.user.email;
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
        //console.log(n_parcels_pts);
        if (n_parcels_pts >= 3) { 
            alert("You have the limit of parcels inputs for gps points");
            window.location.href = window.location.origin + "/dashboard/";
        }
            }
    };

    counter();

    async function write_base() {
        //const session = await supabase_.auth.getSession();
        //let us = document.getElementById('username_');
        //us.textContent = session.data.session.user.email;
        let longitude = document.getElementById("long").value;
        let latitude = document.getElementById("lat").value;
        const session = await supabase_.auth.getSession();
        let owner_uuid = session.data.session.user.email;
        let parcel_name = document.getElementById("parcel_name").value;
        let owner = document.getElementById("parcel_owner").value;
        const { data, error } = await supabase_
        .from('main_parcels_smartsaha_xy') // Replace with your table name
        .insert([{owner : owner, owner_uuid : owner_uuid, longitude : longitude, latitude: latitude, parcel_name : parcel_name}])

        if (error) {console.log(`${error.message}`)}
        else{console.log(`success!`)}
    };
    //

    const map = new Map({
        basemap: "topo-vector"
    });

    const view = new MapView({
        container: "viewDiv", // reference to the div id
        map: map,
        zoom: 3,
        center: [30.162964, 0] //Africa
        });
    
    let scaleBar = new ScaleBar({
        view: view
        });
        // Add widget to the bottom left corner of the view
        view.ui.add(scaleBar, {
        position: "bottom-left"
        });

    let basemapGallery = new BasemapGallery({
        view: view
        });
    
    const basemapexpand = new Expand({
        expandIcon: "basemap",  // see https://developers.arcgis.com/calcite-design-system/icons/
        // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
        view: view,
        content: basemapGallery
    });
    view.ui.add(basemapexpand, "bottom-right");

    // Add a Search widget
    const searchWidget = new Search({
        view: view
      });

    // Add the search widget to the top right of the view
    view.ui.add(searchWidget, {
        position: "top-right"
      });

    view.on("click", function (event) {
        // Get map coordinates
        const coords = {
            longitude: event.mapPoint.longitude.toFixed(6),
            latitude: event.mapPoint.latitude.toFixed(6)
        };

        // Log coordinates
        //console.log("Coordinates:", coords.longitude);


        // Optionally, display the coordinates on the map
        /*
        view.popup.open({
            title: "Coordinates",
            content: `Longitude: ${coords.longitude}<br>Latitude: ${coords.latitude}`,
            location: event.mapPoint
        });
        */
        let long = document.getElementById("long");
        long.value = coords.longitude;
        let lat = document.getElementById("lat");
        lat.value = coords.latitude;
    });

    subb.addEventListener("click", () =>{
        let long = document.getElementById("long").value;
        let lat = document.getElementById("lat").value;
        
        //console.log(`${long}, ${lat}`);
        /*
        const graphicsLayer = new GraphicsLayer();

        const map = new Map({
            basemap: "topo-vector"
        });
        
        const view = new MapView({
        container: "viewDiv", // reference to the div id
        map: map,
        zoom: 8,
        center: [long, lat] //Madagascar
        });

        let scaleBar = new ScaleBar({
            view: view
          });
          // Add widget to the bottom left corner of the view
          view.ui.add(scaleBar, {
            position: "bottom-left"
          });

        let basemapGallery = new BasemapGallery({
            view: view
          });
        
        const basemapexpand = new Expand({
            expandIcon: "basemap",  // see https://developers.arcgis.com/calcite-design-system/icons/
            // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
            view: view,
            content: basemapGallery
        });
        view.ui.add(basemapexpand, "bottom-right");

        map.add(graphicsLayer);
        */

        const point = {
            //Create a point
            type: "point",
            longitude: long,
            latitude: lat
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
        map.add(graphicsLayer);
        view.goTo({
            target: pointGraphic,
            zoom:14
            });
        
        write_base()
        /*
        view.on("click", function (event) {
            // Get map coordinates
            const coords = {
                longitude: event.mapPoint.longitude.toFixed(6),
                latitude: event.mapPoint.latitude.toFixed(6)
            };

            // Log coordinates
            console.log("Coordinates:", coords.longitude);

            let long = document.getElementById("long");
            long.value = coords.longitude;
            let lat = document.getElementById("lat");
            lat.value = coords.latitude;
        });
        */
        
    });
    };

    l();

});
