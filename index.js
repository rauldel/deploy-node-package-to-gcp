const core = require('@actions/core');
const github = require('@actions/github');
const util = require('util');
const path = require('path');
const { exec } = require('child_process');
const { env } = require('process');
const executeChild = util.promisify(exec);

async function checkLoginStatus() {
  try {
    const { stdout, stderr } = await executeChild(`gcloud auth list`);
    console.log(`RES: ${JSON.stringify(stdout, null, 2)}`);

    console.log(`The PATH: ${JSON.stringify(env)}`);
    const { stdout2, stderr2 } = await executeChild(
      `gcloud auth activate-service-account --key-file=${env.GOOGLE_APPLICATION_CREDENTIALS}`
    );
    console.log(`RES 2: ${JSON.stringify(stdout2, null, 2)}`);
  } catch (err) {
    console.error(`Failed to check gcloud auth: ${JSON.stringify(err)}.`);
    throw new Error('Fail to check gcloud auth');
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

    await checkLoginStatus();

    const creds = await getCrendentials();
    console.log(`The credentials ${creds}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
