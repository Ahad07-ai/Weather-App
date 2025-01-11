import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);

    const allIcons = {
        "clear": clear_icon,
        "partly cloudy": cloud_icon,
        "cloudy": cloud_icon,
        "drizzle": drizzle_icon,
        "rain": rain_icon,
        "snow": snow_icon,
        "wind": wind_icon,
    };

    // Fetch weather data based on location input
    const search = async (location) => {
        if (location === "") {
            alert("Enter Country or City Name");
            return;
        }

        try {
            const url = `https://api.weatherapi.com/v1/current.json?key=a920290414bb4030aaf190707242010&q=${location}&aqi=no`;

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.error.message);
                return;
            }

            const iconKey = data.current.condition.text.toLowerCase();
            const icon = allIcons[iconKey] || clear_icon;

            // Check if the input is a country or city based on the location
            const isCountry = data.location.country.toLowerCase() === location.toLowerCase();
            const displayLocation = isCountry ? data.location.country : data.location.name;

            setWeatherData({
                humidity: data.current.humidity,
                windSpeed: data.current.wind_kph,
                temperature: Math.floor(data.current.temp_c),
                location: displayLocation, // Show only the relevant location
                icon: icon,
            });
        } catch (error) {
            setWeatherData(null); // Reset the state on error
            console.error("Error in fetching weather data:", error);
        }
    };

    // Perform initial search for "London" on component mount
    useEffect(() => {
        search("London");
    }, []);

    return (
        <div className='weather'>
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder='Search Country or City' />
                <img
                    src={search_icon}
                    alt="Search Icon"
                    onClick={() => search(inputRef.current.value)}
                    style={{ cursor: 'pointer' }}
                />
            </div>

            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather Icon" className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="Humidity Icon" />
                            <div>
                                <p>{weatherData.humidity} %</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="Wind Icon" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>No weather data available. Try searching for a country or city.</p>
            )}
        </div>
    );
};

export default Weather;



