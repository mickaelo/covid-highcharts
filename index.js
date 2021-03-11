// server/index.js
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

const express = require("express");
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3001;

async function run() {
    client.indices.delete({
        index: '_all'
    }, function (err, res) {

        if (err) {
            console.error(err.message);
        } else {
            console.log('Indexes have been deleted!');
        }
    });
    let time = 370;
    const result = await fetch(
        'https://coronavirusapi-france.now.sh/AllDataByDepartement?Departement=Bas-Rhin'
    ).then(res => res.json())
    result.allDataByDepartement.forEach(async (res) => {
        // Create new Date instance
        // Add a day
        // Let's start by indexing some data
        await client.index({
            index: 'tr',
            type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
            body: res
        })
    });


    // here we are forcing an index refresh, otherwise we will not
    // get any result in the consequent search
    await client.indices.refresh({ index: 'tr' })

    // Let's search!
    const { body } = await client.search({
        index: 'tr',
        body: {
            size: 200,
            from: 0,
        }
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

// define the /search route that should return elastic search results
app.get('/search', function (req, res) {
    console.log(req)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // declare the query object to search elastic search and return only 200 results from the first result found.
    // also match any data where the name is like the query string sent in
    let body = {
        size: 200,
        from: 0,
        query: {
            "range": {
                "hospitalises": {
                    "gte": req.query['q']
                }
            },
            // match: {
            //     date: req.query['q']
            // }
        }
    }
    // perform the actual search passing in the index, the search query and the type
    client.search({ index: 'tr', body })
        .then(results => {
            console.log(results)
            res.send(results.body.hits.hits);
        })
        .catch(err => {
            console.log(err)
            res.send([]);
        });

})

app.get("/api", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const data = await run()
    res.send(data)
});

app.get("/search", async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const data = await search()
    res.send(data)
});

app.get('/', function (req, res) {
    // res.render('index', {});
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});