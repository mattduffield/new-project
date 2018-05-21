import {AppService} from 'services/app-service';
import {Application} from '../lib/koa-web/application';
import homePage from '../index.dev.html!text';


export class App {
  static inject = [AppService, Application];

  constructor(appSvc, koa) {
    this.appSvc = appSvc;
    this.koa = koa;
    // console.log('homePage', homePage);
  }

  async attached() {
    this.appSvc.setupConsole();
    this.appSvc.displayInit();

    console.log('starting Koa server...');

    this.koa.use((ctx, next) => {
      ctx.status = 200;
      // ctx.body = `<h4>Hello ${ctx.path}</h4>`;
      ctx.body = homePage;
      ctx.type = "text/html";
      console.log('started Koa server...');
    });    
    // this.koa.use(async function(ctx) {
    //   ctx.body = 'hello world';
    //   console.log('started Koa server...');
    // });
    const res = await this.call("http://mattduffield.github.io/new-project/world");
    const body = await res.text();
    console.log('res.status: ', res.status);
    // console.log('res.type: ', res.type);
    // console.log('res.body: ', body);
    this.html = body;
  }
  async call(url) {
    const handler = this.koa.handler();
    const reqUrl = new URL(url);
    console.log('reqUrl', reqUrl, reqUrl.url);
    const req = new Request(reqUrl);
    // console.log(`
    //   Url: ${req.url}
    //   Method: ${req.method}
    //   Protocol: ${req.protocol}
    //   Origin: ${req.origin}
    //   Host: ${req.host}
    //   Hostname: ${req.hostname}
    //   Path: ${req.path}
    //   Href: ${req.href}
    //   QueryString: ${req.querystring}
    //   Search: ${req.search}
    // `);
    const res = await handler(req);
    return res;
  }
  
}
    