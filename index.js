// server/index.js
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

const express = require("express");
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3001;

async function run() {
    client.indices.delete({
        index: '_all'
    }, function(err, res) {
    
        if (err) {
            console.error(err.message);
        } else {
            console.log('Indexes have been deleted!');
        }
    });
    let time = 370;
    setInterval(async () => {
    const result = await fetch(
        'https://coronavirusapi-france.now.sh/AllDataByDepartement?Departement=Bas-Rhin'
    ).then(res => res.json())
    result.allDataByDepartement.forEach(async (res) => {
        // Create new Date instance
        var date = new Date(res.date)
        date.setDate(date.getDate() - time)
        res.date = date
        // Add a day
        // Let's start by indexing some data
        await client.index({
            index: 'tr',
            // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
            body: res
        })
    });
    time = time * 2;
}, 5000)


    // here we are forcing an index refresh, otherwise we will not
    // get any result in the consequent search
    await client.indices.refresh({ index: 'tr' })

    // Let's search!
    const { body } = await client.search({
        index: 'tr',
        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
        // body: {
        //     query: {
        //         match: { quote: 'winter' }
        //     }
        // }
    })

    return body.hits.hits

    // console.log(body.hits.hits)
}



const app = express();
app.get("/api", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const data = await run()
    res.send(data)
});

app.get('/', function (req, res) {
    // res.render('index', {});
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});