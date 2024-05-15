require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package
const app = express();

// Use the cors middleware
app.use(cors());

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.get('/maps', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: `${latNum},${lngNum}`,
        radius: 1500,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      res.status(500).send('No response received from Google Maps API');
    } else {
      res.status(500).send('Error in setting up the request: ' + error.message);
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
