//variable to store APIKey
var APIKey = "5ff58d1744fba6ecdad3c248282449e9";

// variables to store elements
var cardTodayName = $('#cardTodayName');
var cardTodayDate = $('#cardTodayDate');
var todayIcon = $('#todayIcon');
var todayTemp = $('#todayTemp');
var todayWind = $('#todayWind');
var todayHumidity = $('#todayHumidity');
var fiveForecastDiv = $('#fiveForecastDiv');

//variable to get current date and time
var currentDate = moment().format('DD/MM/YYYY');

//set array for city history
var cityHistory = [];

var userCity;
var city;


//function to get weather from both apis
function getWeather() {

    // variable to store url
    var cityURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=" + 1 + "&appid=" + APIKey;

    // get lon and lat for inputted city
    $.ajax({
        url: cityURL,
        method: "GET"
    }).then(function (lonLatResponse) {

        if (lonLatResponse.length === 0) {
            $('#cardTodayName').hide();
            $('#cardTodayDate').hide();
            $('#cardTodayBody').hide();
            $('#forecast').hide();
            $('.errorMessage').show();
            return;
        }
        //store the city's longitude and latitude
        var lon = lonLatResponse[0].lon;
        var lat = lonLatResponse[0].lat;
        var cityName = lonLatResponse[0].name;

        // URL to get weather information using latitude and longitude
        var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";


        // get weather information using the weather URL
        $.ajax({
            url: weatherURL,
            method: "GET"
        }).then(function (weatherResponse) {

            //if no data received, show error message and hide all other information
            if (weatherResponse.length === 0) {
                $('#cardTodayName').hide();
                $('#cardTodayDate').hide();
                $('#cardTodayBody').hide();
                $('#forecast').hide();
                $('.errorMessage').show();
                return;
            }

            //show all other information if no errors
            $('#cardTodayName').show();
            $('#cardTodayDate').show();
            $('#cardTodayBody').show();
            $('#forecast').show();
            $('#today').show();
            $('.errorMessage').hide();

            // display city name and current date
            cardTodayName.text(cityName);
            cardTodayDate.text('(' + currentDate + ')');

            // get weather icon value and display icon using url
            var iconValue = weatherResponse.list[0].weather[0].icon;
            var imgURL = "https://openweathermap.org/img/wn/" + iconValue + ".png";
            var iconImg = $('<img>').attr('src', imgURL);
            $('#imgContainer').append(iconImg);

            //set temp, wind speed and humidity to values
            var temp = weatherResponse.list[0].main.temp;
            var wind = weatherResponse.list[0].wind.speed;
            var humidity = weatherResponse.list[0].main.humidity;

            // setting text using variables
            todayTemp.text('Temp: ' + temp + ' °C');
            todayWind.text('Wind : ' + wind + ' KPH');
            todayHumidity.text('Humidity: ' + humidity + '%');

            // store forecasted weather information
            var fiveDayArray = weatherResponse.list;
            var userForecastArray = [];

            // loop through weather info for next 5 days
            $.each(fiveDayArray, function (index, value) {
                forecastObj = {
                    // store date, temp, icon, humidity and wind speed
                    date: value.dt_txt.split(' ')[0],
                    temp: value.main.temp,
                    icon: value.weather[0].icon,
                    humidity: value.main.humidity,
                    wind: value.wind.speed
                }

                // only store the weather info for 9:00:00
                if (value.dt_txt.split(' ')[1] === "09:00:00") {
                    userForecastArray.push(forecastObj);
                }
            })

            //loop through the stored weather info and display it in bootstrap cards
            for (let i = 0; i < userForecastArray.length; i++) {
                //create card div, add classes and add to main forecast div
                var forecastCard = $('<div>');
                forecastCard.attr('class', 'card text-white bg-secondary mb-2 mr-2');
                fiveForecastDiv.append(forecastCard);

                //create heading for title, add classes, set date format using moment
                //add to forecast card
                var forecastHeader = $('<h4>');
                forecastHeader.attr('class', 'card-title px-3 pt-3');
                var mDate = moment(userForecastArray[i].date).format('DD/MM/YYYY');
                forecastHeader.text(mDate);
                forecastCard.append(forecastHeader);

                //create div for forecast body, add classes, add to forecast card
                var forecastBody = $('<div>');
                forecastBody.attr('class', 'card-body pb-2 pt-0');
                forecastCard.append(forecastBody);

                //create image, get icon value, add to url and add to body div
                var forecastIcon = $('<img>');
                forecastIcon.attr('class', 'icons ml-n2');
                forecastIcon.attr('src', 'https://openweathermap.org/img/wn/' + userForecastArray[i].icon + '.png');
                forecastBody.append(forecastIcon);

                //add temp, wind and humidity text and values to forecast body dib
                var forecastTemp = $('<p>').text('Temperature: ' + userForecastArray[i].temp.toFixed(2) + '°C');
                forecastBody.append(forecastTemp);
                var forecastWind = $('<p>').text('Wind: ' + userForecastArray[i].wind + 'KPH');
                forecastBody.append(forecastWind);
                var forecastHumidity = $('<p>').text('Humidity: ' + userForecastArray[i].humidity + '%');
                forecastBody.append(forecastHumidity);
            }

        });
    });

    //clear the search input
    $('#search-input').val('');
};

//when search button clicked
$('#search-button').on('click', function (e) {

    //prevent default behaviour
    e.preventDefault();
    //show weather divs
    $('#today').removeClass('d-none');
    $('.forecastHeading').removeClass('d-none');
    //find value of text input
    city = $(this).parent('.btnSearch').siblings('.textVal').val().trim();
    if (city === "") {
        return;
    };

    //add city name to cityHistory array
    cityHistory.push(city);

    //add inputted city to local storage
    localStorage.setItem('city', JSON.stringify(cityHistory));
    //refresh the containers so they're ready for new input
    $('#imgContainer').empty();
    fiveForecastDiv.empty();
    getHistory();
    getWeather();

    //if city in localStorage show the clearHistory button and hr
    if (localStorage.getItem('city') !== null) {
        $('#clearHistory').removeClass('d-none');
        $('#clearHistory').show();
        $('.hr').removeClass('d-none');
        $('.hr').show();
        //otherwise hide it
    } else {
        $('#clearHistory').hide();
        $('.hr').hide();
    };
});

// variable holding history button container
var historyContainer = $('#history');

// function to get history from local storage
function getHistory() {
    //empty container so we don't get repeats
    historyContainer.empty();

    //only show last 6 searches
    let start = Math.max(cityHistory.length - 6, 0);

    for (let i = start; i < cityHistory.length; i++) {
        //create button with text as city name entered
        var btnEl = $('<button>').text(cityHistory[i]);
        btnEl.addClass('btn btn-secondary btn-block histBtn');
        btnEl.attr('type', 'button');

        historyContainer.prepend(btnEl);
    };


    // show data when history button clicked
    $('.histBtn').on('click', function (e) {
        e.preventDefault();
        //show containers for data
        $('#today').removeClass('d-none');
        $('.forecastHeading').removeClass('d-none');
        //set city to the text of button
        city = $(this).text();
        //removing existing data from containers
        $('#imgContainer').empty();
        fiveForecastDiv.empty();
        //get the weather data using new city value
        getWeather();
    });

};



$('#clearHistory').on('click', function (e) {
    e.preventDefault();
    //hide the clearHistory button,hr line and weather data
    $(this).hide();
    $('.hr').hide();
    $('#forecast').hide();
    $('#today').hide();
    //clear localStorage
    localStorage.clear();
    $('.list-group').empty();
    localStorage.removeItem('city');
    //reset city history array so doesn't show twice
    cityHistory = [];
});




function init() {
    //get localStorage data and add to variable
    var cityHistoryList = JSON.parse(localStorage.getItem('city'));

    //if cityHistoryList is not empty, add to cityHistory array
    if (cityHistoryList !== null) {
        cityHistory = cityHistoryList;
        //show clear history button and hr line
        $('#clearHistory').removeClass('d-none');
        $('#clearHistory').show();
        $('.hr').removeClass('d-none');
        $('.hr').show();
    } else {
        //if empty hide them
        $('#clearHistory').hide();
        $('.hr').hide();
    };

    getHistory();
};

//hide error message at start
$('.errorMessage').hide();

init();