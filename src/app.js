import {AppService} from 'services/app-service';
import {Koa as Application} from '../lib/koa-web/application';

// changes here...
export class App {
  static inject = [AppService, Koa];

  constructor(appSvc, Koa) {
    this.appSvc = appSvc;
    this.Koa = Koa;
  }

  attached() {
    this.appSvc.setupConsole();
    this.appSvc.displayInit();

    console.log('starting Koa server...');
    this.Koa.use(async function(ctx) {
      ctx.body = 'hello world';
      console.log('started Koa server...');
    });
    this.Koa.listen(8080);
    console.log('Koa server listening on port 8080...');
  }
  
}
    