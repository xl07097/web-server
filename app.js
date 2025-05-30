const Koa = require('koa')
const { onerror } = require('koa-onerror')
const url = require('url')

const app = new Koa()

// error handler
onerror(app)

app.use(historyApiFallback())

app.use(require('koa-static')(__dirname + '/dist'))

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx)
})

module.exports = app

// 参考 connect-history-api-fallback
// https://github.com/bripkens/connect-history-api-fallback

function historyApiFallback(options) {
	options = options || {}
	const logger = getLogger(options)

	return async (ctx, next) => {
		if (ctx.method !== 'GET') {
			logger('Not rewriting', ctx.method, ctx.url, 'because the method is not GET.')
			return next()
		} else if (!ctx.header || typeof ctx.header.accept !== 'string') {
			logger('Not rewriting', ctx.method, ctx.url, 'because the client did not send an HTTP accept header.')
			return next()
		} else if (ctx.header.accept.indexOf('application/json') === 0) {
			logger('Not rewriting', ctx.method, ctx.url, 'because the client prefers JSON.')
			return next()
		} else if (!acceptsHtml(ctx.header.accept, options)) {
			logger('Not rewriting', ctx.method, ctx.url, 'because the client does not accept HTML.')
			return next()
		}

		const parsedUrl = url.parse(ctx.url)
		let rewriteTarget
		options.rewrites = options.rewrites || []

		for (let i = 0; i < options.rewrites.length; i++) {
			const rewrite = options.rewrites[i]
			const match = parsedUrl.pathname.match(rewrite.from)

			if (match !== null) {
				rewriteTarget = evaluateRewriteRule(parsedUrl, match, rewrite.to)
				logger('Rewriting', ctx.method, ctx.url, 'to', rewriteTarget)
				ctx.url = rewriteTarget
				return next()
			}
		}

		if (parsedUrl.pathname.indexOf('.') !== -1 && options.disableDotRule !== true) {
			logger('Not rewriting', ctx.method, ctx.url, 'because the path includes a dot (.) character.')
			return next()
		}
		rewriteTarget = options.index || '/index.html'
		logger('Rewriting', ctx.method, ctx.url, 'to', rewriteTarget)
		ctx.url = rewriteTarget
		await next()
	}
}

function evaluateRewriteRule(parsedUrl, match, rule) {
	if (typeof rule === 'string') {
		return rule
	} else if (typeof rule !== 'function') {
		throw new Error('Rewrite rule can only be of type string of function.')
	}
	return rule({
		parsedUrl: parsedUrl,
		match: match,
	})
}

function acceptsHtml(header, options) {
	options.htmlAcceptHeaders = options.htmlAcceptHeaders || ['text/html', '*/*']
	for (let i = 0; i < options.htmlAcceptHeaders.length; i++) {
		if (header.indexOf(options.htmlAcceptHeaders[i]) !== -1) {
			return true
		}
	}
	return false
}

function getLogger(options) {
	if (options && options.logger) {
		return options.logger
	} else if (options && options.verbose) {
		return console.log.bind(console)
	}
	return Function()
}
