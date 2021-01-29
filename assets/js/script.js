var stateNameSubmitEl = document.querySelector("#state-form");
var stateNameEl = document.querySelector("#state-name");
var parkListEl = document.querySelector("#park-list");
var parkHistoryEl = document.querySelector("#park-history");
// parkChose parkCode and parkName will be saved to localStorage
var parkChosen = {
    parkCode: "",
    parkName: "",
};
// parks contains info on the parks from a state
var parks = {
    stateName: "",
    parkName: [],
    parkCode: [],
    fee: [],
    feeTitle: [],
    feeDescr: []
};
// saved to localStorage array of single parks and info
var parkHistory = [];

// clears out HTML in element with particular id
var refresh = function (idToRefresh) {
    idToRefresh.innerHTML = "";
}

var cleanStart = function() {

    parkHistory = getParkHistory();
    displayParkHistory(parkHistory);

    refresh(parkListEl);
}

// retrieves prior parks searched from localStorage
var getParkHistory = function(){

    var retrievedParks = localStorage.getItem("parkHistory");
    // clear out localStorage as soon as I grab it so only one search history
    // at a time
    //localStorage.clear();
    retrievedParks = JSON.parse(retrievedParks);
    if (!retrievedParks) {
        retrievedParks =[];
    };
    return retrievedParks; 
};

// checks to see if the park is already in parkHistory
var newPark = function(parkCode) {
    var foundPark = false;
    if (parkHistory) {
        for (i = 0; i < parkHistory.length; i++) {
            if (parkHistory[i].parkCode === parkChosen.parkCode) {
                console.log("park match");
                foundPark = true;
            }
        }
    }
    return foundPark;
}

// saves park chosen to parkHistory to localStorage if they aren't already there
var saveParkHistory = function(parkCode, parkName) {
    // checks if park chosen already in parkHistory
   found = newPark(parkCode);
   
   // if park is not in parkHistory array then save to localStorage
   if (!found) {
        var parkSave = {
            stateName: parks.stateName,
            parkName: parkName,
            parkCode: parkCode,
            fee: "",
            feeTitle: "",
            feeDescr: ""
        }
        // search through parks to find park info that matches park user chose to save to
        // parkHistory
        for (i = 0; i < parks.parkCode.length; i++) {
            if (parkCode === parks.parkCode[i] && (!found)) {
                 parkSave.fee = parks.fee[i];
                 parkSave.feeTitle = parks.feeTitle[i];
                 parkSave.feeDescr = parks.feeDescr[i];
             }
        }
        console.log("parkSave = ", parkSave);
        parkHistory.push(parkSave);
        localStorage.setItem("parkHistory", JSON.stringify(parkHistory));
    } 
// end of saveParkHistory
};

// puts park search history on page
var displayParkHistory = function(parkHistory) {

    refresh(parkHistoryEl);

    if (parkHistory) {
        for (i =0; i < parkHistory.length; i++) {
            var parkListItem = document.createElement("li");
            parkListItem.id = parkHistory[i].parkCode;
            parkListItem.textContent = parkHistory[i].parkName;
            // adds event listeners on each list item
            parkListItem.addEventListener("click", function (event) {
                event.preventDefault();
                cleanStart();
                parkChosen.parkCode = event.target.id;
                parkChosen.parkName = event.target.textContent;
                localStorage.setItem("parkChosen", JSON.stringify(parkChosen));
                window.location.href = "./index2.html";
            })
            parkHistoryEl.appendChild(parkListItem);
            
        }
    }    
};

// displays parks on the page in the state user chose
var displayParks = function() {
    
    cleanStart();
    
    if (parks) {

        for (i =0; i < parks.parkName.length; i++) {
            var parkListItem = document.createElement("li");
            parkListItem.id =  parks.parkCode[i];
            parkListItem.textContent = parks.parkName[i];
            
            parkListItem.addEventListener("click", function (event) {
                event.preventDefault();
                parkChosen.parkCode = event.target.id;
                parkChosen.parkName = event.target.textContent;
                saveParkHistory(parkChosen.parkCode, parkChosen.parkName);
                localStorage.setItem("parkChosen", JSON.stringify(parkChosen));
                window.location.href = "./index2.html";
            })
            
            parkListEl.appendChild(parkListItem);
        }
    }    
// end of displayParks function    
};

var fetchParks = function (stateName) {

    // gets national park information
    var apiParks = "https://developer.nps.gov/api/v1/parks?stateCode=" + stateName + "&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    fetch(apiParks).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        console.log("the data from Natl Park API", data.data);
        parks.stateName = stateName;
        for (i = 0; i < data.data.length; i++) {
            parks.parkName[i] = data.data[i].fullName;
            parks.parkCode[i] = data.data[i].parkCode;
            if (data.data.entranceFees) {
                parks.fee[i] = "$" + data.data[i].entranceFees[0].cost;
                parks.feeTitle[i] = data.data[i].entranceFees[0].title;
                parks.feeDescr[i] = data.data[i].entranceFees[0].description;
            } else {
                parks.fee[i] = "unavailable;"
            }

        }
        console.log("checking on parks ", parks);

        displayParks();

        // saveParkHistory(parks);
        
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem finding National Parks in a state");
    });
// end of fetchParks function
};


cleanStart();

stateNameEl.onchange = function() {
  fetchParks(stateNameEl.value);
}
