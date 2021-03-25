# Installation
1. npm install
2. npm run serve

# Change API Conf
Navigate to /platform-api-test/src/main.js and change in httpApi variable.
- Change host for API Url
- Change user & pass for login to system and generate access token. the process of bringing up the access token is done on the route node /plathform-api/test/arc/view/node.vue
- Change API Key with project API Key to change project remote data

# Functional File
1. Node List = /platform-api-test/src/views/node.vue
2. Sensor List = /platform-api-test/src/views/sensor.vue
3. Sensor Detail = /platform-api-test/src/views/detail.vue

# Chart Line Testing
Go to /platform-api-test/src/views/detail.vue an navigate betwen line 150 until 153 nad you can reverse the comment for displaying example chart line, And make line 221 - 225 into comment script.

# Note
if something wrong during the npm installation, you can use the direct link to download node_modules at the following link
https://drive.google.com/file/d/1E_ebvVBjoirMZyPYam5V55rCMREzX4vO/view?usp=sharing
