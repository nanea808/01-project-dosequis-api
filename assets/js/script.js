// Ensures code runs after html doc loads
$(() => {
    // ## Function to load response data as button elements ★ ##
    /* store important data in data-{blank} attributes */

    // ## Function to load weather data as a modal element ♥ ##

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

    // ## One weather api function ☁ ##
        /*
        Take lat and lon and inject into api call

        Fetch request

        Take reponse and pass into modal function ♥
        */

    // ## Event listener to take user input and pass to Ticketmaster event discovery api function ✈ ##

    // ## Event listener to take user input on button elements ##
    /* Take event id from button elements and pass into location api function ♣ */
    
});