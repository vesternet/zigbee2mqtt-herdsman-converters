const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
        fingerprint: [{modelID: 'WaterLeakageSensor-ZB3.0', softwareBuildID: '2.01'}, {modelID: 'WaterLeakageSensor-ZB3.0', softwareBuildID: '2.1'}, {modelID: 'WaterLeakageSensor-ZB3.0', softwareBuildID: '2.03'}, {modelID: 'WaterLeakageSensor-ZB3.0', softwareBuildID: '2.04'}],
        model: 'VES-ZB-WAT-023',
        vendor: 'Vesternet',
        description: 'Zigbee water sensor',
        fromZigbee: [fz.ias_enroll, fz.ias_water_leak_alarm_1, fz.battery],
        exposes: [e.water_leak(), e.battery()],
        toZigbee: [],
        whiteLabel: [{vendor: 'HZC Electric', model: 'S900W-ZG'}],
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['ssIasZone', 'genPowerCfg']);
            await endpoint.read('ssIasZone', ['iasCieAddr', 'zoneState', 'zoneId']);
            await reporting.batteryPercentageRemaining(endpoint, {min: 600, max: 21600, change: 2});        
        },
    };

module.exports = definition;
