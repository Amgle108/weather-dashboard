# Weather Dashboard

A feature-rich weather dashboard that fetches live weather data from the public Open-Meteo API.

## Features

- Search for any city
- Current weather summary
- Hourly forecast
- 7-day forecast
- °C / °F toggle
- Dark and light theme
- Use current location via browser geolocation
- Save favorite cities in local storage
- Responsive layout for mobile and desktop

## Technologies Used

- HTML
- CSS
- JavaScript
- Open-Meteo API

## Run locally

Because this is a static frontend app, you can serve it with any local web server.

### Option 1: Python

```bash
cd weather-dashboard
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

### Option 2: VS Code Live Server

Open the project in VS Code and launch it using the Live Server extension.

## Project structure

```text
weather-dashboard/
├── index.html
├── styles.css
├── script.js
├── README.md
├── .gitignore
```

## API used

- Open-Meteo Geocoding API: https://geocoding-api.open-meteo.com
- Open-Meteo Forecast API: https://api.open-meteo.com

This API is public and does not require a key for basic usage.
