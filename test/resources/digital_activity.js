/* globals describe it */
const should = require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('Digital Activity', () => {
  it('should run resources.digital_activity', done => {
    const bundle = {
      inputData: {},
      authData: {
        access_token: "0".repeat(64)}
    };

    appTester(App.resources.digital_activity.list.operation.perform, bundle)
      .then(results => {
        should.exist(results);
        done();
      })
      .catch(done);
  });
});
