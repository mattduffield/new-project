export class AppService {

  constructor() {
  
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
        hljs.highlightBlock(logger);
      }
    } (console.log.bind(console), document.getElementById("logger")));
  }
  highlightBlock() {
    const logger = document.getElementById("logger");
    hljs.highlightBlock(logger);
  }
  displayInitial() {
    
  }
}