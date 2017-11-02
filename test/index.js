/* eslint-disable no-unused-vars */
const handler = require('../index').handler;

const turnOn = {
	'directive': {
		'header': {
			'namespace': 'Alexa.PowerController',
			'name': 'TurnOn',
			'payloadVersion': '3',
			'messageId': '1bd5d003-31b9-476f-ad03-71d471922820',
			'correlationToken': 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg=='
		},
		'endpoint': {
			'scope': {
				'type': 'BearerToken',
				'token': 'access-token-from-skill'
			},
			'endpointId': 'main-floor-office-light',
			'cookie': {
				'ref': '6'
			}
		},
		'payload': {}
	}
};

const reportState = {
	'directive': {
		'header': {
			'namespace': 'Alexa',
			'name': 'ReportState',
			'payloadVersion': '3',
			'messageId': '1bd5d003-31b9-476f-ad03-71d471922820',
			'correlationToken': 'dFMb0z+PgpgdDmluhJ1LddFvSqZ/jCc8ptlAKulUj90jSqg=='
		},
		'endpoint': {
			'endpointId': 'main-floor-office-light',
			'cookie': {
				'ref': '4',
				'useLastLevel': true
			},
			'scope': {
				'type': 'BearerToken',
				'token': 'access-token-from-skill'
			}
		},
		'payload': {}
	}
};

handler(turnOn, {
	succeed: result => console.log('result', JSON.stringify(result, null, 4)),
	fail: error => console.log('error', JSON.stringify(error, null, 4))
});
