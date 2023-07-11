import type { Token, TokenSign, ParseContext } from './type'
import normalModel from './tokenSignsModel/normal'

export default class UParser {
  static defalutTokenSigns = normalModel

  tokenSigns: TokenSign[]

  constructor() {
    this.tokenSigns = UParser.defalutTokenSigns
  }

  /**
   * @description: 解析token
   * @param {string} url
   * @return {Token[]}
   */
  tokenize(url: string) {
    // 当前tokens
    const tokens: Token[] = []
    // 表示使用次数的结构树
    const usingTree: Record<string, number> = {}
    // 当前轮是否存在匹配关系
    let noMatch = false
    // 当前轮输入
    let source = url
    // 表示状态的结构树
    let statusTree: Record<string, boolean> = {}

    wrapper: while (source.length && !noMatch) {
      noMatch = false
      // 依次遍历tokenSign
      for (let i = 0; i < this.tokenSigns.length; i++) {
        // 当前标记
        const sign = this.tokenSigns[i]
        // 最近的（上一次的）token
        const closestToken = tokens[tokens.length - 1]
        if (sign.debugconsole) console.log(`=====${sign.name}=====`)
        if (sign.debugconsole) console.log('当前statusTree：', statusTree)
        // 判断using
        if (sign.using === usingTree[sign.name]) continue
        if (!usingTree[sign.name]) usingTree[sign.name] = 0
        // 判断条件表达式是否符合
        if (sign.customConditionCallback && !sign.customConditionCallback({ sign, currentTokens: tokens, usingTree: { ...usingTree }, statusTree: { ...statusTree } })) continue
        // 判断依赖是否符合
        if (
          sign?.dependStatus &&
          !sign.dependStatus
            .map((key) => !!statusTree[key])
            .reduce((cur, nxt) => cur && nxt)
        ) { continue }
        // 判断不希望的依赖是否符合
        if (
          sign?.excludeStatus &&
          sign.excludeStatus
            .map((key) => !!statusTree[key])
            .reduce((cur, nxt) => cur || nxt)
        ) { continue }
        // 判断相邻token关系是否符合
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

  /**
   * @description: 解析
   * @param {string} url
   * @return {ParseContext['urlDataTree']}
   */
  parse(url: string) {
    const tokens = this.tokenize(url)
    const urlDataTree: ParseContext['urlDataTree'] = {
      __sourceTokens__: tokens,
      garbageContents: [] as string[]
    }
    const dataCacheTree: ParseContext['dataCacheTree'] = {}

    let garbageContent = ''
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      // 处理垃圾字符
      if (token.sign.name === 'unknown') {
        garbageContent += token.tokenContent
      }
      if (token.sign.name !== 'unknown' && garbageContent) {
        urlDataTree.garbageContents.push(garbageContent)
        garbageContent = ''
      }
      // 处理模型提供的解析能力
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

    // 尾部再次处理垃圾字符
    if (garbageContent) {
      urlDataTree.garbageContents.push(garbageContent)
      garbageContent = ''
    }
    return urlDataTree
  }
}
