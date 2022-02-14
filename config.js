// require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    counterHost: process.env.COUNTER_HOST || 'localhost',
    counterPort: process.env.COUNTER_PORT || 80
}
