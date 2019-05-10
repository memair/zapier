const querystring = require('querystring');

const getAccessToken = (z, bundle) => {
  const promise = z.request(`https://memair.com/oauth/token`, {
    method: 'POST',
    body: {
      code: bundle.inputData.code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: bundle.inputData.redirect_uri
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });

  return promise.then((response) => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content);
    }

    const result = JSON.parse(response.content);
    return {
      access_token: result.access_token
    };
  });
};

const testAuth = (z, bundle) => {
  const promise = z.request({
    method: 'GET',
    url: `https://memair.com/api/auth.test`,
    params: {
      access_token: bundle.authData.access_token
    }
  });

  return promise.then((response) => {
    if (response.status === 401) {
      throw new Error(response.content);
    }
    return z.JSON.parse(response.content);
  });
};

module.exports = {
  type: 'oauth2',
  oauth2Config: {
    authorizeUrl: {
      url: `https://memair.com/oauth/authorize`,
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code'
      }
    },
    getAccessToken: getAccessToken,
    scope: 'biometric_read biometric_write digital_activity_read digital_activity_write emotion_read emotion_write journal_read journal_write location_read location_write medication_read medication_write physical_activity_read physical_activity_write insight_write insight_read recommendation_write recommendation_read recommendation_action recommendation_delete user_details'
  },
  test: testAuth,
  connectionLabel: '{{username}}'
};
