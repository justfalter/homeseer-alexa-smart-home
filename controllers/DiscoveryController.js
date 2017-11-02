
const endpoints = require('../endpoints.json');

/**
 * Handles a discovery request.
 * @param {Object} directive
 * @param {Object} context
 */
exports.discoveryHandler = ({header}, {succeed}) => {
	const response = createDiscoveryTemplate();
	const {event} = response;

	event.header.messageId = header.messageId;
	event.payload.endpoints = endpoints;

	succeed(response);
};

const createDiscoveryTemplate = () => {
	return {
		event: {
			header: {
				namespace: 'Alexa.Discovery',
				name: 'Discover.Response',
				payloadVersion: '3',
				messageId: ''
			},
			payload: {
				endpoints: []
			}
		}
	};
};
