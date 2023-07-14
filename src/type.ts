export interface Token {
  name: string
  sign: TokenModelSign
  tokenContent: string
}

export interface ParseContext {
  tokens: Token[]
  urlDataTree: {
    __sourceTokens__: Token[]
    garbageContents: string[]
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

export interface ParsingContext extends ParseContext {
  token: Token
  content: Token['tokenContent']
  index: number
}

export interface TokenizeContext {
  sign: TokenModelSign
  currentTokens: Token[]
  usingTree: Record<string, number>
  statusTree: Record<string, boolean>
}

export interface TokenModelSign {
  name: string
  reg: RegExp
  using?: number
  consuming?: boolean
  handleParse?: (parseContext: ParsingContext) => void
  setStatus?: string
  dependStatus?: string[]
  isNotToken?: boolean
  clearStatus?: string[] | RegExp | '*'
  excludeStatus?: string[]
  closestToken?: string
  customConditionCallback?: (tokenizeContext: TokenizeContext) => boolean
  debugconsole?: boolean
}

export interface TokenModel {
  signs: TokenModelSign[]
  onGarbageBefore?: (parseContext: ParseContext) => void
}
