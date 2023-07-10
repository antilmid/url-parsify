
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('core-js/modules/es.array.reduce.js'), require('core-js/modules/es.regexp.exec.js'), require('core-js/modules/es.string.match.js'), require('core-js/modules/es.regexp.constructor.js'), require('core-js/modules/es.regexp.to-string.js'), require('core-js/modules/es.string.replace.js'), require('core-js/modules/web.dom-collections.iterator.js')) :
  typeof define === 'function' && define.amd ? define(['core-js/modules/es.array.reduce.js', 'core-js/modules/es.regexp.exec.js', 'core-js/modules/es.string.match.js', 'core-js/modules/es.regexp.constructor.js', 'core-js/modules/es.regexp.to-string.js', 'core-js/modules/es.string.replace.js', 'core-js/modules/web.dom-collections.iterator.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.urlParsify = factory());
})(this, (function () { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }
    return keys;
  }
  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  class UParser {
    constructor() {
      _defineProperty(this, "tokenSign", void 0);
      this.tokenSign = UParser.defalutTokenSign;
    }
    tokenize(url) {
      const tokens = [];
      const usingTree = {};
      let noMatch = false;
      let source = url;
      let statusTree = {};
      wrapper: while (source.length && !noMatch) {
        noMatch = false;
        for (let i = 0; i < this.tokenSign.length; i++) {
          const sign = this.tokenSign[i];
          const closestToken = this.tokenSign[i - 1];
          if (sign.debugconsole) console.log("=====".concat(sign.name, "====="));
          if (sign.debugconsole) console.log('当前statusTree：', statusTree);
          // 判断using
          if (sign.using === usingTree[sign.name]) continue;
          if (!usingTree[sign.name]) usingTree[sign.name] = 0;
          // 判断条件表达式、依赖、邻近关系是否符合
          if (sign.customConditionCallback && !sign.customConditionCallback({
            sign,
            currentTokens: tokens,
            usingTree: _objectSpread2({}, usingTree),
            statusTree: _objectSpread2({}, statusTree)
          })) continue;
          if (sign !== null && sign !== void 0 && sign.dependStatus && !sign.dependStatus.map(key => !!statusTree[key]).reduce((cur, nxt) => cur && nxt)) {
            continue;
          }
          if (sign !== null && sign !== void 0 && sign.excludeStatus && sign.excludeStatus.map(key => !!statusTree[key]).reduce((cur, nxt) => cur || nxt)) {
            continue;
          }
          if (sign.closestToken && !closestToken) continue;
          if (sign.closestToken && closestToken && sign.closestToken !== closestToken.name) continue;
          // 匹配
          if (sign.debugconsole) console.log("\u51C6\u5907\u5339\u914D\uFF1A".concat(source));
          const matchRes = source.match(sign.reg);
          if (sign.debugconsole) console.log('匹配结果：', matchRes);
          if (!matchRes) continue;
          const matchToken = matchRes[0];
          // 是否消耗
          if (sign.consuming) source = source.slice(matchToken.length);
          // 存放token
          if (!sign.isNotToken) {
            tokens.push({
              name: sign.name,
              sign: _objectSpread2({}, sign),
              tokenContent: matchToken
            });
          }
          // 设置状态
          if (sign.setStatus) statusTree[sign.setStatus] = true;
          // 清除状态
          if (sign.clearStatus === '*') {
            statusTree = {};
          } else if (sign.clearStatus instanceof Array) {
            sign.clearStatus.forEach(key => {
              delete statusTree[key];
            });
          } else if (sign.clearStatus instanceof RegExp) {
            Object.keys(statusTree).forEach(key => {
              if (key.match(sign.clearStatus)) delete statusTree[key];
            });
          }
          if (sign.debugconsole) console.log('事后statusTree：', statusTree);
          usingTree[sign.name] += 1;
          continue wrapper;
        }
        noMatch = true;
      }
      return tokens;
    }
    parser(url) {
      const tokens = this.tokenize(url);
      const urlDataTree = {
        __sourceTokens__: tokens
      };
      const dataCacheTree = {};
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const handleParse = token.sign.handleParse;
        if (!handleParse) continue;
        handleParse({
          token,
          content: token.tokenContent,
          tokens,
          index: i,
          urlDataTree,
          dataCacheTree
        });
      }
      return urlDataTree;
    }
  }
  // const u = new UParser()
  _defineProperty(UParser, "defalutTokenSign", [{
    name: 'protocol',
    using: 1,
    consuming: true,
    reg: /^[a-zA-Z0-9]*:\/\//,
    setStatus: 'protocol',
    handleParse: _ref => {
      let {
        content,
        urlDataTree
      } = _ref;
      urlDataTree.protocol = (content || '').replace('://', '');
    }
  }, {
    name: 'host',
    using: 1,
    consuming: true,
    reg: /^[a-zA-Z0-9\-_.~%]+/,
    dependStatus: ['protocol'],
    setStatus: 'host',
    handleParse: _ref2 => {
      let {
        content,
        urlDataTree
      } = _ref2;
      urlDataTree.host = content || '';
    }
  }, {
    name: 'port',
    using: 1,
    consuming: true,
    reg: /^:[0-9]+/,
    dependStatus: ['host'],
    closestToken: 'host',
    handleParse: _ref3 => {
      let {
        content,
        urlDataTree,
        tokens
      } = _ref3;
      urlDataTree.port = (content || '').replace(':', '');
    }
  }, {
    name: 'path',
    using: 1,
    consuming: true,
    reg: /^\/[a-zA-Z0-9\-_.~%/]*/,
    handleParse: _ref4 => {
      let {
        content,
        urlDataTree
      } = _ref4;
      urlDataTree.path = content || '';
    }
  },
  // query相关类
  ...[{
    name: 'queryStartSign',
    using: -1,
    consuming: true,
    reg: /^[?]/,
    setStatus: 'queryStart'
  }, {
    name: 'queryKey',
    using: -1,
    consuming: true,
    reg: /^[a-zA-Z0-9\-_.~%]+/,
    setStatus: 'queryKey',
    dependStatus: ['queryStart'],
    excludeStatus: ['queryKey'],
    handleParse: _ref5 => {
      let {
        content,
        urlDataTree,
        dataCacheTree
      } = _ref5;
      if (!urlDataTree.query) urlDataTree.query = {};
      dataCacheTree.currentQueryKey = content;
      urlDataTree.query[content] = true;
    }
  }, {
    name: 'queryEqualOperation',
    using: -1,
    consuming: true,
    reg: /^[=]/,
    setStatus: 'operation',
    dependStatus: ['queryStart', 'queryKey']
  }, {
    name: 'queryValue',
    using: -1,
    consuming: true,
    reg: /^[a-zA-Z0-9\-_.~%]+/,
    setStatus: 'queryValue',
    dependStatus: ['queryStart', 'queryKey', 'operation'],
    handleParse: _ref6 => {
      let {
        content,
        urlDataTree,
        dataCacheTree
      } = _ref6;
      if (!urlDataTree.query) urlDataTree.query = {};
      if (!dataCacheTree.currentQueryKey) return;
      urlDataTree.query[dataCacheTree.currentQueryKey] = content;
      delete dataCacheTree.currentQueryKey;
    }
  }, {
    name: 'queryNextSign',
    using: -1,
    consuming: true,
    reg: /^[&]/,
    setStatus: 'queryStart',
    dependStatus: ['queryStart'],
    clearStatus: ['queryKey', 'operation']
  }, {
    name: 'queryEnd',
    using: -1,
    consuming: false,
    isNotToken: true,
    reg: /./,
    dependStatus: ['queryStart'],
    clearStatus: /^(query|operation)/
  }],
  // hash相关
  ...[{
    name: 'hashStartSign',
    using: -1,
    consuming: true,
    reg: /^[#]/,
    setStatus: 'hashStart'
  }, {
    name: 'hashPath',
    using: -1,
    consuming: true,
    reg: /^[a-zA-Z0-9\-_.~%/]+/,
    dependStatus: ['hashStart'],
    handleParse: _ref7 => {
      let {
        content,
        urlDataTree,
        dataCacheTree
      } = _ref7;
      const unifyPath = path => {
        if (path.match(/^\//)) return path.replace(/\/$/, '');else return "/".concat(path).replace(/\/$/, '');
      };
      if (!urlDataTree.hashPath) {
        urlDataTree.hashPath = unifyPath(content);
        urlDataTree.multiHashPath = urlDataTree.hashPath;
      } else {
        urlDataTree.multiHashPath = "".concat(urlDataTree.multiHashPath).concat(unifyPath(content));
      }
    }
  }, {
    name: 'hashEnd',
    consuming: false,
    using: -1,
    isNotToken: true,
    reg: /./,
    dependStatus: ['hashStart'],
    clearStatus: /^hash/
  }], {
    name: 'unkwon',
    using: -1,
    consuming: true,
    reg: /^./
  }]);

  return UParser;

}));
