/* globals describe it */
const should = require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('Locations', () => {
  it('should run resources.location', done => {
    const bundle = {
      inputData: {},
      authData: {
        access_token: "0".repeat(64)}
    };

    appTester(App.resources.location.list.operation.perform, bundle)
      .then(results => {
        should.exist(results);
        done();
      })
      .catch(done);
  });
});
