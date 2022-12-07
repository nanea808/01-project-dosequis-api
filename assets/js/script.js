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
    var ourModalsList = $('#modal-list');
    console.log(searchButton);
    // ## Function to load response data as button elements ★ ##
    /* store important data in data-{blank} attributes */
    function loadEvents(eventsData) {
        var eventsArray = eventsData._embedded.events;
        console.log(eventsArray);
        
    }

    // ## Function to load weather data as a modal element ♥ ##
    function handleWeatherInformation(weatherData) {
        console.log("The handleWeatherInformation function is being called with "+JSON.stringify(weatherData) +"as a parameter.");
        /*things we care about: 
            temp in Fahrenheit
            windspeed in mph
            humidity as a percentage
            forecast weather (all of the above, except as a forecast)
        */
        ourModalsList.children().eq(0).text(weatherData.current_weather.temperature + "° Fahrenheit.");
        ourModalsList.children().eq(1).text(weatherData.current_weather.windspeed + " mph");
        ourModalsList.children().eq(2).text(weatherData.current_weather.humidity + "% humidity");
        //note: we need to decide how to format forecast data. Suggested: we need to figure out the event date/time and get the forecast if it's within the 7-day window.
        //this function will need to be passed the date/time of the event.
        //if the event is outside our forecast window we can display only the current weather and a message: "event is outside available forecast."
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
    //the following example lat/lon is for Portland, OR: 
    getWeatherBasedOnLatLon(45.5152, 122.6784);

    // ## One weather api function ☁ ##
    function getWeatherBasedOnLatLon(enteredLat, enteredLon) {
        //Take lat and lon and inject into api call
        var queryURL = "https://api.open-meteo.com/v1/forecast?latitude=" + enteredLat + "&longitude=" + enteredLon + 
        "&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&hourly=temperature_2m,relativehumidity_2m,windspeed_10m";
        //Fetch request
        fetch(queryURL)
            .then(function (response) {
                return response.json();
            })
            .then(function(data) {
                // console.log("our data is: "+JSON.stringify(data));
                console.log("function getWeatherBasedOnLatLon() just ran; at the requested location our temperature is: "+data.current_weather.temperature + "° Fahrenheit.");
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

    searchButton.click(function (e) {
        e.preventDefault();
        var inputField = userInputEl.children('input');
        var userKeyword = inputField.val().trim();
        
        if (userKeyword.length > 0) {
            eventDiscovery(userKeyword);
        }
    });

    // ## Event listener to take user input on button elements ##
    /* Take event id from button elements and pass into location api function ♣ */


        // Functions to open and close a modal
        function openModal($el) {
          $el.classList.add('is-active');
        }
      
        function closeModal($el) {
          $el.classList.remove('is-active');
        }
        
        // Add a click event on buttons to open a specific modal
        (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
          const modal = $trigger.dataset.target;
          const $target = document.getElementById(modal);
      
          $trigger.addEventListener('click', () => {
            openModal($target);
          });
        });
      
        // Add a click event on various child elements to close the parent modal
        (document.querySelectorAll('.modal-close, .delete') || []).forEach(($close) => {
          const $target = $close.closest('.modal');
      
          $close.addEventListener('click', () => {
            closeModal($target);
          });
        });
      
});



