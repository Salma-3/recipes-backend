const Sentry = require('@sentry/node')

module.exports = () => Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0
})



