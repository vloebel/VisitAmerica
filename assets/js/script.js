var stateNameSubmitEl = document.querySelector("#state-form");
var stateNameEl = document.querySelector("#state-name");
var parkListEl = document.querySelector("#park-list");
var parkHistoryEl = document.querySelector("#park-history");
var parkCode = '';

var parks = {
    stateName: "",
    parkName: [],
    parkCode: []
};
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
    retrievedParks = JSON.parse(retrievedParks);
    if (!retrievedParks) {
        retrievedParks =[];
    };
    return retrievedParks; 
};

// saves new parks to parkHistory to localStorage if they aren't already there
var saveParkHistory = function() {

    var foundPark = false;
    // search for parks to see if already in parks array
    if (parkHistory) {
        for (i = 0; i < parkHistory.length; i++) {
            if ((parkHistory[i].stateName === parks.stateName )) {
                foundPark = true;
            }
        }
    }
    // if park is not in parkHistory array then save to localStorage
    if (!foundPark && parks.stateName) {
        parkHistory.push(parks);
        localStorage.setItem("parkHistory", JSON.stringify(parkHistory));
    } 
};

// puts park search history on page
var displayParkHistory = function(parkHistory) {

    refresh(parkHistoryEl);

    if (parkHistory) {
        for (i =0; i < parkHistory.length; i++) {
            for (j = 0; j < parkHistory[i].parkName.length; j++) {
                var parkListItem = document.createElement("li");
                parkListItem.id = parkHistory[i].parkCode[j];
                parkListItem.textContent = parkHistory[i].parkName[j];
                // adds event listeners on each list item
                parkListItem.addEventListener("click", function (event) {
                    event.preventDefault();
                    cleanStart();
                    parkCode = event.target.id;
                    console.log("in displayParkHistory ", parkCode);
                    localStorage.setItem("parkCode", JSON.stringify(parkCode));

                    //fetchCampgrounds(event.target.id);
                    window.location.href = "./index2.html";
                })
                parkHistoryEl.appendChild(parkListItem);
            }
        }
    }    
};

// displays parks on the page in the state user chose
var displayParks = function() {
    
    cleanStart();
    
    if (parks) {

        // console.log("in displayParks", parks.parkName.length);
        for (i =0; i < parks.parkName.length; i++) {
            var parkListItem = document.createElement("li");
            parkListItem.id =  parks.parkCode[i];
            parkListItem.textContent = parks.parkName[i];
            
            parkListItem.addEventListener("click", function (event) {
                event.preventDefault();
                parkCode = event.target.id;
                console.log("In displayParks ", parkCode);
                localStorage.setItem("parkCode", JSON.stringify(parkCode));
                window.location.href = "./index2.html";
                // put fetch in 2nd javascript
                //fetchCampgrounds(event.target.id);
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
        // console.log(data.data);
        parks.stateName = stateName;
        for (i = 0; i < data.data.length; i++) {
            parks.parkName[i] = data.data[i].fullName;
            parks.parkCode[i] = data.data[i].parkCode;
        }

        displayParks();

        saveParkHistory(parks);
        
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem finding National Parks in a state");
    });
// end of fetchParks function
};

var getState = function (event) {

    event.preventDefault();
    
    // cleanStart();

    var stateName = stateNameEl.value.trim().toUpperCase();

    fetchParks(stateName);

}

cleanStart();

stateNameSubmitEl.addEventListener("submit", getState);