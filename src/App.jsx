import { useEffect, useState } from 'react'
import axios from 'axios';
import Timeline from './components/timeline';
import Prediction from './components/forecast7days';
import AQI from './components/findAqi';
// react icons
import { FaRegSun } from "react-icons/fa";
import { BsThermometerSun } from "react-icons/bs";
import { WiHumidity } from "react-icons/wi";
import { GiWindSlap } from "react-icons/gi";
import { LuWind } from "react-icons/lu";
import { MdOutlineVisibility } from "react-icons/md";
import { FiSunrise, FiSunset } from "react-icons/fi";

function App() {

  const [search, setSearch] = useState("");
  const [data, setData] = useState("");
  const [hour, setHour] = useState("");
  const [otherInfo, setOtherInfo] = useState("");
  const [astroData, setAstroData] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [day, setDay] = useState("");
  const key = import.meta.env.VITE_API_KEY;
  const baseUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const generateData = async () => {
      let Currentdata, foreCastData
      if (!search) {
        // accessing the user's current location
        let userLocation = {};

        userLocation = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = userLocation.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        Currentdata = await axios.get(`${baseUrl}/current.json?key=${key}&q=${latitude},${longitude}`);
        foreCastData = await axios.get(`${baseUrl}/forecast.json?key=${key}&q=${latitude},${longitude}&aqi=yes`)
      }
      else {

        Currentdata = await axios.get(`${baseUrl}/current.json?key=${key}&q=${search}`);
        foreCastData = await axios.get(`${baseUrl}/forecast.json?key=${key}&q=${search}&aqi=yes`)
      }
      let tempResource = await foreCastData.data.forecast.forecastday[0].astro;
      setAstroData(tempResource);
      const { current } = await foreCastData.data;
      setOtherInfo(current);
      setHour(foreCastData.data.forecast.forecastday[0].hour);
      setData(Currentdata.data.current);

      setSearch(Currentdata.data.location.name)
    }
    generateData();

  }, [search])

  useEffect(() => {

    const changeBackground = async (id) => {
      let day_data;
      if (!search) {
        day_data = await axios.get(`${baseUrl}/current.json?key=${key}&q=${latitude},${longitude}`);
      }
      else {
        day_data = await axios.get(`${baseUrl}/current.json?key=${key}&q=${search}`);
      }
      // accessing the current day
      let day = day_data.data.current.is_day;
      setDay(day);
      if (day === 0) {
        let container = document.getElementById(id);
        let ar = ['bg-gradient-to-b', 'from-gray-500', 'to-blue-800', 'night-fog-animation']
        container.classList.remove('from-orange-400');
        container.classList.remove('to-gray-500');
        for (let classnames of ar) {
          container.classList.add(classnames);
        }
      }
      if (day === 1) {
        let container = document.getElementById(id);
        let ar = ['bg-gradient-to-b', 'from-orange-400', 'to-gray-600', 'day-fog-animation']
        container.classList.remove('from-gray-500');
        container.classList.remove('to-blue-800');
        for (let classnames of ar) {
          container.classList.add(classnames);
        }
      }
    }
    changeBackground('main-container');


  }, [search])


  return (
    <>
      <div id='main-container' className='mx-auto w-full md:w-11/12  h-screen  rounded-lg overflow-y-scroll flex flex-col gap-y-1 bg-cover overflow-x-auto justify-around items-center'>
        <div className='w-11/12 text-left text-white text-xs font-semibold mt-2 px-3 flex flex-row justify-between items-center'>
          {search}
          <div className='flex flex-row items-center justify-center gap-x-1'>
            <input id='input' type="text" className='rounded-sm bg-white  text-black font-extralight text-center font-sm w-20' placeholder='Search Cities' />
            <button className='bg-transparent opacity-70 text-white font-semibold border border-white rounded-sm hover:bg-white hover:text-black text-xs' style={{ transition: "all 1s" }} onClick={() => {
              let value = document.getElementById('input').value;
              setSearch(value)
            }}>Search</button>
          </div>
        </div>
        <div className='text-white mt-2 font-semibold text-center text-3xl'>
          {data.temp_c}*C
          <p className='text-sm font-extralight'>Last updated:{data.last_updated}</p>
        </div>
        <div className='bg-transparent font-semibold rounded-xl w-11/12 h-32 text-white text-sm text-center flex flex-row overflow-x-scroll gap-x-3 mx-1'>
          <Timeline hourData={hour} />
        </div>
        <div className=' bg-gray-900 opacity-40 rounded-xl w-11/12 h-96 text-white text-xs text-center flex flex-col  items-center justify-around '>
          <Prediction search={search} />
          <button style={{ transition: "all 1.2s" }} className=' rounded-md text-white bg-transparent border border-white font-semibold px-10 py-1 hover:bg-white hover:text-black hover:font-semibold'>15 day forecast</button>
        </div>
        <div className=' bg-gray-900 opacity-40 rounded-xl w-11/12 h-14 text-white text-sm text-left gap-y-1 px-2 flex flex-col'>
          <b className='text-xs text-opacity-100'>Air Quality:  <AQI search={search} /> </b>
          <input type="range" name="" id="" min={1} max={400} value={< AQI search={search} />} />
        </div>
        <div className='w-11/12 h-14 text-white text-sm text-center gap-y-4 flex flex-row flex-wrap  gap-x-10 sm:gap-x-24 md:gap-x-24 px-1 justify-between'>

          <div className='w-1/4 sm:w-1/3 h-12 bg-gray-900 opacity-40 rounded-xl text-white font-medium  flex flex-col items-center justify-center'>
            <FaRegSun />
            <b className='text-xs' >UV: {otherInfo.uv}</b>

          </div>
          <div className='w-1/4 sm:w-1/3 h-12 bg-gray-900 opacity-40 rounded-xl text-white font-medium flex flex-col items-center justify-around'>
            <BsThermometerSun />
            <b className='text-xs'>Feels like: {otherInfo.feelslike_c}</b>

          </div>
          <div className='w-1/4 sm:w-1/3  h-12  bg-gray-900 opacity-40 rounded-xl text-white font-medium  flex flex-col justify-around items-center'>
            <WiHumidity />
            <b className='text-xs'>Humdity: {otherInfo.humidity}</b>
          </div>
          <div className='w-1/4 sm:w-1/3 h-12 bg-gray-900 opacity-40 rounded-xl text-white font-medium flex flex-col justify-around items-center'>
            <LuWind />
            <b className='text-xs'>{otherInfo.wind_dir},{otherInfo.wind_kph}</b>
          </div>
          <div className='w-1/4 sm:w-1/3 h-12 bg-gray-900 opacity-40 rounded-xl text-white font-medium flex flex-col justify-around items-center'>
            <GiWindSlap />
            <b className='text-xs'>Pressure: {otherInfo.pressure_mb}</b>
          </div>
          <div className='w-1/4 sm:w-1/3 h-12 bg-gray-900 opacity-40 rounded-xl text-white font-medium flex flex-col justify-center items-center'>
            <MdOutlineVisibility />
            <b className='text-xs'>Visibility: {otherInfo.vis_km}</b>
          </div>
        </div>
        <div className='bg-gray-900 opacity-40 rounded-xl w-11/12 h-24 text-white text-sm text-left px-2 flex flex-row mt-14 items-center justify-around mb-1'>
          <div className='flex flex-col items-center justify-around'>
            <span> <FiSunset /></span>
            <p >{astroData.sunset}</p>
            <span className='text-xl'>Sunset</span>
          </div>
          <div className='flex flex-col items-center justify-around'>
            <p><FiSunrise /></p>
            <p>{astroData.sunrise}</p>
            <p className='text-xl'>Sunrise</p>
          </div>
        </div>
      </div>
    </>
  )
}
export default App;
