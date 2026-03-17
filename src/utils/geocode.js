const axios = require("axios");

exports.getCoordinates = async (address) => {

  try {

    console.log("Geocoding address:", address);

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "health-app"
        }
      }
    );

    if (!response.data || response.data.length === 0) {
      throw new Error("No coordinates found for this address");
    }

    return {
      latitude: parseFloat(response.data[0].lat),
      longitude: parseFloat(response.data[0].lon)
    };

  } catch (error) {

    console.error("Geocode error:", error.message);
    throw new Error("Geocoding failed");

  }

};