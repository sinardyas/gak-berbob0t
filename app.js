require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Twitter = require('twitter-promise');

const client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => res.status(200).json({ message: 'Hello W0rld' }));

app.get('/status', async (req, res) => {
    const { userName, limit } = req.query;
    let result;

    try {
        result = await client.get({ path: 'favorites/list', params: { screen_name: userName, count: limit }});
    } catch (e) {
        return res.status(500).json({ error: e });
    }

    return res.status(200).json({ message: result });
});

app.get('/status/:id/detail', async (req, res) => {
    const { id } = req.params;
    let result;

    try {
        result = await client.get({ path: 'statuses/show', params: { id } });
    } catch (e) {
        return res.status(500).json({ error: e.error });
    }

    return res.status(200).json({ message: result });
});

app.get('/status/timeline', async (req, res) => {
    const { userName } = req.query;
    let result;

    try {
        result = await client.get({ path: 'statuses/user_timeline', params: { screen_name: userName } });
    } catch (e) {
        return res.status(500).json({ error: e.error });
    }

    console.log('data length : ', result.data.length);

    return res.status(200).json({ message: result });
});

app.post('/status/update', async (req, res) => {
    const { status } = req.body;    
    let result;

    try {
        result = await client.post({ path: 'statuses/update', params: { status } });
    } catch (e) {   
        return res.status(500).json({ error: e.error });
    }

    return res.status(200).json({ message: result });
});

app.get('/collections/list', async (req, res) => {
    const { userName } = req.query;
    let result;

    try {
        result = await client.get({ path: 'collections/list', params: { screen_name: userName } });
    } catch (e) {
        return res.status(500).json({ error: e.error });
    }

    // console.log('data length : ', result.data.length);

    return res.status(200).json({ message: result });
});

app.listen(port, () => {
    console.log(`[${new Date}] App listening on port ${port}`);
});

module.exports = app;