const axios = require('axios')
const config = require(`${process.cwd()}/config`)

const { baseURL } = config

const request = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

module.exports = request
