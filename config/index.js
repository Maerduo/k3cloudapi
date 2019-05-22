const ENV = process.env.NODE_ENV || 'dev'

const config = require(`./${ENV}`)

module.exports = config
