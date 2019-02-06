const express = require('express');
const bodyParser = require('body-parser');
const Twit = require('twit');
const Cron = require('cron').CronJob;

const Twot = new Twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  '',
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/update', async (req, res) => {    
    let result;
    let status;
    ({ status } = req.body);

    try {
        result = await Twot.post('statuses/update', { status: `[${new Date}] ${status}` });
    } catch (e) {
        return res.status(500).json({ message: 'Failed!' });
    }
    
    return res.status(200).json({ message: 'Success!', data: result.data });
});

app.listen(port, () => {
    console.log(`[${new Date}] App listening on port ${port}`);
});

const job = new Cron('0 */5 * * * *', async () => {
    let result;
    let status = 'Tweeted from Express.js using Twit library https://www.npmjs.com/package/twit';

    try {
        result = await Twot.post('statuses/update', { status: `[${new Date}] ${status}` });
    } catch (e) {
        console.log(`[${new Date}] Failed : ${e.message}`);
    }

    console.log(`[${new Date}] Success : ${JSON.stringify(result.data, null, 2)}`);
});

job.start();

module.exports = app;