const DEFAULT_CITY = "Istanbul";
const THEME_KEY = "weather-dashboard-theme";
const FAVORITES_KEY = "weather-dashboard-favorites";

const state = {
  unit: "C",
  selectedLocation: null,
  theme: localStorage.getItem(THEME_KEY) || "dark",
  favorites: JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"),
};

const elements = {
  body: document.body,
  searchForm: document.querySelector("#search-form"),
  cityInput: document.querySelector("#city-input"),
  locationButton: document.querySelector("#location-button"),
  saveCityButton: document.querySelector("#save-city-button"),
  themeToggle: document.querySelector("#theme-toggle"),
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
  favoritesContainer: document.querySelector("#favorites"),
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

function saveFavorites() {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
}

function renderFavorites() {
  if (!state.favorites.length) {
    elements.favoritesContainer.innerHTML = "";
    return;
  }

  elements.favoritesContainer.innerHTML = state.favorites
    .map(
      (city) => `
        <button class="favorite-item" type="button" data-city="${city}">
          ${city}
          <span class="remove" data-remove-city="${city}" aria-label="Remove ${city}">×</span>
        </button>
      `
    )
    .join("");
}

function isFavorite(cityName) {
  return state.favorites.some((city) => city.toLowerCase() === cityName.toLowerCase());
}

function addFavorite(cityName) {
  const trimmed = cityName.trim();
  if (!trimmed) return;

  if (!isFavorite(trimmed)) {
    state.favorites.unshift(trimmed);
    state.favorites = state.favorites.slice(0, 6);
    saveFavorites();
    renderFavorites();
  }
}

function removeFavorite(cityName) {
  state.favorites = state.favorites.filter((city) => city.toLowerCase() !== cityName.toLowerCase());
  saveFavorites();
  renderFavorites();
}

function applyTheme() {
  elements.body.setAttribute("data-theme", state.theme);
  localStorage.setItem(THEME_KEY, state.theme);
  elements.themeToggle.textContent = state.theme === "dark" ? "🌙" : "☀️";
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
}

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
  return fetchWeatherByCoordinates(place.latitude, place.longitude, place);
}

async function fetchWeatherByCoordinates(latitude, longitude, fallbackPlace = null) {
  const params = new URLSearchParams({
    latitude,
    longitude,
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

  if (!fallbackPlace) {
    const reverseUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`;
    const reverseResponse = await fetch(reverseUrl);

    if (reverseResponse.ok) {
      const reverseData = await reverseResponse.json();
      const result = reverseData.results?.[0];
      if (result) {
        fallbackPlace = {
          name: result.name,
          country: result.country,
          latitude,
          longitude,
        };
      }
    }
  }

  return { place: fallbackPlace || { name: "Current Location", latitude, longitude }, forecast: forecastData };
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
    if (state.selectedLocation && state.selectedLocation.name) {
      elements.cityInput.value = state.selectedLocation.name;
    }
  } catch (error) {
    showError(error.message || "Something went wrong while fetching the weather.");
  } finally {
    showLoading(false);
  }
}

async function loadWeatherByLocation(latitude, longitude) {
  showLoading(true);
  try {
    const result = await fetchWeatherByCoordinates(latitude, longitude);
    state.selectedLocation = result.place;
    updateWeatherUI(result.forecast, result.place);
    elements.cityInput.value = state.selectedLocation.name;
  } catch (error) {
    showError(error.message || "Unable to fetch weather for your location.");
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
    if (state.selectedLocation.latitude && state.selectedLocation.longitude) {
      loadWeatherByLocation(state.selectedLocation.latitude, state.selectedLocation.longitude);
    } else {
      loadWeather(state.selectedLocation.name);
    }
  }
}

function handleFavoritesClick(event) {
  const removeTarget = event.target.closest("[data-remove-city]");
  if (removeTarget) {
    removeFavorite(removeTarget.dataset.removeCity);
    return;
  }

  const favoriteTarget = event.target.closest("[data-city]");
  if (favoriteTarget) {
    loadWeather(favoriteTarget.dataset.city);
  }
}

function handleGeoLocation() {
  if (!navigator.geolocation) {
    showError("Geolocation is not supported in this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      loadWeatherByLocation(latitude, longitude);
    },
    () => {
      showError("Location access was denied. Try searching for a city manually.");
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
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

elements.locationButton.addEventListener("click", handleGeoLocation);

elements.themeToggle.addEventListener("click", toggleTheme);

elements.saveCityButton.addEventListener("click", () => {
  if (!state.selectedLocation || !state.selectedLocation.name) {
    showError("Load a city first to save it.");
    return;
  }

  addFavorite(state.selectedLocation.name);
  renderFavorites();
});

elements.favoritesContainer.addEventListener("click", handleFavoritesClick);

applyTheme();
renderFavorites();
loadWeather(DEFAULT_CITY);
