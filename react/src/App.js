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
    Highcharts.dateFormat('%a %d %b %H:%M:%S', res._source.date),
    res._source.hospitalises,
  ]).filter((t) => t[0] !== undefined && t[1] !== undefined).sort(function (x, y) {
    return new Date(x[0]).getTime() - new Date(y[0]).getTime();
  })

  const dataY = data.map((res) => [
    Highcharts.dateFormat('%a %d %b %H:%M:%S', res._source.date),
    res._source.reanimation,
  ]).filter((t) => t[0] !== undefined && t[1] !== undefined).sort(function (x, y) {
    return new Date(x[0]).getTime() - new Date(y[0]).getTime();
  })

  const options = {
    title: {
      text: 'Hospitalisations'
    },
    xAxis: {
      dateTimeLabelFormats: {
        day: '%d %b %Y'    //ex- 01 Jan 2016
      },
      type: 'datetime',
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
      data: dataO
    }]
  }

  const options2 = {
    title: {
      text: 'Réanimations'
    },
    xAxis: {
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
      data: dataY
    }]
  }

  const options3 = {
    title: {
      text: 'Réanimations / Hospitalisations'
    },
    xAxis: {
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
      data: dataY
    }, {
      data: dataO
    }]
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <h2>Welcome to your custom covid data app</h2>
      <body>
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
      </body>
    </div>
  );
}

export default App;
