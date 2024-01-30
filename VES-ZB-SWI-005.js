const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
    fingerprint: [{modelID: 'HK-SL-RELAY-A', softwareBuildID: '2.5.3_r47'}, {modelID: 'HK-SL-RELAY-A', softwareBuildID: '2.9.2_r54'}],
    model: 'VES-ZB-SWI-005',
    vendor: 'Vesternet',
    description: 'Zigbee switch',
    fromZigbee: [fz.on_off, fz.power_on_behavior, fz.ignore_genOta],
    toZigbee: [tz.on_off, tz.power_on_behavior],
    exposes: [e.switch(), e.power_on_behavior(['off', 'on', 'previous'])],
    whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9100A-S'}],
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint = device.getEndpoint(1);
        await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff']);
        await reporting.onOff(endpoint);
    },
};

module.exports = definition;
