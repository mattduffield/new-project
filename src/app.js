import {AppService} from 'services/app-service';

// changes here...
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
    