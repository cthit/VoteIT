module.exports = function () {

    return {
        files: ['src/**/*.js'],

        tests: ['__tests__/*-test.js'],

        env: {
            type: 'node',
            runner: 'node'
        },

        testFramework: 'jest'
    };
};