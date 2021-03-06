import React from 'react';
const fetch = require('node-fetch');

import * as cx from 'classnames';
import * as style from '../../css/styles.css'

import { Forecast } from './Forecast.jsx';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "",
      cityToBeSearched: "",
      forecast: {},
      isLoading: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  componentDidMount() {
    this.fetchData;
  }

  handleChange(e) {
    this.setState({
      cityToBeSearched: e.target.value
    })
  }

  handleFocus() {
    this.setState({
      cityToBeSearched: ""
    })
  }

  fetchData(e) {
    e.preventDefault();
    this.setState({
      isLoading: true
    })
    let query = this.state.cityToBeSearched;
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
      targetUrl = `https://www.metaweather.com/api/location/search/?query=${query}`;

    const that = this;
    fetch(proxyUrl + targetUrl).then(response =>
      response.json().then(data => ({
        data: data,
        status: response.status
      })
      ).then(res => {
        let woeid = res.data[0].woeid;
        fetch(proxyUrl + `https://www.metaweather.com/api/location/${woeid}`).then(response => {
          response.json().then(data => ({
            data: data,
            status: response.status
          })).then(res => {
            that.setState({
              forecast: res.data.consolidated_weather,
              city: res.data.title,
              isLoading: false
            })

          })
        })
      })).catch(function (error) {
        console.log(error)
        alert('city is not found, please reload the page and try another city');
      });
  }

  render() {
    const {
      forecast,
      cityToBeSearched,
      city,
      isLoading
    } = this.state;

    if (isLoading) {
      return (
        <div className={cx("spinner-border", style.loader)} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      )
    }
    return (
      <div className={cx("container")}>
        <h2 className={style.header}>Weather forecast</h2>
        <form onSubmit={this.fetchData}>
          <input className={style.input} type="text" placeholder="type city name" onChange={this.handleChange} onFocus={this.handleFocus} value={cityToBeSearched}></input>
          <button className={style.button} type="submit">Get Forecast</button><br />
        </form>
        <Forecast forecast={forecast} city={city} />
      </div>
    )
  }
};


