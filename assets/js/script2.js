// script for national park & monument information
var parkChosenEl = document.querySelector("#park-chosen");
var returnToSearchBtnEl = document.querySelector("#return-to-search");
var campgroundListEl = document.querySelector("#campground-list");
var visitorCenterEl = document.querySelector("#visitor-center");

// parkChosen by user pulled from localStorage
var parkChosen = {
    parkCode: "",
    parkName: ""
};

// campground array
var campgrounds = [];
// visitorCenter information
var visitorCenter = {
    name: "",
    description: "",
    imageUrl: "",
    imageAlt: "",
    city: "",
    state: ""
}; 
// forecasted park weather information
var parkForecast = {
    forecastDate: [],
    forecastTemp: [],
    forecastHumidity: [],
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
        console.log(data.data);
        // take first visitor center info available
        if (data.data[0]) {
            visitorCenter.name = data.data[0].name;
            visitorCenter.description = data.data[0].description;
                    
            if (data.data[0].images[0]) {
                visitorCenter.imageUrl = data.data[0].images[0].url;
                visitorCenter.imageAlt = data.data[0].images[0].altText;
            }
            visitorCenter.city = data.data[0].addresses[0].city; 
            visitorCenter.state = data.data[0].addresses[0].stateCode;
        }
        console.log("before fetchForecast ", visitorCenter);
        fetchForecast(visitorCenter.city, visitorCenter.state);
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

var getParkChosen = function() {
    parkChosen = localStorage.getItem("parkChosen");
    parkChosen = JSON.parse(parkChosen);
    parkChosenEl.textContent = parkChosen.parkName;
    fetchCampgrounds(parkChosen.parkCode);
    fetchVisitorCenter(parkChosen.parkCode);
};

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

        initializeParkForecast();

        // capture forecasts 11am to 2pm  day + 1, 2, 3, 4, 5
        if (data.list) {
            for (i = 0; i < data.list.length; i++) {
                //get forecast date in local time of city searched
                getForecastDate = moment.unix(data.list[i].dt).utcOffset(data.city.timezone / 3600);
                time = parseInt(getForecastDate.format("HH"));

                // capturing forecast mid-day the next day or current day
                if (time >= 11 && time < 14)  {
                    parkForecast.forecastHumidity.push(data.list[i].main.humidity);
                    parkForecast.forecastTemp.push(data.list[i].main.temp.toFixed(1));
                    parkForecast.forecastDate.push(getForecastDate);
                    parkForecast.forecastIcon.push(data.list[i].weather[0].icon);
                }
            }
            console.log("in fetch forecast ", parkForecast);
        }
        else {
            console.log("no forecast available");
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

getParkChosen();

returnToSearchBtnEl.addEventListener("click", backToSearch);