// get a list of locations
const listLocations = (z) => {
  const responsePromise = z.request({
    url: 'https://jsonplaceholder.typicode.com/posts',
    params: {
      order_by: 'id desc'
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
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
