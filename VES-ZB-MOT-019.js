const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
	fingerprint: [{modelID: 'HK-ZCC-A', softwareBuildID: '2.5.3_r48'}],
        model: 'VES-ZB-MOT-019',
        vendor: 'Vesternet',
        description: 'Zigbee Motor Controller',
        fromZigbee: [fz.cover_position_tilt, fz.ignore_genOta],
        toZigbee: [tz.cover_state, tz.cover_position_tilt],
        exposes: [e.cover_position()],
        whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9080A'}],
	meta: {coverInverted: true},
        configure: async (device, coordinatorEndpoint, logger) => {
            const endpoint = device.getEndpoint(1);
	    await reporting.bind(endpoint, coordinatorEndpoint, ['closuresWindowCovering']);
            await reporting.currentPositionLiftPercentage(endpoint);
        },
    };

module.exports = definition;
