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
    })
};
        // var lat = data.coord.lat;
        // var lon = data.coord.lon;
