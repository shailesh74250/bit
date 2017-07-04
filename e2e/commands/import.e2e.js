// covers also init, create, commit, modify commands

import { expect } from 'chai';
import path from 'path';
import fs from 'fs-extra';
import Helper from '../e2e-helper';

const helper = new Helper();

describe('bit import', function () {
  this.timeout(0);

  before(() => {
    helper.reInitLocalScope();
    helper.reInitRemoteScope();
    helper.addRemoteScope();

    // Create remote scope with all needed components
    // export a new simple component
    helper.runCmd('bit create simple');
    helper.commitComponent('simple');
    helper.exportComponent('simple');

    // export a new component with dependencies
    helper.runCmd('bit create with-deps -j');
    const bitJsonPath = path.join(helper.localScopePath, '/components/global/with-deps/bit.json'); // TODO: Change to use the automatic deps resolver
    // add "foo" as a bit.json dependency and lodash.get as a package dependency
    helper.addBitJsonDependencies(bitJsonPath, { [`@${helper.remoteScope}/global/simple`]: '1' }, {'lodash.get': "4.4.2"});
    helper.commitComponent('with-deps');
    helper.exportComponent('with-deps');
  });

  after(() => {
    helper.destroyEnv();
  });

  beforeEach(() => {
    helper.reInitLocalScope();
    helper.addRemoteScope();
  });

  describe('Import stand alone component (without dependencies)', () => {
    it.skip('Should throw error if there is already component with the same name and namespace and different scope', () => {
    });

    it('Should write the component in bit.json file', () => {
      const output = helper.runCmd(`bit import @${helper.remoteScope}/global/simple`);
      const bitJson = helper.readBitJson();
      expect(output.includes('successfully imported the following Bit components')).to.be.true;
      expect(output.includes('global/simple')).to.be.true;
      console.log(bitJson);
      const depName = path.join(helper.remoteScope, 'global', 'simple');
      expect(bitJson.dependencies).to.include({[depName] : "1"});
    });

    describe.skip('Component without envs', () => {
      it('Should write the component in bit.map file', () => {
      });
      describe('Write the component to file system correctly', () => {
        // TODO: Validate all files exists in a folder with the component name
        it('Should write the component to asked path (-p)', () => {
        });
        it('Should write the component to default path from bit.json', () => {
          //TODO: check few cases with different structure props - namespace, name, version, scope
        });
        // Prevent cases when I export a component with few files from different directories
        // and get it in another structure during imports
        it('Should write the component to the paths specified in bit.map', () => {
        });
      });
    });

    describe.skip('Component with compiler and tester', () => {
      it('Should not install envs when not requested', () => {
      });
      it('Should install envs when requested (-e)', () => {
      });
      it('Should create bit.json file with envs in the folder', () => {
      });
    });
  });

  describe('Import component with dependencies', () => {
    it('Should add all missing components to bit.map file', () => {
    });
    it('Should mark dependencies source in bit.map file', () => {
      // Make sure direct imports are marked as such
      // Make sure nested dependencies are marked as such
    });
    it('Should not add existing components to bit.map file', () => {
    });
    it('Should create bit.json file with all the dependencies in the folder', () => {
    });
    it('Should print warning for missing package dependencies', () => {
      const output = helper.runCmd(`bit import @${helper.remoteScope}/global/with-deps`);
      expect(output.includes('Missing the following package dependencies. Please install and add to package.json')).to.be.true;
      expect(output.includes('lodash.get: 4.4.2')).to.be.true;
    });
    describe.skip('Write the component to file system correctly', () => {
      it('Should create a recursive nested dependency tree', () => {
      });
      it('Should not write again to file system same dependencies which imported by another component', () => {
      });
    });
  });

  describe.skip('Import compiler', () => {
    it('Should install package dependencies', () => {
    });
  });

  describe.skip('Import tester', () => {
    it('Should install package dependencies', () => {
    });
  });
});
