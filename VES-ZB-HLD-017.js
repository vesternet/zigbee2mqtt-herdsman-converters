const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/modernExtend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
    fingerprint: [{modelID: 'ON/OFF -M', softwareBuildID: '2.9.2_r54'}, {modelID: 'ON/OFF -M', softwareBuildID: '2.9.2_r55'}],
    model: 'VES-ZB-HLD-017',
    vendor: 'Vesternet',
    description: 'Zigbee high load switch',
    fromZigbee: [fz.on_off, fz.electrical_measurement, fz.metering, fz.power_on_behavior, fz.ignore_genOta],
    toZigbee: [tz.on_off, tz.power_on_behavior],
    exposes: [e.switch(), e.power(), e.current(), e.voltage(), e.energy(), e.power_on_behavior(['off', 'on', 'previous'])],
    whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9101SAC-HP-SWITCH-B'}],
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint = device.getEndpoint(1);
        await reporting.bind(endpoint, coordinatorEndpoint, ['genOnOff', 'haElectricalMeasurement', 'seMetering']);
        await reporting.onOff(endpoint);
        await reporting.readEletricalMeasurementMultiplierDivisors(endpoint);
        await reporting.activePower(endpoint);
        await reporting.rmsCurrent(endpoint, {min: 10, change: 10});
        await reporting.rmsVoltage(endpoint, {min: 10});
        await reporting.readMeteringMultiplierDivisor(endpoint);
        await reporting.currentSummDelivered(endpoint);
    },
};

module.exports = definition;
