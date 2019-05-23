const Koa = require("koa");
const static = require('koa-static');
const onerror = require('koa-onerror');
const {historyApiFallback} = require("koa2-connect-history-api-fallback");

const app = new Koa();

// error handler
onerror(app)

app.use(historyApiFallback({}));

app.use(static(__dirname + '/dist'))

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app;
