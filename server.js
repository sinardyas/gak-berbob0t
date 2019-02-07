require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Twit = require('twit');
const Cron = require('cron').CronJob;

const Twot = new Twit({
  consumer_key:         process.env.CONSUMER_KEY,
  consumer_secret:      process.env.CONSUMER_SECRET,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
});

const app = express();
const port = process.env.PORT;

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

const job = new Cron('0 */60 * * * *', async () => {
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