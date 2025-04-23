//this funciton fetches te weather of city and date. The API only goes 14 days out. 
async function getWeather(city, eventDate, elementId) {

    const apiKey = WEATHER_API_KEY; // defined in EJS
    const today = new Date();
    const event = new Date(eventDate);

    const diffTime = event.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000*60*60* 24));

    if (diffDays >14) {
        document.getElementById(elementId).innerText = "Forecasts are unavailable beyond 14 days. Please check back closer to your date.";
        return;
    }

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&dt=${eventDate}`;

    try {
        //fetch weather from API
        const response = await fetch(url);

        //convert to JSON file 
        const data = await response.json();

        //check if there is a forecast to return
        if (data && data.forecast) {

            //get forecast for specific date
            const forecast = data.forecast.forecastday[0];

            //htlm created to display the actual forecast
            const html = `<p><strong>${forecast.day.condition.text}</strong></p>
        <img src="${forecast.day.condition.icon}" alt="weather icon">
        <p>${forecast.day.avgtemp_f} °F</p>`;

            //inset the weather HTML into the correct DIV 
            document.getElementById(elementId).innerHTML = html;

        } else {
            document.getElementById(elementId).innerText = "Forecast Unavailable";
        }

    } catch (error) {
        console.error("Weather Fetch Error", error);
        document.getElementById(elementId).innerText = "Weather Fetch error";
    }
}
