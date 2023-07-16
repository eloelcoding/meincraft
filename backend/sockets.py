import socketio

sio_server = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=[]
)

sio_app = socketio.ASGIApp(
    socketio_server=sio_server,
    # socketio_path='socket.io'
)


@sio_server.event
async def connect(sid, environ, auth):
    print(f'{sid}: connected')
    # print(environ)
    print(auth)
    await sio_server.emit('join', {'sid': sid})


@sio_server.on('message')
async def message(sid, message):
    print("[INCOMING MESSAGE] ", sid, message)
    await sio_server.emit('message', {'sid': sid, 'message': message})

@sio_server.on('chat')
async def chat(sid, message):
    print("[  CHAT MESSAGE  ] ", sid, message)
    await sio_server.emit('chat', {'sid': sid, 'message': message})

players = {}

@sio_server.on('playerchange')
async def playerchange(sid, message):
    print("[ PLAYER CHANGE  ] ", sid, message)
    players[sid] = message['player']
    print(players)
    await sio_server.emit('chat', {'sid': sid, 'message': message})
    


@sio_server.event
async def disconnect(sid):
    print(f'{sid}: disconnected')