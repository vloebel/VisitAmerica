// script for national park & monument information
var parkChosenEl = document.querySelector("#park-chosen");
var returnToSearchBtnEl = document.querySelector("#return-to-search");
var campgroundListEl = document.querySelector("#campground-list");
var visitorCenterEl = document.querySelector("#visitor-center");
// new 1/29 visitorCenterErrorEl used to hide extra heading if we find a visitor center
var visitorCenterErrorEl = document.querySelector("#visitor-center-error");
// New 1/29 - fiveDayEl used to show/hide weather display
var fiveDayEl = document.querySelector("#five-day-forecast");
var noWeatherEl = document.querySelector("#no-weather-forecast");
// stephanie added 1.30.2021 - needed to append image after park name
var parkChosenContainerEl = document.querySelector("#park-chosen-container");
// stephanie added 1.30.2021 - needed to append park fee
var parkFeeEl = document.querySelector("#park-fee");
// stephanie added 1.30.2021 - needed to append park fee description
var parkFeeDescrEl = document.querySelector("#park-fee-description");

// park info pulled from localStorage
var park = {
    parkCode: "",
    parkName: "",
    latitude: "",
    longitude: "",
    fee: "",
    feeTitle: "",
    feeDescr: "",
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

// stephanie added 1.30.2021 to display park entrance fee
var displayFee = function(fee, feeDescr) {
    if (fee) {
        parkFeeEl.textContent = "Entrance Fee: " + fee;
        parkFeeDescrEl.textContent = feeDescr;
    }
}

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
        campgroundListItem.textContent = "Sorry, no campground information available";
        campgroundListEl.appendChild(campgroundListItem);
    } 
// end of displayCampgrounds function    
};

var displayVisitorCenter = function() {
  if (visitorCenter) {
      // vl 1/29: tried to write directly to the h4 in the index2 file but
      // I was stepping on something - so I'm just going to hide it if
      // we are displaying this visitor center. Keep in mind the "h4" element
      // is hardcoded here so if we change the other ones it won't match
    visitorCenterErrorEl.style.display = "none";
    // vl: I'm really stuck here - not sure I understand the code and
    // no matter what I do we either seem to abort in the weather section
    // or fall through here - never get to the else part i dont' think
    console.log('visitor center object: ${visitorCenter');
        var visitorCenterName = document.createElement("h4");
        visitorCenterName.textContent = visitorCenter.name;
        visitorCenterName.id = "visitor-center-name";
        var visitorCenterInfo = document.createElement("p");
        visitorCenterInfo.textContent = visitorCenter.description;
        visitorCenterInfo.id = "visitor-center-info";
        var visitorCenterImage = document.createElement("img");
        visitorCenterImage.id = "visitor-center-image";
    visitorCenterImage.setAttribute("src", visitorCenter.imageUrl);
    visitorCenterImage.setAttribute("height", "300px");

        visitorCenterEl.append(visitorCenterName, visitorCenterInfo, visitorCenterImage);
    }
  else {
    visitorCenterErrorEl.style.display = "block";
    console.log("no visitor center information was available");
    // the error message is already there
    }
    //     var visitorCenterInfo = document.createElement("textarea");
    //     visitorCenterInfo.textContent = "There are no visitor centers for this park";

    //     visitorCenterEl.appendChild(visitorCenterInfo);
    // } 
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
      // vl: start with a no campground message and then overwrite if good
      // that catches both bad data and good data with no name maybe?
      campgrounds[0] = "No campground information available";
        if (data.data) {
            for (i = 0; i < data.data.length; i++) {
                campgrounds[i] = data.data[i].name;
            }
          }
        displayCampgrounds();
    })
    .catch(function(error) {
        console.error(error);
      campgrounds[0] = "No campground information available";
      displayCampgrounds();

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
            displayVisitorCenter();
        }

        
    })
    .catch(function(error) {
        console.error(error);
        visitorCenterErrorEl.style.display = "block";
        console.log("API Catch- visitor center fetch failed");
    
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
    // stephanie added fee info to park 1.30.2021
    park.fee = parkHistory[parkIndex].fee;
    park.feeTitle = parkHistory[parkIndex].feeDescr;
    park.feeDescr = parkHistory[parkIndex].feeDescr;
    park.imageUrl = parkHistory[parkIndex].imageUrl;
    park.imageAlt = parkHistory[parkIndex].imageAlt;
    // Stephanie added park image 01.30.2021
    if (park.imageUrl) {
        var parkImage = document.createElement("img");
        parkImage.setAttribute("src", park.imageUrl);
        parkImage.setAttribute("alt", park.imageAlt);
        parkChosenContainerEl.appendChild(parkImage);
    }
    // stephanie added displayFee function call 1.30.2021
    displayFee(park.fee, park.feeTitle);
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
          // turn on the weather div & turn off the "no weather" notice
          noWeatherEl.style.display = "none";
          fiveDayEl.style.display = "block";
          displayForecast();

        }
        else {
          // turn off the weather div
          console.log("no forecast available");
          noWeatherEl.style.display = "block";
          fiveDayEl.style.display = "none";

        }
        //vl: moved function call up into if(data) displayForecast();
        
    })
    .catch(function(error) {
      console.error(error);
      console.log("Greetings from weather data catch function");
      // vl: deleted alert - turn off the weather display div
      fiveDayEl.style.display = "none";
      noWeatherEl.style.display = "block";
    });
// end of fetchForecast function
};

///////////////////////////////////////////
// vl 1/29: Set default display for show/hide headings

// fiveDayEl.style.display = "none";
// noWeatherEl.style.display = "block";
// visitorCenterErrorEl.style.display = "block";







getParkChosen();

returnToSearchBtnEl.addEventListener("click", backToSearch);