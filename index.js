const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');
const url = require('url');
var request = require('request');

try {
  // `who-to-greet` input defined in action metadata file
  const jenkinsUrl = core.getInput('jenkins-url');
  console.log(`Github hook will be called on ${jenkinsUrl}`);
  const time = (new Date()).toTimeString();
  // parse jenkins url
  const parsedUrl = url.parse(jenkinsUrl) ;
  const webHookUrl = new URL('/github-webhook/', jenkinsUrl);
  var agentOptions;
  var agent;
  
  agentOptions = {
    host: parsedUrl.host,
    port: parsedUrl.port,
    path: '/',
    rejectUnauthorized: false
  }
  agent = new https.Agent(agentOptions)

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  request.post({ url: webHookUrl ,
            agent: agent, 
            body: ${payload},
            json: true,
            headers: { "X-GitHub-Event" : "push", "content-type": "application/json" }
          }, function (err, response, body) {
          console.log(response);
          }
  )
  core.setOutput("http_status", response.statusCode);
} catch (error) {
  core.setFailed(error.message);
}
