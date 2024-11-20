const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const e = exposes.presets;


const definition = {
    fingerprint: [{modelID: 'ON/OFF(2CH)', softwareBuildID: '2.5.3_r2'}, {modelID: 'ON/OFF(2CH)', softwareBuildID: '2.9.2_r3'}],
    model: 'VES-ZB-SWI-015',
    vendor: 'Vesternet',
    description: 'Zigbee 2 channel switch',
    fromZigbee: [fz.on_off, fz.electrical_measurement, fz.metering, fz.power_on_behavior, fz.ignore_genOta],
    toZigbee: [tz.on_off, tz.power_on_behavior, tz.identify],
    exposes: [e.switch().withEndpoint('l1'), e.switch().withEndpoint('l2'), e.power(), e.current(), e.voltage(), e.energy(), e.identify().withEndpoint('l1'), e.identify().withEndpoint('l2'), e.power_on_behavior(['off', 'on', 'previous']).withEndpoint('l1'), e.power_on_behavior(['off', 'on', 'previous']).withEndpoint('l2')],
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
        await endpoint1.read('genOnOff', [0x0000]);
        await endpoint2.read('genOnOff', [0x0000]);
        await endpoint1.write('genOnOff', {0x4003: {value: 0xFF, type: 0x30}});
        await endpoint1.read('genOnOff', [0x4003]);
        await endpoint2.write('genOnOff', {0x4003: {value: 0xFF, type: 0x30}});
        await endpoint2.read('genOnOff', [0x4003]);        
        if (device && device.softwareBuildID == '2.9.2_r3') {
            //newer firmware version power reports are on endpoint 11
            const endpoint11 = device.getEndpoint(11);
            await reporting.bind(endpoint11, coordinatorEndpoint, ['haElectricalMeasurement', 'seMetering']);
            await reporting.readEletricalMeasurementMultiplierDivisors(endpoint11);
            await reporting.activePower(endpoint11, {min: 10, change: 50, max: 600});
            await reporting.rmsCurrent(endpoint11, {min: 10, change: 100, max: 600});
            await reporting.rmsVoltage(endpoint11, {min: 10, change: 10, max: 600});
            await reporting.readMeteringMultiplierDivisor(endpoint11);
            await reporting.currentSummDelivered(endpoint11, {min: 10, change: 360000, max: 600});
            await endpoint11.read('haElectricalMeasurement', ['activePower']);
            await endpoint11.read('haElectricalMeasurement', ['rmsCurrent']);
            await endpoint11.read('haElectricalMeasurement', ['rmsVoltage']);
            await endpoint11.read('seMetering', ['currentSummDelivered']);
        }
        else if (device && device.softwareBuildID == '2.5.3_r2') {
            //older firmware version power reports are on endpoint 1
            await reporting.bind(endpoint1, coordinatorEndpoint, ['haElectricalMeasurement', 'seMetering']);
            await reporting.readEletricalMeasurementMultiplierDivisors(endpoint1);
            await reporting.activePower(endpoint1, {min: 10, change: 50, max: 600});
            await reporting.rmsCurrent(endpoint1, {min: 10, change: 100, max: 600});
            await reporting.rmsVoltage(endpoint1, {min: 10, change: 10, max: 600});
            await reporting.readMeteringMultiplierDivisor(endpoint1);
            await reporting.currentSummDelivered(endpoint1, {min: 10, change: 360000, max: 600});
            await endpoint1.read('haElectricalMeasurement', ['activePower']);
            await endpoint1.read('haElectricalMeasurement', ['rmsCurrent']);
            await endpoint1.read('haElectricalMeasurement', ['rmsVoltage']);
            await endpoint1.read('seMetering', ['currentSummDelivered']);
        }
    },
};

module.exports = definition;
