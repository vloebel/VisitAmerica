// script for national park & monument information
var returnToSearchBtnEl = document.querySelector("#return-to-search");
var campgroundListEl = document.querySelector("#campground-list");
var visitorCentersEl = document.querySelector("#visitor-centers");

var parkCode = "";
var campgrounds = [];
var visitorCenters = [];

// displays parks on the page in the state user chose
var displayCampgrounds = function() {
    
    if (campgrounds) {
        // console.log("in displayParks", parks.parkName.length);
        for (i =0; i < campgrounds.length; i++) {
            var campgroundListItem = document.createElement("li");
            campgroundListItem.textContent = campgrounds[i];
            campgroundListEl.appendChild(campgroundListItem);
        }
    // let user know there were no campgrounds for this park
    } else {
        var campgroundListItem = document.createElement("li");
        campgroundListItem.textContent = "There are no campgrounds for this park";
        campgroundListEl.appendChild(campgroundListItem);
    } 
// end of displayCampgrounds function    
};

var displayVisitorCenters = function() {
    console.log("in displayVisitorCenters ", visitorCenters);
    if (visitorCenters) {
        for (i =0; i < visitorCenters.length; i++) {
            var visitorCenterName = document.createElement("h4");
            visitorCenterName.textContent = visitorCenters[i].name;
            var visitorCenterInfo = document.createElement("textarea");
            visitorCenterInfo.textContent = visitorCenters[i].description;
            
            visitorCentersEl.append(visitorCenterName, visitorCenterInfo);
        }
    // let user know there were no campgrounds for this park
    } else {
        var visitorCenterInfo = document.createElement("textarea");
        visitorCenterInfo.textContent = "There are no visitor centers for this park";

        visitorCentersEl.appendChild(visitorCenterInfo);
    } 
// end of displayVisitorCenters function    
};


var fetchCampgrounds = function(parkCode) {
    // gets campgrounds from a particular national park
    var apiCampgrounds = "https://developer.nps.gov/api/v1/campgrounds?parkCode=" + parkCode + "&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    fetch(apiCampgrounds).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        //console.log(data.data);
        if (data.data) {
            for (i = 0; i < data.data.length; i++) {
                // console.log(data.data[i].fullName, data.data[i].parkCode);
                campgrounds[i] = data.data[i].name;
            }
        }
        displayCampgrounds();
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem finding campgrounds");
    });
// end of fetchCampgrounds function
};

var fetchVisitorCenters = function(parkCode) {
    // gets national park information
    var apiVisitorCenters = "https://developer.nps.gov/api/v1/visitorcenters?parkCode=" + parkCode + "&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    fetch(apiVisitorCenters).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data.data);
        if (data.data) {
            for (i = 0; i < data.data.length; i++) {  
                var visitorCenter = {
                    name: "",
                    description: "",
                    latitude: 0,
                    longitude: 0
                };       
                visitorCenter.name = data.data[i].name;
                visitorCenter.description = data.data[i].description;
                visitorCenter.latitude = data.data[i].latitude;
                visitorCenter.longitude = data.data[i].longitude;
                visitorCenters.push(visitorCenter);
            }
        }
        displayVisitorCenters();
        
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem finding visitor centers");
    });
// end of fetchVisitorCenters function
};


var backToSearch = function(event) {
    event.preventDefault();
    console.log(event.target);
    window.location.href = "./index.html";
}

var getParkCode = function() {
    parkCode = localStorage.getItem("parkCode");
    parkCode = JSON.parse(parkCode);

    fetchCampgrounds(parkCode);
    fetchVisitorCenters(parkCode);
};

getParkCode();

returnToSearchBtnEl.addEventListener("click", backToSearch);