export class AppService {

  constructor() {
    this.postMessageSetup();
  }
  postMessageSetup() {
    window.addEventListener("message", this.receiveMessage.bind(this), false);    
  }
  receiveMessage(event) {
    console.log('messaged received: ', event);
    // Do we trust the sender of this message?
    if (event.origin !== "http://localhost:9000") return;

    const messages = JSON.parse(event.data);
    messages.forEach(msg => {
      const {operation, repo, key, value} = msg;
      console.log('repo', repo, 'location.href', location.href);
      switch(operation) {
        case 'set': 
          this.putCache(key, value);
          break;
      }
    });
  }
  deleteCache(key) {
    const RUNTIME = 'runtime';
    caches.open(RUNTIME).then(cache => {
      const req = new Request(`https://mattduffield.github.io/${key}`);
      console.log('removing old cache for ', req);
      cache.delete(req).then((response) => {
        console.log('deleteCache - completed!', response);
      });      
    });    
  }
  putCache(key, value) {
    // Save to the CACHE API
    const RUNTIME = 'runtime';
    caches.open(RUNTIME).then(cache => {
      const req = new Request(`https://mattduffield.github.io/${key}`);
      const res = new Response(value);
      console.log(`caching (${key}): ${value}`);
      // Put a copy of the response in the runtime cache.
      cache.put(req, res).then(() => {
        // Completed caching.
        console.log('putCache - completed!');
        location.reload();
      });
    });
    
  }

  setupConsole() {
    console.log = (function (old_function, logger) { 
      return function (...text) {
        old_function(...text);
        const pre = document.createElement("pre");
        const code = document.createElement("code");
        text.forEach(t => {
          let msg = '';
          if (Array.isArray(t)) {
            const arr = t.join(', ');
            msg = `[${arr}]`;
          } else if (typeof(t) === 'object') {
            msg = `${JSON.stringify(t, null, 2)}`;
          } else {
            msg = `${t}  `;
          }
          const txt = document.createTextNode(msg.trim());
          code.appendChild(txt);
        });
        pre.appendChild(code);
        logger.appendChild(pre);
        hljs.highlightBlock(pre);
      }
    } (console.log.bind(console), document.getElementById("logger")));
  }
  highlightBlock() {
    const logger = document.getElementById("logger");
    hljs.highlightBlock(logger);
  }
  displayInit() {
    const map = JSON.parse(localStorage.getItem('packageMap'));
    const pkg = JSON.parse(localStorage.getItem('packagePackages'));
    const meta = JSON.parse(localStorage.getItem('packageMeta'));
    console.log('SystemJS Config - Map section');
    console.log(map);
    console.log('SystemJS Config - Packages section');
    console.log(pkg);
    console.log('SystemJS Config - Meta section');
    console.log(meta);
  }
}