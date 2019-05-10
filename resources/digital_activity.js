// get a list of digital_activitys
const listDigitalactivitys = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://memair.com/graphql',
    headers: {
      'access_token': bundle.authData.access_token
    },
    body: 'query{DigitalActivities(first: 100){id timestamp duration digital_activity_type{slug} meta source}}'
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content)['data']['DigitalActivities']);
};

// create a digital_activity
const createDigitalactivity = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://memair.com/graphql',
    headers: {
      'access_token': bundle.authData.access_token
    },
    body: `mutation {Create(digital_activities: [{type: ${bundle.inputData.type} ${(bundle.inputData.duration != null) ? 'duration: ' + bundle.inputData.duration : ''} timestamp: "${bundle.inputData.timestamp}" meta: ${JSON.stringify(JSON.stringify(bundle.inputData.meta_data, null, "\r\t"))} }]) {digital_activities {id timestamp duration meta}}}`
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

yaml = require('js-yaml');
fs   = require('fs');

var digital_activity_types;
var choices = {};
try{
  digital_activity_types = yaml.safeLoad(fs.readFileSync('data-types/digital_activity_types.yml', 'utf8'));

  digital_activity_types.forEach(function(digital_activity_type){
    choices[digital_activity_type.slug] = digital_activity_type.name
  });
}catch(e){
  // this prevents a little bug on Zapier's side
}

module.exports = {
  key: 'digital_activity',
  noun: 'Digital Activity',

  list: {
    display: {
      label: 'Digital Activities',
      description: 'Recently created Digital Activities.'
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
          label: 'Digital Activity type',
          choices: choices
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
