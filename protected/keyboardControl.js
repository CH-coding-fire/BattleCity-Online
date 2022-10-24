document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)


function keyDown(e) {
    switch (e.code) {
        case 'KeyW':
            socket.emit('keyDown', "up") //a7 Tell the server you move
            break
        case 'KeyS':
            socket.emit('keyDown', "down")
            break
        case 'KeyA':
            socket.emit('keyDown', "left")
            break
        case 'KeyD':
            socket.emit('keyDown', "right")
            break
        case 'Space':
            socket.emit('tankFire')
            break
    }
}

function keyUp(e) {
    switch (e.key) {
        case 'w':
            socket.emit('keyUp', "up") //a7 Tell the server you move
            break
        case 's':
            socket.emit('keyUp', "down")
            break
        case 'a':
            socket.emit('keyUp', "left")
            break
        case 'd':
            socket.emit('keyUp', "right")
            break
    }
}