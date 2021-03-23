import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

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
  const [hospi, setHospi] = React.useState(0);
  const [rea, setRea] = React.useState(0)
  const [deces, setDeces] = React.useState(0)

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

  const dataD = data.map((res) => [
    new Date(res._source.date).getTime(),
    res._source.deces,
  ]).filter((t) => t[0] !== undefined && t[1] !== undefined).sort(function (x, y) {
    return new Date(x[0]).getTime() - new Date(y[0]).getTime();
  })

  const options = {
    chart: {
      spacingLeft: 100,
      spacingRight: 100,
    },
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
      name: 'Hospitalisations',
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
      name: 'Réanimations',
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
      name: 'Hospitalisations',
      data: dataO
    }, {
      name: 'Réanimations',
      data: dataY
    }, {
      name: 'Décès',
      data: dataD
    }]
  }
  console.log(data)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Covid Stats Bas-Rhin
        <hr />
        <Row style={{ display: "inline" }}>
          <Col>
            <Button onClick={() => fetch("http://localhost:3001/clean")
              .then((res) => res.json())
              .then((res) => { console.log(res); setData(res) })} variant="primary">Clean D</Button>
          </Col><Col>
          <Button onClick={() => fetch("http://localhost:3001/api")
            .then((res) => res.json())
            .then((res) => { console.log(res); setData(res) })} variant="primary">Load public data</Button>
          </Col>
        </Row>
        <hr />
        <Row style={{ margin: 10 }} align="left">
          <Col xs={4}>
            <div class="input-hidden-label"
              aria-hidden="true">
              Minimum hospitalisations threshold
          <hr />
              <input min="0" defaultValue={0} width="500" onChange={(e) => {
                setHospi(e.target.value)
                fetch(`http://localhost:3001/search?q=${e.target.value}&r=${rea}&d=${deces}`)
                  .then((res) => res.json())
                  .then((res) => { setData(res) });
              }} type="text" />
            </div></Col>
          <Col xs={4}>
            <div class="input-hidden-label"
              aria-hidden="true">
              Minimum reanimations threshold
          <hr />
              <input min="0" defaultValue={0} width="500" onChange={(e) => {
                setRea(e.target.value)
                fetch(`http://localhost:3001/search?r=${e.target.value}&q=${hospi}&d=${deces}`)
                  .then((res) => res.json())
                  .then((res) => { setData(res) });
              }} type="text" />
            </div></Col>
          <Col xs={4}>
            <div class="input-hidden-label"
              aria-hidden="true">
              Minimum deaths threshold
          <hr />
              <input min="0" defaultValue={0} width="500" onChange={(e) => {
                setDeces(e.target.value)
                fetch(`http://localhost:3001/search?r=${rea}&q=${hospi}&d=${e.target.value}`)
                  .then((res) => res.json())
                  .then((res) => { setData(res) });
              }} type="text" />
            </div></Col>
        </Row>

        {/* <input width="500" onChange={(e) => {
          fetch(`http://localhost:3001/search?q=${e.target.value}`)
            .then((res) => res.json())
            .then((res) => { setData(res) });
        }} type="text" />
        <hr />
        <div class="input-hidden-label"
          aria-hidden="true">
          Minimum hospitalisations threshold
     </div> */}

        {/* <input width="500" onChange={(e) => {
          fetch(`http://localhost:3001/search?r=${e.target.value}`)
            .then((res) => res.json())
            .then((res) => { setData(res) });
        }} type="text" /> */}
        <hr />
      </header>
      <h2>Welcome to your custom covid data app</h2>
      <body>
        <div id="container" style={{ height: 400 }}>
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
