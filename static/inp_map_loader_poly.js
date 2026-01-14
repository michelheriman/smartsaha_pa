require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Sketch",
    "esri/Graphic",
    "https://unpkg.com/terraformer",
    "https://unpkg.com/terraformer-wkt-parser",
    "https://unpkg.com/terraformer-arcgis-parser",
    "esri/widgets/Expand", "esri/widgets/Search",
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
    //"esri/Graphic",
    "esri/geometry/geometryEngine",
    "esri/geometry/operators/centroidOperator",
    "esri/geometry/projection",
    "esri/geometry/SpatialReference"
], function(Map, MapView, GraphicsLayer, Sketch, Graphic, terraformer,
    terraformer_wkt_parser, terraformer_arcgis_parser, Expand, Search,
    supabase, geometryEngine, centroidOperator, projection, SpatialReference
) {

    //load from supabase
    let apilink_ = window.location.origin + "/apikey/";

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
        //window.location.href = './signin.html';
        window.location.href = window.location.origin + 'signin/';

    }
      };
  
    logout.addEventListener("click", signOut);

    //check the limits of inputs 10 points for gps , 5 parcels for poly
    async function counter() {
        const session = await supabase_.auth.getSession();
        let us = document.getElementById('username_');
        us.textContent = session.data.session.user.email;
        const { data, error } = await supabase_
      .from("main_parcels_smart_saha_poly")
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
        if (n_parcels_pts >= 2) { 
            alert("You have the limit of parcels inputs for parcels");
            //window.location.href = "./index.html";
            window.location.href = window.location.origin + "/dashboard/";

        }
            }
    };

    counter();

    const graphicsLayer = new GraphicsLayer();
    const map = new Map({
        basemap: "satellite",
        layers: [graphicsLayer]
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [17, 0],
        zoom: 3
    });

    const sketch = new Sketch({
        layer: graphicsLayer,
        view: view,
        creationMode: "update"
    });

    const sketch_ex = new Expand({
        expandIcon: "pencil-mark-plus",  // see https://developers.arcgis.com/calcite-design-system/icons/
        // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
        view: view,
        content: sketch
    });
    view.ui.add(sketch_ex, "top-right");

    // Add a Search widget
    const searchWidget = new Search({
        view: view
      });

    // Add the search widget to the top right of the view
    view.ui.add(searchWidget, {
        position: "top-left"
      });

    sketch.on("create", function(event) {
        if (event.state === "complete") {
            //const polygonGeometry = event.graphic.geometry.toJSON();
            const graphic = event.graphic;
            let outSpatialReference = new SpatialReference({
                wkid: 4326 //Sphere_Sinusoidal projection
              });
            graphic.geometry = projection.project(graphic.geometry, outSpatialReference);
            let centroid = centroidOperator.execute(graphic.geometry) //geometryEngine.labelPoint(graphic) ;//geometryEngine.centroid(graphic.geometry);
            const polygonGeometry = event.graphic.geometry.toJSON();
            console.log(centroid);

            try {
                // Convert Esri JSON to GeoJSON
                const geojson = Terraformer.ArcGIS.parse(polygonGeometry);

                // Convert GeoJSON to WKT
                const wkt = Terraformer.WKT.convert(geojson);

                console.log("PostGIS WKT Format:", wkt);
                console.log("PostGIS GeoJSON Format:", JSON.stringify(geojson));

                //alert("do not forget to fill the inputs on the bottom-left");
                async function writer() {
                    const session = await supabase_.auth.getSession();
                    let owner_uuid = session.data.session.user.email;
                    let geojsonf = JSON.stringify(geojson)
                    let owner = document.getElementById("parcel_owner").value;
                    let parcel_n = document.getElementById("parcel_name").value;
                    if (owner === null) {alert("please fill your name on the bottom-left")}
                    if (parcel_n === null) {alert("please fill your parce name on the bottom-left")}
                    let longitude = centroid.x;
                    let latitude = centroid.y;
                    const { data, error } = await supabase_
                        .from('main_parcels_smart_saha_poly') // Replace with your table name
                        .insert([{owner : owner, owner_uuid : owner_uuid, longitude : longitude, latitude: latitude, parcel_name : parcel_n, geojson : geojsonf}])
                    alert("your parcel has been registered")
                };

                writer();

                
            } catch (error) {
                console.error("Conversion Error:", error);
                alert("Failed to convert geometry.");
            }
        }
    });
    
    };

    l();
    
});
