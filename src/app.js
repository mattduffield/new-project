import {AppService} from 'services/app-service';
import {Application} from '../lib/koa-web/application';
import homePage from '../index.html!text';


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
    <title>Empty Web</title>
    <meta charset="utf-8">
    <link href="lib/highlight/styles/monokai-sublime.css" rel="stylesheet" type="text/css">
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
  <body aurelia-app="main">
    <h1 class="loading">Loading...</h1>

    <script src="lib/highlight/highlight.pack.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
    <script src="https://unpkg.com/systemjs@0.19.41/dist/system.js"></script>
    <script src="systemjs.config.js"></script>
    <script src="index.dev.js"></script>
  </body>
</html>`;


    // var app = new Koa;
    this.koa.use((ctx, next) => {
      ctx.status = 200;
      ctx.body = `<h4>Hello ${ctx.path}</h4>`;
      // ctx.body = index;
      // ctx.body = homePage;
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
    