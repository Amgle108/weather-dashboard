# weather-dashboard
A beautiful weather dashboard that fetches real-time weather data from public APIs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weather Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="app-shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">Forecast</p>
          <h1>Weather Dashboard</h1>
        </div>

        <div class="toolbar">
          <form id="search-form" class="search-form" autocomplete="off">
            <label class="sr-only" for="city-input">Search city</label>
            <input
              id="city-input"
              type="text"
              name="city"
              placeholder="Search city"
              value="Istanbul"
            />
            <button type="submit">Search</button>
          </form>

          <div class="unit-toggle" aria-label="Temperature unit toggle">
            <button class="unit-btn active" type="button" data-unit="C">°C</button>
            <button class="unit-btn" type="button" data-unit="F">°F</button>
          </div>
        </div>
      </header>

      <main>
        <section id="current-weather" class="current-card card hidden" aria-live="polite">
          <div class="current-header">
            <div>
              <p id="location-name" class="location-name">City</p>
              <p id="current-date" class="current-date">--</p>
            </div>
            <div id="weather-icon" class="weather-icon" aria-hidden="true">☀️</div>
          </div>

          <div class="current-main">
            <div>
              <p class="label">Now</p>
              <div class="temperature-row">
                <span id="current-temp" class="current-temp">--</span>
              </div>
            </div>

            <div class="current-summary">
              <p id="weather-condition" class="condition">--</p>
              <p id="feels-like" class="meta">Feels like --</p>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-box">
              <span class="label">Humidity</span>
              <strong id="humidity">--</strong>
            </div>
            <div class="stat-box">
              <span class="label">Wind</span>
              <strong id="wind-speed">--</strong>
            </div>
            <div class="stat-box">
              <span class="label">Sunrise</span>
              <strong id="sunrise">--</strong>
            </div>
            <div class="stat-box">
              <span class="label">Sunset</span>
              <strong id="sunset">--</strong>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="section-heading">
            <h2>Hourly</h2>
          </div>
          <div id="hourly-forecast" class="hourly-forecast" aria-live="polite"></div>
        </section>

        <section class="card">
          <div class="section-heading">
            <h2>7-Day Forecast</h2>
          </div>
          <div id="daily-forecast" class="daily-forecast" aria-live="polite"></div>
        </section>
      </main>
    </div>

    <div id="loading" class="loading hidden">
      <div class="spinner"></div>
      <p>Loading weather data...</p>
    </div>

    <div id="error-message" class="error-message hidden" role="alert"></div>

    <script src="script.js"></script>
  </body>
</html>

 :root {
  --bg: #07111f;
  --bg-2: #101c2e;
  --panel: rgba(18, 30, 46, 0.9);
  --panel-strong: rgba(23, 37, 55, 0.95);
  --primary: #7dd3fc;
  --primary-strong: #38bdf8;
  --text: #eaf4ff;
  --muted: #b7c9db;
  --border: rgba(168, 196, 220, 0.2);
  --accent: #fbbf24;
  --danger: #f87171;
  --shadow: 0 18px 40px rgba(3, 8, 20, 0.45);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), transparent 25%),
    radial-gradient(circle at bottom right, rgba(96, 165, 250, 0.25), transparent 25%),
    linear-gradient(160deg, var(--bg), var(--bg-2));
  color: var(--text);
}

button,
input {
  font: inherit;
}

.app-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 40px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--primary);
  font-size: 0.72rem;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 2.8vw, 3rem);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 10px 8px 18px;
  box-shadow: var(--shadow);
}

.search-form input {
  width: min(280px, 42vw);
  min-width: 180px;
  background: transparent;
  border: 0;
  color: var(--text);
  outline: none;
  padding-right: 8px;
}

.search-form input::placeholder {
  color: rgba(234, 244, 255, 0.64);
}

.search-form button,
.unit-btn {
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: #062033;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.search-form button {
  padding: 10px 16px;
}

.search-form button:hover,
.unit-btn:hover {
  transform: translateY(-1px);
}

.unit-toggle {
  display: inline-flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 4px;
}

.unit-btn {
  background: transparent;
  color: var(--muted);
  padding: 8px 12px;
}

.unit-btn.active {
  background: linear-gradient(135deg, var(--accent), #f59e0b);
  color: #1d1404;
  box-shadow: 0 8px 18px rgba(251, 191, 36, 0.25);
}

main {
  display: grid;
  gap: 20px;
}

.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: var(--shadow);
  padding: 24px;
  backdrop-filter: blur(14px);
}

.current-card {
  padding: 28px;
}

.current-header,
.current-main,
.section-heading,
.daily-item,
.hourly-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.location-name {
  margin: 0;
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  font-weight: 700;
}

.current-date {
  margin: 6px 0 0;
  color: var(--muted);
}

.weather-icon {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: rgba(125, 211, 252, 0.12);
  font-size: 2rem;
}

.current-main {
  margin-top: 24px;
  gap: 24px;
  align-items: end;
}

.label {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  color: var(--muted);
}

.current-temp {
  font-size: clamp(3rem, 5vw, 4.7rem);
  font-weight: 800;
  line-height: 1;
}

.condition {
  margin: 0;
  font-size: clamp(1.05rem, 1.7vw, 1.4rem);
  font-weight: 700;
}

.meta {
  margin: 8px 0 0;
  color: var(--muted);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 26px;
}

.stat-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(148, 163, 184, 0.07);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 16px 18px;
}

.stat-box strong {
  font-size: 1.05rem;
}

.section-heading {
  margin-bottom: 16px;
}

.section-heading h2 {
  margin: 0;
  font-size: 1.25rem;
}

.hourly-forecast,
.daily-forecast {
  display: grid;
  gap: 12px;
}

.hourly-forecast {
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.hourly-item,
.daily-item {
  background: rgba(148, 163, 184, 0.06);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 14px 16px;
  gap: 12px;
}

.hourly-item {
  flex-direction: column;
  align-items: flex-start;
}

.hourly-item strong,
.daily-item strong {
  font-size: 1.1rem;
}

.hourly-item small,
.daily-item small {
  color: var(--muted);
}

.daily-item {
  padding: 14px 18px;
}

.daily-weather {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 220px;
}

.daily-temps {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.temp-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.temp-range .max {
  font-weight: 700;
}

.temp-range .min {
  color: var(--muted);
}

.hidden {
  display: none !important;
}

.loading {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(7, 17, 31, 0.75);
  z-index: 999;
  backdrop-filter: blur(6px);
}

.loading p {
  margin-top: 18px;
  color: var(--text);
  font-weight: 600;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.18);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  position: fixed;
  bottom: 22px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(127, 29, 29, 0.82);
  color: white;
  border: 1px solid rgba(248, 113, 113, 0.5);
  border-radius: 16px;
  padding: 12px 18px;
  box-shadow: var(--shadow);
  z-index: 1000;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 720px) {
  .topbar,
  .current-main,
  .daily-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .toolbar {
    width: 100%;
  }

  .search-form {
    width: 100%;
    justify-content: space-between;
  }

  .search-form input {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .daily-weather {
    min-width: auto;
  }
}

const DEFAULT_CITY = "Istanbul";

const state = {
  unit: "C",
  selectedLocation: null,
};

const elements = {
  searchForm: document.querySelector("#search-form"),
  cityInput: document.querySelector("#city-input"),
  currentWeather: document.querySelector("#current-weather"),
  locationName: document.querySelector("#location-name"),
  currentDate: document.querySelector("#current-date"),
  weatherIcon: document.querySelector("#weather-icon"),
  currentTemp: document.querySelector("#current-temp"),
  weatherCondition: document.querySelector("#weather-condition"),
  feelsLike: document.querySelector("#feels-like"),
  humidity: document.querySelector("#humidity"),
  windSpeed: document.querySelector("#wind-speed"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),
  hourlyForecast: document.querySelector("#hourly-forecast"),
  dailyForecast: document.querySelector("#daily-forecast"),
  loading: document.querySelector("#loading"),
  errorMessage: document.querySelector("#error-message"),
  unitButtons: document.querySelectorAll(".unit-btn"),
};

const weatherCodeMap = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mostly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Cloudy", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Foggy", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  56: { label: "Freezing drizzle", icon: "🌧️" },
  57: { label: "Heavy freezing drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  67: { label: "Heavy freezing rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "Snow grains", icon: "❄️" },
  80: { label: "Rain showers", icon: "🌦️" },
  81: { label: "Heavy showers", icon: "🌧️" },
  82: { label: "Violent showers", icon: "⛈️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "🌨️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" },
  99: { label: "Severe thunderstorm", icon: "⛈️" },
};

function showLoading(show) {
  elements.loading.classList.toggle("hidden", !show);
}

function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.classList.remove("hidden");

  setTimeout(() => {
    elements.errorMessage.classList.add("hidden");
  }, 3500);
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

function formatTime(dateString) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function convertTemperature(value) {
  return state.unit === "C" ? value : (value * 9) / 5 + 32;
}

function toDisplayTemp(value) {
  const converted = convertTemperature(value);
  return `${Math.round(converted)}°${state.unit}`;
}

function getWindUnit() {
  return state.unit === "C" ? "km/h" : "mph";
}

function getWeatherMeta(code) {
  return weatherCodeMap[code] || { label: "Unknown", icon: "🌤️" };
}

function renderHourlyForecast(hourlyData, times) {
  const nextHours = hourlyData.slice(0, 8);

  elements.hourlyForecast.innerHTML = nextHours
    .map((temp, index) => {
      const weather = getWeatherMeta(hourlyData[index]?.weather_code || 0);
      const timeLabel = index === 0 ? "Now" : new Date(times[index]).toLocaleTimeString([], { hour: "numeric" });

      return `
        <div class="hourly-item">
          <small>${timeLabel}</small>
          <div class="weather-icon" aria-hidden="true">${weather.icon}</div>
          <strong>${toDisplayTemp(temp)}</strong>
          <small>${weather.label}</small>
        </div>
      `;
    })
    .join("");
}

function renderDailyForecast(dailyData) {
  const days = dailyData.time.map((day, index) => {
    const maxTemp = dailyData.temperature_2m_max[index];
    const minTemp = dailyData.temperature_2m_min[index];
    const weather = getWeatherMeta(dailyData.weather_code[index]);

    return `
      <div class="daily-item">
        <div class="daily-weather">
          <div class="weather-icon" aria-hidden="true">${weather.icon}</div>
          <div>
            <strong>${new Date(day).toLocaleDateString("en-US", { weekday: "short" })}</strong>
            <br />
            <small>${weather.label}</small>
          </div>
        </div>

        <div class="daily-temps">
          <div class="temp-range">
            <span class="max">${toDisplayTemp(maxTemp)}</span>
            <span class="min">${toDisplayTemp(minTemp)}</span>
          </div>
        </div>
      </div>
    `;
  });

  elements.dailyForecast.innerHTML = days.join("");
}

async function fetchWeatherByCity(cityName) {
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  const geocodeResponse = await fetch(geocodeUrl);

  if (!geocodeResponse.ok) {
    throw new Error("Could not find the city.");
  }

  const geocodeData = await geocodeResponse.json();

  if (!geocodeData.results || geocodeData.results.length === 0) {
    throw new Error("City not found. Please try another name.");
  }

  const place = geocodeData.results[0];
  const params = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m",
    hourly: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
    timezone: "auto",
    forecast_days: 7,
    temperature_unit: state.unit === "C" ? "celsius" : "fahrenheit",
    wind_speed_unit: state.unit === "C" ? "kmh" : "mph",
  });

  const forecastUrl = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const forecastResponse = await fetch(forecastUrl);

  if (!forecastResponse.ok) {
    throw new Error("Unable to fetch weather details.");
  }

  const forecastData = await forecastResponse.json();
  return { place, forecast: forecastData };
}

function renderCurrentWeather(data, place) {
  const current = data.current;
  const weather = getWeatherMeta(current.weather_code);

  elements.locationName.textContent = `${place.name}${place.country ? `, ${place.country}` : ""}`;
  elements.currentDate.textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());
  elements.weatherIcon.textContent = weather.icon;
  elements.currentTemp.textContent = toDisplayTemp(current.temperature_2m);
  elements.weatherCondition.textContent = weather.label;
  elements.feelsLike.textContent = `Feels like ${toDisplayTemp(current.apparent_temperature)}`;
  elements.humidity.textContent = `${current.relative_humidity_2m}%`;
  elements.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} ${getWindUnit()}`;
  elements.sunrise.textContent = formatTime(data.daily.sunrise[0]);
  elements.sunset.textContent = formatTime(data.daily.sunset[0]);

  elements.currentWeather.classList.remove("hidden");
}

function updateWeatherUI(data, place) {
  renderCurrentWeather(data, place);
  renderHourlyForecast(data.hourly.temperature_2m, data.hourly.time);
  renderDailyForecast(data.daily);
}

async function loadWeather(cityName) {
  showLoading(true);
  elements.errorMessage.classList.add("hidden");

  try {
    const result = await fetchWeatherByCity(cityName);
    state.selectedLocation = result.place;
    updateWeatherUI(result.forecast, result.place);
  } catch (error) {
    showError(error.message || "Something went wrong while fetching the weather.");
  } finally {
    showLoading(false);
  }
}

function setUnit(unit) {
  state.unit = unit;
  elements.unitButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.unit === unit);
  });

  if (state.selectedLocation) {
    loadWeather(state.selectedLocation.name);
  }
}

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = elements.cityInput.value.trim();

  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  loadWeather(city);
});

elements.unitButtons.forEach((button) => {
  button.addEventListener("click", () => setUnit(button.dataset.unit));
});

loadWeather(DEFAULT_CITY);
