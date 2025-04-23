// Fetches coordinates for a city/state from Google Geocoding API
async function geocodeAddress(address, apiKey) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Geocoding response for:", address, data);
  
    if (data.status === "OK") {
      return data.results[0].geometry.location; // { lat: ..., lng: ... }
    } else {
      throw new Error("You entered an incorrect address. Please re-edit your event.");
    }
  }
  
  // Called automatically by the Google Maps JS API via callback=initMap
  window.initMap = async function () {
    const apiKey = GOOGLE_API_KEY;
    const mapDivs = document.querySelectorAll("[data-map-address]");
  
    for (const div of mapDivs) {
      const address = div.getAttribute("data-map-address");
      const mapId = div.getAttribute("id");
  
      if (!address || !mapId) {
        div.innerText = "Missing address or map ID.";
        continue;
      }
  
      try {
        const coords = await geocodeAddress(address, apiKey);
  
        const map = new google.maps.Map(document.getElementById(mapId), {
          center: coords,
          zoom: 13,
          mapTypeId: "roadmap"
        });
  
        new google.maps.Marker({
          position: coords,
          map: map,
          title: address
        });
  
      } catch (err) {
        div.innerText = "Map failed to load: " + err.message;
      }
    }
  };
  