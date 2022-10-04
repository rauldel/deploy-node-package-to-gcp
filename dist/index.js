/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 192:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 915:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(192);
const github = __nccwpck_require__(915);
const util = __nccwpck_require__(837);
const path = __nccwpck_require__(17);
const { exec } = __nccwpck_require__(81);
const executeChild = util.promisify(exec);

async function loginGoogleCloud() {
  try {
    console.log('Logging in GCP...');
    const { stdout, stderr } = await executeChild(
      `gcloud auth application-default login`
    );
    console.log(`Login result: ${JSON.stringify(stdout, null, 2)}`);
  } catch (err) {
    console.error(`Failed to login in GCP: ${JSON.stringify(err)}.`);
    throw new Error('Fail to login in GCP. Please seek for assistance.');
  }
}

async function getCrendentials() {
  try {
    console.log(`Retrieving credentials from gcloud...`);
    const { stdout, stderr } = await executeChild(
      `gcloud auth print-access-token`
    );

    const credentials = stdout.trim();
    return credentials;
  } catch (err) {
    console.error(
      `Failed to retrieve credentials from gcloud: ${JSON.stringify(err)}.`
    );
    throw new Error(
      'Fail to get credentials. Please run: \n' + '`gcloud auth login`'
    );
  }
}

async function run() {
  try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = new Date().toTimeString();
    core.setOutput('time', time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);

    await loginGoogleCloud();
    const creds = await getCrendentials();
    console.log(`The credentials ${creds}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;