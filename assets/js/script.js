//variable to store APIKey
var APIKey = "5ff58d1744fba6ecdad3c248282449e9";


var cardTodayName = document.getElementById('cardTodayName');
var cardTodayDate = document.getElementById('cardTodayDate');
var todayIcon = document.getElementById('todayIcon');
var cardTodayBody = document.getElementById('cardTodayBody');
var todayUl = document.getElementById('todayUl');
var todayTemp = $('#todayTemp');
var todayWind = $('#todayWind');
var todayHumidity = $('#todayHumidity');


//variable to store city name



//variable to get current date and time
var currentDate = moment().format('l');
var currentDateTime = moment().format('YYYY-MM-DD HH:MM:SS');

//set array for city history
var cityHistory = [];

var userCity;
var city;


// on click of search button
$('#search-button').on('click', function (e) {
    
    //prevent default behaviour
    e.preventDefault();
    //set user's input to 'city' for url
    var userCity = $('#search-input').val();
    // variable to store url
    var city = userCity;
    var cityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=" + 1 + "&appid=" + APIKey;

    //function to get lon and lat
    function getWeather() {
        $.ajax({
            url: cityURL,
            method: "GET"
        }).then(function (lonLatResponse) {
            var lon = lonLatResponse[0].lon;
            var lat = lonLatResponse[0].lat;
            var cityName = lonLatResponse[0].name;

            var weatherURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

            $.ajax({
                url: weatherURL,
                method: "GET"
            }).then(function (weatherResponse) {
                cardTodayName.textContent = cityName;
                cardTodayDate.textContent = currentDate;
                var iconValue = weatherResponse.list[0].weather[0].icon;
                var imgURL = "http://openweathermap.org/img/wn/" + iconValue + ".png";
                var iconImg = $('<img>').attr('src', imgURL);
                $('#imgContainer').append(iconImg);
                console.log(weatherURL);

                var tempKelvin = weatherResponse.list[0].main.temp;
                var tempCelcius = tempKelvin - 273.15;
                var temp = tempCelcius.toFixed(2);
                console.log(temp);
                var wind = weatherResponse.list[0].wind.speed;
                var humidity = weatherResponse.list[0].main.humidity;

                todayTemp.text('Temp: ' + temp + ' °C');
                todayWind.text('Wind : ' + wind + ' KPH');
                todayHumidity.text('Humidity: ' + humidity + '%');



            })
        })
    }

    getWeather();

});



// $('#search-button').on('click', function (e) {
//     // set user's input to 'city' for url
//     var userCity = $('#search-input').val();
//     //alert($('#search-input').val());
//     //variable to store url
//     e.preventDefault();
//     var city = userCity;
//     var cityURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
//     console.log(cityURL);
    
//     console.log(city);
    
//     // function to add data to today card
// function weatherToday() {
//     $.ajax({
//        url: queryURL,
//        method: 'GET'
//    }).then(function (response) {
        

//        cardTodayName.textContent = response.name;
//        cardTodayDate.textContent = currentDate;
//        temperature = response.main.temp;
//        windSpeed = response.wind.speed;
//        humidity = response.main.humidity;

//        alert('Temperature: ' + temperature);
//        alert('Wind Speed: ' + windSpeed);
//        alert('Humidity: ' + humidity);
//    })
   
// }
// weatherToday()

// });


// var city = userCity;
// var queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=" + 1 + "&appid=" + APIKey;



