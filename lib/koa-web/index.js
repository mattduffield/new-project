'use strict'
const compose = require('koa-compose');
const delegate = require('delegates');
const contentType = require('content-type');
const statuses = require('statuses');

class Application {
  constructor() {
    this.middleware = [];
    this.contextClass = class extends Context { };
    this.ctx = this.contextClass.prototype;
  }

  use(fn) {
    this.middleware.push(fn);
  }

  handler() {
    var fn = compose(this.middleware);

    return async (req) => {
      var ctx = new this.contextClass(this, req);
      await fn(ctx);
      return ctx.response.finalize();
    }
  }
}
class Context {
  constructor(app, req) {
    this.app = app;
    this.request = new KoaRequest(this, req);
    this.response = new KoaResponse(this);
  }
}

/**
 * Response delegation.
 */

delegate(Context.prototype, 'response')
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');

/**
 * Request delegation.
 */

delegate(Context.prototype, 'request')
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')
  .method('get')
  .method('is')
  .access('querystring')
  .access('idempotent')
  .access('socket')
  .access('search')
  .access('method')
  .access('query')
  .access('path')
  .access('url')
  .getter('origin')
  .getter('href')
  .getter('subdomains')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('URL')
  .getter('header')
  .getter('headers')
  .getter('secure')
  .getter('stale')
  .getter('fresh')
  .getter('ips')
  .getter('ip');


class KoaRequest {
  constructor(ctx, req) {
    this.ctx = ctx;
    this._url = new URL(req.url);
    this._method = req.method;
    this._headers = req.headers;
    this._querycache = {};
  }

  get URL() {
    return this._url;
  }

  get header() {
    return this.headers;
  }

  set header(val) {
    this.headers = val;
  }

  get headers() {
    return this._headers;
  }

  set headers(val) {
    this._headers = new Headers(val);
  }

  get url() {
    return this._url.pathname + this._url.search + this._url.hash;
  }

  set url(val) {
    const parts = val.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
    this._url.pathname = parts[1];
    this._url.search = parts[2] || "";
    this._url.hash = parts[3] || "";
  }

  get href() {
    return this._url.toString();
  }

  get method() {
    return this._method;
  }

  set method(val) {
    this._method = val;
  }

  get query() {
    const qs = this.querystring;
    var obj = this._querycache[qs];
    if (obj) return obj;

    obj = this._querycache[qs] = {};

    for (const pair of this._url.searchParams) {
      obj[pair[0]] = pair[1];
    }
    return Object.freeze(obj);
  }

  set query(obj) {
    const parts = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const escKey = window.encodeURIComponent(key);
        const escValue = window.encodeURIComponent(obj[key]);
        parts.push(`${escKey}=${escValue}`);
      }
    }
    this.querystring = parts.join('&');
  }

  get querystring() {
    return this.search.slice(1);
  }

  set querystring(str) {
    this.search = str;
  }

  get fresh() {
    const method = this.method;
    const s = this.ctx.status;

    // GET or HEAD for weak freshness validation only
    if ('GET' != method && 'HEAD' != method) return false;

    // 2xx or 304 as per rfc2616 14.26
    if ((s >= 200 && s < 300) || 304 == s) {
      return fresh(this.header, this.ctx.response.header);
    }

    return false;
  }

  get stale() {
    return !this.fresh;
  }

  get idempotent() {
    const methods = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'TRACE'];
    return !!~methods.indexOf(this.method);
  }

  get charset() {
    let type = this.get('Content-Type');
    if (!type) return '';

    try {
      type = contentType.parse(type);
    } catch (e) {
      return '';
    }

    return type.parameters.charset || '';
  }

  get length() {
    const len = this.get('Content-Length');
    if (len == '') return;
    return ~~len;
  }

  get protocol() {
    return this.protocolWithColon.slice(0, -1);
  }

  get secure() {
    return 'https' == this.protocol;
  }

  get ips() {
    return [];
  }

  get subdomains() {
    return [];
  }

  get type() {
    const type = this.get('Content-Type');
    if (!type) return '';
    return type.split(';')[0];
  }

  get(field) {
    const headers = this._headers;
    switch (field = field.toLowerCase()) {
      case 'referrer':
        return headers.get('referer');
      default:
        return headers.get(field);
    }
  }
}

function delegateToUrl(name, target) {
  if (!target) target = name;

  Object.defineProperty(KoaRequest.prototype, name, {
    get: function() {
      return this._url[target];
    },
    set: function(val) {
      this._url[target] = val;
    }
  })
}

delegateToUrl("origin")
delegateToUrl("path", "pathname")
delegateToUrl("search")
delegateToUrl("host")
delegateToUrl("hostname")
delegateToUrl("protocolWithColon", "protocol")

class KoaResponse {
  constructor() {
    this._headers = new Headers;
    this._status = 404;
    this._body = null;
  }

  finalize() {
    return new window.Response(this._body, {
      status: this._status,
      headers: this._headers
    })
  }

  get header() {
    return this._headers;
  }

  get headers() {
    return this.header;
  }

  get status() {
    return this._status;
  }

  set status(code) {
    this._status = code;
  }

  get message() {
    return this._statusMessage || statuses[this.status];
  }

  set message(msg) {
    this._statusMessage = msg;
  }

  get body() {
    return this._body;
  }

  set body(val) {
    this._body = val;
  }

  set length(n) {
    // do nothing
  }

  get length() {
    return 0;
  }

  get headerSent() {
    return false;
  }

  redirect(url, alt) {
    // location
    if ('back' == url) url = this.ctx.get('Referrer') || alt || '/';
    this.set('Location', url);

    // status
    if (!statuses.redirect[this.status]) this.status = 302;

    // html
    if (this.ctx.accepts('html')) {
      url = escape(url);
      this.type = 'text/html; charset=utf-8';
      this.body = `Redirecting to <a href="${url}">${url}</a>.`;
      return;
    }

    // text
    this.type = 'text/plain; charset=utf-8';
    this.body = `Redirecting to ${url}.`;
  }

  attachment(filename) {
    if (filename) this.type = extname(filename);
    this.set('Content-Disposition', contentDisposition(filename));
  }

  set type(type) {
    if (type) {
      this.set('Content-Type', type);
    } else {
      this.remove('Content-Type');
    }
  }

  set lastModified(val) {
    if ('string' == typeof val) val = new Date(val);
    this.set('Last-Modified', val.toUTCString());
  }

  get lastModified() {
    const date = this.get('last-modified');
    if (date) return new Date(date);
  }

  set etag(val) {
    if (!/^(W\/)?"/.test(val)) val = `"${val}"`;
    this.set('ETag', val);
  }

  get etag() {
    return this.get('ETag');
  }

  get type() {
    const type = this.get('Content-Type');
    if (!type) return '';
    return type.split(';')[0];
  }

  get(field) {
    return this.header.get(field);
  }

  set(field, val) {
    if (2 == arguments.length) {
      if (Array.isArray(val)) {
        this._headers.set(field, val[0]);
        for (var i = 1; i < val.length; i++) {
          this._headers.append(field, val[i]);
        }
      } else {
        this._headers.set(field, val);
      }
    } else {
      for (const key in field) {
        this.set(key, field[key]);
      }
    }
  }

  append(field, val) {
    if (Array.isArray(val)) {
      for (var i = 0; i < val.length; i++) {
        this._headers.append(field, val[i]);
      }
    } else {
      this._headers.append(field, val);
    }
  }

  remove(field) {
    this._headers.delete(field);
  }

  get writable() {
    return true;
  }

  flushHeaders() {
    // do nothing
  }
};




module.exports = Context;
module.exports = Application;
module.exports = KoaRequest;
module.exports = KoaResponse;