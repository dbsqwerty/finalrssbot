const config = require('../config.js')
const commands = require('../util/commands.js').list
const channelTracker = require('../util/channelTracker.js')
const pageControls = require('../util/pageControls.js')
const log = require('../util/logger.js')
const Menu = require('./MenuUtils.js').Menu
const MULTI_SELECT = ['rssremove', 'rssmove']
const GLOBAL_SELECT = ['rssmove']





/**
 * A menu with predefined passover data with feed information, merged with any previous menu's data.
 *
 * @extends {Menu}
 */
class FeedSelector extends Menu {
  /**
   * Creates an instance of FeedSelector.
   * @param {Oject} message Instance of a Discord.js Message
   * @param {Function} [passoverFn]  Function with predefined passover data in the second parameter
   * @param {Object} [cmdInfo] Command information
   * @param {String} [cmdInfo.command] Command name
   * @param {String} [cmdInfo.miscOption] Description of the miscoption by rssoptions
   * @param {Boolean} [cmdInfo.multiSelect] Whether to allow multiple feeds to be selected
   * @param {Boolean} [cmdInfo.globalSelect] Whether to allow feeds from other channels to be selected
   * @param {String} [cmdInfo.prependDescription] Additional information in the description, before the FeedSelector's default instructions
   * @memberof FeedSelector
   */
  constructor (message, passoverFn, cmdInfo, guildRss) {
    super(message)
    if (!passoverFn) passoverFn = async (m, data) => data
    this.guildRss = guildRss
    this.passoverFn = passoverFn
    if (!this.guildRss || !this.guildRss.sources || Object.keys(this.guildRss.sources).length === 0) {
      this.text = 'There are no existing feeds.'
      return
    }
    const { command, miscOption, multiSelect, prependDescription, globalSelect } = cmdInfo
    this.command = command
    this.miscOption = miscOption
    this.multiSelect = MULTI_SELECT.includes(command) || multiSelect
    this.globalSelect = GLOBAL_SELECT.includes(command) || globalSelect

    const rssList = this.guildRss.sources
    this._currentRSSList = []

    for (var rssName in rssList) { // Generate the info for each feed as an object, and push into array to be used in pages that are sent
      const source = rssList[rssName]
      if (message.channel.id !== source.channel && !this.globalSelect) continue
      let o = { link: source.link, rssName: rssName, title: source.title }

      if (OPTIONS_TEXTS[miscOption]) {
        const statusText = OPTIONS_TEXTS[miscOption].status
        let decision = ''

        const globalSetting = config.feeds[miscOption]
        decision = globalSetting ? `${statusText} Enabled\n` : `${statusText} Disabled\n`
        const specificSetting = source[miscOption]
        decision = typeof specificSetting !== 'boolean' ? decision : specificSetting === true ? `${statusText} Enabled\n` : `${statusText} Disabled\n`

        o.miscOption = decision
      }
      if (this.globalSelect) o.channel = source.channel
      this._currentRSSList.push(o)
    }

    if (this._currentRSSList.length === 0) {
      this.text = 'No feeds assigned to this channel.'
      return
    }
    let desc = ''
    desc += (this.globalSelect ? '' : `**Channel:** #${message.channel.name}\n`)
    this.setAuthor('Feed Lister')
    this.setDescription(desc)

    this._currentRSSList.forEach(item => {
      const channel = item.channel ? message.client.channels.has(item.channel) ? `Channel: #${message.client.channels.get(item.channel).name}\n` : undefined : undefined
      const link = item.link
      const title = item.title
      const status = item.status || ''

      // const miscOption = item.checkTitles || item.imagePreviews || item.imageLinksExistence || item.checkDates || item.formatTables || ''
      const miscOption = item.miscOption || ''
      this.addOption(`${title.length > 200 ? title.slice(0, 200) + ' ...' : title}`, `${channel || ''}${miscOption}${status}Link: ${link.length > 500 ? '*Exceeds 500 characters*' : link}`)
    })

    this.fn = selectFeedFn.bind(this)
  }

  /**
   * Callback function for sending a Menu
   *
   * @callback sendCallback
   * @param {Error} err SyntaxError if incorrect input for retry, or other Error to stop the collector.
   * @param {Object} data Data at the end of a Menu passed over
   * @param {MessageCleaner} msgCleaner MessageCleaner containing the messages collected thus far
   * @param {Boolean} endPrematurely Prematurely end a MenuSeries if it exists, calling its callback
   */

  /**
   * Send the text and/or embed with pagination if needed
   *
   * @param {Object} data
   * @param {sendCallback} callback
   * @override
   * @memberof FeedSelector
   */
  async send (data) {
    const m = await this.channel.send(this.text, { embed: this.pages[0] })
    this._msgCleaner.add(m)
    if (this.pages.length > 1) {
      await m.react('◀')
      await m.react('▶')
      pageControls.add(m.id, this.pages)
    }

    if (!this.fn) return [] // This function is called *after* the feed is selected with the pre-made function selectFeedFn

  }
}

module.exports = FeedSelector
