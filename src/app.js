import {AppService} from 'services/app-service';
import {Application} from '../lib/koa-web/application';

export class App {
  // static inject = [AppService];
  static inject = [AppService, Application];

  html = '';

  // constructor(appSvc) {
  constructor(appSvc, koa) {
    this.appSvc = appSvc;
    this.koa = koa;
  }

  async attached() {
    this.appSvc.setupConsole();
    this.appSvc.displayInit();

    console.log('starting Koa server...');

    // var app = new Koa;
    this.koa.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = "Hello " + ctx.path;
      ctx.type = "text/html";
    });    
    // this.koa.use(async function(ctx) {
    //   ctx.body = 'hello world';
    //   console.log('started Koa server...');
    // });
    const res = await this.call("http://127.0.0.1/world");
    const body = await res.text();
    console.log('res.status: ', res.status);
    console.log('res.type: ', res.type);
    console.log('res.body: ', body);
    this.html = body;
  }
  async call(url) {
    const handler = this.koa.handler();
    const req = new Request(url);
    const res = await handler(req);
    return res;
  }
  
}
    