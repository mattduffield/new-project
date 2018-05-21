import {AppService} from 'services/app-service';
import {Application} from '../lib/koa-web/application';

export class App {
  // static inject = [AppService];
  static inject = [AppService, Application];

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
    // t.equal(res.status, 200);    
    // const res = await this.call('/');
    console.log('res', res);
    // // this.koa.handler()(new Request('/'));
    // // const response = this.koa.handler()(new Request('/'));
    // this.koa.handler()(new Request('/')).then(response => {
    //   console.log('reponse', response);
    // });
    // response.on('finish', (response) => {
    //   console.log(response.body);
    // });    
    // this.koa.listen(8080);
    // console.log('Koa server listening on port 8080...');
  }
  async call(url) {
    const handler = this.koa.handler();
    const req = new Request(url);
    const res = await handler(req);
    return res;
  }
  
}
    