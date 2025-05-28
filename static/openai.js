/*

async function laucher() {
    let res = await fetch("https://openrouter.ai/api/v1", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apikey}`,
          "HTTP-Referer": 'https://smartsaha.vercel.app/', // Optional. Site URL for rankings on openrouter.ai.
          "X-Title": "smart saha", // Optional. Site title for rankings on openrouter.ai.
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1:free",
          "messages": [
            {
              "role": "user",
              "content": "What is the meaning of life?"
            }
          ]
        })
      });
    
    //let body = document.getElementById("main");
    
    
    console.log(res);
};

laucher();
*/

//load from supabase
//const supabase_ = supabase.createClient(supabaseUrl, supabaseKey);

/*

async function checker() {
  const session = await supabase_.auth.getSession();
  if (!session.data.session) {
    // Redirect or block access
    window.location.href = "/signin.html";
  }
  else {console.log("connected succefulyy");
    //const user = await getCurrentUser();
    let us = document.getElementById('username_');

    us.textContent = session.data.session.user.email;
  }
    };
checker();
*/

let signin = window.location.origin + "/sigin/"; //replace this by sign in in views
async function checker(supabase_, signin_) {
  const session = await supabase_.auth.getSession();
  if (!session.data.session) {
    // Redirect or block access
    window.location.href = signin_;
  }
  else{
    console.log("success!");
  }
}

async function launcher(prompt, element) {  
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apikey}`,
        "HTTP-Referer": "https://smartsaha.vercel.app/",
        "X-Title": "smart saha",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          {
            role: "user",
            content: `${prompt}`
          }
        ]
      })
    });

  
    const data = await res.json();
    //console.log(data);
    //let body = document.getElementById("main");
    //element = document.getElementById("main");
    //body.innerHTML = `<p>${data.choices[0].message.content}}</p>`
     //= `<p>${data.choices[0].message.content}}</p>`
    element.innerHTML = `
        <div class="bg-gray-200 p-3 rounded-xl text-gray-800 max-w-[75%]">
          "${data.choices[0].message.content}"
        </div>
      `
    //console.log(data);

  }

//load supabase : load user and parcels, then get all the data need , then build the prompt 
let apilink = window.location.origin + "/apikey/";
//let apilink = "supabase-proxy/";

//console.log(link);
//please change the  

//functions utils for nasa 
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

function calculateMean(array) {
  if (array.length === 0) {
    return 0; // Handle empty array case
  }
  const sum = array.reduce((acc, val) => acc + val, 0);
  return sum / array.length;
};

//en of functions utils for nasa


async function supfetch(apilink) {
  const response = await fetch(apilink);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  const data_ = await response.json();
  const supabase_ = supabase.createClient(data_.supabaseurl, data_.supabasekey);
  checker(supabase_, signin);
  const session = await supabase_.auth.getSession();
  const { data, error } = await supabase_
      .from("main_parcels_smartsaha_xy") //parcels x_y
      .select("*")
      .eq("owner_uuid", session.data.session.user.email);
      if (error) {
        console.error(`Error fetching the data from ${tableName}`, error);
        return null; // Return null or handle error accordingly
      } else {
        //
        // here you load : 1. all the parcels, 2. call the api : 
        // 1.1. the power api, 1.2. soil and later NDVI
        // 3. input into deepseek 4. get the answer
        let user = session.data.session.user.email;
        console.log(user);
        let props = data.map(row => {
                    let properties = { ...row };
                    return properties;
                });
        //let inputs = [];
        //console.log(props);
        let allinputs = [];
        console.log(data);
        //props.forEach(row => {
        for (const row of props) {
          //soil
            let inputs = [];

            let soillink = `https://api.openepi.io/soil/property?lon=${row.longitude}&lat=${row.latitude}&depths=0-5cm&properties=bdod&properties=phh2o&properties=nitrogen&properties=soc&properties=cec&properties=cfvo&properties=clay&properties=sand&properties=silt&values=mean`;
            //console.log(soillink);
            //const soildata = async () => { 
            async function soilmain() {
              
            
              let res = await fetch(soillink);
              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }
              else {
                //let last = await res.json();
                let soildata = await res.json();

                //console.log(soildata.properties.layers[2].depths[0].values['mean']);
                //return last;
                inputs.push({"Nitrogen" : soildata.properties.layers[2].depths[0].values['mean'],
                  "unit" : "cg/kg"
                });
                //console.log(soildata.properties.layers[2].depths[0].value['mean']);
                inputs.push({"ph" : soildata.properties.layers[1].depths[0].values['mean']/10});
                inputs.push({"soil_organic_carbon" : soildata.properties.layers[3].depths[0].values['mean'],
                  "unit" : "dg/kg"
                });
                inputs.push({"cation_exchange_capacity" : soildata.properties.layers[4].depths[0].values['mean'],
                  "unit" : "mmol(c)/kg"
                });
                inputs.push({"bulk_density" : soildata.properties.layers[0].depths[0].values['mean'], 
                  "unit" : "cg/cm³"
                });
                inputs.push({"clay_contents" : soildata.properties.layers[6].depths[0].values['mean'], 
                  "sand_content" : soildata.properties.layers[7].depths[0].values['mean'],
                  "silt_content" : soildata.properties.layers[8].depths[0].values['mean'],
                  "unit" : "g/kg"
                });
              }
            };
            await soilmain();
            console.log(inputs)

            //console.log(soildata);

            //inputs.push({"parcelID" : row.uuid});
            //inputs.push({"ParcelName" : row.row.parcel_name});
            //console.log(soildata);
            /*
            inputs.push({"Nitrogen" : soildata.properties.layers[2].depths[0].value['mean'],
              "unit" : 'cg/kg'
            });
            console.log(soildata.properties.layers[2].depths[0].value['mean']);
            inputs.push({"ph10" : soildata.properties.layers[1].depths[0].values['mean']});
            inputs.push({"soil_organic_carbon" : soildata.properties.layers[3].depths[0].values['mean'],
              "unit" : 'dg/kg'
            });
            inputs.push({"cation_exchange_capacity" : soildata.properties.layers[4].depths[0].values['mean'],
              "unit" : 'mmol(c)/kg'
            });
            inputs.push({"bulk_density" : soildata.properties.layers[0].depths[0].values['mean'], 
              "unit" : 'cg/cm³'
            });
            inputs.push({"clay_contents" : soildata.properties.layers[6].depths[0].values['mean'], 
              "sand_content" : soildata.properties.layers[7].depths[0].values['mean'],
              "silt_content" : soildata.properties.layers[8].depths[0].values['mean'],
              "unit" : 'g/kg'
            });
            */

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

            //load NASA 
            let climputs = [];
            const naseapi = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,T2MDEW,T2MWET,TS,T2M_RANGE,T2M_MAX,T2M_MIN,PRECTOTCORR,EVLAND,GWETPROF&community=RE&longitude=${row.longitude}&latitude=${row.latitude}&start=${start}&end=${end}&format=JSON`;
            //const climdata = async () => {
            async function climdata() {
              let resul = await fetch(naseapi).then(res => res.json());
              //return await res.json();
              //return resul
              //afindra eto daholo ny eo ambany
              let fetchedData = [];
              fetchedData = Object.entries(resul.properties.parameter).map(([key, values]) => ({
                  date: key,
                  ...values
                }));

              let test = transformDataForCSV(fetchedData);
              let arr_prec = [];
              let land_ev =[];
              let soil_moist = [];
              let day = [];

              //test.forEach((element) => {
              for (const element of test) {
                if (element.PRECTOTCORR >= 0) {
                    //arr_t2m.push(element.T2M);
                    day.push(element.date);
                    arr_prec.push(element.PRECTOTCORR);
                    land_ev.push(element.EVLAND);
                    soil_moist.push(element.GWETPROF);
                    //let bilan = summer(element.PRECTOTCORR) - summer(element.EVLAND)
                }
                  };
            
            //let climputs = [];
            climputs.push({"rain_vs_evaporation" : summer(arr_prec) - summer(land_ev),
              "unit" : "mm"
            });
            climputs.push({"soil_moisture_mean" : calculateMean(soil_moist),
              "units" : "%"
            });
            };
            /*
            let fetchedData = [];
            fetchedData = Object.entries(climdata.properties.parameter).map(([key, values]) => ({
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
            
            //let climputs = [];
            climputs.push({"rain_vs_evaporation" : summer(arr_prec) - summer(land_ev),
              "unit" : 'mm'
            });
            climputs.push({"soil_moisture_mean" : calculateMean(soil_moist),
              "units" : '%'
            });
            */
            await climdata();
            console.log(JSON.stringify(inputs));
            console.log(climputs);


            let allin = {"parcelID" : row.uuid,
                           "ParcelName" : row.parcel_name,
                           "longitude" : row.longitude,
                           "latitude" : row.latitude, 
                           "soildata" : inputs, 
                           "climdata" : climputs};
            allinputs.push(allin);

        };
        console.log(JSON.stringify(allinputs, null, 2));//error 
        //return allinputs;
        return JSON.stringify(allinputs, null, 2);

        
        
      }
  
};

async function main() {
  try {
    const result = await supfetch(apilink);
    //console.log(result);
    let promp = `You are a smart agronomy assistant. Based on the following farms data, provide a brief recommendation on crop growing, on watering, 
    natural soil treatement and crop management: Farms Data: ${result}`;
    return promp
  } catch (err) {
    console.error("Error in supfetch:", err);
  }
}

//main(); // Call your main async function

//let results = supfetch(apilink); // change the apilink into link in production
//console.log(results);


async function launcher_(prompt, element, apikey_) {  
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apikey_}`,
      "HTTP-Referer": "https://smartsaha.vercel.app/",
      "X-Title": "smart saha",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: `${prompt}`
        }
      ]
    })
  });


//load supabase : load user and parcels, then get all the data need , then build the prompt 

  const data = await res.json();
  //console.log(data);
  //let body = document.getElementById("main");
  //element = document.getElementById("main");
  //body.innerHTML = `<p>${data.choices[0].message.content}}</p>`
    //= `<p>${data.choices[0].message.content}}</p>`
  element.innerHTML = `
      <div class="bg-gray-200 p-3 rounded-xl text-gray-800 max-w-[75%]">
        
        "${data.choices[0].message.content}"

      </div>
    `
  //"${data.choices[0].message.content}"
  //console.log(data);

}

  //launcher();

  
  const chatBox = document.getElementById('chat-box');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  //lauch the first message
  let faimessage = document.createElement('div');
  faimessage.ClassName = 'flex';
  fetch("apikey/").then(res => res.json()).then(data => {
    async function waiter () {
      let res = await main();
      console.log(res);
      launcher_(prompt = res, element = faimessage, apikey_ = data.apikey);
      chatBox.appendChild(faimessage);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
    waiter();
    
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const message = input.value.trim();
    if (message === '') return;

    // Add user's message
    const userMessage = document.createElement('div');
    userMessage.className = 'flex justify-end';
    userMessage.innerHTML = `
      <div class="bg-indigo-500 text-white p-3 rounded-xl max-w-[75%]">${message}</div>
    `;
    chatBox.appendChild(userMessage);



    // Add AI response (static for now)
    setTimeout(() => {
      const aiMessage = document.createElement('div');
      aiMessage.className = 'flex';
      //launcher(prompt = message, element = aiMessage)
      //maonmboka eto
      fetch("apikey/").then(res => res.json()).then(data => {
        launcher_(prompt = message, element = aiMessage, apikey_ = data.apikey);
        chatBox.appendChild(aiMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
      });
      

      /*
      aiMessage.innerHTML = `
        <div class="bg-gray-200 p-3 rounded-xl text-gray-800 max-w-[75%]">
          You said: "${message}"
        </div>
      `;
      */
      //chatBox.appendChild(aiMessage);
      //chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);

    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
  });
  
/*
now you need to input first the data from each parcels
such as the evaporation vs rain
*/