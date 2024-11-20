const {electricityMeter, light, identify} = require('zigbee-herdsman-converters/lib/modernExtend');

const definition = {
    fingerprint: [{ modelID: 'HK-SL-DIM-A', softwareBuildID: '2.5.3_r52' }, { modelID: 'HK-SL-DIM-A', softwareBuildID: '2.9.2_r54' }, { modelID: 'HK-SL-DIM-A', softwareBuildID: '2.9.2_r63' }],
    model: 'VES-ZB-DIM-004',
    vendor: 'Vesternet',
    description: 'Zigbee dimmer',
    extend: [
        light({configureReporting: true, levelConfig: {disabledFeatures: ['on_transition_time', 'off_transition_time', 'on_off_transition_time', 'execute_if_off']}, powerOnBehavior: true, effect: false}), 
        identify(),
        electricityMeter(),
    ],
    whiteLabel: [{ vendor: 'Sunricher', model: 'SR-ZG9040A' }]
};

module.exports = definition;
