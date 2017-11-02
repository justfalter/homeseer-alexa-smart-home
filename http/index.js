/**
 * http module.
 * @module http/index
 */

const https = require('https');
const querystring = require('querystring');

/**
 * Types of requests available.
 *
 * @param {string} GET_STATUS - A request type that returns the status of a device.
 * @param {string} GET_CONTROL - A request type that returns the control information of a device.
 * @param {string} CONTROL_DEVICE_BY_VALUE - A request type that sets a new value on a device.
 */
const requestType = {
	GET_STATUS: 'getstatus',
	GET_CONTROL: 'getcontrol',
	CONTROL_DEVICE_BY_VALUE: 'controldevicebyvalue'
};

/**
 * Abstraction for requests to the HomeSeer JSON API.
 *
 * Requests should be one of getstatus, getcontrol,
 * and controldevicebyvalue. If a request of type
 * controldevicebyvalue is made, another request of
 * type getstatus, with the device's new value, will
 * be automatically made with its result returned.
 *
 * @param {string} request - The type of request to make.
 * @param {string} ref - The ref of the device to request or control.
 * @param {number} [value] - The value to set on the device when controlling.
 * @return {Promise}
 */
const send = (request, ref, value) => {

	const query = {
		user: process.env.HOMESEER_USERNAME,
		pass: process.env.HOMESEER_PASSWORD,
		request, ref
	};

	if (request === requestType.CONTROL_DEVICE_BY_VALUE) {
		Object.assign(query, {value});
	}

	const httpOptions = {
		host: process.env.HOMESEER_HOST,
		path: `/JSON/?${querystring.stringify(query)}`
	};

	return new Promise((resolve, reject) => {

		https.get(httpOptions, response => {
			response.setEncoding('utf8');

			let body = '';
			response.on('data', data => body += data);

			response.on('end', () => {
				let result;

				try {
					result = JSON.parse(body);
				} catch (error) {
					reject(error);
				}

				if (request === requestType.CONTROL_DEVICE_BY_VALUE) {
					resolve(send(requestType.GET_STATUS, ref));
				} else {
					resolve(result);
				}

			});
		}).on('error', error => reject(error));

	});
};

module.exports = {
	requestType, send
};
