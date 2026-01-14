
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
            window.location.href = window.location.origin + "/signin";
            }
            else {console.log("connected succefulyy");
            //const user = await getCurrentUser();
            //let us = document.getElementById('username_');

            //us.textContent = session.data.session.user.email;
            }
            };
        checker();

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

        let body = document.getElementById("main");

        async function soil_provi() {
            const session = await supabase_.auth.getSession();
            let us = session.data.session.user.email
            let res = await fetc_4(tableName = "main_parcels_smart_saha_poly", query = "*", filter_col="owner_uuid", filter_value=us);
            let res_ = await fetc_4(tableName = "main_parcels_smartsaha_xy", query = "*", filter_col="owner_uuid", filter_value=us);
            res.forEach(row => {
                //let id_p = row.uuid
                /*
                let card_cont = document.createElement("div");
                card_cont.className = "max-w-xs bg-white rounded-xl shadow-md overflow-hidden m-4";
                body.appendChild(card_cont);
                let n = document.createElement("div");
                n.className = "bg-gray-800 py-2 px-4";
                card_cont.appendChild(n);
                let o = document.createElement("div");
                o.className = "flex justify-between items-center";
                card_cont.appendChild(o);
                let h = document.createElement("h1");
                h.textContent = "Parcel ID"
                h.className = "text-white font-medium text-sm"
                o.appendChild(h)
                let s = document.createElement("span");
                s.textContent = row.uuid
                s.className = "bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded";
                o.appendChild(s);
                */
                let link = `https://api.openepi.io/soil/property?lon=${row.longitude}&lat=${row.latitude}&depths=0-5cm&properties=bdod&properties=phh2o&properties=nitrogen&properties=soc&properties=cec&properties=cfvo&properties=clay&properties=sand&properties=silt&values=mean`;
                async function load() {
                    try {
                        const response = await fetch(link);
                        
                        if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        //console.log(data.properties.most_probable_soil_type);
                        //soil.textContent = `the soil type is principaly ${data.properties.most_probable_soil_type} , however you could find ${data.properties.probabilities[1].soil_type} and ${data.properties.probabilities[2].soil_type}`;
                        console.log(data);
                        let card = `
                        <div class="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden m-4 border border-gray-200">
            <!-- Parcel ID Header -->
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 py-3 px-5">
                <div class="flex justify-between items-center">
                    <h1 class="text-white font-semibold text-sm">Parcel ID</h1>
                    <span class="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-md shadow">${row.uuid} | ${row.parcel_name}</span>
                </div>
            </div>
            
            <!-- Data Sections -->
            <div class="divide-y divide-gray-200">
                <div class="bg-gradient-to-r from-green-500 to-green-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Nitrogen (N)</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[2].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">cg/kg</span>
                </div>
                
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">pH Water</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[1].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">pH*10</span>
                </div>
                
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Soil Organic Carbon</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[3].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">dg/kg</span>
                </div>

                <div class="bg-gradient-to-r from-red-500 to-red-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Cation Exchange Capacity</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[4].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">mmol(c)/kg</span>
                </div>

                <div class="bg-gradient-to-r from-orange-500 to-red-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Bulk Density</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[0].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">cg/cm³</span>
                </div>

                <div class="bg-gradient-to-r from-yellow-500 to-orange-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Sand contents</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[7].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">g/kg</span>
                </div>

                <div class="bg-gradient-to-r from-red-500 to-red-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Clay contents</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[6].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">g/kg</span>
                </div>

                <div class="bg-gradient-to-r from-red-500 to-red-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Silt contents</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[8].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">g/kg</span>
                </div>
            </div>
            
            <!-- Additional Info -->
            <div class="px-6 py-4 bg-gray-50 rounded-b-2xl">
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Last Reading:</span>
                    <span class="text-gray-800 font-medium">${new Date().toISOString().slice(0, 10)}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Soil Depth:</span>
                    <span class="text-gray-800 font-medium">0-5 cm</span>
                </div>
            </div>
        </div>

                `
                let cont = document.createElement("div");
                cont.className = "max-w-xs bg-white rounded-xl shadow-md overflow-hidden m-4";
                cont.innerHTML = card;
                body.appendChild(cont)

                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                    
                }
                load()
            }
        )

        res_.forEach(row => {
            //let id_p = row.uuid
            /*
            let card_cont = document.createElement("div");
            card_cont.className = "max-w-xs bg-white rounded-xl shadow-md overflow-hidden m-4";
            body.appendChild(card_cont);
            let n = document.createElement("div");
            n.className = "bg-gray-800 py-2 px-4";
            card_cont.appendChild(n);
            let o = document.createElement("div");
            o.className = "flex justify-between items-center";
            card_cont.appendChild(o);
            let h = document.createElement("h1");
            h.textContent = "Parcel ID"
            h.className = "text-white font-medium text-sm"
            o.appendChild(h)
            let s = document.createElement("span");
            s.textContent = row.uuid
            s.className = "bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded";
            o.appendChild(s);
            */
            //let link = `https://api.openepi.io/soil/property?lon=${row.longitude}&lat=${row.latitude}&depths=0-5cm&properties=bdod&properties=phh2o&properties=nitrogen&properties=soc&properties=cec&values=mean`;
            let link = `https://api.openepi.io/soil/property?lon=${row.longitude}&lat=${row.latitude}&depths=0-5cm&properties=bdod&properties=phh2o&properties=nitrogen&properties=soc&properties=cec&properties=cfvo&properties=clay&properties=sand&properties=silt&values=mean`;
            
            async function load() {
                try {
                    const response = await fetch(link);
                    
                    if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    //console.log(data.properties.most_probable_soil_type);
                    //soil.textContent = `the soil type is principaly ${data.properties.most_probable_soil_type} , however you could find ${data.properties.probabilities[1].soil_type} and ${data.properties.probabilities[2].soil_type}`;
                    console.log(data);
                    let card = `<div class="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden m-4 border border-gray-200">
            <!-- Parcel ID Header -->
            <div class="bg-gradient-to-r from-gray-800 to-gray-900 py-3 px-5">
                <div class="flex justify-between items-center">
                    <h1 class="text-white font-semibold text-sm">Parcel ID</h1>
                    <span class="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-md shadow">${row.uuid} | ${row.parcel_name}</span>
                </div>
            </div>
            
            <!-- Data Sections -->
            <div class="divide-y divide-gray-200">
                <div class="bg-gradient-to-r from-green-500 to-green-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Nitrogen (N)</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[2].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">cg/kg</span>
                </div>
                
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">pH Water</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[1].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">pH*10</span>
                </div>
                
                <div class="bg-gradient-to-r from-orange-500 to-orange-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Soil Organic Carbon</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[3].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">dg/kg</span>
                </div>

                <div class="bg-gradient-to-r from-red-500 to-red-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Cation Exchange Capacity</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[4].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">mmol(c)/kg</span>
                </div>

                <div class="bg-gradient-to-r from-orange-500 to-red-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Bulk Density</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[0].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">cg/cm³</span>
                </div>

                <div class="bg-gradient-to-r from-yellow-500 to-orange-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Sand contents</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[7].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">g/kg</span>
                </div>

                <div class="bg-gradient-to-r from-red-500 to-red-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Clay contents</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[6].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">g/kg</span>
                </div>

                <div class="bg-gradient-to-r from-red-500 to-red-600 py-4">
                    <h2 class="text-center text-white font-extrabold text-xl">Silt contents</h2>
                </div>
                <div class="p-6 flex flex-col items-center">
                    <span class="text-5xl font-bold text-gray-800">${data.properties.layers[8].depths[0].values['mean']}</span>
                    <span class="text-lg text-gray-500">g/kg</span>
                </div>
            </div>
            
            <!-- Additional Info -->
            <div class="px-6 py-4 bg-gray-50 rounded-b-2xl">
                <div class="flex justify-between text-sm text-gray-600">
                    <span>Last Reading:</span>
                    <span class="text-gray-800 font-medium">${new Date().toISOString().slice(0, 10)}</span>
                </div>
                <div class="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Soil Depth:</span>
                    <span class="text-gray-800 font-medium">0-5 cm</span>
                </div>
            </div>
        </div>

            `
            //body.innerHTML = card;
            let cont = document.createElement("div");
            cont.className = "max-w-xs bg-white rounded-xl shadow-md overflow-hidden m-4";
            cont.innerHTML = card;
            body.appendChild(cont)

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
                
            }
            load()
        }
        )

            
        }

        soil_provi();
};

l();

