const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const extend = require('zigbee-herdsman-converters/lib/modernExtend');
const e = exposes.presets;
const ea = exposes.access;


const definition = {
    fingerprint: [{modelID: 'ON/OFF(2CH)', softwareBuildID: '2.5.3_r2'}, {modelID: 'ON/OFF(2CH)', softwareBuildID: '2.9.2_r3'}],
    model: 'VES-ZB-SWI-015',
    vendor: 'Vesternet',
    description: 'Zigbee 2 channel switch',
    fromZigbee: [fz.on_off, fz.electrical_measurement, fz.metering, fz.power_on_behavior, fz.ignore_genOta],
    toZigbee: [tz.on_off, tz.power_on_behavior],
    exposes: [e.switch().withEndpoint('l1'), e.switch().withEndpoint('l2'), e.power(), e.current(), e.voltage(), e.energy(), e.power_on_behavior(['off', 'on', 'previous'])],
    whiteLabel: [{vendor: 'Sunricher', model: 'SR-ZG9101SAC-HP-SWITCH-2CH'}],
    endpoint: (device) => {
        return {'l1': 1, 'l2': 2};
    },
    meta: {multiEndpoint: true},
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint1 = device.getEndpoint(1);
        const endpoint2 = device.getEndpoint(2);            
        await reporting.bind(endpoint1, coordinatorEndpoint, ['genOnOff']);
        await reporting.bind(endpoint2, coordinatorEndpoint, ['genOnOff']);
        await reporting.onOff(endpoint1);
        await reporting.onOff(endpoint2);
        if (device && device.softwareBuildID == '2.9.2_r3') {
            //newer firmware version power reports are on endpoint 11
            const endpoint11 = device.getEndpoint(11);
            await reporting.bind(endpoint11, coordinatorEndpoint, ['haElectricalMeasurement', 'seMetering']);
            await reporting.readEletricalMeasurementMultiplierDivisors(endpoint11);
            await reporting.activePower(endpoint11);
            await reporting.rmsCurrent(endpoint11, {min: 10, change: 10});
            await reporting.rmsVoltage(endpoint11, {min: 10});
            await reporting.readMeteringMultiplierDivisor(endpoint11);
        }
        else if (device && device.softwareBuildID == '2.5.3_r2') {
            //older firmware version power reports are on endpoint 1
            await reporting.bind(endpoint1, coordinatorEndpoint, ['haElectricalMeasurement', 'seMetering']);                
            await reporting.readEletricalMeasurementMultiplierDivisors(endpoint1);
            await reporting.activePower(endpoint1);
            await reporting.rmsCurrent(endpoint1, {min: 10, change: 10});
            await reporting.rmsVoltage(endpoint1, {min: 10});
            await reporting.readMeteringMultiplierDivisor(endpoint1);
            await reporting.currentSummDelivered(endpoint1);
        }
    },
};

module.exports = definition;
