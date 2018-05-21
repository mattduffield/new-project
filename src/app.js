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

  attached() {
    this.appSvc.setupConsole();
    this.appSvc.displayInit();

    console.log('starting Koa server...');
    this.koa.use(async function(ctx) {
      ctx.body = 'hello world';
      console.log('started Koa server...');
    });
    // this.koa.listen(8080);
    // console.log('Koa server listening on port 8080...');
  }
  
}
    