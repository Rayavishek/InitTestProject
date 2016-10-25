'use strict'

exports.handle = function handle(client) {

  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('app:response:name:welcome')
      client.addResponse('app:response:name:provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('app:response:name:provide/instructions')
      client.updateConversationState({
        helloSent: true
      })
      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('app:response:name:apology/untrained')
      client.done()
    }
  })

  const handleGreeting = client.createStep({
  satisfied() {
    return false
  },

  prompt() {
    client.addTextResponse('Hi Kuchi! Kuch bestest. Mostest. Foreverest! Hain...')
    client.done()
  }
})

  const handleGoodbye = client.createStep({
  satisfied() {
    return false
  },

  prompt() {
    client.addTextResponse('Hope to see you back soon!')
    client.done()
  }
})

  client.runFlow({
    classifications: {
			// map inbound message classifications to names of streams
			greeting: 'greeting',
			goodbye: 'goodbye'
    },
   streams: {
	     // Add a Stream for greetings and assign it a Step
    greeting: handleGreeting,
	goodbye: handleGoodbye,
      main: 'onboarding',
      onboarding: [sayHello],
      end: [untrained]
    }
  })
}
