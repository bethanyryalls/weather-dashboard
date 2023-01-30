//variable to store APIKey
var APIKey = "5ff58d1744fba6ecdad3c248282449e9";


var cardTodayName = document.getElementById('cardTodayName');
var cardTodayDate = document.getElementById('cardTodayDate');
var todayIcon = document.getElementById('todayIcon');
var todayTemp = $('#todayTemp');
var todayWind = $('#todayWind');
var todayHumidity = $('#todayHumidity');
var fiveForecastDiv = $('#fiveForecastDiv');


//variable to store city name



//variable to get current date and time
var currentDate = moment().format('DD/MM/YYYY');
var currentDateTime = moment().format('YYYY-MM-DD HH:MM:SS');

//set array for city history
var cityHistory = [];

var userCity;
var city;




//function to get lon and lat
function getWeather() {


    //set user's input to 'city' for url
    // var userCity = $('#search-input').val();
    // variable to store url
    // var city = userCity;
    var cityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=" + 1 + "&appid=" + APIKey;
    // get weather information for a city
    $.ajax({
        url: cityURL,
        method: "GET"
    }).then(function (lonLatResponse) {
        //store the city's longitude and latitude
        var lon = lonLatResponse[0].lon;
        var lat = lonLatResponse[0].lat;
        var cityName = lonLatResponse[0].name;

        // URL to get weather information using latitude and longitude
        var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric";


        // get weather information using the URL
        $.ajax({
            url: weatherURL,
            method: "GET"
        }).then(function (weatherResponse) {
            // display city name and current date
            cardTodayName.textContent = cityName;
            cardTodayDate.textContent = '(' + currentDate + ')';

            // get weather icon value and display icon using url
            var iconValue = weatherResponse.list[0].weather[0].icon;
            var imgURL = "http://openweathermap.org/img/wn/" + iconValue + ".png";
            var iconImg = $('<img>').attr('src', imgURL);
            $('#imgContainer').append(iconImg);

            //convert temp and display new temp, wind speed and humidity
            var temp = weatherResponse.list[0].main.temp;
            // var tempCelcius = tempKelvin - 273.15;
            // var temp = tempCelcius.toFixed(2);
            var wind = weatherResponse.list[0].wind.speed;
            var humidity = weatherResponse.list[0].main.humidity;

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
                var forecastCard = $('<div>');
                forecastCard.attr('class', 'card text-white bg-secondary mb-2 mr-2');
                fiveForecastDiv.append(forecastCard);

                var forecastHeader = $('<h4>');
                forecastHeader.attr('class', 'card-title px-3 pt-3');
                var mDate = moment(userForecastArray[i].date).format('DD/MM/YYYY');
                forecastHeader.text(mDate);
                forecastCard.append(forecastHeader);

                var forecastBody = $('<div>');
                forecastBody.attr('class', 'card-body pb-2 pt-0');
                forecastCard.append(forecastBody);

                var forecastIcon = $('<img>');
                forecastIcon.attr('class', 'icons ml-n2');
                forecastIcon.attr('src', 'https://openweathermap.org/img/wn/' + userForecastArray[i].icon + '.png');
                forecastBody.append(forecastIcon);

                var forecastTemp = $('<p>').text('Temperature: ' + userForecastArray[i].temp.toFixed(2) + '°C');
                forecastBody.append(forecastTemp);
                var forecastWind = $('<p>').text('Wind: ' + userForecastArray[i].wind + 'KPH');
                forecastBody.append(forecastWind);
                var forecastHumidity = $('<p>').text('Humidity: ' + userForecastArray[i].humidity + '%');
                forecastBody.append(forecastHumidity);
            }

        })
    })
    $('#search-input').val('');
};

$('#search-button').on('click', function (e) {

    //prevent default behaviour
    e.preventDefault();
    $('#today').removeClass('d-none');
    $('.forecastHeading').removeClass('d-none');
    // $('#clearHistory').removeClass('d-none');
    city = $(this).parent('.btnSearch').siblings('.textVal').val().trim();
    if (city === "") {
        return;
    };

    cityHistory.push(city);

    localStorage.setItem('city', JSON.stringify(cityHistory));
    $('#imgContainer').empty();
    fiveForecastDiv.empty();
    getHistory();
    getWeather();

    if (localStorage.getItem('city') !== null) {
        $('#clearHistory').show();
        $('.hr').show();
    } else {
        $('#clearHistory').hide();
        $('.hr').hide();
    };
});

// create buttons for search history
var historyContainer = $('#history');

// function to get history from local storage
function getHistory() {
    historyContainer.empty();

    let start = Math.max(cityHistory.length -6, 0);

    for (let i = start; i < cityHistory.length; i++) {
        // var btnDivEl = $('<div>');
        var btnEl = $('<button>').text(cityHistory[i]);

        // btnDivEl.addClass('row histBtnRow');
        btnEl.addClass('btn btn-secondary btn-block histBtn');
        btnEl.attr('type', 'button');

        historyContainer.prepend(btnEl);
        // btnDivEl.append(btnEl);
    } 
    

    // show data when history button clicked
    $('.histBtn').on('click', function (e) {
        e.preventDefault();
        $('#today').removeClass('d-none');
        $('.forecastHeading').removeClass('d-none');
        city = $(this).text();
        $('#imgContainer').empty();
        fiveForecastDiv.empty();
        getWeather();
    });

    if (!city) {
        return;
    }

};



$('#clearHistory').on('click', function(e) {
    e.preventDefault();
    $(this).hide();
    $('.hr').hide();
    localStorage.clear();
    $('.list-group').empty();
    localStorage.removeItem('city');
    cityHistory = [];
    city = [];
    cityHistory.push(city.trim());
    localStorage.setItem('city', JSON.stringify(cityHistory));
    
});




function init() {
    var cityHistoryList = JSON.parse(localStorage.getItem('city'));

    if (cityHistoryList !== null) {
        cityHistory = cityHistoryList;
    };

    if (localStorage.getItem('city') !== null) {
        $('#clearHistory').show();
        $('.hr').show();
    } else {
        $('#clearHistory').hide();
        $('.hr').hide();
    };

    getHistory();
    // getWeather();
};



init();