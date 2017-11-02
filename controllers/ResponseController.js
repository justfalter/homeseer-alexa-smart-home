const endpoints = require('../endpoints.json');

/**
 * Handles responses sent back to Alexa.
 * @param {Object} directive
 * @param {Object} response
 * @param {Object} context
 */
exports.responseHandler = (directive, {Devices}, {succeed}) => {
	const {name, messageId, correlationToken} = directive.header;
	const [device] = Devices;
	const response = createResponseTemplate();

	const endpoint = Array.from(endpoints).find(ep =>
		ep.endpointId === directive.endpoint.endpointId
	);

	const {properties} = response.context;
	Array.from(endpoint['capabilities']).forEach(capability => {
		switch (capability['interface']) {
			case 'Alexa.EndpointHealth':
				properties.push(getHealthProperty(device));
				break;
			case 'Alexa.PowerController':
				properties.push(getPowerProperty(device));
				break;
			case 'Alexa.BrightnessController':
				properties.push(getBrightnessProperty(device));
				break;
		}
	});

	const {header} = response.event;
	header.name = name === 'ReportState' ? 'StateReport' : 'Response';
	header.messageId = `${messageId}-R`;
	header.correlationToken = correlationToken;

	succeed(response);
};

const getHealthProperty = device => {
	return {
		namespace: 'Alexa.EndpointHealth',
		name: 'connectivity',
		value: {'value': 'OK'},
		timeOfSample: parseDate(device['last_change']),
		uncertaintyInMilliseconds: 200
	};
};

const getPowerProperty = device => {
	return {
		namespace: 'Alexa.PowerController',
		name: 'powerState',
		value: device.status.toUpperCase(),
		timeOfSample: parseDate(device['last_change']),
		uncertaintyInMilliseconds: 200
	};
};

const getBrightnessProperty = device => {
	return {
		namespace: 'Alexa.BrightnessController',
		name: 'brightness',
		value: device.value,
		timeOfSample: parseDate(device['last_change']),
		uncertaintyInMilliseconds: 200
	};
};

/**
 * Takes a date string in the format of: /Date(1507385107697)/
 * and converts it into ISO format: 2017-10-07T14:29:46.192Z
 * @param {string} dateStr
 * @return {string}
 */
const parseDate = dateStr => {
	let d;

	d = /\d+/.exec(dateStr)[0];
	d = parseInt(d, 10);
	d = new Date(d);

	return d.toISOString();
};

const createResponseTemplate = () => {
	return {
		context: {
			properties: []
		},
		event: {
			header: {
				namespace: 'Alexa',
				name: '',
				payloadVersion: '3',
				messageId: '',
				correlationToken: ''
			},
			payload: {}
		}
	};
};
