// Ensures code runs after html doc loads
$(() => {
    //mobile menu
    const burgerIcon = document.querySelector('#burger');
    const navbarMenu = document.querySelector('#nav-links');
    
    burgerIcon.addEventListener('click', () => {
      navbarMenu.classList.toggle('is-active');
    });


    // Elements
    var userInputEl = $('#user-input');
    var searchButton = userInputEl.children('.buttons').children('button');
    console.log(searchButton);
    // ## Function to load response data as button elements ★ ##
    /* store important data in data-{blank} attributes */
    function loadEvents(eventsData) {
        var eventsArray = eventsData._embedded.events;
        console.log(eventsArray);
        
    }

    // ## Function to load weather data as a modal element ♥ ##
    function handleWeatherInformation(weatherData) {
        console.log("The handleWeatherInformation function is being called with "+weatherData +"as a parameter.");
    }
    
    // ## Event discovery api function ✈ ##
    function eventDiscovery(userInput) {
        // Take user input and inject into api call
        var requestUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + userInput + '&countryCode=US&apikey=iQvDtAeqOGfetg1ilGAAF6sw3ekPWih6';

        fetch(requestUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                    console.log(data);
                    if (data._embedded) {
                        loadEvents(data);
                    }
                    
                    // Pass data into the function to load responses onto page ★
            });
    }

    eventDiscovery("Super Bowl");

    // ## Event location api function ♣ ##
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
                console.log(data);
                console.log("our temperature is: "+data.current_weather.temperature + "° Fahrenheit.");
                //Take reponse and pass into modal function ♥
                handleWeatherInformation(data);
            })
    }

    // ## Event listener to take user input and pass to Ticketmaster event discovery api function ✈ ##
    userInputEl.submit(function (e) {
        e.preventDefault();
        var inputField = userInputEl.children('input');
        var userKeyword = inputField.val().trim();
        
        if (userKeyword.length > 0) {
            eventDiscovery(userKeyword);
        }
    });
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    searchButton.click(function (e) {
        e.preventDefault();
        var inputField = userInputEl.children('input');
        var userKeyword = inputField.val().trim();
        
        if (userKeyword.length > 0) {
            eventDiscovery(userKeyword);
        }

        eventDiscovery(userKeyword);
        searchHistory.push(userKeyword);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        setSearchHistory();
    });

    const SAVEDSEARCH = document.getElementById("searchedLast");
    const TITLESEARCH = document.getElementById("lastSearchedTitle");
    function setSearchHistory() {
        SAVEDSEARCH.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const SAVEDITEM = document.createElement("input");
            SAVEDITEM.setAttribute("type", "text");
            SAVEDITEM.setAttribute("readonly", true);
            SAVEDITEM.setAttribute("class", "block is-size-6 has-text-centered button");
            SAVEDITEM.setAttribute("value", searchHistory[i]);
            SAVEDITEM.addEventListener("click", function () {
                eventDiscovery(SAVEDITEM.value);
            })
            SAVEDSEARCH.append(SAVEDITEM);
            TITLESEARCH.setAttribute("class", "block is-size-4 has-text-centered");
        }
    }
    setSearchHistory();
    if (searchHistory.length > 0) {
        eventDiscovery(searchHistory[searchHistory.length - 1]);
    }

    // ## Event listener to take user input on button elements ##
    /* Take event id from button elements and pass into location api function ♣ */
});