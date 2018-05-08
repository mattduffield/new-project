
export class App {

  message = "This is exciting!";

  constructor() {

  }

  attached() {
    this.compute();
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
    