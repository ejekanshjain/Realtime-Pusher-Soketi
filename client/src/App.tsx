import Pusher from 'pusher-js'
import { useEffect } from 'react'
import './App.css'

const pusherClient = new Pusher('app-key', {
  wsHost: 'soketi.run.app',
  cluster: 'cluster-1',
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],

  // authEndpoint: 'http://localhost:4000/pusher/user-auth',
  // authTransport: 'ajax',
  // auth: {
  //   headers: {
  //     Authorization: '123'
  //   }
  // },

  // userAuthentication: {
  //   endpoint: 'http://localhost:4000/pusher/user-auth',
  //   transport: 'ajax',
  //   headersProvider: () => {
  //     return {
  //       Authorization: '123'
  //     }
  //   }
  // },

  channelAuthorization: {
    endpoint: 'http://localhost:4000/pusher/channel-auth',
    transport: 'ajax',
    headersProvider: () => {
      return {
        Authorization: '123'
      }
    }
  }
})

function App() {
  useEffect(() => {
    const publicChannelSub = pusherClient.subscribe('open-channel')
    publicChannelSub.bind('message', (data: string) => {
      console.log('Received data in Open Channel:', data)
    })

    const privateChannelSub = pusherClient.subscribe('private-channel')
    privateChannelSub.bind('message', (data: string) => {
      console.log('Received data in Private Channel:', data)
    })

    return () => {
      publicChannelSub.unbind_all()
      publicChannelSub.unsubscribe()
      privateChannelSub.unbind_all()
      privateChannelSub.unsubscribe()
    }
  }, [])

  return <div>Hello, World!</div>
}

export default App
