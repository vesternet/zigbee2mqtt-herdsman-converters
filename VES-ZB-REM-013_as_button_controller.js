const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const utils = require('zigbee-herdsman-converters/lib/utils');
const gs = require('zigbee-herdsman-converters/lib/store');
const e = exposes.presets;
const transactionStore = {};

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
                    let dontDividePercentage = false;
                    if (meta.device.softwareBuildID == "2.5.3_r20") {
                        dontDividePercentage = true;
                    }
                    let percentage = msg.data['batteryPercentageRemaining'];
                    percentage = dontDividePercentage ? percentage : percentage / 2;
                    payload.battery = utils.precisionRound(percentage, 2);
                }

                return payload;
            },
        },
        button_map_level: {
            cluster: 'genLevelCtrl',
            type: ['commandMove', 'commandMoveWithOnOff', 'commandStop', 'commandStopWithOnOff'],
            convert: (model, msg, publish, options, meta) => {
                if (utils.hasAlreadyProcessedMessage(msg, model)) return;
                let button_number = 'unknown';
                let button_action = 'unknown';
                if (msg.type == 'commandMove' || msg.type == 'commandMoveWithOnOff') {
                    const direction = msg.data.movemode === 1 ? 'down' : 'up';
                    button_number = direction == 'up' ? (Number(msg.endpoint.ID * 2)) - 1 : (Number(msg.endpoint.ID) * 2)            
                    gs.putValue(msg.endpoint, 'previous_direction', direction);
                    button_action = '_hold';
                }
                else if (msg.type == 'commandStop' || msg.type == 'commandStopWithOnOff') {
                    const previous_direction = gs.getValue(msg.endpoint, 'previous_direction')
                    if (previous_direction !== undefined) {
                        button_number = previous_direction == 'up' ? (Number(msg.endpoint.ID * 2)) - 1 : (Number(msg.endpoint.ID) * 2)
                        button_action = '_release';
                    }
                }
                const payload = {action: 'button_' + button_number + button_action};
                utils.addActionGroup(payload, msg, model);
                return payload;
            },
        },
        button_map_state: {
            cluster: 'genOnOff',
            type: ['commandOn', 'commandOff'],
            convert: (model, msg, publish, options, meta) => {
                if (utils.hasAlreadyProcessedMessage(msg, model)) return;
                const button_number = msg.type == 'commandOn' ? (Number(msg.endpoint.ID * 2)) - 1 : (Number(msg.endpoint.ID) * 2)
                const payload = {action: 'button_' + button_number + '_click'};
                utils.addActionGroup(payload, msg, model);
                return payload;
            },
        },
        button_map_scene: {
            cluster: 'genScenes',
            type: ['commandRecall'],
            convert: (model, msg, publish, options, meta) => {
                if (utils.hasAlreadyProcessedMessage(msg, model)) return;
                const button_number = Number(msg.data.sceneid) == 1 ? 9 : 10
                const payload = {action: 'button_' + button_number + '_click'};
                utils.addActionGroup(payload, msg, model);
                return payload;
            },
        }        
    },
};

const definition = {
    fingerprint: [{modelID: 'ZGRC-KEY-013', softwareBuildID: '2.5.3_r20'}, 
                    {modelID: 'ZGRC-KEY-013', softwareBuildID: '2.7.6_r25'},
                    {modelID: 'ZGRC-KEY-013', softwareBuildID: '2.7.6_r27'}],
    model: 'VES-ZB-REM-013',
    vendor: 'Vesternet',
    description: 'Zigbee remote control - 12 button',
    fromZigbee: [vesternet.fz.button_map_level, vesternet.fz.button_map_state, vesternet.fz.button_map_scene, vesternet.fz.battery, fz.ignore_genOta],
    exposes: [e.battery(), e.action([
        'button_1_click', 'button_1_hold', 'button_1_release', 'button_2_click', 'button_2_hold', 'button_2_release', 'button_3_click', 'button_3_hold', 'button_3_release', 'button_4_click', 'button_4_hold', 'button_4_release', 'button_5_click', 'button_5_hold', 'button_5_release', 'button_6_click', 'button_6_hold', 'button_6_release', 'button_7_click', 'button_7_hold', 'button_7_release', 'button_8_click', 'button_8_hold', 'button_8_release'])],
    toZigbee: [],
    meta: {multiEndpoint: true, battery: {dontDividePercentage: true}},
    whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9001K12-DIM-Z4'}],
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint1 = device.getEndpoint(1);
        const endpoint2 = device.getEndpoint(2);
        const endpoint3 = device.getEndpoint(3);
        const endpoint4 = device.getEndpoint(4);
        await reporting.bind(endpoint1, coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'genScenes', 'genPowerCfg']);
        await reporting.bind(endpoint2, coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'genScenes' ]);
        await reporting.bind(endpoint3, coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'genScenes']);
        await reporting.bind(endpoint4, coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'genScenes']);
        let batterychange = 2;
        if (device && device.softwareBuildID == "2.5.3_r20") {
            // older firmware versions reported 0 - 100 so change needs to be 1 for 1 percent
            // newer firmware versions report 0 - 200 so change needs to be 2 for 1 percent
            batterychange = 1;
        }
        await reporting.batteryPercentageRemaining(endpoint1, {min: 3600, max: 21600, change: batterychange});
    },
};

module.exports = definition;
