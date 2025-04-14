//this funciton fetches te weather of city and date. The API only goes 14 days out. 
async function getWeather(city, eventDate, elementId) {

    const apiKey = "4e702c79a5594e539d4122055251404"; // ✅ Make sure this key is valid and kept private

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
            const html = `
        <p><strong>${forecast.day.condition.text}</strong></p>
        <img src="${forecast.day.condition.icon}" alt="weather icon">
        <p>${forecast.day.avgtemp_f} °F</p>`;

            //inset the weather HTML into the correct DIV 
            document.getElementById(elementId).innerHTML = html;

        } else {
            document.getElementById(elementId).innerText = "14 Day Forecast unavailable";
        }

    } catch (error) {
        console.error("Weather Fetch Error", error);
        document.getElementById(elementId).innerText = "Weather error";
    }
}
