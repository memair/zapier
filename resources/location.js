// get a list of locations
const listLocations = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://memair.com/graphql',
    headers: {
      'access-token': bundle.authData.access_token
    },
    body: 'query{Locations(first: 100){id lat lon timestamp source point_accuracy}}'
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content)['data']['Locations']);
};

module.exports = {
  key: 'location',
  noun: 'Location',
  list: {
    display: {
      label: 'New Location',
      description: 'Lists the locations.'
    },
    operation: {
      perform: listLocations
    }
  },

  sample: {
    id: 1,
    name: 'Test'
  }
};
