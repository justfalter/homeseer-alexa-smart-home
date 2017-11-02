const {send, requestType} = require('../http');

/**
 * Handles State Report requests.
 * @param {Object} directive
 * @return {Promise}
 */
exports.stateReportHandler = ({endpoint}) => {
	const ref = endpoint.cookie.ref;
	return send(requestType.GET_STATUS, ref);
};
