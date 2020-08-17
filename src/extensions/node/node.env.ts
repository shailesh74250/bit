import { Environment } from '../environments';
import { ReactEnv } from '../react/react.env';

/**
 * a component environment built for node .
 */
export class NodeEnv implements Environment {
  constructor(private reactEnv: ReactEnv) {}

  getCompiler() {
    return this.reactEnv.getCompiler();
  }

  getDependencies() {
    return {};
  }
}
