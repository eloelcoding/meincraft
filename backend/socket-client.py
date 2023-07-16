import asyncio

import socketio

sio_client = socketio.AsyncClient()

@sio_client.event
async def connect():
    print('I\'m connected')
    # await sio_client.emit('message', "########################### $$$$$$$$$$$$$$$$$$$$$$$$$$$")
    await sio_client.emit('message', {'type': 'message','a': 123, 'b': [1,2,3,4]})
    await sio_client.emit('chat', {'type': 'chat','a': 123, 'b': [1,2,3,4]})


@sio_client.event
async def disconnect():
    print('I\'m disconnected')

@sio_client.event
async def main():
    await sio_client.connect(url='http://localhost:3000', socketio_path='socket.io')
    await sio_client.disconnect()

asyncio.run(main())