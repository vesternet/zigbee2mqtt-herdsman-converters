const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const utils = require('zigbee-herdsman-converters/lib/utils');
const e = exposes.presets;
const ea = exposes.access;


const vesternet = { 
    fz: {
        battery: {
            cluster: 'genPowerCfg',
            type: ['attributeReport', 'readResponse'],
            convert: (model, msg, publish, options, meta) => {
                const payload = {};
                if (msg.data.hasOwnProperty('batteryPercentageRemaining') && (msg.data['batteryPercentageRemaining'] < 255)) {
                    // older firmware versions reported 0 - 100 so don't need percentage dividing
                    // newer firmware versions report 0 - 200 so do need percentage dividing
                    let dontDividePercentage = true;
                    if (meta.device.softwareBuildID == "2.7.6_r25") {
                        dontDividePercentage = false;
                    }
                    let percentage = msg.data['batteryPercentageRemaining'];
                    percentage = dontDividePercentage ? percentage : percentage / 2;
                    payload.battery = utils.precisionRound(percentage, 2);
                }

                return payload;
            },
        }
    },
};

const definition = {
    fingerprint: [{modelID: 'ZG2833K2_EU07', softwareBuildID: '2.5.3_r20'}, {modelID: 'ZG2833K2_EU07', softwareBuildID: '2.7.6_r25'}],
    model: 'VES-ZB-WAL-006',
    vendor: 'Vesternet',
    description: 'Zigbee wall controller - 2 button',
    fromZigbee: [fz.command_on, fz.command_off, fz.command_move, fz.command_stop, vesternet.fz.battery, fz.ignore_genOta],
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
