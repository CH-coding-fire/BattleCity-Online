const canvas = document.getElementById('canvas') //*initialize canvas
const ctx = canvas.getContext('2d')
canvas.width = 600
canvas.height = 600

////Socket
const socket = io.connect()
socket.on("dataFromServer", upDateDataFromServer)
socket.on("announce", (data)=>alert(data))
    ////Socket

const imageTankUp = document.getElementById('tankUpsource');
const imageTankDown = document.getElementById('tankDownsource');
const imageTankLeft = document.getElementById('tankLeftsource');
const imageTankRight = document.getElementById('tankRightsource');
const imageTankUpP2 = document.getElementById('tankUpsourceP2');
const imageTankDownP2 = document.getElementById('tankDownsourceP2');
const imageTankLeftP2 = document.getElementById('tankLeftsourceP2');
const imageTankRightP2 = document.getElementById('tankRightsourceP2');
const imageWater = document.getElementById('water');
const imagePlant = document.getElementById('plant');

let playerArrayInClient = []
let bulletArrayInClient = []
let brickArrayInClient = []
let steelArrayInClient = []
let waterArrayInClient = []
let plantArrayInClient = []



function upDateDataFromServer(playerArray, bulletArray, brickArray, steelArray, waterArray, plantArray) {
    playerArrayInClient = playerArray
    bulletArrayInClient = bulletArray
    brickArrayInClient = brickArray
    steelArrayInClient = steelArray
    waterArrayInClient = waterArray
    plantArrayInClient = plantArray

}

function update() {
    requestAnimationFrame(update)
    clearCanvas()
    drawEnvironment()
    drawPlayer()
    drawBullet()
    drawPlant()
}

function drawPlayer() {
    for (let i = 0; i < playerArrayInClient.length; i++) {
        let playerToBeDrew = playerArrayInClient[i]
        if (i == 0 && playerToBeDrew.hp != 0) {
            if (playerToBeDrew.direction == "pointUp") {
                ctx.drawImage(imageTankUp, playerToBeDrew.x - 15, playerToBeDrew.y - 15, playerToBeDrew.w, playerToBeDrew.h)
            } else if (playerToBeDrew.direction == "pointDown") {
                ctx.drawImage(imageTankDown, playerToBeDrew.x - 15, playerToBeDrew.y - 15, playerToBeDrew.w, playerToBeDrew.h)
            } else if (playerToBeDrew.direction == "pointLeft") {
                ctx.drawImage(imageTankLeft, playerToBeDrew.x - 15, playerToBeDrew.y - 15, playerToBeDrew.w, playerToBeDrew.h)
            } else if (playerToBeDrew.direction == "pointRight") {
                ctx.drawImage(imageTankRight, playerToBeDrew.x - 15, playerToBeDrew.y - 15, playerToBeDrew.w, playerToBeDrew.h)
            }
        } else if (i == 1 && playerToBeDrew.hp != 0) {
            if (playerToBeDrew.direction == "pointUp") {
                ctx.drawImage(imageTankUpP2, playerToBeDrew.x - 15, playerToBeDrew.y - 15, playerToBeDrew.w, playerToBeDrew.h)
            } else if (playerToBeDrew.direction == "pointDown") {
                ctx.drawImage(imageTankDownP2, playerToBeDrew.x - 15, playerToBeDrew.y - 15, playerToBeDrew.w, playerToBeDrew.h)
            } else if (playerToBeDrew.direction == "pointLeft") {
                ctx.drawImage(imageTankLeftP2, playerToBeDrew.x - 15, playerToBeDrew.y - 15, playerToBeDrew.w, playerToBeDrew.h)
            } else if (playerToBeDrew.direction == "pointRight") {
                ctx.drawImage(imageTankRightP2, playerToBeDrew.x - 15, playerToBeDrew.y - 15, playerToBeDrew.w, playerToBeDrew.h)
            }
        }
    }
}

function drawBullet() {
    if (bulletArrayInClient.length != 0) {
        for (let i = 0; i < bulletArrayInClient.length; i++) {
            let bulletToBeDrew = bulletArrayInClient[i]
            switch (bulletToBeDrew.direction) {
                case "pointUp":
                    ctx.drawImage(imageTankUp, bulletToBeDrew.x - 5, bulletToBeDrew.y, bulletToBeDrew.w, bulletToBeDrew.h)
                    break
                case "pointDown":
                    ctx.drawImage(imageTankDown, bulletToBeDrew.x - 5, bulletToBeDrew.y - 10, bulletToBeDrew.w, bulletToBeDrew.h)
                    break
                case "pointLeft":
                    ctx.drawImage(imageTankLeft, bulletToBeDrew.x, bulletToBeDrew.y - 5, bulletToBeDrew.w, bulletToBeDrew.h)
                    break
                case "pointRight":
                    ctx.drawImage(imageTankRight, bulletToBeDrew.x - 10, bulletToBeDrew.y - 5, bulletToBeDrew.w, bulletToBeDrew.h)
                    break
                default:
            }
        }
    }

}

function drawEnvironment() {
    drawBrick()
    drawSteel()
    drawWater()
}

function drawBrick() {
    for (let i = 0; i < brickArrayInClient.length; i++) {
        let brickToBeDrew = brickArrayInClient[i]
        ctx.drawImage(imageTankUp, brickToBeDrew.x_Pos_Tile, brickToBeDrew.y_Pos_Tile, brickToBeDrew.w, brickToBeDrew.h)
    }
}

function drawSteel() {
    for (let i = 0; i < steelArrayInClient.length; i++) {
        let steelToBeDrew = steelArrayInClient[i]
        ctx.drawImage(imageTankRightP2, steelToBeDrew.x_Pos_Tile, steelToBeDrew.y_Pos_Tile, steelToBeDrew.w, steelToBeDrew.h)
    }
}

function drawWater() {
    for (let i = 0; i < waterArrayInClient.length; i++) {
        let waterToBeDrew = waterArrayInClient[i]
        ctx.drawImage(imageWater, waterToBeDrew.x_Pos_Tile, waterToBeDrew.y_Pos_Tile, waterToBeDrew.w, waterToBeDrew.h)
    }
}

function drawPlant() {
    console.log("plant")
    for (let i = 0; i < plantArrayInClient.length; i++) {
        let plantToBeDrew = plantArrayInClient[i]
        ctx.drawImage(imagePlant, plantToBeDrew.x_Pos_Tile, plantToBeDrew.y_Pos_Tile, plantToBeDrew.w, plantToBeDrew.h)
    }
}



function clearCanvas() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.height)
}
////Execute the game
update()

