
// HAPPY CAMPER SCRIPT
var stateNameSubmitEl = document.querySelector("#state-form");
var stateNameEl = document.querySelector("#state-name");
var parkListEl = document.querySelector("#park-list");
var parks = {
    stateName: "",
    parkName: [],
    parkCode: []
};

// clears out HTML in element with particular id
var refresh = function (idToRefresh) {
    idToRefresh.innerHTML = "";
}

// displays parks on the page in the state user chose
var displayParks = function() {

    if (parks) {
        console.log("in displayParks", parks.parkName.length);
        for (i =0; i < parks.parkName.length; i++) {
            var parkListItem = document.createElement("li");
            parkListItem.id = "park-" + parks.parkCode[i];
            parkListItem.textContent = parks.parkName[i];
            parkListItem.addEventListener("click", function (event) {
                event.preventDefault();
                console.log(event.target);
                //fetchCampgrounds(event.target.textContent);
            })
            parkListEl.appendChild(parkListItem);
        }
    }    
// end of displayParks function    
};

var fetchCampgrounds = function (parkCode) {
    // gets national park information
    //var apiParks = "https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    var apiCampgrounds = "https://developer.nps.gov/api/v1/campgrounds?parkCode=" + parkCode + "&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    //var apiParks = "https://developer.nps.gov/api/v1/parks?start=151&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    fetch(apiCampgrounds).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data.data);
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem finding campgrounds");
    });
// end of fetchParks function
};

var fetchParks = function (stateName) {
    // gets national park information
    //var apiParks = "https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    var apiParks = "https://developer.nps.gov/api/v1/parks?stateCode=" + stateName + "&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    //var apiParks = "https://developer.nps.gov/api/v1/parks?start=151&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    fetch(apiParks).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        // console.log(data.data);
        parks.stateName = stateName;
        for (i = 0; i < data.data.length; i++) {
            // console.log(data.data[i].fullName, data.data[i].parkCode);
            parks.parkName[i] = data.data[i].fullName;
            parks.parkCode[i] = data.data[i].parkCode;
        }

        displayParks();
        // console.log("parks = ", parks.parkName.length);
        
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem finding National Parks in a state");
    });
// end of fetchParks function
};

var getParks = function (event) {

    event.preventDefault();
    
    // cleanStart();

    var stateName = stateNameEl.value.trim().toUpperCase();
    // console.log(stateName);

    fetchParks(stateName);
}


stateNameSubmitEl.addEventListener("submit", getParks);