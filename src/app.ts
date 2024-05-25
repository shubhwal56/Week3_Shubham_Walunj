import express, { Request, Response } from 'express';
import { saveWeatherData } from './service';
import { sequelize } from './pgConfig';
import { Weather } from './user_model';

const app = express();
const port = 8000;

app.use(express.json());

app.post('/api/SaveWeatherMapping', async (req: Request, res: Response) => {
    try {
        const cities = req.body;
        console.log('Request body:', cities);

        if (!Array.isArray(cities)) {
            throw new TypeError('Request body must be an array');
        }

        await saveWeatherData(cities);
        res.status(201).send("Weather data saved successfully");
    } catch (error) {
        console.error('Error in /api/SaveWeatherMapping:', error);
        res.status(500).send(`Error saving weather data: ${error}`);
    }
});

app.get('/api/weatherDashboard', async (req: Request, res: Response) => {
    try {
        const { city } = req.query;

        let whereClause = {};
        if (city) {
            whereClause = { city: city.toString() };
        }

        const weatherData = await Weather.findAll({
            where: whereClause,
            order: [['time', 'DESC']], 
            attributes: ['id', 'city', 'country', 'time', 'weather']
        });

        res.json(weatherData);
    } catch (error) {
        console.error('Error in /api/weatherDashboard:', error);
        res.status(500).send(`Error fetching weather dashboard data: ${error}`);
    }
});

app.post('/api/sendWeatherDataByEmail', async (req: Request, res: Response) => {
    try {
        const { city } = req.body;
        let weatherData;

        if (city) {
            weatherData = await Weather.findAll({ where: { city } });
        } else {
            weatherData = await Weather.findAll({
                attributes: ['city', 'country', 'weather', 'time'],
                group: ['city', 'country', 'weather'],
                order: [['time', 'DESC']]
            });
        }

        sendEmail(weatherData); 

        res.status(200).send('Weather data sent via email successfully');
    } catch (error) {
        console.error('Error sending weather data via email:', error);
        res.status(500).send(`Error sending weather data via email: ${error}`);
    }
});




sequelize.sync({ force: false }).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error('Unable to sync database:', err);
});
function sendEmail(weatherData: Weather[]) {
    throw new Error('Function not implemented.');
}

