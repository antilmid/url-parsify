interface Token {
  name: string
  sign: TokenSign
  tokenContent: string
}

interface ParseContext {
  token: Token
  content: Token['tokenContent']
  tokens: Token[]
  index: number
  urlDataTree: {
    __sourceTokens__: Token[]
    protocol?: string
    host?: string
    path?: string
    query?: Record<string, string | boolean>
    hashPath?: string
    multiHashPath?: string
    [key: string]: any
  }
  dataCacheTree: Record<string, any>
}

interface TokenizeContext {
  sign: TokenSign
  currentTokens: Token[]
  usingTree: Record<string, number>
  statusTree: Record<string, boolean>
}

interface TokenSign {
  name: string
  reg: RegExp
  using?: number
  consuming?: boolean
  handleParse?: (parseContext: ParseContext) => void
  setStatus?: string
  dependStatus?: string[]
  isNotToken?: boolean
  clearStatus?: string[] | RegExp | '*'
  excludeStatus?: string[]
  closestToken?: string
  customConditionCallback?: (tokenizeContext: TokenizeContext) => boolean
  debugconsole?: boolean
}

export default class UParser {
  static defalutTokenSign: TokenSign[] = [
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
    },

    // query相关类
    ...[
      {
        name: 'queryStartSign',
        using: -1,
        consuming: true,
        reg: /^[?]/,
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
      name: 'unkwon',
      using: -1,
      consuming: true,
      reg: /^./
    }
  ]

  tokenSign: TokenSign[]

  constructor() {
    this.tokenSign = UParser.defalutTokenSign
  }

  tokenize(url: string) {
    const tokens: Token[] = []
    const usingTree: Record<string, number> = {}
    let noMatch = false
    let source = url
    let statusTree: Record<string, boolean> = {}

    wrapper: while (source.length && !noMatch) {
      noMatch = false
      for (let i = 0; i < this.tokenSign.length; i++) {
        const sign = this.tokenSign[i]
        const closestToken = this.tokenSign[i - 1]
        if (sign.debugconsole) console.log(`=====${sign.name}=====`)
        if (sign.debugconsole) console.log('当前statusTree：', statusTree)
        // 判断using
        if (sign.using === usingTree[sign.name]) continue
        if (!usingTree[sign.name]) usingTree[sign.name] = 0
        // 判断条件表达式、依赖、邻近关系是否符合
        if (sign.customConditionCallback && !sign.customConditionCallback({ sign, currentTokens: tokens, usingTree: { ...usingTree }, statusTree: { ...statusTree } })) continue
        if (
          sign?.dependStatus &&
          !sign.dependStatus
            .map((key) => !!statusTree[key])
            .reduce((cur, nxt) => cur && nxt)
        ) { continue }
        if (
          sign?.excludeStatus &&
          sign.excludeStatus
            .map((key) => !!statusTree[key])
            .reduce((cur, nxt) => cur || nxt)
        ) { continue }
        if (sign.closestToken && !closestToken) continue
        if (sign.closestToken && closestToken && sign.closestToken !== closestToken.name) continue
        // 匹配
        if (sign.debugconsole) console.log(`准备匹配：${source}`)
        const matchRes = source.match(sign.reg)
        if (sign.debugconsole) console.log('匹配结果：', matchRes)
        if (!matchRes) continue
        const matchToken = matchRes[0]
        // 是否消耗
        if (sign.consuming) source = source.slice(matchToken.length)
        // 存放token
        if (!sign.isNotToken) {
          tokens.push({
            name: sign.name,
            sign: { ...sign },
            tokenContent: matchToken
          })
        }
        // 设置状态
        if (sign.setStatus) statusTree[sign.setStatus] = true
        // 清除状态
        if (sign.clearStatus === '*') {
          statusTree = {}
        } else if (sign.clearStatus instanceof Array) {
          sign.clearStatus.forEach((key) => {
            delete statusTree[key]
          })
        } else if (sign.clearStatus instanceof RegExp) {
          Object.keys(statusTree).forEach((key) => {
            if (key.match(sign.clearStatus as RegExp)) delete statusTree[key]
          })
        }
        if (sign.debugconsole) console.log('事后statusTree：', statusTree)
        usingTree[sign.name] += 1
        continue wrapper
      }
      noMatch = true
    }
    return tokens
  }

  parser(url: string) {
    const tokens = this.tokenize(url)
    const urlDataTree: ParseContext['urlDataTree'] = {
      __sourceTokens__: tokens
    }
    const dataCacheTree: ParseContext['dataCacheTree'] = {}
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      const handleParse = token.sign.handleParse
      if (!handleParse) continue
      handleParse({
        token,
        content: token.tokenContent,
        tokens,
        index: i,
        urlDataTree,
        dataCacheTree
      })
    }
    return urlDataTree
  }
}
// const u = new UParser()
