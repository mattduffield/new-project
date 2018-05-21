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


    const index = `<!doctype html>
<html>
  <head>
    <title>Koa Web</title>
    <meta charset="utf-8">
    <link href="styles/styles.css" rel="stylesheet" type="text/css">    
    <style>
      html, body {
        height: 100%;
      }
      .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -100px;
      }    
    </style>
  </head>
  <body>
    <h1 class="loading">Welcome!!!</h1>
  </body>
</html>`;


    // var app = new Koa;
    this.koa.use((ctx, next) => {
      ctx.status = 200;
      // ctx.body = `<h4>Hello ${ctx.path}</h4>`;
      ctx.body = index;
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
    