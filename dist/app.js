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
const express_1 = __importDefault(require("express"));
const service_1 = require("./service");
const pgConfig_1 = require("./pgConfig");
const app = (0, express_1.default)();
const port = 8000;
app.use(express_1.default.json());
app.post('/api/SaveWeatherMapping', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cities = req.body;
        console.log('Request body:', cities);
        if (!Array.isArray(cities)) {
            throw new TypeError('Request body must be an array');
        }
        yield (0, service_1.saveWeatherData)(cities);
        res.status(201).send("Weather data saved successfully");
    }
    catch (error) {
        console.error('Error in /api/SaveWeatherMapping:', error);
        res.status(500).send(`Error saving weather data: ${error}`);
    }
}));
pgConfig_1.sequelize.sync({ force: false }).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error('Unable to sync database:', err);
});
//# sourceMappingURL=app.js.map