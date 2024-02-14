import React, { useEffect, useState } from 'react';
import axios from 'axios';

async function fetchAqiData(search) {
    const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=e76340af3b584d23b6a164722241302&q=${search}&aqi=yes`);
    return response.data.current;
}


function AQI(props) {
    const [aqi, setAqi] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (props.search) {
                    const data = await fetchAqiData(props.search);
                    setAqi(data);
                }
            } catch (error) {
                console.error('Error fetching aqi data:', error);
            }
        };

        fetchData();
    }, [props.search]);

    if (aqi.length === 0) {
        return <h1 className='text-xs text-opacity-100'>Loading the AQI Index</h1>;
    }

    return (
        aqi.air_quality.pm2_5

    )
}

export default AQI;