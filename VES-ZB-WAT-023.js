const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const ota = require('zigbee-herdsman-converters/lib/ota');
const e = exposes.presets;

const vesternet = {
    fz: {
        ias_water_leak_alarm_1_report: {
            cluster: 'ssIasZone',
            type: ['attributeReport', 'readResponse'],
            convert: (model, msg, publish, options, meta) => {
                const zoneStatus = msg.data.zoneStatus;
                return {
                    water_leak: (zoneStatus & 1) > 0,
                    tamper: (zoneStatus & (1 << 2)) > 0,
                    battery_low: (zoneStatus & (1 << 3)) > 0,
                };
            },
        }
    }
};

const definition = {
    fingerprint: [{modelID: 'WaterLeakageSensor-ZB3.0', softwareBuildID: '2.01'},
                    {modelID: 'WaterLeakageSensor-ZB3.0', softwareBuildID: '2.1'},
                    {modelID: 'WaterLeakageSensor-ZB3.0', softwareBuildID: '2.03'},
                    {modelID: 'WaterLeakageSensor-ZB3.0', softwareBuildID: '2.04'},
                    {modelID: 'WaterLeakageSensor-ZB3.0', softwareBuildID: '2.10'}],
    model: 'VES-ZB-WAT-023',
    vendor: 'Vesternet',
    description: 'Zigbee water sensor',
    fromZigbee: [fz.ias_enroll, fz.ias_water_leak_alarm_1, vesternet.fz.ias_water_leak_alarm_1_report, fz.battery],
    exposes: [e.water_leak(), e.battery()],
    toZigbee: [],
    ota: ota.zigbeeOTA,
    whiteLabel: [{vendor: 'HZC Electric', model: 'S900W-ZG'}],
    configure: async (device, coordinatorEndpoint, logger) => {
        const endpoint = device.getEndpoint(1);
        await reporting.bind(endpoint, coordinatorEndpoint, ['ssIasZone', 'genPowerCfg']);
        await endpoint.read('ssIasZone', ['iasCieAddr', 'zoneState', 'zoneId', 'zoneStatus']);
        await reporting.batteryPercentageRemaining(endpoint, {min: 3600, max: 21600, change: 2});
        await endpoint.read('genPowerCfg', ['batteryPercentageRemaining']);
    },
};

module.exports = definition;
