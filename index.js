const core = require('@actions/core');
const github = require('@actions/github');
const https = require('https');
const url = require('url');
var request = require('request');

try {
  // `who-to-greet` input defined in action metadata file
  const jenkinsUrl = core.getInput('jenkins-url');
  console.log(`Jenkins url is ${jenkinsUrl}`);
  const time = (new Date()).toTimeString();
  // parse jenkins url
  const parsedUrl = url.parse(jenkinsUrl) ;
  const webHookUrl = new URL('/github-webhook/', jenkinsUrl);
  console.log(`Github hook will be called on ${webHookUrl}`);


  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  var responseStatus = 0 ;
  request.post({ url: webHookUrl ,
            agentOptions: { rejectUnauthorized: false },
            body: github.context.payload,
            json: true,
            headers: { "X-GitHub-Event" : "push", "Content-Type": "application/json" }
          }, function (err, response, body) {
            console.log(`The response statusCode is ${response.statusCode}`);
            responseStatus = response.statusCode ;
          }
  )
  core.setOutput("http_status", responseStatus);
} catch (error) {
  core.setFailed(error.message);
}
