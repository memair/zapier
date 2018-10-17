// get a list of digital_activitys
const listDigitalactivitys = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://memair.com/graphql',
    params: {
      query: 'query{DigitalActivities(order:timestamp_desc first: 100){id timestamp duration digital_activity_type{slug}}}',
      access_token: bundle.authData.access_token
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

// create a digital_activity
const createDigitalactivity = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://memair.com/graphql',
    params: {
      query: `mutation {Create(digital_activities: [{type: ${bundle.inputData.type} ${(bundle.inputData.duration != null) ? 'duration: ' + bundle.inputData.duration : ''} timestamp: "${bundle.inputData.timestamp}"}]) {digital_activities {id timestamp duration meta}}}`,
      access_token: bundle.authData.access_token
    }
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

module.exports = {
  key: 'digital_activity',
  noun: 'Digital Activity',

  list: {
    display: {
      label: 'New Digital Activity',
      description: 'Lists Digital Activities.'
    },
    operation: {
      perform: listDigitalactivitys
    }
  },

  create: {
    display: {
      label: 'Create Digital Activity',
      description: 'Creates a new Digital Activity.'
    },
    operation: {
      inputFields: [
        {
          key: 'timestamp',
          required: true,
          type: 'datetime',
          label: 'Timestamp'
        },
        {
          key: 'duration',
          required: false,
          type: 'number',
          label: 'Duration',
          helpText: 'In seconds'
        },
        {
          key: 'meta_data',
          required: false,
          dict: true,
          label: 'Meta data'
        },
        {
          key: 'type',
          required: true,
          label: 'Digital Activity Type',
          choices: {
            'played_game': 'Played game',
            'watched_video': 'Watched video',
            'visited_website': 'Visited website',
            'sent_communication': 'Sent communication',
            'received_communication': 'Received communication',
          }
        }
      ],
      perform: createDigitalactivity
    },
  },

  sample: {
    id: 1,
    name: 'Test'
  },

  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Name'}
  ]
};
