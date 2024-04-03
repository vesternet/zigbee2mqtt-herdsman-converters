const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const {electricityMeter, light} = require('zigbee-herdsman-converters/lib/modernExtend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
    fingerprint: [{ modelID: 'HK-SL-DIM-A', softwareBuildID: '2.5.3_r52' }, { modelID: 'HK-SL-DIM-A', softwareBuildID: '2.9.2_r54' }],
    model: 'VES-ZB-DIM-004',
    vendor: 'Vesternet',
    description: 'Zigbee dimmer',
    extend: [
        light({configureReporting: true, levelConfig: {disabledFeatures: ['on_transition_time', 'off_transition_time']}}),
        electricityMeter(),
    ],
    whiteLabel: [{ vendor: 'Sunricher', model: 'SR-ZG9040A' }]
};

module.exports = definition;
