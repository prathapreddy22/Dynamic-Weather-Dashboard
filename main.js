const dashboard = document.getElementById("dashboard");

function generateWeather() {
  const conditions = [
    {condition: "Clear Sky", icon: "sun"},
    {condition: "Partly Cloudy", icon: "cloud"},
    {condition: "Light Rain", icon: "rain"},
    {condition: "Snowfall", icon: "snow"},
    {condition: "Thunderstorms", icon: "lightning"},
    {condition: "Humid & Sunny", icon: "sunCloud"}
  ];
  const weather = conditions[Math.floor(Math.random() * conditions.length)];
  const high = Math.floor(Math.random()*15 + 25);
  const low = Math.floor(high - Math.random()*8);
  const feels = Math.floor((high + low) / 2);
  return {...weather, high: high+"°C", low: low+"°C", feels: feels+"°C"};
}

function getWeatherIcon(icon) {
  let html = '';
  switch(icon){
    case 'sun': html = '<div class="sun"></div>'; break;
    case 'cloud':
      for(let i=0;i<2;i++){
        const top = 5 + Math.random()*20 + 'px';
        const duration = 6 + Math.random()*4 + 's';
        html += `<div class="cloud" style="top:${top};animation-duration:${duration}"></div>`;
      }
      break;
    case 'rain':
      for(let i=0;i<8;i++){
        const left = Math.random()*90 + '%';
        const delay = Math.random()*2 + 's';
        const duration = 1 + Math.random()+'s';
        html += `<div class="raindrop" style="left:${left};animation-delay:${delay};animation-duration:${duration}"></div>`;
      }
      break;
    case 'snow':
      for(let i=0;i<6;i++){
        const left = Math.random()*90 + '%';
        const delay = Math.random()*3 + 's';
        const duration = 3 + Math.random()*2+'s';
        const size = 3 + Math.random()*4 + 'px';
        html += `<div class="snowflake" style="left:${left};width:${size};height:${size};animation-delay:${delay};animation-duration:${duration}"></div>`;
      }
      break;
    case 'lightning': html = '<div class="lightning"></div>'; break;
    case 'sunCloud':
      html += '<div class="sun"></div>';
      for(let i=0;i<2;i++){
        const top = 5 + Math.random()*20 + 'px';
        const duration = 8 + Math.random()*5 + 's';
        html += `<div class="cloud" style="top:${top};animation-duration:${duration}"></div>`;
      }
      break;
  }
  return html;
}

function displayWeather(city, data) {
  const card = document.createElement("div");
  card.className = "card";

  const tempClass = "moderate";
  const days = ["Thu","Fri","Sat","Sun","Mon"];
  let forecastHTML = '<div class="forecast-boxes">';
  for (let i=0; i<5; i++) {
    const forecastData = generateWeather();
    forecastHTML += `
      <div class="forecast-box">
        <h3>${days[i]}</h3>
        ${getWeatherIcon(forecastData.icon)}
        <p>${forecastData.condition}</p>
        <p class="temp">${forecastData.high} / ${forecastData.low}</p>
        <p>~ ${forecastData.feels}</p>
      </div>
    `;
  }
  forecastHTML += '</div>';

  card.innerHTML = `
    ${getWeatherIcon(data.icon)}
    <h2 class="${tempClass}">${data.high}</h2>
    <p>${city}</p>
    <p>${data.condition}</p>
    <p>Feels like ${data.feels}</p>
    ${forecastHTML}
  `;

  dashboard.innerHTML = "";
  dashboard.appendChild(card);
}

function searchCity() {
  const city = document.getElementById("cityInput").value.trim();
  if(city) displayWeather(city, generateWeather());
}

function useMyLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || "Your Location";
        displayWeather(city, generateWeather());
      } catch {
        displayWeather("My Location", generateWeather());
      }
    }, () => {
      alert("Location access denied.");
    });
  } else {
    alert("Geolocation not supported.");
  }
}

window.onload = () => {
  const cities = ["London","New York","Tokyo","Paris","Sydney","Moscow","Dubai"];
  const city = cities[Math.floor(Math.random() * cities.length)];
  displayWeather(city, generateWeather());
};

