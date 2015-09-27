module.exports = function (app) {
	app.use('/fb/authenticate', require('./fb-user'))

	// authenticator middleware

	app.all('/api/*', require('./authenticator'));

    app.use('/api/users', require('./users'));
};