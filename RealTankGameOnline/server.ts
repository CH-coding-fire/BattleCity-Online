import express from "express";
import expressSession from "express-session";
import http from "http";
import { emit } from "process";
import { Server as SocketIO } from "socket.io";
import { Request, Response } from "express";
import path from "path";
import playerClass, {
  findRoomAndAddPlayerInArray,
  playerArray,
  Player,
} from "./gameData/playerClass";
import { Bullet, bulletArray, addBulletToArray } from "./gameData/bullet";
import { selectControlTarget } from "./gameData/controlServerSide";
import { brickArray, Brick } from "./gameData/bricks";
import { createEnvironmentOjb, map1 } from "./gameData/createEnvironmentOjb";
import { steelArray, Steel } from "./gameData/steel";
import { waterArray, Water } from "./gameData/water";
import { plantArray, Plant } from "./gameData/plant";

const app = express();
const server = new http.Server(app);
export const io = new SocketIO(server);

app.use(
  expressSession({
    secret: "Tecky Academy teaches typescript",
    resave: true,
    saveUninitialized: true,
  })
);

export let roomObject = {};
export let roomNumAcc: number = 0;

let player1: string = "";
let player2: string = "";

io.on("connection", function (socket) {
  if (!player1) {
    player1 = socket.id;
    console.log(`player1's socketID is: ${player1}`);
    findRoomAndAddPlayerInArray(socket.id, 100, 100);
  } else if (!player2) {
    player2 = socket.id;
    console.log(`player2's socketID is: ${player2}`);
    findRoomAndAddPlayerInArray(socket.id, 500, 500);
  } else {
    let inspectorID;
    inspectorID = socket.id;
    console.log(`inspector's socketID is: ${inspectorID}`);
  }
  socket.on("keyDown", (key) => {
    let tankDirection: string = key;
    for (let i: number = 0; i < playerArray.length; i++) {
      if (playerArray[i].socketID == socket.id) {
        switch (tankDirection) {
          case "up":
            playerArray[i].move("up", "move");
            socket.emit("playerNewPos", playerArray[i].x, playerArray[i].y);
            break;
          case "down":
            playerArray[i].move("down", "move");
            break;
          case "left":
            playerArray[i].move("left", "move");
            break;
          case "right":
            playerArray[i].move("right", "move");
            break;
        }
      }
    }
  });
  // socket.on('announce', function (data) {
  //   io.to(playerArray[1].socketID).emit('announce', data);
  //   io.to(playerArray[0].socketID).emit('announce', data);
  // })

  socket.on("keyUp", (key) => {
    let tankDirection: string = key;
    for (let i: number = 0; i < playerArray.length; i++) {
      if (playerArray[i].socketID == socket.id && playerArray[i].hp != 0) {
        switch (tankDirection) {
          case "up":
            playerArray[i].move("", "stop");
            break;
          case "down":
            playerArray[i].move("", "stop");
            break;
          case "left":
            playerArray[i].move("", "stop");
            break;
          case "right":
            playerArray[i].move("", "stop");
            break;
        }
      }
    }
  });
  socket.on("tankFire", () => {
    for (let i: number = 0; i < playerArray.length; i++) {
      if (
        playerArray[i].socketID == socket.id &&
        playerArray[i].hp != 0 &&
        playerArray[i].coolDown == 0
      ) {
        playerArray[i].fire();
      }
    }
  });
});

app.get("/", function (req: Request, res: Response) {
  res.sendFile(path.resolve("./public", "index.html"));
  req.session["user"] = Math.round(Math.random() * 1000);
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
app.use(express.static("./public"));

createNewRoom();
createNewRoom();

export function createNewRoom() {
  roomNumAcc = roomNumAcc + 1;
  roomObject[`Room ${roomNumAcc}`] = {
    playerArray: [],
  };
}

let sendDataToCanvas: ReturnType<typeof setInterval> = setInterval(() => {
  io.emit(
    "dataFromServer",
    playerArray,
    bulletArray,
    brickArray,
    steelArray,
    waterArray,
    plantArray
  );
}, 5);

createEnvironmentOjb(map1);
