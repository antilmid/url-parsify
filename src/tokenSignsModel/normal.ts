
import type { TokenSign } from '../type'

export default [
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
  ] as TokenSign[],

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
        if (!urlDataTree.query) urlDataTree.query = {}
        dataCacheTree.currentQueryKey = content
        urlDataTree.query[content] = true
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
        if (!urlDataTree.query) urlDataTree.query = {}
        if (!dataCacheTree.currentQueryKey) return
        urlDataTree.query[dataCacheTree.currentQueryKey] = content
        delete dataCacheTree.currentQueryKey
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
  ] as TokenSign[],

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
  ] as TokenSign[],
  {
    name: 'unknown',
    using: -1,
    consuming: true,
    reg: /^./
  }
] as TokenSign[]
