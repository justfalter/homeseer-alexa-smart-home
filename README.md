HomeSeer Alexa Smart Home Skill API
==============================================

Configure Environment Variables
-------------------------------

Set the following environment variables on your AWS Lambda function:

* HOMESEER_HOST: connected.homeseer.com
* HOMESEER_USERNAME: _Your username used to execute JSON API requests_
* HOMESEER_PASSWORD: _Your password used to execute JSON API requests_

Define Discoverable Devices
---------------------------

endpoints.json already has a couple of sample devices defined for reference. You can use 
[this](https://developer.amazon.com/docs/device-apis/alexa-discovery.html#discoverresponse)
as a more thorough reference.

_*note: the endpoints.json should define the endpoints[] array as the top-level object_

### A few notes about endpoint definitions: 

* endpointId: Can be anything, but should be unique. I name mine location1-location2-devicename
* friendlyName: The name you want to use when referencing the device to Alexa. Can be the same
name as defined in HS3 or something different.
* description and manufacturer: These can be anything. They display in the Alexa app.
* displayCategories: Should be one of [these](https://developer.amazon.com/docs/device-apis/alexa-discovery.html#display-categories) 
I believe this only used to display a graphic in the alexa app.
* cookie: Must define a 'ref' property set to the ref of the device in HS3. cookie can also define
a 'useLastLevel' boolean if you want the 'turnOn' command for dimmers to set the value to the
dimmer's last on value.
* capabilities: Define a capability block for each capability your device supports. For binary
switches, this would be just PowerController. For dimmers, this would include both PowerController
and BrightnessController. All devices should define the initial AlexaInterface and EndpointHealth
* proactivelyReported: Should be set to false for all capability blocks until this skill supports
async status reports.

##### The only, currently support capabilities are PowerController and BrightnessController. 

Once configured, zip up the project and upload to your Lambda.

A test file exists in the test directory that you can run and test locally.