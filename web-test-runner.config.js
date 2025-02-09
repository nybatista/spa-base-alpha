import { defaultReporter } from '@web/test-runner';
import { junitReporter } from '@web/test-runner-junit-reporter';

export default {
  files: ['src/tests/unit-tests/**/*.test.js'],

  testFramework: {
    config: {
      ui: 'bdd',
      timeout: 2000,
    },
  },

  nodeResolve: true,

  reporters: [
    defaultReporter({
      // Turn on test result reporting in the console
      reportTestResults: true,
      reportTestProgress: true,
    }),
    junitReporter({
      outputPath: './src/tests/results/unit-test-results.xml',
      reportLogs: true,
    }),
  ],

  // Any other options...
};
