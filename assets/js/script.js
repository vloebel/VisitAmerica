var stateNameSubmitEl = document.querySelector("#state-form");
var stateNameEl = document.querySelector("#state-name");
var parkListEl = document.querySelector("#park-list");
var parkHistoryEl = document.querySelector("#park-history");
var parkHeadingEl = document.getElementById("park-heading");

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
    latitude: [],
    longitude: [],
    fee: [],
    feeTitle: [],
    feeDescr: [],
    imageUrl: [],
    imageAlt: [],
    operatingHours:[],
    exceptionHours:[]
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
    retrievedParks = JSON.parse(retrievedParks);
    if (!retrievedParks) {
        retrievedParks =[];
    };
    return retrievedParks; 
};

getParkFullName = function() {
    var retrievedParkFullName = localStorage.getItem("parkFullName");
    retrievedParkFullName = JSON.parse(retrievedParkFullName);
    if (!retrievedParkFullName) {
        retrievedParkFullName ="";
    };
    return retrievedParkFullName; 
}

// checks to see if the park is already in parkHistory
var newPark = function(parkCode) {
    var foundPark = false;
    if (parkHistory) {
        for (i = 0; i < parkHistory.length; i++) {
            if (parkHistory[i].parkCode === parkChosen.parkCode) {
                foundPark = true;
            }
        }
    }
    return foundPark;
}
//saves Parks to localStorage so that the list of parks in the chosen states remains
// while checking out individual parks in 2nd window
var saveParks = function() {
    localStorage.setItem("parks", JSON.stringify(parks));
}

var getParks = function() {
    retrievedParks = localStorage.getItem("parks");
    retrievedParks = JSON.parse(retrievedParks);
    var parkFullName = getParkFullName();

    if (!retrievedParks) {
        initializeParks();
    } else {
        parks = retrievedParks;

        parkHeadingEl.textContent = `Parks in ${parkFullName}`;

        displayParks();
    }
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
            latitude: "",
            longitude: "",
            fee: "",
            feeTitle: "",
            feeDescr: "",
            imageUrl: "",
            imageAlt: "",
            operatingHours: "",
            exceptionHours: ""
        }
        console.log("in saveParkHistory and should change parkName in 2nd page");
        // search through parks to find park info that matches park user chose to save to
        // parkHistory
        for (i = 0; i < parks.parkCode.length; i++) {
            if (parkCode === parks.parkCode[i] && (!found)) {
                 parkSave.fee = parks.fee[i];
                 parkSave.feeTitle = parks.feeTitle[i];
                 parkSave.feeDescr = parks.feeDescr[i];
                 parkSave.latitude = parks.latitude[i];
                 parkSave.longitude = parks.longitude[i];
                 parkSave.imageUrl = parks.imageUrl[i];
                 parkSave.imageAlt = parks.imageAlt[i];
                 parkSave.operatingHours = parks.operatingHours[i];
                 parkSave.exceptionHours = parks.exceptionHours[i]
             }
        }
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
                saveParks();
                parkChosen.parkCode = event.target.id;
                parkChosen.parkName = event.target.textContent;
                localStorage.setItem("parkChosen", JSON.stringify(parkChosen));
                window.location.href = "./index2.html";
            })
            parkHistoryEl.appendChild(parkListItem); 
        }
    }    
};

document.getElementById("park-search").addEventListener("mouseenter", mouseEnter);
document.getElementById("park-search").addEventListener("mouseleave", mouseLeave);

function mouseEnter() {
    document.getElementById("park-search").style.backgroundColor = "#d8e7d5";
};

function mouseLeave() {
    document.getElementById("park-search").style.backgroundColor = "";
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
                saveParks();
                parkChosen.parkCode = event.target.id;
                // stephanie added stateName to parkName in parkHistory for 2nd page
                // 01.30.2021
                if (parks.stateName === "DC") {
                    parkChosen.parkName = event.target.textContent + ", " + "D.C.";
                } else {
                    parkChosen.parkName = event.target.textContent + ", " + parks.stateName;
                }
                saveParkHistory(parkChosen.parkCode, parkChosen.parkName);
                localStorage.setItem("parkChosen", JSON.stringify(parkChosen));
                window.location.href = "./index2.html";
            })
            
            parkListEl.appendChild(parkListItem);
        }
        
    }    
// end of displayParks function    
};
var initializeParks = function() {
    parks.stateName ="";
    parks.parkName.length = 0;
    parks.parkCode.length = 0;
    parks.latitude.length = 0;
    parks.longitude.length = 0;
    parks.fee.length = 0;
    parks.feeTitle.length = 0;
    parks.feeDescr.length = 0;
    parks.imageUrl.length = 0;
    parks.imageAlt.length = 0; 
    parks.operatingHours.length = 0;  
    parks.exceptionHours.length = 0; 
}

// some of the names of parks have random rumbers and symbols attached
// so these were removed to make the name readable
var fixParkName = function(parkName) {
    fixedParkName = parkName.replace(/[^a-zA-Z ]/g, "");
    return fixedParkName;
}

// fetches parks from the national park api
var fetchParks = function (stateName) {

    initializeParks();

    // gets national park information
    var apiParks = "https://developer.nps.gov/api/v1/parks?stateCode=" + stateName + "&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    fetch(apiParks).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        console.log("the data from Natl Park API", data.data);
        parks.stateName = stateName;
        for (i = 0; i < data.data.length; i++) {
            var fullNameAlphaOnly = fixParkName(data.data[i].fullName);
            parks.parkName[i] = fullNameAlphaOnly;
            parks.parkCode[i] = data.data[i].parkCode;
            parks.latitude[i] = data.data[i].latitude;
            parks.longitude[i] = data.data[i].longitude;
            if (data.data[i].entranceFees[0]) {
                parks.fee[i] = "$" + data.data[i].entranceFees[0].cost;
                parks.feeTitle[i] = data.data[i].entranceFees[0].title;
                parks.feeDescr[i] = data.data[i].entranceFees[0].description;
            } else {
                parks.fee[i] = "unavailable;"
            }
            if (data.data[i].images[0]) {
                parks.imageUrl[i] = data.data[i].images[0].url;
                parks.imageAlt[i] = data.data[i].images[0].altText;
            }
            if (data.data[i].operatingHours[0]) {
                parks.operatingHours[i] = data.data[i].operatingHours[0].description;
            } else {
                parks.operatingHours[i] = "unavailable";
            }
            // looking for exception hours (need to check whether each object or on api exists)
            var foundExceptionHours = false;
            if (data.data[i].operatingHours) {
                if (data.data[i].operatingHours[0]) {
                    if (data.data[i].operatingHours[0].exceptions) {
                        if (data.data[i].operatingHours[0].exceptions[0]) {
                            if (data.data[i].operatingHours[0].exceptions[0].name) {
                                foundExceptionHours = true;
                                // appending all the exceptions onto one string
                                for (j = 0; j < data.data[i].operatingHours[0].exceptions.length; j++) {
                                    if (data.data[i].operatingHours[0].exceptions[j].name) {
                                        // checks if something already in exceptionHours string
                                        if (!parks.exceptionHours[i]) {
                                            parks.exceptionHours[i] = "";
                                        } else if (parks.exceptionHours[i]) {
                                            parks.exceptionHours[i] += ", ";
                                        }
                                        parks.exceptionHours[i] += data.data[i].operatingHours[0].exceptions[j].name;
                                    }
                                }
                            }
                        }
                    }
                }
            } 
            if (!foundExceptionHours) {
                parks.exceptionHours[i] = "none listed";
            }
        // end of looping through parks
        }
        displayParks();        
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem finding National Parks in a state");
    });
// end of fetchParks function
};

cleanStart();
getParks();

stateNameEl.onchange = function() {
    cleanStart();
    // captures the full state name from the html code drop down menu
    // full state name to be used to in a header on the page rather than state abbreviation
    var stateAbbreviation = $(this).find('option:selected').attr('id')
    // the value of the selected element is the state name
    var stateNameHeading = (stateNameEl.value);
    parkHeadingEl.textContent = `Parks in ${stateNameHeading}`;
    // puts the full park name in localStorage so that when go to new window to
    // search a park and return to main page the full state name can still be displayed
    localStorage.setItem("parkFullName", JSON.stringify(stateNameHeading));

    fetchParks(stateAbbreviation);

}
