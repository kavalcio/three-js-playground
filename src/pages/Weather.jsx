import { useEffect } from 'react';
import axios from 'axios';

// https://api.open-meteo.com/v1/forecast?latitude=43.7001&longitude=-79.4163&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall&timezone=auto&forecast_days=1

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const getData = async () => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        latitude: 45.7001,
        longitude: -79.4163,
        current: ['weather_code'].join(','),
        hourly: ['weather_code'].join(','),
        // daily: ['weather_code'].join(','),
        // hourly:
        //   'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall',
        // timezone: 'auto',
        forecast_days: 1,
        temperature_unit: 'celsius',
      },
    });
    console.log(response.data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const Weather = () => {
  // useEffect(() => {
  //   getData().then((data) => console.log({ data }));
  // }, []);

  return (
    <div>
      <button onClick={getData}>Get Data</button>
    </div>
  );
};
