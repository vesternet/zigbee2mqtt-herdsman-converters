const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const ota = require('zigbee-herdsman-converters/lib/ota');
const e = exposes.presets;

const definition = {
    fingerprint: [{modelID: 'TempAndHumSensor-ZB3.0', softwareBuildID: '2.01'},
                    {modelID: 'TempAndHumSensor-ZB3.0', softwareBuildID: '2.1'},
                    {modelID: 'TempAndHumSensor-ZB3.0', softwareBuildID: '2.04'},
                    {modelID: 'TempAndHumSensor-ZB3.0', softwareBuildID: '2.07'},
                    {modelID: 'TempAndHumSensor-ZB3.0', softwareBuildID: '2.08'},
                    {modelID: 'TempAndHumSensor-ZB3.0', softwareBuildID: '2.09'},
                    {modelID: 'TempAndHumSensor-ZB3.0', softwareBuildID: '2.10'},
                    {modelID: 'TempAndHumSensor-ZB3.0', softwareBuildID: '2.11'},
                    {modelID: 'TempAndHumSensor-ZB3.0', softwareBuildID: '2.12'},
                    {modelID: 'TempAndHumSensor-ZB3.0', softwareBuildID: '2.13'}],
    model: 'VES-ZB-TEM-027',
    vendor: 'Vesternet',
    description: 'Zigbee temperature and humidity sensor',
    fromZigbee: [fz.temperature, fz.humidity, fz.battery],
    exposes: [e.temperature(), e.humidity(), e.battery()],
    toZigbee: [],
    ota: ota.zigbeeOTA,
    whiteLabel: [{vendor: 'HZC Electric', model: 'S093TH-ZG'}],
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint = device.getEndpoint(1);
        await reporting.bind(endpoint, coordinatorEndpoint, ['msTemperatureMeasurement', 'msRelativeHumidity', 'genPowerCfg']);
        await reporting.temperature(endpoint, {min: 60, max: 1800, change: 100});
        await endpoint.read('msTemperatureMeasurement', ['measuredValue']);
        await reporting.humidity(endpoint, {min: 60, max: 1800, change: 100});
        await endpoint.read('msRelativeHumidity', ['measuredValue']);
        await reporting.batteryPercentageRemaining(endpoint, {min: 3600, max: 21600, change: 2});
        await endpoint.read('genPowerCfg', ['batteryPercentageRemaining']);
    },
};

module.exports = definition;
