const {send, requestType} = require('../http');

/**
 * Handles Power requests.
 * @param {Object} directive
 * @return {Promise}
 */
exports.powerHandler = ({header, endpoint}) => {
	const ref = endpoint.cookie.ref;
	const useLastLevel = endpoint.cookie.useLastLevel;

	return send(requestType.GET_CONTROL, ref).then(response => {
		const controlPairs = Array.from(response['ControlPairs']);

		let control;

		if (header.name === 'TurnOn') {
			control = getControl(controlPairs, useLastLevel ? 4 : 1);
		} else { // 'TurnOff'
			control = getControl(controlPairs, 2);
		}

		if (!control && useLastLevel) {
			control = getControl(controlPairs, 1);
		}
		if (!control) {
			return new Error('Could not find control pair');
		}

		return send(requestType.CONTROL_DEVICE_BY_VALUE, ref, control['ControlValue']);
	});
};

const getControl = (controlPairs, controlUse) => {
	return controlPairs.find(pair => pair['ControlUse'] === controlUse);
};
