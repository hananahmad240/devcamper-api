const logger = ((req, res, next) => {
    // req.name = 'Hanan Ahmad';

    console.log(`
    ${req.method} ${req.protocol}  ${req.get('host')}${req.originalUrl}
    `);
    next();
});

module.exports = logger;