const {electricityMeter, onOff, identify} = require('zigbee-herdsman-converters/lib/modernExtend');

const definition = {
    fingerprint: [{modelID: 'ON/OFF -M', softwareBuildID: '2.9.2_r54'}, {modelID: 'ON/OFF -M', softwareBuildID: '2.9.2_r55'}],
    model: 'VES-ZB-HLD-017',
    vendor: 'Vesternet',
    description: 'Zigbee high load switch',
    extend: [
        onOff(), 
        identify(),
        electricityMeter(),
    ],
    whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9101SAC-HP-SWITCH-B'}],
};

module.exports = definition;
