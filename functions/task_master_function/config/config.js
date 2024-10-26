const config = {
    development: {
        secret: process.env.CATALYST_SECRET || 'dev_secret',
    },
    production: {
        secret: process.env.CATALYST_SECRET,
    },
    test: {
        secret: 'test_secret',
    }
};

const environment = process.env.CATALYST_ENVIRONMENT || 'development';

module.exports = config[environment];