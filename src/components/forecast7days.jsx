import React, { useEffect, useState } from 'react';
import axios from 'axios';

async function fetchForecastData(search) {
    const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=e76340af3b584d23b6a164722241302&q=${search}&days=7`);
    return response.data.forecast.forecastday;
}

function Prediction(props) {
    const [forecastData, setForecastData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (props.search) {
                    const data = await fetchForecastData(props.search);
                    setForecastData(data);
                }
            } catch (error) {
                console.error('Error fetching forecast data:', error);
            }
        };

        fetchData();
    }, [props.search]);

    if (forecastData.length === 0) {
        return <h1>Loading the forecast</h1>;
    }

    return (
        <>
            {forecastData.map((day, index) => (
                <div className='w-full sm:text-white text-xs  h-5 flex flex-row items-center justify-around text-left mt-3 text-opacity-100'>
                    <p className='opacity-100'>{day.date.slice(6, 10)}</p>
                    <p> <img className='px-3' src={day.day.condition.icon} alt="image not available at the moment" /></p>
                    <p className='opacity-100'>{day.day.maxtemp_c} / {day.day.mintemp_c}</p>
                </div>
            ))}
        </>
    );
}

export default Prediction;