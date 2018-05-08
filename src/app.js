import {AppService} from = 'services/app-service';


export class App {
  static inject = [AppService];

  message = "This is exciting!";

  constructor(appSvc) {
    this.appSvc = appSvc;
  }

  attached() {
    this.compute();
    this.appSvc.setupConsole();
  }
  async compute() {
    const message2 = await this.computeMessage();
    this.message = message2;
  }
  async computeMessage() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve('How do you like me now?');
      },3000);
    });
  }

  
}
    