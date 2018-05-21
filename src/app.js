import {AppService} from 'services/app-service';
import {Koa as Application} from '../../lib/koa-web/application';

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
  }
  
}
    