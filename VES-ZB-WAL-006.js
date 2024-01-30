const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
    fingerprint: [{modelID: 'ZG2833K2_EU07', softwareBuildID: '2.5.3_r20'}, {modelID: 'ZG2833K2_EU07', softwareBuildID: '2.7.6_r25'}],
    model: 'VES-ZB-WAL-006',
    vendor: 'Vesternet',
    description: 'Zigbee wall controller - 2 button',
    fromZigbee: [fz.command_on, fz.command_off, fz.command_move, fz.command_stop, fz.battery, fz.ignore_genOta],
    exposes: [e.battery(), e.action([
        'on_1', 'off_1', 'stop_1', 'brightness_move_up_1', 'brightness_move_down_1', 'brightness_stop_1'])],
    toZigbee: [],
    meta: {multiEndpoint: true, battery: {dontDividePercentage: true}},
    whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9001K2-DIM2'}],
    configure: async (device, coordinatorEndpoint, logger) => {
        await reporting.bind(device.getEndpoint(1), coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'genPowerCfg']);
        await reporting.batteryPercentageRemaining(device.getEndpoint(1));
    },
};

module.exports = definition;
