"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWeatherData = void 0;
const axios_1 = __importDefault(require("axios"));
const user_model_1 = require("./user_model");
const GEO_CODING_API_URL = 'https://api.api-ninjas.com/v1/geocoding';
const WEATHER_API_URL = 'https://weatherapi-com.p.rapidapi.com/current.json';
const GEO_CODING_API_KEY = 'SMwCpFPEEN+f9xMyEIXhYA==kfys6Tj1F4GRjUcp';
const WEATHER_API_KEY = '02fd95f2f8msh09087f3feeb3faep138d4ajsn33795d274e8d';
function fetchCoordinates(city, country) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(GEO_CODING_API_URL, {
                params: { city, country },
                headers: { 'X-Api-Key': GEO_CODING_API_KEY }
            });
            console.log('Geocoding API Response:', response.data);
            if (!response.data || response.data.length === 0) {
                throw new Error(`Invalid response for ${city}, ${country}`);
            }
            const { latitude, longitude } = response.data[0];
            return { latitude, longitude };
        }
        catch (error) {
            console.error(`Error fetching coordinates for ${city}, ${country}:`, error);
            throw error;
        }
    });
}
function fetchWeather(latitude, longitude) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(WEATHER_API_URL, {
                params: { key: WEATHER_API_KEY, q: `${latitude},${longitude}` }
            });
            console.log('Weather API Response:', response.data);
            if (!response.data || !response.data.current || !response.data.current.condition) {
                throw new Error(`Invalid weather response for coordinates (${latitude}, ${longitude})`);
            }
            return response.data.current.condition.text;
        }
        catch (error) {
            console.error(`Error fetching weather for coordinates (${latitude}, ${longitude}):`, error);
            throw error;
        }
    });
}
function saveWeatherData(cities) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Cities parameter:', cities);
        if (!Array.isArray(cities)) {
            throw new TypeError('cities is not an array');
        }
        for (const { city, country } of cities) {
            try {
                const { latitude, longitude } = yield fetchCoordinates(city, country);
                const weather = yield fetchWeather(latitude, longitude);
                yield user_model_1.Weather.create({
                    city,
                    country,
                    weather,
                    time: new Date(),
                    longitude,
                    latitude
                });
                console.log(`Saved weather data for ${city}, ${country}`);
            }
            catch (error) {
                console.error(`Error saving weather data for ${city}, ${country}:`, error);
            }
        }
    });
}
exports.saveWeatherData = saveWeatherData;
//# sourceMappingURL=service.js.map