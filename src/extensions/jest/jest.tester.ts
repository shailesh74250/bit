import { runCLI } from 'jest';
import { Tester, TestResults, TesterContext } from '../tester';

export class JestTester implements Tester {
  constructor(readonly jestConfig: any) {}

  async test(context: TesterContext): Promise<TestResults> {
    const config: any = {
      rootDir: context.rootPath,
      watch: context.watch,
      runInBand: context.debug,

      /**
       * below config keeps the results of a test-run in a json file. we can use it to keep the results for jest.
       * then when the UI wants to view them, Bit can show results from the JSON output.
       * If no results available and tester is defined and component has tests - Bit can run tests.
       *
       * See implementation by Storybook https://github.com/storybookjs/storybook/tree/next/addons/jest
       *
       * 1. when "jest: true" it seems that we loose CLI-reporter (only get summary).
       * 2. we should probably handle this differently in the worksacpe (output to '.git/bit/tmp/' ?)
       * 3. Bit should provide an API for the UI to grab only the relevant test results and have the same API
       *    for both worksapce and scope.
       * 4. when running tests on a capsule and saving to models, we can cut the relevant part for each component
       *    from the json file.
       * 5. copy storybook's UI?
       * 6. add 'test watch' funcitonality to Bit's dev-server?
       */
      json: true,
      outputFile: '.bit-jest-results.json',
    };

    // eslint-disable-next-line
    const jestConfig = require(this.jestConfig);
    Object.assign(jestConfig, {
      testMatch: context.specFiles,
    });

    Object.assign(config, jestConfig);
    // :TODO he we should match results to components and format them accordingly. (e.g. const results = runCLI(...))
    await runCLI(config, [this.jestConfig]);
    return {
      total: 50,
    };
  }
}
