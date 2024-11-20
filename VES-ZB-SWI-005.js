const {onOff, identify} = require('zigbee-herdsman-converters/lib/modernExtend');

const definition = {
    fingerprint: [{modelID: 'HK-SL-RELAY-A', softwareBuildID: '2.5.3_r47'}, {modelID: 'HK-SL-RELAY-A', softwareBuildID: '2.9.2_r54'}],
    model: 'VES-ZB-SWI-005',
    vendor: 'Vesternet',
    description: 'Zigbee switch',
    extend: [
        onOff(), 
        identify(),
    ],
    whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9100A-S'}]
};

module.exports = definition;
