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
            if (eventsArray[x].classifications[0].genre.name != "Undefined") {
                var desc = eventsArray[x].classifications[0].genre.name;
            }
            if (!eventsArray[x].dates.start.dateTBA && !eventsArray[x].dates.start.dateTBD) {
                var date = eventsArray[x].dates.start.dateTime;
            }

            var lat = eventsArray[x]._embedded.venues[0].location.latitude;
            var lon = eventsArray[x]._embedded.venues[0].location.longitude;

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

            // Line Break
            var brEl = $('<br>');

            // Modal trigger
            var modalTrigger = $('<button>');
            modalTrigger.attr('class', 'js-modal-trigger');
            modalTrigger.attr('data-target', 'our-modal');
            modalTrigger.text('Open weather modal');

            // Data
            cardEl.attr('data-dateTime', date);
            cardEl.attr('data-lat', lat);
            cardEl.attr('data-lon', lon);

            // Appends                    
            mediaFigure.append(mediaImage);
            mediaLeft.append(mediaFigure);
            cardMediaEl.append(mediaLeft);
            mediaContent.append(mContentTitle);
            mediaContent.append(mContentSubTitle);
            cardMediaEl.append(mediaContent);
            contentEl.append(cardMediaEl); // Media: child of Content

            contentEl.append(modalTrigger);

            cardContentEl.append(brEl);
            cardContentEl.append(dateTime);
            contentEl.append(cardContentEl); // cardContent: child of Content

            cardEl.append(contentEl); // Content: child of Parent
            cardsEl.append(cardEl); // Parent
        }
    }

    // ## Function to load weather data as a modal element ♥ ##

    function handleWeatherInformation(weatherData, eventDateTime) {
        //the ticketmaster API formats as ISO8601 without the timezone. Example: 
        let weatherApiComparisonDate = eventDateTime.slice(0,13) + ":00";
        console.log(weatherApiComparisonDate);
        let rightNow = dayjs().unix();
        let sevenDaysFromNow = rightNow + 604800;
        let reformattedDate = dayjs(eventDateTime.slice(0,10)).unix();
        console.log("0-10 is: "+eventDateTime.slice(0,10));
        console.log(reformattedDate);
        //adding hours
        reformattedDate += (eventDateTime.slice(11,13) * 60 * 60);
        console.log("11-13 is: "+eventDateTime.slice(11,13));
        console.log(reformattedDate);
        //adding minutes
        reformattedDate += (eventDateTime.slice(14,16) * 60);
        console.log("14-16 is: "+eventDateTime.slice(14,16));

        console.log("our unix is supposed to read: "+1670628600);
        console.log("instead, our unix reads: "+reformattedDate);
        //if the event unix is less than or equal to today, or beyond our 7-day forecast window, we just display the current weather.
        if(reformattedDate <= rightNow || reformattedDate >= sevenDaysFromNow) {
            ourModalsList.children().eq(0).text("Weathercode: "+weatherData.current_weather.weathercode);
            ourModalsList.children().eq(1).text("Current temperature is: "+weatherData.current_weather.temperature + "° Fahrenheit.");
            ourModalsList.children().eq(2).text("Windspeed is: "+weatherData.current_weather.windspeed + " mph");
        }

        //else, we display the weather on that date.
        else {
            let ourDatePosition =  weatherData.hourly.time.indexOf(weatherApiComparisonDate);           
            ourModalsList.children().eq(0).text("Temperature will be: "+weatherData.hourly.temperature_2m[ourDatePosition] + "° Fahrenheit.");
            ourModalsList.children().eq(1).text("Relative humidity will be: "+weatherData.hourly.relativehumidity_2m[ourDatePosition] + "%.");
            ourModalsList.children().eq(2).text("Windspeed will be: "+weatherData.hourly.windspeed_10m[ourDatePosition] + " mph.");
        }


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

    // ## One weather api function ☁ ##
    function getWeatherBasedOnLatLon(enteredLat, enteredLon, enteredDateTime) {
        //Take lat and lon and inject into api call
        var queryURL = "https://api.open-meteo.com/v1/forecast?latitude=" + enteredLat + "&longitude=" + enteredLon +
            "&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&hourly=temperature_2m,relativehumidity_2m,windspeed_10m";
        //Fetch request
        fetch(queryURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // console.log("our data is: "+JSON.stringify(data));
                console.log("function getWeatherBasedOnLatLon() just ran; at the requested location our temperature is: " + data.current_weather.temperature + "° Fahrenheit.");
                //Take reponse and pass into modal function ♥
                handleWeatherInformation(data, enteredDateTime);
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

        if (userKeyword != "") {
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
            if (searchHistory[totalHistoryLength - i]) {
                const SAVEDITEM = document.createElement("input");
                SAVEDITEM.setAttribute("type", "text");
                SAVEDITEM.setAttribute("readonly", true);
                SAVEDITEM.setAttribute("class", "block is-size-6 has-text-centered button is-info is-size-7-mobile");
                SAVEDITEM.setAttribute("value", searchHistory[totalHistoryLength-i]);
                SAVEDITEM.addEventListener("click", function () {
                    eventDiscovery(SAVEDITEM.value);
                })
                SAVEDSEARCH.append(SAVEDITEM);
                TITLESEARCH.setAttribute("class", "block is-size-4 has-text-centered is-size-7-mobile has-text-white");
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

    // // Add a click event on buttons to open a specific modal
    // (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    //     const modal = $trigger.dataset.target;
    //     console.log($trigger);
    //     const $target = document.getElementById(modal);
    //     $trigger.addEventListener('click', (e) => {
    //         openModal($target);
    //     });
    // });

    // Event listener for modal buttons
    $('body').on('click', '.js-modal-trigger', function (e) { 
        // Get time and location variables
        var card = e.target.offsetParent;
        var timeDate = card.dataset.datetime;
        var lat = card.dataset.lat;
        var lon = card.dataset.lon;

        // Get modal element
        var target = e.target;
        var modalId = target.dataset.target;
        var modalEl = document.getElementById(modalId);

        getWeatherBasedOnLatLon(lat, lon, timeDate);
        openModal(modalEl);
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