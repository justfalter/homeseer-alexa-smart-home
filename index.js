const handleDiscovery = require('./controllers/DiscoveryController').discoveryHandler;
const handlePower = require('./controllers/PowerController').powerHandler;
const handleBrightness = require('./controllers/BrightnessController').brightnessHandler;
const handleStateReport = require('./controllers/StateReportController').stateReportHandler;
const handleResponse = require('./controllers/ResponseController').responseHandler;

/**
 * Entry point.
 * @param {Object} request
 * @param {Object} context
 */
exports.handler = ({directive}, context) => {

	switch (directive.header.namespace) {

		// handles discovery requests
		case 'Alexa.Discovery':
			handleDiscovery(directive, context);
			break;

		// handles power requests
		case 'Alexa.PowerController':
			handlePower(directive)
				.then(response => handleResponse(directive, response, context))
				.catch(context.fail);
			break;

		// handles brightness requests
		case 'Alexa.BrightnessController':
			handleBrightness(directive)
				.then(response => handleResponse(directive, response, context))
				.catch(context.fail);
			break;

		// handles report state requests
		default:
			handleStateReport(directive)
				.then(response => handleResponse(directive, response, context))
				.catch(context.fail);
	}
};
