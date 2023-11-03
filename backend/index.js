const express = require('express')
const cors = require('cors')
const Pusher = require('pusher')

const pusher = new Pusher({
  host: 'soketi.run.app',
  appId: 'app-id',
  secret: 'app-secret',
  key: 'app-key',
  useTLS: true,
  cluster: 'cluster-1'
})

const app = express()

app.use(cors())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false
  })
)

app.get('/', (_, res) => res.send('Hello, World!'))

app.get('/test', async (_, res) => {
  await pusher.trigger('open-channel', 'message', 'Hello from Open Channel')
  await pusher.trigger(
    'private-channel',
    'message',
    'Hello from Private Channel'
  )
  res.send('Done')
})

const users = [
  {
    id: '123',
    username: 'thedrunkenmess',
    name: 'Yashasvi'
  },
  {
    id: '456',
    username: '10x_developer',
    name: 'Ekansh'
  }
]

// app.post('/pusher/user-auth', (req, res) => {
//   console.log('Pusher User Auth', req.headers.authorization)
//   const socketId = req.body.socket_id

//   const user = users.find(u => u.id === req.headers.authorization)
//   if (!user) return res.status(403).send('Forbidden')

//   const authResponse = pusher.authenticateUser(socketId, user)
//   res.send(authResponse)
// })

app.post('/pusher/channel-auth', (req, res) => {
  console.log('Pusher Channel Auth', req.headers.authorization)
  const socketId = req.body.socket_id
  const channel = req.body.channel_name

  const user = users.find(u => u.id === req.headers.authorization)
  if (!user) return res.status(403).send('Forbidden')

  const authResponse = pusher.authorizeChannel(socketId, channel)
  res.send(authResponse)
})

app.listen(4000, () => {
  console.log('Server running on port 4000')
})
