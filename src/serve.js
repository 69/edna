const Express = require('express');
const request = require('request-promise');

const app = new Express();
const env = require('dotenv').config().parsed;

if (!env.API_KEY) {
  // eslint-disable-next-line no-console
  console.error('Please set the API key for whoisxmlapi before proceeding.');
}

app.get('/checkAvailability/:domain', (req, res) => {
  const options = {
    url: 'https://www.whoisxmlapi.com/whoisserver/WhoisService',
    qs: {
      apiKey: env.API_KEY,
      domainName: req.params.domain,
      da: 2,
      outputFormat: 'JSON',
      thinWhois: 1,
      ignoreRawTexts: 1,
      _parse: 0,
    },
    json: true,
  };

  request(options).then((response) => {
    if (!response || !response.WhoisRecord) {
      return res.send({ success: false });
    }

    const apiStatus = response.WhoisRecord.domainAvailability;
    return res.send({
      isAvailable: apiStatus === 'AVAILABLE',
      success: apiStatus !== 'UNDETERMINED',
    });
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send({
      error: true,
    });
  });
});

app.use(Express.static('static'));
app.listen(env.PORT || 3000);
