module.exports = function () {

    return {
        files: ['*.js', '!__tests__/*.js'],

        tests: ['__tests__/*-test.js'],

        env: {
            type: 'node',
            runner: 'node'
        },

        testFramework: 'jest'
    };
};