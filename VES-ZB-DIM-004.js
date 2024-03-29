const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/extend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
    fingerprint: [{ modelID: 'HK-SL-DIM-A', softwareBuildID: '2.5.3_r52' }, { modelID: 'HK-SL-DIM-A', softwareBuildID: '2.9.2_r54' }],
    model: 'VES-ZB-DIM-004',
    vendor: 'Vesternet',
    description: 'Zigbee dimmer',
    fromZigbee: extend.light_onoff_brightness().fromZigbee.concat([fz.electrical_measurement, fz.metering, fz.ignore_genOta]),
    toZigbee: extend.light_onoff_brightness().toZigbee.concat([tz.power_on_behavior]),
    exposes: [e.light_brightness().withLevelConfig(['on_transition_time', 'off_transition_time']), e.power(), e.voltage(), e.current(), e.energy(), e.power_on_behavior(['off', 'on', 'previous'])],
    whiteLabel: [{ vendor: 'Sunricher', model: 'SR-ZG9040A' }],
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint = device.getEndpoint(1);
        await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff', 'genLevelCtrl', 'haElectricalMeasurement', 'seMetering']);
        await reporting.onOff(endpoint);
        await reporting.brightness(endpoint);
        await reporting.readEletricalMeasurementMultiplierDivisors(endpoint);
        await reporting.activePower(endpoint);
        await reporting.rmsCurrent(endpoint, { min: 10, change: 10 });
        await reporting.rmsVoltage(endpoint, { min: 10 });
        await reporting.readMeteringMultiplierDivisor(endpoint);
        await reporting.currentSummDelivered(endpoint);
    },
};

module.exports = definition;
