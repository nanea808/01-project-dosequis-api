// Ensures code runs after html doc loads
$(() => {
    // ## Function to load response data as button elements ★ ##
    /* store important data in data-{blank} attributes */

    // ## Function to load weather data as a modal element ♥ ##
    function handleWeatherInformation(weatherData) {
        console.log("The handleWeatherInformation function is being called with "+weatherData +"as a parameter.");
    }

    // ## Two Ticketmaster api functions ##
        // # Event discovery api function ✈ #
        /* 
        Take user input and inject into api call
        var requestUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + userInput + '&countryCode=US&apikey={apikey}'

        Fetch request using requestUrl

        Pass data into the function to load responses onto page ★
        */

        // # Event location api function ♣ #
        /* 
        Take event id and inject into api call
        var requestUrl = 'https://app.ticketmaster.com/discovery/v2/events/' + id + '&apikey={apikey}'

        Fetch request using requestUrl

        Pass lat and lon data into the weather api function ☁
        */

        getWeatherBasedOnLatLon(45.5152, 122.6784);

    // ## One weather api function ☁ ##
    function getWeatherBasedOnLatLon(enteredLat, enteredLon) {
        //Take lat and lon and inject into api call
        var queryURL = "https://api.open-meteo.com/v1/forecast?latitude=" + enteredLat + "&longitude=" + enteredLon + 
        "&current_weather=true&temperature_unit=fahrenheit&hourly=temperature_2m,relativehumidity_2m,windspeed_10m";
        //Fetch request
        fetch(queryURL)
            .then(function (response) {
                return response.json();
            })
            .then(function(data) {
                console.log("our data is: "+data);
                console.log("our temperature is: "+data.current_weather.temperature + "° Fahrenheit.");
                //Take reponse and pass into modal function ♥
                handleWeatherInformation(data);
            })
    }

    // ## Event listener to take user input and pass to Ticketmaster event discovery api function ✈ ##

    // ## Event listener to take user input on button elements ##
    /* Take event id from button elements and pass into location api function ♣ */
    
});