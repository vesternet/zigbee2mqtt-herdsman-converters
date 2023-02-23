const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
	fingerprint: [{modelID: 'ZGRC-KEY-013', softwareBuildID: '2.5.3_r20'}],
        model: 'VES-ZB-REM-013',
        vendor: 'Vesternet',
        description: 'Zigbee Remote Control - 12 Button',
        fromZigbee: [fz.command_on, fz.command_off, fz.command_move, fz.command_stop, fz.command_recall, fz.battery, fz.ignore_genOta],
        exposes: [e.battery(), e.action(['on_*', 'off_*', 'stop_*', 'brightness_move_up_*', 'brightness_move_down_*', 'brightness_stop_*', 'recall_*'])],
        toZigbee: [],
        meta: {multiEndpoint: true, battery: {dontDividePercentage: true}, publishDuplicateTransaction: true},
        whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9001K12-DIM-Z4'}],
	configure: async (device, coordinatorEndpoint, logger) => {
            await reporting.bind(device.getEndpoint(1), coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'genScenes', 'genPowerCfg']);
            await reporting.bind(device.getEndpoint(2), coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'genScenes' ]);
            await reporting.bind(device.getEndpoint(3), coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'genScenes' ]);
            await reporting.bind(device.getEndpoint(4), coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'genScenes' ]);
	    await reporting.batteryPercentageRemaining(device.getEndpoint(1));
        },
    };

module.exports = definition;
