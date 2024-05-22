const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/modernExtend');
const ota = require('zigbee-herdsman-converters/lib/ota');
const e = exposes.presets;
const ea = exposes.access;

const definition = {
    fingerprint: [{modelID: 'MotionSensor-ZB3.0', softwareBuildID: '2.01'}, 
                    {modelID: 'MotionSensor-ZB3.0', softwareBuildID: '2.1'}, 
                    {modelID: 'MotionSensor-ZB3.0', softwareBuildID: '2.03'}, 
                    {modelID: 'MotionSensor-ZB3.0', softwareBuildID: '2.04'},
                    {modelID: 'MotionSensor-ZB3.0', softwareBuildID: '2.10'}],
    model: 'VES-ZB-PIR-021',
    vendor: 'Vesternet',
    description: 'Zigbee motion sensor',
    fromZigbee: [fz.ias_enroll, fz.ias_occupancy_alarm_1, fz.battery],
    exposes: [e.occupancy(), e.tamper(), e.battery()],
    toZigbee: [],
    ota: ota.zigbeeOTA,
    whiteLabel: [{vendor: 'HZC Electric', model: 'S902M-ZG'}],
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint = device.getEndpoint(1);
        await reporting.bind(endpoint, coordinatorEndpoint, ['ssIasZone', 'genPowerCfg']);
        await endpoint.read('ssIasZone', ['iasCieAddr', 'zoneState', 'zoneId']);
        await reporting.batteryPercentageRemaining(endpoint, {min: 3600, max: 21600, change: 2});        
    },
};

module.exports = definition;
