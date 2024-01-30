const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
        fingerprint: [{modelID: 'DoorSensor-ZB3.0', softwareBuildID: '2.01'}, {modelID: 'DoorSensor-ZB3.0', softwareBuildID: '2.1'}, {modelID: 'DoorSensor-ZB3.0', softwareBuildID: '2.03'}, {modelID: 'DoorSensor-ZB3.0', softwareBuildID: '2.04'}],
        model: 'VES-ZB-DOR-25',
        vendor: 'Vesternet',
        description: 'Zigbee door and window Sensor',
        fromZigbee: [fz.ias_enroll, fz.ias_contact_alarm_1, fz.battery],
        exposes: [e.contact(), e.tamper(), e.battery()],
        toZigbee: [],
        whiteLabel: [{vendor: 'HZC Electric', model: 'S901D-ZG'}],
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
            await reporting.bind(endpoint, coordinatorEndpoint, ['ssIasZone', 'genPowerCfg']);
            await endpoint.read('ssIasZone', ['iasCieAddr', 'zoneState', 'zoneId']);
            await reporting.batteryPercentageRemaining(endpoint, {min: 3600, max: 7200});        
        },
    };

module.exports = definition;