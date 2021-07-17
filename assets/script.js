//api key
var apiKey = "97cd4515e44bacb188ec4436fcb18d9d";
//today's date
var date = moment().format("MM/DD/YYYY");
//submit button
var submitButtonEl = document.querySelector("#submit-btn");
//event listener for submit button
submitButtonEl.addEventListener("click", function (event) {
    event.preventDefault();
    //get cityname from search input value
    var cityName = document.querySelector("#city-input").value.trim();
    displayTodaysWeather(cityName);
    saveCity(cityName);
});

//function to display today's weather

function displayTodaysWeather(cityName) {
    var todaysWeatherEl = document.querySelector("#todays-weather");
    fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`
    )
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    todaysWeatherEl.innerHTML = `
        <h3>${data.name} (${date})</h3>
        <p>Temperature: ${data.main.temp} F </p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} mph</p>
        `;

        var lat = data.coord.lat;
        var lon = data.coord.lon;

        fiveDayDisplay(lat, lon);
        //calling a different API to get the UI index, which uses latitude and longitude instead of city name
        fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&appid=${apiKey}`
        )
        .then(function (response) {
            return response.json();
        })
        .then(function (data2) {
            todaysWeatherEl.innerHTML += `<p>UV Index: ${data2.current.uvi}</p>`;
        });
    });
}

//function to display 5 day weather
function fiveDayDisplay(lat, lon) {
    fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=imperial&appid=${apiKey}`
    )
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        document.querySelector("#week-weather").innerHTML = "";
        for (var i = 1; i < 6; i++) {
        //use inner html to display 5 day forecast
        document.querySelector("#week-weather").innerHTML += `
            <div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
            <div class="card-header">${moment.unix(data.daily[i].dt).format("MM/DD/YYYY")}</div>
            <div class="card-body">
            <h5 class="card-title"><img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" /></h5>
            <p class= "card-text"> Temp: ${data.daily[i].temp.day} F</p>
            <p class= "card-text"> Humidity: ${data.daily[i].humidity}%</p>
            </div>`
        ;}

    });
};

function renderCities() {
    document.querySelector("#city-list").innerHTML = "";
    //parse into an array and save that value into a variable
    var cityArray = JSON.parse(localStorage.getItem("cities"));
    cityArray.forEach((city)=> {
    document.querySelector("#city-list").innerHTML += `<li class="list-group-item city-item">${city}</li>`
    }) 
    //add city to the list
    document.querySelectorAll(".city-item").forEach((city) => {
    //add event listener for each item in the array, function executes on click
        city.addEventListener("click", function (event) {
            event.preventDefault();
            //get cityname from search input value
            var cityName = this.textContent
            displayTodaysWeather(cityName);
        });
    });
};

function saveCity(cityName) {
    //if statement to check if there is anything in local storage
    //create local storage with empty array
    if (!localStorage.getItem("cities")) {
    localStorage.setItem("cities", JSON.stringify([]));
    }
    //get value of the city input and push it to the array
    var cityArray = JSON.parse(localStorage.getItem("cities"));
    cityArray.push(cityName);
    //save back to local storage
    localStorage.setItem("cities", JSON.stringify(cityArray));
    renderCities();
};

renderCities();

