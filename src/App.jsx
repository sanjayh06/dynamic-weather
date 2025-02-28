import { useEffect, useState } from 'react'
import './App.css'
import PropTypes from "prop-types";

// Images

import searchIcon from "./assets/search.png";
import clearIcon from "./assets/clear-sky.png";
import cloudIcon from "./assets/clouds.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/heavy-rain.png";
import humidityIcon from "./assets/humidity.png";
import snowIcon from "./assets/snow.png";
import windIcon from "./assets/windy.png";

const WeatherDetails = ({icon,temp,city,country,lat,long,wind,humidity}) => {
  return (
  <>
    <div className="image">
      <img src={icon} alt="image"/>
    </div>
    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div>
        <span className="lat">Latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className="long">Longitude</span>
        <span>{long}</span>
      </div>
    </div>
    <div className="data-container">
      <div className="element">
        <img className = "icon" src={humidityIcon} alt="humidity" />
        <div className="data">
          <div className="humidity-percent">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
      </div>
      <div className="element">
        <img className = "icon" src={windIcon} alt="wind" />
        <div className="data">
          <div className="wind-percent">{wind} km/h</div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
    </div>
  </>
  )
}

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,   
};

function App() {
  let api_key = "b6ac2746936885961d02ff80c75b487e";
  const [text,setText] = useState("Kolar Gold Fields");
  const [icon,setIcon] = useState(snowIcon);
  const [temp,setTemp] = useState(0);
  const [city,setCity] = useState("");
  const [country,setCountry] = useState("");
  const [lat,setLat] = useState(0);
  const [long,setLong] = useState(0);
  const [humidity,setHumidity] = useState(0);
  const [wind,setWind] = useState(0);

  const [cityNotFound,setCityNotFound] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data);
      if(data.cod === "404"){
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLong(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || clearIcon);
      setCityNotFound(false);


    }catch(error){
      console.error("An error occurred:", error.message);
      setError("An error occurred while fetching weather data.");
    }finally{
      setLoading(false);
    }
  };
   
  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      search();
    }
  };

  useEffect(function(){
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className="cityInput" placeholder="Search City" onChange={handleCity} value = {text} onKeyDown={handleKeyDown} />
          <div className="search-icon">
            <img className = "search_icon" src={searchIcon} onClick={() => search()} alt="search-icon" />
          </div>
        </div>
       
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

       {!loading && !cityNotFound && <WeatherDetails icon = {icon} temp = {temp} city = {city} country = {country} lat = {lat} long = {long} wind = {wind} humidity = {humidity} />}

        <p className="copyright">
          Designed by <span>Sanjay H</span>
        </p>
      </div>
    </>
  )
}

export default App
