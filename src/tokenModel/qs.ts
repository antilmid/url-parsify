import type { TokenModelSign, TokenModel } from '../type'

const ARRAY_SYMBOL = Symbol('array')

export default {
  signs: [
    // 基础结构相关
    ...[
      {
        name: 'protocol',
        using: 1,
        consuming: true,
        reg: /^[a-zA-Z0-9]*:\/\//,
        setStatus: 'protocol',
        handleParse: ({ content, urlDataTree }) => {
          urlDataTree.protocol = (content || '').replace('://', '')
        }
      },
      {
        name: 'host',
        using: 1,
        consuming: true,
        reg: /^[a-zA-Z0-9\-_.~%]+/,
        dependStatus: ['protocol'],
        setStatus: 'host',
        handleParse: ({ content, urlDataTree }) => {
          urlDataTree.host = content || ''
        }
      },
      {
        name: 'port',
        using: 1,
        consuming: true,
        reg: /^:[0-9]+/,
        dependStatus: ['host'],
        closestToken: 'host',
        handleParse: ({ content, urlDataTree, tokens }) => {
          urlDataTree.port = (content || '').replace(':', '')
        }
      },
      {
        name: 'path',
        using: 1,
        consuming: true,
        reg: /^\/[a-zA-Z0-9\-_.~%/]*/,
        handleParse: ({ content, urlDataTree }) => {
          urlDataTree.path = content || ''
        }
      }
    ] as TokenModelSign[],

    // query相关类
    ...[
      {
        name: 'queryStartSign',
        using: -1,
        consuming: true,
        reg: /^[?&]/,
        excludeStatus: ['queryStart'],
        setStatus: 'queryStart'
      },
      {
        name: 'queryKey',
        using: -1,
        consuming: true,
        reg: /^[a-zA-Z0-9\-_.~%]+/,
        setStatus: 'queryKey',
        dependStatus: ['queryStart'],
        excludeStatus: ['queryKey'],
        handleParse: ({ content, urlDataTree, dataCacheTree }) => {
          if (!dataCacheTree.queryInfoTree) dataCacheTree.queryInfoTree = []
          dataCacheTree.currentQueryPathInfo = {
            keyPath: [content],
            value: true
          }
          dataCacheTree.queryInfoTree.push(dataCacheTree.currentQueryPathInfo)
        }
      },
      {
        name: 'queryKeyArr',
        using: -1,
        consuming: true,
        reg: /^\[[a-zA-Z0-9\-_.~%]*\]/,
        setStatus: 'queryKeyArr',
        dependStatus: ['queryKey'],
        handleParse: ({ content, urlDataTree, dataCacheTree }) => {
          if (!dataCacheTree.currentQueryPathInfo) return
          const keyname = content.replace(/(\[|\]|(%22))/g, '')
          if (!keyname) {
            dataCacheTree.currentQueryPathInfo.keyPath.push(ARRAY_SYMBOL)
          } else {
            dataCacheTree.currentQueryPathInfo.keyPath.push(keyname)
          }
        }
      },
      {
        name: 'queryEqualOperation',
        using: -1,
        consuming: true,
        reg: /^[=]/,
        setStatus: 'operation',
        dependStatus: ['queryStart', 'queryKey']
      },
      {
        name: 'queryValue',
        using: -1,
        consuming: true,
        reg: /^[a-zA-Z0-9\-_.~%]+/,
        setStatus: 'queryValue',
        dependStatus: ['queryStart', 'queryKey', 'operation'],
        handleParse: ({ content, urlDataTree, dataCacheTree }) => {
          if (!dataCacheTree.currentQueryPathInfo) return
          dataCacheTree.currentQueryPathInfo.value = content
        }
      },
      {
        name: 'queryNextSign',
        using: -1,
        consuming: true,
        reg: /^[&]/,
        setStatus: 'queryStart',
        dependStatus: ['queryStart'],
        clearStatus: ['queryKey', 'operation']
      },
      {
        name: 'queryEnd',
        using: -1,
        consuming: false,
        isNotToken: true,
        reg: /./,
        dependStatus: ['queryStart'],
        clearStatus: /^(query|operation)/
      }
    ] as TokenModelSign[],

    // hash相关
    ...[
      {
        name: 'hashStartSign',
        using: -1,
        consuming: true,
        reg: /^[#]/,
        setStatus: 'hashStart'
      },
      {
        name: 'hashPath',
        using: -1,
        consuming: true,
        reg: /^[a-zA-Z0-9\-_.~%/]+/,
        dependStatus: ['hashStart'],
        handleParse: ({ content, urlDataTree, dataCacheTree }) => {
          const unifyPath = (path: string) => {
            if (path.match(/^\//)) return path.replace(/\/$/, '')
            else return `/${path}`.replace(/\/$/, '')
          }

          if (!urlDataTree.hashPath) {
            urlDataTree.hashPath = unifyPath(content)
            urlDataTree.multiHashPath = urlDataTree.hashPath
          } else {
            urlDataTree.multiHashPath = `${urlDataTree.multiHashPath
              }${unifyPath(content)}`
          }
        }
      },
      {
        name: 'hashEnd',
        consuming: false,
        using: -1,
        isNotToken: true,
        reg: /./,
        dependStatus: ['hashStart'],
        clearStatus: /^hash/
      }
    ] as TokenModelSign[],
    {
      name: 'unknown',
      using: -1,
      consuming: true,
      reg: /^./
    }
  ] as TokenModelSign[],
  onGarbageBefore(parseContext) {
    console.log(parseContext, 'xxx')
  }
} satisfies TokenModel
