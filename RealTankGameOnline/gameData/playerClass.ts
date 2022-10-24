import { Socket } from "socket.io";
import { roomObject, roomNumAcc } from "../server";
import { frameRatePerSecond } from "./runMovementFrame";
import { Bullet, bulletArray, addBulletToArray } from "./bullet";
import { clearInterval } from "timers";
import { brickArray, Brick } from "./bricks";
import { steelArray } from "./steel";
import { waterArray, Water } from "./water";

export class Player {
  socketID: string;
  w: number = 30;
  h: number = 30;
  dx: number = 0;
  dy: number = 0;
  speed: number = 2;
  direction: string = "pointUp";
  x: number;
  y: number;
  hp: number = 1;
  bound1: any; //* Top left corner, [x,y]
  bound2: any; //* Top Right corner
  bound3: any; //* Bottom left corner
  bound4: any; //* Bottom right corner
  x_axis: any;
  y_axis: any;
  coolDown: number = 0;
  previousX: number;
  previousY: number;
  previousBound1: any;
  previousBound2: any;
  previousBound3: any;
  previousBound4: any;

  constructor(socketID: string, x: number, y: number) {
    this.socketID = socketID;
    this.x = x; //*position
    this.y = y;
    this.bound1 = [this.x - 15, this.y - 15]; //! Should not hard code
    this.bound2 = [this.x + 15, this.y - 15];
    this.bound3 = [this.x - 15, this.y + 15];
    this.bound4 = [this.x + 15, this.y + 15];
    this.x_axis = [this.x - 15, this.x + 15];
    this.y_axis = [this.y - 15, this.y + 15];
  }

  coolDownReset() {}

  move(direction: string, moveOrStop: string) {
    this.previousX = this.x; //* This is for recording the previous position
    this.previousY = this.y;
    this.previousBound1 = this.bound1;
    this.previousBound2 = this.bound2;
    this.previousBound3 = this.bound3;
    this.previousBound4 = this.bound4;

    let runFrameRateTankMovement: ReturnType<typeof setInterval>;
    runFrameRateTankMovement = setInterval(() => {
      clearInterval(runFrameRateTankMovement);
      switch (direction) {
        case "up":
          if (this.y > 15) {
            this.dy = -this.speed;
            this.y += this.dy;
            this.bound1 = [this.x - 15, this.y - 15];
            this.bound2 = [this.x + 15, this.y - 15];
            this.bound3 = [this.x - 15, this.y + 15];
            this.bound4 = [this.x + 15, this.y + 15];
            this.y_axis[0] += this.dy;
            this.y_axis[1] += this.dy;
            this.direction = "pointUp";
          }
          break;
        case "down":
          if (this.y < 585) {
            this.dy = this.speed;
            this.y += this.dy;
            this.bound1 = [this.x - 15, this.y - 15];
            this.bound2 = [this.x + 15, this.y - 15];
            this.bound3 = [this.x - 15, this.y + 15];
            this.bound4 = [this.x + 15, this.y + 15];
            this.y_axis[0] += this.dy;
            this.y_axis[1] += this.dy;
            this.direction = "pointDown";
          }

          break;
        case "left":
          if (this.x > 15) {
            this.dx = -this.speed;
            this.x += this.dx;
            this.bound1 = [this.x - 15, this.y - 15];
            this.bound2 = [this.x + 15, this.y - 15];
            this.bound3 = [this.x - 15, this.y + 15];
            this.bound4 = [this.x + 15, this.y + 15];
            this.x_axis[0] += this.dx;
            this.x_axis[1] += this.dy;
            this.direction = "pointLeft";
          }
          break;
        case "right":
          if (this.x < 585) {
            this.dx = this.speed;
            this.x += this.dx;
            this.bound1 = [this.x - 15, this.y - 15];
            this.bound2 = [this.x + 15, this.y - 15];
            this.bound3 = [this.x - 15, this.y + 15];
            this.bound4 = [this.x + 15, this.y + 15];
            this.x_axis[0] += this.dx;
            this.x_axis[1] += this.dy;
            this.direction = "pointRight";
          }
          break;
      }
      ////This is for hitobs
      this.hitObs(brickArray);
      this.hitObs(steelArray);
      this.hitObs(waterArray);
      ////This is for hitobs
    }, 50 / frameRatePerSecond);

    if (moveOrStop == "stop") {
      this.dx = 0;
      this.dy = 0;
      clearInterval(runFrameRateTankMovement);
    }
  }

  hitObs(objArray: any[]) {
    for (let i: number = 0; i < objArray.length; i++) {
      if (
        this.bound1[0] <= objArray[i].RightBound_X - 4 &&
        this.bound1[1] <= objArray[i].BottomBoundY_Y - 4 &&
        this.bound2[0] >= objArray[i].x_Pos_Tile + 4 &&
        this.bound2[1] <= objArray[i].BottomBoundY_Y - 4 &&
        this.bound3[0] <= objArray[i].RightBound_X - 4 &&
        this.bound3[1] >= objArray[i].y_Pos_Tile + 4
      ) {
        this.returnPreviousPos();
        return;
      }
    }
  }

  returnPreviousPos() {
    this.x = this.previousX;
    this.y = this.previousY;
    this.bound1 = this.previousBound1;
    this.bound2 = this.previousBound2;
    this.bound3 = this.previousBound3;
    this.bound4 = this.previousBound4;
  }

  fire() {
    let coolDownInterval: ReturnType<typeof setInterval>;
    coolDownInterval = setInterval(() => {
      if (this.coolDown > 0) {
        this.coolDown -= 20; //! Chris change it to 20 to make cooldown faster
        if (this.coolDown == 0) {
          clearInterval(coolDownInterval);
        }
      }
    }, 100);
    switch (this.direction) {
      case "pointUp":
        addBulletToArray(this.direction, this.x, this.y - 20, this.socketID); //*Chris I change from 25 to 20 to eliminate the bug with bricks
        bulletArray[bulletArray.length - 1].fly();
        this.coolDown += 100;

        break;
      case "pointDown":
        addBulletToArray(this.direction, this.x, this.y + 20, this.socketID);
        bulletArray[bulletArray.length - 1].fly();
        this.coolDown += 100;
        break;
      case "pointLeft":
        addBulletToArray(this.direction, this.x - 20, this.y, this.socketID);
        bulletArray[bulletArray.length - 1].fly();
        this.coolDown += 100;
        break;
      case "pointRight":
        addBulletToArray(this.direction, this.x + 20, this.y, this.socketID);
        bulletArray[bulletArray.length - 1].fly();
        this.coolDown += 100;
        break;
    }
  }
}



export function findRoomAndAddPlayerInArray(
  socketID: string,
  x: number,
  y: number
) {
  if (playerArray.length < 2) {
    playerArray.push(new Player(socketID, x, y));
  }
}

export let playerArray: Player[] = [];

let playerClass = {
  Player,
  findRoomAndAddPlayerInArray,
};
export default playerClass;
