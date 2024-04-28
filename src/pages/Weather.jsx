import { useEffect } from 'react';
import axios from 'axios';

// https://api.open-meteo.com/v1/forecast?latitude=43.7001&longitude=-79.4163&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,snowfall&timezone=auto&forecast_days=1

/*
Animation params:
- Sun position and sky color
  - Datetime
  - Latitude longitude
  - Note: I think sunset/sunrise time is returned by open-meteo, so worst case i can do a linear mapping on time of day between sunrise/sunset to sun position between
- weather_code
- visibility? Maybe weather_code is enough to determine fog
- cloud_cover? weather_code might be enough
- Temperature? Maybe add effects when temperatures are especially high or low
- Wind speed? Maybe add a cartoon wind effect if wind is especially strong
- Star visibility based on light polution and cloud cover level (really extra)
*/

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
