import {AppService} from 'services/app-service';

export class App {
  static inject = [AppService];

  constructor(appSvc) {
    this.appSvc = appSvc;
  }

  attached() {
    this.appSvc.setupConsole();
    this.appSvc.displayInit();
  }
  
}
    