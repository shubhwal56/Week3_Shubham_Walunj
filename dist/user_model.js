"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Weather = void 0;
const sequelize_1 = require("sequelize");
const pgConfig_1 = require("./pgConfig");
class Weather extends sequelize_1.Model {
}
exports.Weather = Weather;
Weather.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    weather: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    longitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    latitude: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    sequelize: pgConfig_1.sequelize,
    modelName: 'Weather',
    tableName: 'weathers',
    timestamps: false,
});
//# sourceMappingURL=user_model.js.map