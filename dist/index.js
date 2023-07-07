(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('core-js/modules/es.promise.js'), require('core-js/modules/es.regexp.exec.js'), require('core-js/modules/es.regexp.test.js'), require('core-js/modules/es.string.replace.js'), require('core-js/modules/es.string.search.js'), require('core-js/modules/web.dom-collections.iterator.js'), require('core-js/modules/web.url-search-params.js'), require('core-js/modules/esnext.string.replace-all.js'), require('core-js/modules/es.regexp.to-string.js'), require('core-js/modules/es.symbol.description.js')) :
  typeof define === 'function' && define.amd ? define(['core-js/modules/es.promise.js', 'core-js/modules/es.regexp.exec.js', 'core-js/modules/es.regexp.test.js', 'core-js/modules/es.string.replace.js', 'core-js/modules/es.string.search.js', 'core-js/modules/web.dom-collections.iterator.js', 'core-js/modules/web.url-search-params.js', 'core-js/modules/esnext.string.replace-all.js', 'core-js/modules/es.regexp.to-string.js', 'core-js/modules/es.symbol.description.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.worklink = factory());
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
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
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

  const _excluded = ["_location"];
  const fullUrl = url => {
    return "".concat(/^.{0,8}\/\//.test(url) ? url : /^\//.test(url) ? "".concat(location.origin).concat(url) : "".concat(location.origin, "/").concat(url));
  };
  /**
   * @description: 解析url
   * @param {string} url
   * @return {UrlStruct}
   */
  const parseUrl = url => {
    const furl = fullUrl(url);
    const parser = document.createElement('a');
    const hashparser = document.createElement('a');
    parser.href = furl;
    hashparser.href = fullUrl(parser.hash.replace(/^#*/, ''));
    const pathSearch = parser.search.replace(/(^\?*)|(&*$)/g, '');
    const hashSearch = hashparser.search.replace(/(^\?*)|(&*$)/g, '');
    const fullSearch = "".concat(pathSearch).concat(pathSearch && hashSearch ? '&' : '').concat(hashSearch);
    const paramsMap = new URLSearchParams(fullSearch);
    const paramsKeys = paramsMap.keys();
    const params = {};
    for (const keyname of paramsKeys) {
      params[keyname] = paramsMap.get(keyname);
    }
    return {
      protocol: parser.protocol,
      host: parser.host,
      port: parser.port,
      path: parser.pathname,
      query: params,
      hash: "".concat(hashparser.pathname ? '#' : '').concat(hashparser.pathname),
      search: "".concat(fullSearch ? '?' : '').concat(fullSearch)
    };
  };
  var utils = {
    /**
     * @description: 对象转换成search，会自动帮你encodeURIComponent对象内容
     * @param {T} data
     * @return {*}
     */
    objectToSearch(data) {
      return Object.entries(data).map(_ref => {
        let [key, value] = _ref;
        return "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(value));
      }).join('&');
    },
    /**
     * @description: 解析url
     * @param {string} url
     * @return {UrlStruct}
     */
    parseUrl,
    /**
     * @description: 根据urlStruct获取工作台能够匹配的路径
     * @param {ReturnType} urlStruct
     * @return {*}
     */
    async getWorkMatchedUrl(urlStruct) {
      let matchedInput = '';
      let matchUrl = '';
      // TODO: 此处判断其实不准确
      // host+path+hash
      matchUrl = await message.getMenuUrl(matchedInput = "".concat(urlStruct.host).concat(urlStruct.path).concat(urlStruct.hash)).catch(() => '');
      return {
        matchUrl,
        matchedInput
      };
    },
    /**
     * @description: 获取工作台信息
     * @return {Promise<any>}
     */
    getWorkInfo: async () => {
      const _await$message$getWin = await message.getWindowAttributes(['_location']).catch(() => ({})),
        {
          _location
        } = _await$message$getWin,
        data = _objectWithoutProperties(_await$message$getWin, _excluded);
      if (_location) data.location = _location;
      return data;
    },
    /**
     * @description: 通过path设置对象
     * @param {any} obj 要设置的对象
     * @param {string} path 路径
     * @param {any} value 值
     */
    setProperty(obj, path, value) {
      const props = path.split('.');
      let currentObj = obj;
      for (let i = 0; i < props.length - 1; i++) {
        const prop = props[i];
        currentObj = currentObj[prop] || {};
      }
      currentObj[props[props.length - 1]] = value;
    },
    /**
     * @description: 通过urlStruct获取reHashPath内容
     * @param {ReturnType<typeof parseUrl>} urlStruct
     * @param {boolean} [isMixinLocationSearch] 是否混入自身的search，默认false
     * @return {*}
     */
    getReHashpathByUrlStruct: function getReHashpathByUrlStruct(urlStruct) {
      let isMixinLocationSearch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const slocation = parseUrl(location.href);
      return "?reHashPath=".concat(encodeURIComponent((urlStruct.hash || '/').replaceAll('#', ''))).concat(urlStruct.search ? "&".concat(urlStruct.search.replace(/^\?*/, '')) : '').concat(slocation.search && isMixinLocationSearch ? "&".concat(slocation.search.replace(/^\?*/, '')) : '');
    },
    /**
     * @description: 通过urlStruct获取reHashPath内容
     * @param {ReturnType<typeof parseUrl>} urlStruct
     * @param {boolean} [isMixinLocationSearch] 是否混入自身的search，默认false
     * @return {*}
     */
    getRepathByUrlStruct: function getRepathByUrlStruct(urlStruct) {
      let isMixinLocationSearch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const slocation = parseUrl(location.href);
      return "?redirectPath=".concat(encodeURIComponent((urlStruct.hash || '/').replaceAll('#', ''))).concat(urlStruct.search ? "&".concat(urlStruct.search.replace(/^\?*/, '')) : '').concat(slocation.search && isMixinLocationSearch ? "&".concat(slocation.search.replace(/^\?*/, '')) : '');
    },
    /**
     * @description: 批量给元素绑定事件
     * @param {any} elements 元素数组或类数组
     * @param {Parameters<typeof addEventListener>} args
     */
    batchAddEventListener(elements) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      for (let i = 0; i < elements.length; i++) {
        const ele = elements[i];
        ele.addEventListener(...args);
      }
    },
    /**
     * @description: 批量给元素移除事件
     * @param {any} elements 元素数组或类数组
     * @param {Parameters<typeof removeEventListener>} args
     */
    batchRemoveEventListener(elements) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }
      for (let i = 0; i < elements.length; i++) {
        const ele = elements[i];
        ele.removeEventListener(...args);
      }
    }
  };

  const validateEnvironment = () => {
    var _window;
    if (!((_window = window) !== null && _window !== void 0 && _window.postMessage)) {
      throw Error('不是浏览器环境');
    }
    if (!window.top) {
      throw Error('不是iframe子集');
    }
  };
  const getMesId = (() => {
    let mesId = 0;
    return () => {
      mesId++;
      return mesId;
    };
  })();
  var message = {
    /**
     * @description: 通信协议：search参数透传（https://base.xiaojukeji.com/docs/workspace/2681）
     * @param {Params} params
     * @param {boolean} [changeIframe] 是否强制刷新iframe，默认false
     * @return {*}
     */
    setMem(params) {
      let changeIframe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      validateEnvironment();
      window.top.postMessage({
        type: 'setMem',
        data: utils.objectToSearch(params),
        changeIframe
      }, '*');
    },
    /**
     * @description: 通信协议：通知父修改iframe相对路径
     * @param {string} relativePath 路径
     * @param {Record<string, string>|null} params 参数
     * @param {boolean} [changeIframe] 是否强制刷新iframe，默认false
     * @return {*}
     */
    setRedirectPath(relativePath) {
      let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let changeIframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      validateEnvironment();
      const paramsStr = utils.objectToSearch(params !== null && params !== void 0 ? params : {});
      window.top.postMessage({
        type: 'setRouter',
        source: 'redirectPath',
        data: params ? "".concat(relativePath).concat(paramsStr ? "&".concat(paramsStr) : '') : "".concat(relativePath),
        changeIframe
      }, '*');
    },
    /**
     * @description: 通信协议：通知父修改iframe hash路径
     * @param {string} hashPath hash路由
     * @param {Record<string, string>|null} params 参数
     * @param {boolean} [changeIframe] 是否强制刷新iframe，默认false
     * @return {*}
     */
    setRedirectHashPath(hashPath) {
      let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      let changeIframe = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      validateEnvironment();
      const paramsStr = utils.objectToSearch(params !== null && params !== void 0 ? params : {});
      window.top.postMessage({
        type: 'setRouter',
        source: 'reHashPath',
        data: params ? "".concat(hashPath).concat(paramsStr ? "&".concat(paramsStr) : '') : "".concat(hashPath),
        changeIframe
      }, '*');
    },
    /**
     * @description: 通信协议：通知父根据matchIframePath自动匹配菜单并选中
     * @param {string} matchIframePath 路径
     * @param {Record<string, string>|null} params 参数
     * @return {*}
     */
    selectMenu(matchIframePath) {
      let params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      validateEnvironment();
      window.top.postMessage({
        type: 'menuOp',
        source: 'selectMenu',
        data: params ? "".concat(matchIframePath, "?").concat(utils.objectToSearch(params)) : "".concat(matchIframePath)
      }, '*');
    },
    /**
     * @description: 通信协议：通知父根据matchIframPath返回对应的工作台路径
     * @param {string} matchIframePath
     * @return {Promise<string>}
     */
    async getMenuUrl(matchIframePath) {
      validateEnvironment();
      const mesId = getMesId();
      window.top.postMessage({
        type: 'menuOp',
        source: 'getMenuUrl',
        data: {
          matchPath: matchIframePath,
          mesId
        }
      }, '*');
      return await new Promise((resolve, reject) => {
        const linstenInfo = {
          listener(e) {
            var _e$data;
            if ((e === null || e === void 0 ? void 0 : (_e$data = e.data) === null || _e$data === void 0 ? void 0 : _e$data.mesId) === mesId) {
              var _e$data2;
              window.removeEventListener('message', linstenInfo.listener);
              clearTimeout(linstenInfo.timer);
              resolve(e === null || e === void 0 ? void 0 : (_e$data2 = e.data) === null || _e$data2 === void 0 ? void 0 : _e$data2.workUrl);
            }
          },
          timer: setTimeout(() => {
            window.removeEventListener('message', linstenInfo.listener);
            reject(Error('postMessage接收信息超时'));
          }, 1000)
        };
        window.addEventListener('message', linstenInfo.listener);
      });
    },
    /**
     * @description: 通信协议：获取父window对象属性
     * @param {string} attributes 要获取的属性数组
     * @return {Promise<Record<string, any>>}
     */
    async getWindowAttributes(attributes) {
      validateEnvironment();
      const mesId = getMesId();
      window.top.postMessage({
        type: 'windowOp',
        data: {
          matchParam: attributes,
          mesId
        }
      }, '*');
      return await new Promise((resolve, reject) => {
        const linstenInfo = {
          listener(e) {
            var _e$data3;
            if ((e === null || e === void 0 ? void 0 : (_e$data3 = e.data) === null || _e$data3 === void 0 ? void 0 : _e$data3.mesId) === mesId) {
              var _e$data4;
              window.removeEventListener('message', linstenInfo.listener);
              clearTimeout(linstenInfo.timer);
              resolve(_objectSpread2(_objectSpread2({}, (e === null || e === void 0 ? void 0 : (_e$data4 = e.data) === null || _e$data4 === void 0 ? void 0 : _e$data4.paramData) || {}), {}, {
                // 注入难获取的属性
                origin: e === null || e === void 0 ? void 0 : e.origin
              }));
            }
          },
          timer: setTimeout(() => {
            window.removeEventListener('message', linstenInfo.listener);
            reject(Error('postMessage接收信息超时'));
          }, 1000)
        };
        window.addEventListener('message', linstenInfo.listener);
      });
    }
  };

  var routeSwitch = {
    to: () => {}
  };

  const $symbol = {
    DEBOUNCE_CHECK: Symbol(0b00000001) // 防抖检查
  };

  const $constant = {
    atagAttr: ['download', 'href', 'hreflang', 'media', 'referrerpolicy', 'ping', 'rel', 'target', 'type'] // a标签自身所有属性
  };

  // 已劫持信息
  const hookedMap = new Map();
  // 观察者信息
  const obvInfo = {
    hookedMap: new Map(),
    observer: null
  };
  // routeType
  let _routeType = 'hash';
  // 劫持类型
  const hookType = {
    // window open劫持
    open: {
      type: 'window',
      path: 'open',
      origin: window.open,
      hooker: async function hooker() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        // 分解open参数
        const url = args[0];
        const target = args[1];
        const originOpen = hookType.open.origin.bind(window);
        // 只处理默认打开和新窗口打开
        if (target === '_blank' || !target) {
          try {
            var _ref;
            const innerUrl = utils.parseUrl((_ref = url !== null && url !== void 0 ? url : '') === null || _ref === void 0 ? void 0 : _ref.toString());
            // 先查看是否在工作台有菜单，如果有，则直接打开对应菜单
            const {
              matchUrl
            } = await utils.getWorkMatchedUrl(innerUrl);
            if (matchUrl) {
              return originOpen("".concat(matchUrl).concat(innerUrl.search), ...args.slice(1));
            }
            const workInfo = await utils.getWorkInfo();
            // 判断打开的是否是自身路由，并且将走hash路由，如果是，则通过reHashPath打开
            if (innerUrl.host === location.host && innerUrl.path === location.pathname) {
              var _wlocation$origin;
              const wlocation = (workInfo === null || workInfo === void 0 ? void 0 : workInfo.location) || {};
              const newUrl = "".concat((_wlocation$origin = wlocation.origin) !== null && _wlocation$origin !== void 0 ? _wlocation$origin : '').concat(wlocation.pathname || '').concat(utils.getReHashpathByUrlStruct(innerUrl));
              return originOpen(newUrl, ...args.slice(1));
            }
            // 判断是否是走path打开
            if (innerUrl.host === location.host && _routeType === 'path') {
              var _wlocation$origin2;
              const wlocation = (workInfo === null || workInfo === void 0 ? void 0 : workInfo.location) || {};
              const newUrl = "".concat((_wlocation$origin2 = wlocation.origin) !== null && _wlocation$origin2 !== void 0 ? _wlocation$origin2 : '').concat(wlocation.pathname || '').concat(utils.getRepathByUrlStruct(innerUrl));
              return originOpen(newUrl, ...args.slice(1));
            }
          } catch (error) {
            console.debug(error);
          }
        }
        // 以上都没有，还原到默认window.open
        originOpen(...args);
      }
    },
    // hashchange劫持
    hashchange: {
      type: 'event',
      eventName: 'hashchange',
      function: async e => {
        var _e$newURL;
        const url = (_e$newURL = e.newURL) !== null && _e$newURL !== void 0 ? _e$newURL : '';
        const innerUrl = utils.parseUrl(url !== null && url !== void 0 ? url : '');
        const matchedInfo = await utils.getWorkMatchedUrl(innerUrl);
        if (matchedInfo.matchUrl) {
          message.selectMenu(matchedInfo.matchedInput, innerUrl.query);
        } else {
          message.setRedirectHashPath(innerUrl.hash.replaceAll('#', ''), innerUrl.query);
        }
      }
    },
    // A标签劫持
    ATag: {
      type: 'observer',
      function: async e => {
        // 禁止默认打开事件
        e.preventDefault();
        // 防抖检查
        const current = e.target || {};
        if (current[$symbol.DEBOUNCE_CHECK]) return;
        // 初始化
        try {
          current[$symbol.DEBOUNCE_CHECK] = true;
          const virtualTag = document.createElement('a');
          // 尝试让虚拟标签属性和实际的一致
          $constant.atagAttr.forEach(attrName => current[attrName] && (virtualTag[attrName] = current[attrName]));
          // 只考虑新窗口打开的情况，基本和window.open劫持相似
          if (virtualTag.target === '_blank') {
            var _current$href;
            // 先查看是否在工作台有菜单，如果有，则直接打开对应菜单
            const innerHref = utils.parseUrl((_current$href = current.href) !== null && _current$href !== void 0 ? _current$href : '');
            const {
              matchUrl
            } = await utils.getWorkMatchedUrl(innerHref);
            if (matchUrl) {
              virtualTag.href = matchUrl;
              virtualTag.click();
              current[$symbol.DEBOUNCE_CHECK] = false;
              return;
            }
            const workInfo = await utils.getWorkInfo();
            // 判断打开的是否是自身路由，如果是，则通过reHashPath打开
            if (innerHref.host === location.host && innerHref.path === location.pathname) {
              var _wlocation$origin3;
              const wlocation = (workInfo === null || workInfo === void 0 ? void 0 : workInfo.location) || {};
              const newHref = "".concat((_wlocation$origin3 = wlocation.origin) !== null && _wlocation$origin3 !== void 0 ? _wlocation$origin3 : '').concat(wlocation.pathname || '').concat(utils.getReHashpathByUrlStruct(innerHref));
              virtualTag.href = newHref !== null && newHref !== void 0 ? newHref : current.href;
              virtualTag.click();
              current[$symbol.DEBOUNCE_CHECK] = false;
              return;
            }
            // 判断是否是走path打开
            if (innerHref.host === location.host && _routeType === 'path') {
              var _wlocation$origin4;
              const wlocation = (workInfo === null || workInfo === void 0 ? void 0 : workInfo.location) || {};
              const newHref = "".concat((_wlocation$origin4 = wlocation.origin) !== null && _wlocation$origin4 !== void 0 ? _wlocation$origin4 : '').concat(wlocation.pathname || '').concat(utils.getRepathByUrlStruct(innerHref));
              virtualTag.href = newHref !== null && newHref !== void 0 ? newHref : current.href;
              virtualTag.click();
              current[$symbol.DEBOUNCE_CHECK] = false;
              return;
            }
          }
          // 如果都没有走到，则走默认事件
          virtualTag.href = current.href;
          virtualTag.click();
          current[$symbol.DEBOUNCE_CHECK] = false;
        } catch (error) {
          current[$symbol.DEBOUNCE_CHECK] = false;
          console.debug(error);
        }
      }
    },
    // 劫持pushState
    pushState: {
      type: 'window',
      path: 'history.pushState',
      origin: window.history.pushState,
      hooker: async function hooker() {
        var _toString, _ref2;
        const originPushState = hookType.pushState.origin.bind(window.history);
        // 分解参数
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        const [data, unsed, url, ...rest] = args;
        const innerUrl = utils.parseUrl((_toString = (_ref2 = url !== null && url !== void 0 ? url : '') === null || _ref2 === void 0 ? void 0 : _ref2.toString()) !== null && _toString !== void 0 ? _toString : '');
        const currentUrl = utils.parseUrl(location.href);
        const matchedInfo = await utils.getWorkMatchedUrl(innerUrl);
        if (matchedInfo.matchUrl) {
          message.selectMenu(matchedInfo.matchedInput, innerUrl.query);
        } else if (currentUrl.path !== innerUrl.path || currentUrl.search !== innerUrl.search && _routeType === 'path') {
          // 说明是path路由
          message.setRedirectPath(innerUrl.path, innerUrl.query);
        } else if (currentUrl.hash !== innerUrl.hash || currentUrl.search !== innerUrl.search && _routeType === 'hash') {
          // 说明是hash路由
          message.setRedirectHashPath(innerUrl.hash.replaceAll('#', ''), innerUrl.query);
        }
        originPushState(data, unsed, url, ...rest);
      }
    },
    // 劫持historyState
    replaceState: {
      type: 'window',
      path: 'history.pushState',
      origin: window.history.replaceState,
      hooker: async function hooker() {
        var _toString2, _ref3;
        const originPushState = hookType.replaceState.origin.bind(window.history);
        // 分解参数
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }
        const [data, unsed, url, ...rest] = args;
        const innerUrl = utils.parseUrl((_toString2 = (_ref3 = url !== null && url !== void 0 ? url : '') === null || _ref3 === void 0 ? void 0 : _ref3.toString()) !== null && _toString2 !== void 0 ? _toString2 : '');
        const currentUrl = utils.parseUrl(location.href);
        const matchedInfo = await utils.getWorkMatchedUrl(innerUrl);
        if (matchedInfo.matchUrl) {
          message.selectMenu(matchedInfo.matchedInput, innerUrl.query);
        } else if (currentUrl.path !== innerUrl.path || currentUrl.search !== innerUrl.search && _routeType === 'path') {
          // 说明是path路由
          message.setRedirectPath(innerUrl.path, innerUrl.query);
        } else if (currentUrl.hash !== innerUrl.hash || currentUrl.search !== innerUrl.search && _routeType === 'hash') {
          // 说明是hash路由
          message.setRedirectHashPath(innerUrl.hash.replaceAll('#', ''), innerUrl.query);
        }
        originPushState(data, unsed, url, ...rest);
      }
    }
  };
  var hook = {
    /**
     * @description: 安装Hool
     * @param {Array<keyof typeof hookType> | null} hookList 要安装的hook列表，如果为空，则安装全部
     */
    installHook(hookList) {
      let routeType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'hash';
      _routeType = routeType;
      const realHookList = hookList !== null && hookList !== void 0 ? hookList : Object.keys(hookType);
      for (let i = 0; i < realHookList.length; i++) {
        const hookName = realHookList[i];
        const hook = hookType[hookName];
        if (hookedMap.get(hookName) || obvInfo.hookedMap.get(hookName)) continue;
        switch (hook.type) {
          case 'window':
            utils.setProperty(window, hook.path, hook.hooker);
          case 'event':
            window.addEventListener(hook.eventName, hook.function);
            hookedMap.set(hookName, true);
            break;
          case 'observer':
            if (!obvInfo.observer) {
              obvInfo.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                  // 遍历所有变化的节点
                  mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'A' && obvInfo.hookedMap.get('ATag')) {
                      node.removeEventListener('click', hookType.ATag.function);
                      node.addEventListener('click', hookType.ATag.function);
                    }
                  });
                });
              });
              obvInfo.observer.observe(document, {
                childList: true,
                subtree: true // 观察所有子树中的节点变化
              });
            }

            if (hookName === 'ATag') {
              utils.batchRemoveEventListener(document.getElementsByTagName('a'), 'click', hookType.ATag.function);
              utils.batchAddEventListener(document.getElementsByTagName('a'), 'click', hookType.ATag.function);
            }
            obvInfo.hookedMap.set(hookName, true);
        }
      }
    },
    /**
     * @description: 卸载hook
     * @param {Array<keyof typeof hookType> | null} hookList 要卸载的hook列表，如果为空，则全部卸载
     */
    uninstallHook(hookList) {
      const realHookList = hookList !== null && hookList !== void 0 ? hookList : Object.keys(hookType);
      for (let i = 0; i < realHookList.length; i++) {
        const hookName = realHookList[i];
        const hook = hookType[hookName];
        if (!hookedMap.get(hookName) && !obvInfo.hookedMap.get(hookName)) {
          continue;
        }
        switch (hook.type) {
          case 'window':
            utils.setProperty(window, hook.path, hook.origin);
          case 'event':
            window.removeEventListener(hook.eventName, hook.function);
            hookedMap.delete(hookName);
            break;
          case 'observer':
            if (hookName === 'ATag') {
              utils.batchRemoveEventListener(document.getElementsByTagName('a'), 'click', hookType.ATag.function);
            }
            obvInfo.hookedMap.delete(hookName);
            if (obvInfo.observer && [...obvInfo.hookedMap.keys()].length === 0) {
              obvInfo.observer.disconnect();
              obvInfo.observer = null;
            }
        }
      }
    }
  };

  var index = {
    message,
    routeSwitch,
    hook
  };

  return index;

}));
