import { ReactExtension } from '../react';
import { Environments } from '../environments';
import { NodeEnv } from './node.env';

export class NodeExtension {
  static id = '@teambit/node';

  static dependencies = [ReactExtension, Environments];

  static async provider([react, envs]: [ReactExtension, Environments]) {
    const env = envs.compose(new NodeEnv(react.reactEnv), react.reactEnv);
    envs.registerEnv(env);
    return new NodeExtension();
  }

  // please replace to the nodeJS icon.
  // icon() {
  //  return 'https://static.bit.dev/extensions-icons/node.svg';
  // }
}
