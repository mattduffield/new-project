import compose from 'koa-compose';
import {Context} from './context.js';

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
    let fn = compose(this.middleware);

    return async (req) => {
      let ctx = new this.contextClass(this, req);
      await fn(ctx);
      return ctx.response.finalize();
    }
  }
}
