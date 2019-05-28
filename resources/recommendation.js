// get a list of recommendations
const listRecommendations = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://memair.com/graphql',
    headers: {
      'access_token': bundle.authData.access_token
    },
    body: 'query{Recommendations(first: 100){id actioned_at description duration expires_at id is_actioned is_expired is_ignored notes priority published_at source thumbnail_url timestamp title type url}}'
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content)['data']['Recommendations']);
};

// create a recommendations
const createRecommendation = (z, bundle) => {
  const responsePromise = z.request({
    method: 'POST',
    url: 'https://memair.com/graphql',
    headers: {
      'access_token': bundle.authData.access_token
    },
    body: `mutation {Create(recommendations: [{type: ${bundle.inputData.type} ${(bundle.inputData.source != null) ? 'source: "' + bundle.inputData.source + '"' : ''} ${(bundle.inputData.notes != null) ? 'notes: "' + bundle.inputData.notes + '"' : ''} priority: ${bundle.inputData.priority} expires_at: "${bundle.inputData.expires_at}" ${(bundle.inputData.url != null) ? 'url: "' + bundle.inputData.url + '"' : ''} ${(bundle.inputData.title != null) ? 'title: "' + bundle.inputData.title + '"' : ''} ${(bundle.inputData.description != null) ? 'description: "' + bundle.inputData.description + '"' : ''} ${(bundle.inputData.thumbnail_url != null) ? 'thumbnail_url: "' + bundle.inputData.thumbnail_url + '"' : ''} ${(bundle.inputData.duration != null) ? 'duration: ' + bundle.inputData.duration : ''} ${(bundle.inputData.published_at != null) ? 'published_at: "' + bundle.inputData.published_at + '"' : ''}}]) {id}}`
  });
  return responsePromise
    .then(response => z.JSON.parse(response.content));
};

yaml = require('js-yaml');
fs   = require('fs');

var recommendation_types;
var choices = {};
try{
  recommendation_types = yaml.safeLoad(fs.readFileSync('data-types/recommendation_types.yml', 'utf8'));

  recommendation_types.forEach(function(recommendation_type){
    choices[recommendation_type.slug] = recommendation_type.name
  });
}catch(e){
  // this prevents a little bug on Zapier's side
}

module.exports = {
  key: 'recommendation',
  noun: 'Recommendation',

  list: {
    display: {
      label: 'Recommendations',
      description: 'Lists recently created Recommendations.'
    },
    operation: {
      perform: listRecommendations
    }
  },

  create: {
    display: {
      label: 'Create Recommendation',
      description: 'Creates a new Recommendation.'
    },
    operation: {
      inputFields: [
        {
          key: 'expires_at',
          required: true,
          type: 'datetime',
          label: 'Expires at',
          helpText: 'When the recommendation expires'
        }, {
          key: 'priority',
          required: true,
          type: 'number',
          label: 'Priority',
          helpText: 'from 0 to 10'
        }, {
          key: 'type',
          required: true,
          label: 'Recommendation type',
          choices: choices
        }, {
          key: 'source',
          required: false,
          type: 'string',
          label: 'Source'
        }, {
          key: 'notes',
          required: false,
          type: 'text',
          label: 'Notes'
        }, {
          key: 'url',
          required: false,
          type: 'string',
          label: 'URL'
        }, {
          key: 'title',
          required: false,
          type: 'string',
          label: 'Title'
        }, {
          key: 'description',
          required: false,
          type: 'text',
          label: 'Description'
        }, {
          key: 'thumbnail_url',
          required: false,
          type: 'string',
          label: 'Thumbnail URL'
        }, {
          key: 'duration',
          required: false,
          type: 'number',
          label: 'Duration',
          helpText: 'In seconds'
        }, {
          key: 'published_at',
          required: false,
          type: 'datetime',
          label: 'Published at'
        }
      ],
      perform: createRecommendation
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
