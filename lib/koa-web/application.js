import compose from 'koa-compose';
import {Context} from './context';

export class Application {
  constructor() {
    this.middleware = [];
    this.contextClass = class extends Context { };
    this.ctx = this.contextClass.prototype;
  }

  use(fn) {
    this.middleware.push(fn);
  }

  handler() {
    var fn = compose(this.middleware);

    return async (req) => {
      var ctx = new this.contextClass(this, req);
      await fn(ctx);
      return ctx.response.finalize();
    }
  }
}
