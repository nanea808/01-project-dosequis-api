// Ensures code runs after html doc loads
$(() => {
    //mobile menu
    const burgerIcon = document.querySelector('#burger');
    const navbarMenu = document.querySelector('#nav-links');

    burgerIcon.addEventListener('click', () => {
      navbarMenu.classList.toggle('is-active');
    //   navbarMenu.toggle("class", "navbar-item has-text-black");
    });


    // Elements
    var userInputEl = $('#user-input');

    var searchButton = userInputEl.children('.buttons').children('button');
    var ourModalsList = $('#modal-list');
    console.log(searchButton);
    var cardsEl = $('#cards');
    var numberOfHistoryItems = 5;

    console.log(cardsEl);
    // ## Function to load response data as button elements ★ ##
    /* store important data in data-{blank} attributes */
    function loadEvents(eventsData) {
        var eventsArray = eventsData._embedded.events;
        console.log(eventsArray);

        for (var x = 0; x < eventsArray.length; x++) {
            // element variables
            var imageUrl = eventsArray[x].images[0].url;
            var title = eventsArray[x].name;
            var location = eventsArray[x]._embedded.venues[0].city.name + ", " + eventsArray[x]._embedded.venues[0].state.name;
            var desc = eventsArray[x].classifications[0].genre.name;
            if (!eventsArray[x].dates.start.dateTBA && !eventsArray[x].dates.start.dateTBD) {
                var date = eventsArray[x].dates.start.dateTime;
                var time = eventsArray[x].dates.start.localTime;
            }

            // Parent
            var cardEl = $('<div>');
            cardEl.attr('class', 'card');

            // cardContent: child of Parent
            var contentEl = $('<div>');
            contentEl.attr('class', 'card-content');
            
            // Media: child of cardContent
            var cardMediaEl = $('<div>');
            cardMediaEl.attr('class', 'media');
            
            // Children of Media ^
            var mediaLeft = $('<div>'); // Media Left
            mediaLeft.attr('class', 'media-left');
                var mediaFigure = $('<figure>'); // Child of Media Left
                mediaFigure.attr('class', 'image is-128x128');

                var mediaImage = $('<img>'); // Child of ^
                mediaImage.attr('src', imageUrl); // ## Image ##

            var mediaContent = $('<div>'); // Media Content
            mediaContent.attr('class', 'media-content');
                var mContentTitle = $('<p>');
                mContentTitle.attr('class', 'title is-4');
                mContentTitle.text(title); // ## Title ##
                var mContentSubTitle = $('<p>');
                mContentSubTitle.attr('class', 'subtitle is-6');
                mContentSubTitle.text(location); // ## Subtitle ##

            // Content: child of cardContent
            var cardContentEl = $('<div>');
            cardContentEl.attr('class', 'content');
            cardContentEl.text(desc); // ## Description ##
            
            // Children of Content ^
            var dateTime = $('<time>');
            dateTime.attr('datetime', date); // ## Date + Time ##
            dateTime.text(dayjs(date).format('h:mm A - D MMM YYYY'));

            var brEl = $('<br>');

            // Appends                    
                    mediaFigure.append(mediaImage);
                    mediaLeft.append(mediaFigure);
                cardMediaEl.append(mediaLeft);
                    mediaContent.append(mContentTitle);
                    mediaContent.append(mContentSubTitle);
                cardMediaEl.append(mediaContent);
            contentEl.append(cardMediaEl); // Media: child of Content

                cardContentEl.append(brEl);
                cardContentEl.append(dateTime);
            contentEl.append(cardContentEl); // cardContent: child of Content

            
            cardEl.append(contentEl); // Content: child of Parent
            cardsEl.append(cardEl); // Parent
        }
    }

    // ## Function to load weather data as a modal element ♥ ##
    function handleWeatherInformation(weatherData) {
        console.log("The handleWeatherInformation function is being called with "+JSON.stringify(weatherData) +"as a parameter.");
        /*things we care about: 
            temp in Fahrenheit
            windspeed in mph
            humidity as a percentage
            forecast weather (all of the above, except as a forecast)--see note
        */
        ourModalsList.children().eq(0).text(weatherData.current_weather.temperature + "° Fahrenheit.");
        ourModalsList.children().eq(1).text(weatherData.current_weather.windspeed + " mph");
        //***meteo doesn't offer humidity for current weather. ourModalsList.children().eq(2).text(weatherData.current_weather.humidity + "% humidity");

        // Suggested: we need to figure out the event date/time and get the forecast if it's within the 7-day window.
        //this function will need to be passed the date/time of the event to figure out what data to display.
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
    getWeatherBasedOnLatLon(45.523064, -122.676483);

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
    //create a variable titled searchHistory equal to the contents of our search array in storage.
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    //what happens when someone enters a search.
    searchButton.click(function (e) {
        e.preventDefault();
        var inputField = userInputEl.children('input');
        var userKeyword = inputField.val().trim();
        
        if (userKeyword.length > 0) {
            eventDiscovery(userKeyword);
        }

        if(userKeyword != "") {
            eventDiscovery(userKeyword);
            searchHistory.push(userKeyword);
            localStorage.setItem("search", JSON.stringify(searchHistory));
        }
        setSearchHistory();
    });

    const SAVEDSEARCH = document.getElementById("searchedLast");
    const TITLESEARCH = document.getElementById("lastSearchedTitle");
    function setSearchHistory() {
        SAVEDSEARCH.innerHTML = "";
        let totalHistoryLength = searchHistory.length;
        console.log(totalHistoryLength);
        //we start at the most recent history items
        for (let i = 0; i <= numberOfHistoryItems; i++) {
            if(searchHistory[totalHistoryLength-i]) {
                const SAVEDITEM = document.createElement("input");
                SAVEDITEM.setAttribute("type", "text");
                SAVEDITEM.setAttribute("readonly", true);
                SAVEDITEM.setAttribute("class", "block is-size-6 has-text-centered button");
                SAVEDITEM.setAttribute("value", searchHistory[totalHistoryLength-i]);
                SAVEDITEM.addEventListener("click", function () {
                    eventDiscovery(SAVEDITEM.value);
                })
                SAVEDSEARCH.append(SAVEDITEM);
                TITLESEARCH.setAttribute("class", "block is-size-4 has-text-centered");
            }
        }
    }
    setSearchHistory();
    if (searchHistory.length > 0) {
        eventDiscovery(searchHistory[searchHistory.length - 1]);
    }

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
      
        // Clear History button
        const NEWSEARCH = document.getElementById("newSearch");
        NEWSEARCH.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        setSearchHistory();
        location.reload();
    })
});



