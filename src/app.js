
export class App {

  message = "This is exciting!";

  constructor() {

  }

  attached() {
    compute();
  }
  async compute() {
    const message2 = await computeMessage();
  }
  async computeMessage() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve('How do you like me now?');
      },3000);
    });
  }
}
    