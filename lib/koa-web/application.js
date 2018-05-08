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

    // return (req) => {
    //   return new Promise((resolve, reject) => {
    //     let ctx = new this.contextClass(this, req);
    //     fn(ctx).then(() => {
    //       return ctx.response.finalize();        
    //     });
    //   });
    // };

    return async (req) => {
      var ctx = new this.contextClass(this, req);
      await fn(ctx);
      return ctx.response.finalize();
    }
  }
}
