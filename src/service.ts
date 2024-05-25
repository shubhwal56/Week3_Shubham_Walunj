import axios from 'axios';
import nodemailer from 'nodemailer';

import { Weather } from './user_model';

const GEO_CODING_API_URL = 'https://api.api-ninjas.com/v1/geocoding';
const WEATHER_API_URL = 'https://weatherapi-com.p.rapidapi.com/current.json';
const GEO_CODING_API_KEY = 'SMwCpFPEEN+f9xMyEIXhYA==kfys6Tj1F4GRjUcp';
const WEATHER_API_KEY = '02fd95f2f8msh09087f3feeb3faep138d4ajsn33795d274e8d';

interface CityInfo {
    city: string;
    country: string;
}

async function fetchCoordinates(city: string, country: string) {
    try {
        const response = await axios.get(GEO_CODING_API_URL, {
            params: { city, country },
            headers: { 'X-Api-Key': GEO_CODING_API_KEY }
        });

        console.log('Geocoding API Response:', response); 

        if (!response.data || response.data.length === 0) {
            throw new Error(`Invalid response for ${city}, ${country}`);
        }

        const { latitude, longitude } = response.data[0];
        return { latitude, longitude };
    } catch (error) {
        console.error(`Error fetching coordinates for ${city}, ${country}:`, error);
        throw error;
    }
}


async function fetchWeather(latitude: number, longitude: number) {
    try {
        const response = await axios.get(WEATHER_API_URL, {
            params: { key: WEATHER_API_KEY, q: `${latitude},${longitude}` }
        });

        console.log('Weather API Response:', response.data);

        if (!response.data || !response.data.current || !response.data.current.condition) {
            throw new Error(`Invalid weather response for coordinates (${latitude}, ${longitude})`);
        }

        return response.data.current.condition.text;
    } catch (error) {
        console.error(`Error fetching weather for coordinates (${latitude}, ${longitude}):`, error);
        throw error;
    }
}

export async function saveWeatherData(cities: CityInfo[]) {
    console.log('Cities parameter:', cities);

    if (!Array.isArray(cities)) {
        throw new TypeError('cities is not an array');
    }

    for (const { city, country } of cities) {
        try {
            const { latitude, longitude } = await fetchCoordinates(city, country);
            const weather = await fetchWeather(latitude, longitude);

            await Weather.create({
                city,
                country,
                weather,
                time: new Date(),
                longitude,
                latitude
            });

            console.log(`Saved weather data for ${city}, ${country}`);
        } catch (error) {
            console.error(`Error saving weather data for ${city}, ${country}:`, error);
        }
    }
}


async function sendEmail(weatherData: any[]) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: 'dsouz70@gmail.com', 
            pass: 'Baleno@123' 
        }
    });

    const mailOptions = {
        to: 'Bolan21@gmail.com', 
        subject: 'Weather Data', 
        text: JSON.stringify(weatherData) 
    };

    await transporter.sendMail(mailOptions);
}