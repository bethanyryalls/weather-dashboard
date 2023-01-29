//variable to store APIKey
var APIKey = "5ff58d1744fba6ecdad3c248282449e9";


var cardTodayName = document.getElementById('cardTodayName');
var cardTodayDate = document.getElementById('cardTodayDate')
var cardTodayBody = document.getElementById('cardTodayBody');


//variable to store city name



//variable to get current date and time
var currentDate = moment().format('l');
var currentDateTime = moment().format('YYYY-MM-DD HH:MM:SS');

//set array for city history
var cityHistory = [];

var userCity;
var city;

$('#search-button').on('click', function (e) {
    // set user's input to 'city' for url
    var userCity = $('#search-input').val();
    //alert($('#search-input').val());
    //variable to store url
    e.preventDefault();
    var city = userCity;
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
    console.log(queryURL);
    
    console.log(city);
    
    // function to add data to today card
function weatherToday() {
    $.ajax({
       url: queryURL,
       method: 'GET'
   }).then(function (response) {
       cardTodayName.textContent = response.name;
       cardTodayDate.textContent = currentDate;
       temperature = response.main.temp;
       windSpeed = response.wind.speed;
       humidity = response.main.humidity;

       alert('Temperature: ' + temperature);
       alert('Wind Speed: ' + windSpeed);
       alert('Humidity: ' + humidity);
   })
   
}
weatherToday()

});