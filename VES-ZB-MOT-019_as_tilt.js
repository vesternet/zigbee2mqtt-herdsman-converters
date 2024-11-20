const {windowCovering, identify} = require('zigbee-herdsman-converters/lib/modernExtend');

const definition = {
    fingerprint: [{modelID: 'HK-ZCC-A', softwareBuildID: '2.5.3_r48'}],
    model: 'VES-ZB-MOT-019',
    vendor: 'Vesternet',
    description: 'Zigbee motor controller',
    extend: [
        windowCovering({ controls: ['tilt'], stateSource: 'tilt' }), 
        identify(),
    ],
    whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9080A'}],
};

module.exports = definition;
