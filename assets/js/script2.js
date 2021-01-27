// script for national park & monument information
returnToSearchBtnEl = document.querySelector("#return-to-search");
campgroundListEl = document.querySelector("#campground-list");
var parkCode = '';
var campgrounds = [];

// displays parks on the page in the state user chose
var displayCampgrounds = function() {
    
    if (campgrounds) {
        console.log("in displayCampgrounds");

        // console.log("in displayParks", parks.parkName.length);
        for (i =0; i < campgrounds.length; i++) {
            var campgroundListItem = document.createElement("li");
            campgroundListItem.textContent = campgrounds[i];
            console.log("in displayCampgrounds for loop")
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

var fetchCampgrounds = function(parkCode) {
    // gets national park information
    //var apiParks = "https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    var apiCampgrounds = "https://developer.nps.gov/api/v1/campgrounds?parkCode=" + parkCode + "&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    //var apiParks = "https://developer.nps.gov/api/v1/parks?start=151&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    fetch(apiCampgrounds).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data.data);
        if (data.data) {
            for (i = 0; i < data.data.length; i++) {
                // console.log(data.data[i].fullName, data.data[i].parkCode);
                campgrounds[i] = data.data[i].name;
                console.log("campgrounds[i] = ", campgrounds);
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


var backToSearch = function(event) {
    event.preventDefault();
    console.log(event.target);
    window.location.href = "./index.html";
}

var getParkCode = function() {
    parkCode = localStorage.getItem("parkCode");
    parkCode = JSON.parse(parkCode);

    fetchCampgrounds(parkCode);
};

getParkCode();
returnToSearchBtnEl.addEventListener("click", backToSearch);