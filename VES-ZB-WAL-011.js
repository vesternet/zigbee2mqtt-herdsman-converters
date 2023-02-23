const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
	fingerprint: [{modelID: 'ZG2833K4_EU06', softwareBuildID: '2.5.3_r20'}],
        model: 'VES-ZB-WAL-011',
        vendor: 'Vesternet',
        description: 'Zigbee Wall Controller - 4 Button',
        fromZigbee: [fz.command_on, fz.command_off, fz.command_move, fz.command_stop, fz.battery, fz.ignore_genOta],
        exposes: [e.battery(), e.action([
            'on_1', 'off_1', 'stop_1', 'brightness_move_up_1', 'brightness_move_down_1', 'brightness_stop_1',
            'on_2', 'off_2', 'stop_2', 'brightness_move_up_2', 'brightness_move_down_2', 'brightness_stop_2'])],
        toZigbee: [],
        meta: {multiEndpoint: true, battery: {dontDividePercentage: true}},
        whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9001K4-DIM2'}],
	configure: async (device, coordinatorEndpoint, logger) => {
            await reporting.bind(device.getEndpoint(1), coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'genPowerCfg']);
            await reporting.bind(device.getEndpoint(2), coordinatorEndpoint, ['genOnOff', 'genLevelCtrl']);
	    await reporting.batteryPercentageRemaining(device.getEndpoint(1));
        },
    };

module.exports = definition;
