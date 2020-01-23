const chats = []
const CHAT_CHANNEL = 'CHAT_CHANNEL'

module.exports = {
  Query: {
    chats (root, args, context) {
      return chats
    }
  },

  Mutation: {
    sendMessage (root, { from, message }, { pubSub }) {
      const chat = { messageId: chats.length + 1, from, message }
      chats.push(chat)
      pubSub.publish('CHAT_CHANNEL', { messageSent: chat })
      return chat
    }
  },

  Subscription: {
    messageSent: {
      subscribe: (root, args, { pubSub }) => {
        return pubSub.asyncIterator(CHAT_CHANNEL)
      }
    }
  }
}

