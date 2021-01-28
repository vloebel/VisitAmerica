// script for national park & monument information
var returnToSearchBtnEl = document.querySelector("#return-to-search");
var campgroundListEl = document.querySelector("#campground-list");
var visitorCenterEl = document.querySelector("#visitor-center");

var parkCode = "";
var campgrounds = [];
var visitorCenter = {
    name: "",
    description: "",
    imageUrl: "",
    city: "",
    state: ""
}; 

// forecasted park weather information
var parkForecast = {
    parkDate: [],
    parkTemp: [],
    parkHumidity: [],
    forecastIcon: []
};

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
    console.log("in displayVisitorCenter ", visitorCenter);
    if (visitorCenter) {
        var visitorCenterName = document.createElement("h4");
        visitorCenterName.textContent = visitorCenter.name;
        visitorCenterName.id = "visitor-center-name";
        var visitorCenterInfo = document.createElement("textarea");
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
var displayVisitorCentersb = function() {
    console.log("in displayVisitorCenters ", visitorCenters);
    if (visitorCenters) {
        for (i =0; i < visitorCenters.length; i++) {

            var visitorCenterName = document.createElement("h4");
            visitorCenterName.textContent = visitorCenters[i].name;
            visitorCenterName.id = "visitor-center-name";
            var visitorCenterInfo = document.createElement("textarea");
            visitorCenterInfo.textContent = visitorCenters[i].description;
            visitorCenterInfo.id = "visitor-center-info";
            var visitorCenterImage = document.createElement("img");
            visitorCenterImage.id = "visitor-center-image";
            visitorCenterImage.setAttribute("src", visitorCenters[i].imageUrl);
            
            visitorCentersEl.append(visitorCenterName, visitorCenterInfo, visitorCenterImage);
        }
    // let user know there were no campgrounds for this park
    } else {
        var visitorCenterInfo = document.createElement("textarea");
        visitorCenterInfo.textContent = "There are no visitor centers for this park";

        visitorCentersEl.appendChild(visitorCenterInfo);
    } 
// end of displayVisitorCentersb function    
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
    // gets national park information
    var apiVisitorCenters = "https://developer.nps.gov/api/v1/visitorcenters?q=" + parkCode + "&api_key=vRuVSXthFPHJlZJaS64mURPmJOnJUcmixeqKwanX";
    fetch(apiVisitorCenters).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data.data);
        // take first visitor center info available
        if (data.data) {
                visitorCenter.name = data.data[0].name;
                visitorCenter.description = data.data[0].description;
                
                if (data.data[0].images[0]) {
                    visitorCenter.imageUrl = data.data[0].images[0].url;
                }
                visitorCenter.city = data.data[0].addresses[0].city; 
                //.split(' ').join('');
                visitorCenter.state = data.data[0].addresses[0].stateCode;
        }
        console.log(visitorCenter);
        // fetchForecast(visitorCenter.city, visitorCenter.state);

        displayVisitorCenter();
        
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem finding visitor centers");
    });
// end of fetchVisitorCenter function
};
var fetchVisitorCentersb = function(parkCode) {
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
                    imageUrl: "",
                    latitude: 0,
                    longitude: 0
                };       
                visitorCenter.name = data.data[i].name;
                visitorCenter.description = data.data[i].description;
                
                if (data.data[i].images[0]) {
                    visitorCenter.imageUrl = data.data[i].images[0].url;
                }
                
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
// end of fetchVisitorCentersb function
};

var backToSearch = function(event) {
    event.preventDefault();
    // console.log(event.target);
    window.location.href = "./index.html";
}

var getParkCode = function() {
    parkCode = localStorage.getItem("parkCode");
    parkCode = JSON.parse(parkCode);

    fetchCampgrounds(parkCode);
    fetchVisitorCenter(parkCode);
};
/*
var initializeParkForecast = function() {
    parkForecast.forecastDate.length = 0;
    parkForecast.forecastTemp.length = 0;
    parkForecast.forecastHumidity.length = 0;
    parkForecast.forecastIcon.length = 0;
};

var fetchForecast = function (city,state) {
    // gets 5-day forecast
    var apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + state + ",US&units=imperial&appid=36badb05283e47c914843551c2046d2d";
    fetch(apiUrlForecast).then(function (response) {
        return response.json();
    })
    .then(function(data) {
        console.log("in fetchForecast", data);

        //initializeParkForecast();

        // capture forecasts 11am to 2pm  day + 1, 2, 3, 4, 5
        for (i = 0; i < data.list.length; i++) {
            //get forecast date in local time of city searched
            getForecastDate = moment.unix(data.list[i].dt).utcOffset(data.city.timezone / 3600);
            day = parseInt(getForecastDate.format("DD")) - parseInt(cityWeather.date.format("DD"));
            time = parseInt(getForecastDate.format("HH"));

            // capturing forecast mid-day the next day or current day
            if ((day>0 && time >= 11 && time < 14) || (cityForecast.forecastTemp.length === 4 && i === (data.list.length-1))) {
                parkForecast.forecastHumidity.push(data.list[i].main.humidity);
                parkForecast.forecastTemp.push(data.list[i].main.temp.toFixed(1));
                parkForecast.forecastDate.push(getForecastDate);
                parkForecast.forecastIcon.push(data.list[i].weather[0].icon);
            }
        }
        //displayWeather();
        //displayForecast();
        
    })
    .catch(function(error) {
        console.error(error);
        alert("Problem capturing 5-day forecast");
    });
// end of fetchForecast function
};
*/


getParkCode();

returnToSearchBtnEl.addEventListener("click", backToSearch);