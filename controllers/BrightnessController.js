const {send, requestType} = require('../http');

/**
 * Handles Power requests.
 * @param {Object} directive
 * @return {Promise}
 */
exports.brightnessHandler = ({header, endpoint, payload}) => {
	const ref = endpoint.cookie.ref;

	return send(requestType.GET_CONTROL, ref).then(response => {
		const controlPairs = Array.from(response['ControlPairs']);
		const control = controlPairs.find(pair => {
			return pair['ControlUse'] === 3;
		});

		let value;

		if (header.name === 'AdjustBrightness') {
			value = payload['brightnessDelta'];
			return adjustBrightness(ref, value, control);
		}
		if (header.name === 'SetBrightness') {
			value = payload['brightness'];
			return setBrightness(ref, value, control);
		}
	});
};

const adjustBrightness = (ref, value, control) => {
	const rangeStart = control['Range']['RangeStart'];
	const rangeEnd = control['Range']['RangeEnd'];

	return send(requestType.GET_STATUS, ref).then(response => {
		const devices = Array.from(response['Devices']);
		const currentValue = devices[0]['value'];

		let newValue = value + currentValue;

		if (newValue > rangeEnd) {
			newValue = rangeEnd;
		}
		if (newValue < rangeStart) {
			newValue = rangeStart;
		}

		return send(requestType.CONTROL_DEVICE_BY_VALUE, ref, newValue);

	});
};

const setBrightness = (ref, value, control) => {
	const rangeStart = control['Range']['RangeStart'];
	const rangeEnd = control['Range']['RangeEnd'];

	let newValue = value;

	if (newValue > rangeEnd) {
		newValue = rangeEnd;
	}
	if (newValue < rangeStart) {
		newValue = rangeStart;
	}

	return send(requestType.CONTROL_DEVICE_BY_VALUE, ref, newValue);
};
