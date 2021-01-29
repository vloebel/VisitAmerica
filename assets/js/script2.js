// script for national park & monument information
var parkChosenEl = document.querySelector("#park-chosen");
var returnToSearchBtnEl = document.querySelector("#return-to-search");
var campgroundListEl = document.querySelector("#campground-list");
var visitorCenterEl = document.querySelector("#visitor-center");

// park info pulled from localStorage
var park = {
    parkCode: "",
    parkName: "",
    latitude: "",
    longitude: "",
    imageUrl: "",
    imageAlt: ""
};

// campground array
var campgrounds = [];
// visitorCenter information
var visitorCenter = {
    name: "",
    description: "",
    imageUrl: "",
    imageAlt: ""
}; 
// forecasted park weather information
var parkForecast = {
    forecastDate: [],
    forecastTemp: [],
    forecastIcon: []
};
// from localStorage
var parkHistory = [];

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

var displayVisitorCenter = function() {
    if (visitorCenter) {
        var visitorCenterName = document.createElement("h4");
        visitorCenterName.textContent = visitorCenter.name;
        visitorCenterName.id = "visitor-center-name";
        var visitorCenterInfo = document.createElement("p");
        visitorCenterInfo.textContent = visitorCenter.description;
        visitorCenterInfo.id = "visitor-center-info";
        var visitorCenterImage = document.createElement("img");
        visitorCenterImage.id = "visitor-center-image";
        visitorCenterImage.setAttribute("src", visitorCenter.imageUrl);
            
        visitorCenterEl.append(visitorCenterName, visitorCenterInfo, visitorCenterImage);
    // let user know there were no campgrounds for this park
    } else {
        var visitorCenterInfo = document.createElement("textarea");
        visitorCenterInfo.textContent = "There are no visitor centers for this park";

        visitorCenterEl.appendChild(visitorCenterInfo);
    } 
// end of displayVisitorCenter function    
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

var fetchVisitorCenter = function(parkCode) {
    // gets national park visitor center
    var apiVisitorCenters = "https://developer.nps.gov/api/v1/visitorcenters?q=" + parkCode + "&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    fetch(apiVisitorCenters).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        console.log("fetchVisitorCenter data", data.data);
        // take first visitor center info available
        if (data.data[0]) {
            visitorCenter.name = data.data[0].name;
            visitorCenter.description = data.data[0].description;
                    
            if (data.data[0].images[0]) {
                visitorCenter.imageUrl = data.data[0].images[0].url;
                visitorCenter.imageAlt = data.data[0].images[0].altText;
            }
        }

        displayVisitorCenter();
        
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem finding visitor centers");
    });
// end of fetchVisitorCenter function
};

var backToSearch = function(event) {
    event.preventDefault();
    window.location.href = "./index.html";
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

var getParkIndex = function(parkChosen) {
    // finds the park is already in parkHistory
    var parkIndex = -1;
    console.log("parkHistory ", parkHistory);
    console.log("parkChosen", parkChosen);
    if (parkHistory) {
        for (i = 0; i < parkHistory.length; i++) {
            if (parkHistory[i].parkCode === parkChosen.parkCode) {
                parkIndex = i;      
            }
        }
    }
    return parkIndex;
}

var getParkChosen = function() {
    var parkChosen = localStorage.getItem("parkChosen");
    parkChosen = JSON.parse(parkChosen);
    parkChosenEl.textContent = parkChosen.parkName;

    parkHistory = getParkHistory();
    var parkIndex = getParkIndex(parkChosen);
    park.parkCode = parkHistory[parkIndex].parkCode;
    park.parkName = parkHistory[parkIndex].parkName;
    park.latitude = parkHistory[parkIndex].latitude;
    park.longitude = parkHistory[parkIndex].longitude;
    park.imageUrl = parkHistory[parkIndex].imageUrl;
    park.imageAlt = parkHistory[parkIndex].imageAlt;

    fetchCampgrounds(park.parkCode);
    fetchVisitorCenter(park.parkCode);
    fetchForecast(park.latitude, park.longitude);
    
};

var initializeParkForecast = function() {
    parkForecast.forecastDate.length = 0;
    parkForecast.forecastTemp.length = 0;
    parkForecast.forecastIcon.length = 0;
};

var displayForecast = function () {
    // displays forecasted weather elements on page
    for (i = 0; i < 5; i++) {
        var cardContainerEl = document.querySelector("#card" + i.toString());
        var cardDateEl = document.querySelector("#card-date-" + i.toString());
        console.log("cardDateEl", cardDateEl);
        cardDateEl.textContent = parkForecast.forecastDate[i];
        var cardIconEl = document.querySelector("#card-icon-" + i.toString());
        cardIconEl.src = "http://openweathermap.org/img/wn/" + parkForecast.forecastIcon[i] + "@2x.png";
        var cardTempEl = document.querySelector("#card-temp-" + i.toString());
        cardTempEl.textContent = parkForecast.forecastTemp[i];

    }
    // end of displayForecast Function
}

var fetchForecast = function (latitude, longitude) {
    // gets 5-day forecast
    var apiUrlForecast = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=36badb05283e47c914843551c2046d2d";
    
    fetch(apiUrlForecast).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        //console.log("in fetchForecast", data);
        initializeParkForecast();
        // capture 5-day forecast
        if (data) {
            for (i = 0; i < 5; i++) {
                parkForecast.forecastDate.push(moment.unix(data.daily[i].dt).utcOffset(data.timezone / 3600).format("MMM Do, YYYY"));
                parkForecast.forecastTemp.push(data.daily[i].temp.day.toFixed(1));
                parkForecast.forecastIcon.push(data.daily[i].weather[0].icon);
            }           
        }
        else {
            console.log("no forecast available");
        }
        displayForecast();
        
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem capturing 5-day forecast");
    });
// end of fetchForecast function
};

getParkChosen();

returnToSearchBtnEl.addEventListener("click", backToSearch);