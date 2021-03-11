import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
// const { Client } = require('@elastic/elasticsearch')
// const client = new Client({ node: 'http://localhost:9200' })
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

function App() {
  // React.useEffect(() => {
  //   fetch("http://localhost:3001/api")
  //   .then((res) => res.json())
  //   .then((data) => console.log(data));
  // }, []);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch("http://localhost:3001/api")
      .then((res) => res.json())
      .then((res) => { console.log(res); setData(res) });

  }, []);

  const dataO = data.map((res) => [
    new Date(res._source.date).getTime(),
    res._source.hospitalises,
  ]).filter((t) => t[0] !== undefined && t[1] !== undefined).sort(function (x, y) {
    return new Date(x[0]).getTime() - new Date(y[0]).getTime();
  })

  const dataY = data.map((res) => [
    new Date(res._source.date).getTime(),
    res._source.reanimation,
  ]).filter((t) => t[0] !== undefined && t[1] !== undefined).sort(function (x, y) {
    return new Date(x[0]).getTime() - new Date(y[0]).getTime();
  })
  console.log(dataO)
  const options = {
    title: {
      text: 'Hospitalisations'
    },
    xAxis: {
      type: "datetime",
      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Hospitalisations'
      }
    },
    series: [{
      name: 'hospi',
      data: dataO
    }]
  }

  const options2 = {
    title: {
      text: 'Réanimations'
    },
    xAxis: {
      type: "datetime",

      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Réanimations'
      }
    },
    series: [{
      name: 'réa',
      data: dataY
    }]
  }

  const options3 = {
    title: {
      text: 'Réanimations / Hospitalisations'
    },
    xAxis: {
      type: "datetime",

      title: {
        text: 'Date'
      }
    },
    yAxis: {
      title: {
        text: 'Réanimations'
      }
    },
    series: [{
      name: 'Rea',
      data: dataY
    }, {
      name: 'Hospi',
      data: dataO
    }]
  }
  console.log(data)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Covid Stats Bas-Rhin
        <hr />
        <div class="input-hidden-label"
          aria-hidden="true">
          Minimum hospitalisations threshold
     </div>

        <input width="500" onChange={(e) => {
          fetch(`http://localhost:3001/search?q=${e.target.value}`)
            .then((res) => res.json())
            .then((res) => { setData(res) });
        }} type="text" />
        <hr />
      </header>
      <h2>Welcome to your custom covid data app</h2>
      <body>
        <div id="container" style={{height: 400}}>
          <p>{!data ? "Loading..." : <><HighchartsReact
          highcharts={Highcharts}
          options={options}
        /><HighchartsReact
            highcharts={Highcharts}
            options={options2}
          /><HighchartsReact
            highcharts={Highcharts}
            options={options3}
          /></>}</p>
        </div>
      </body>
    </div >
  );
}

export default App;
