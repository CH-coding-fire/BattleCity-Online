export let bulletArray: Bullet[] = [];
import { playerArray } from "./playerClass";
import { frameRatePerSecond } from "./runMovementFrame";
import { getDistance } from "./calDistance";
import { brickArray } from "./bricks";
import { steelArray } from "./steel";
import { sortAndDeduplicateDiagnostics } from "typescript";
import { io } from "../server";

export class Bullet {
  socketID: string;
  w: number = 10; //* size
  h: number = 10;
  dx: number = 0; //* acceration
  dy: number = 0;
  speed: number = 2;
  direction: string = "";
  x: number;
  y: number;
  hp: number = 1;
  bound1: any;
  bound2: any;
  bound3: any;
  bound4: any;
  radius: number = 5;

  constructor(direction: string, x: number, y: number, socketID: string) {
    this.direction = direction;
    this.x = x;
    this.y = y;
    this.bound1 = [this.x - 5, this.y - 5]; //! Chris: I think that this will be better to use objects instead of array, but not a big problem
    this.bound2 = [this.x + 5, this.y - 5];
    this.bound3 = [this.x - 5, this.y + 5];
    this.bound4 = [this.x + 5, this.y + 5];
    this.socketID = socketID;
  }

  fly() {
    if (this.x > 600 || this.x < -1 || this.y > 600 || this.y < -1) {
      this.hp = 0;
      // clearBullet();
    }
    let runFrameRateBulletMovement: ReturnType<typeof setInterval>;
    runFrameRateBulletMovement = setInterval(() => {
      switch (this.direction) {
        case "pointUp":
          this.dy = -this.speed;
          this.y += this.dy;
          this.bound1[1] += this.dy;
          this.bound2[1] += this.dy;
          this.bound3[1] += this.dy;
          this.bound4[1] += this.dy;
          this.direction = "pointUp";
          if (this.y <= 0) {
            this.hp -= 1;
            clearBullet();
          }
          break;
        case "pointDown":
          this.dy = this.speed;
          this.y += this.dy;
          this.bound1[1] += this.dy;
          this.bound2[1] += this.dy;
          this.bound3[1] += this.dy;
          this.bound4[1] += this.dy;
          this.direction = "pointDown";
          if (this.y >= 600) {
            this.hp -= 1;
            clearBullet();
          }
          break;
        case "pointLeft":
          this.dx = -this.speed;
          this.x += this.dx;
          this.bound1[0] += this.dx;
          this.bound2[0] += this.dx;
          this.bound3[0] += this.dx;
          this.bound4[0] += this.dx;
          this.direction = "pointLeft";
          if (this.x <= 0) {
            this.hp -= 1;
            clearBullet();
          }
          break;
        case "pointRight":
          this.dx = this.speed;
          this.x += this.dx;
          this.bound1[0] += this.dx;
          this.bound2[0] += this.dx;
          this.bound3[0] += this.dx;
          this.bound4[0] += this.dx;
          this.direction = "pointRight";
          if (this.x >= 600) {
            this.hp -= 1;
            clearBullet();
          }

          break;
      }
      for (let i = 0; i < playerArray.length; i++) {
        if (
          ((this.bound1[0] > playerArray[i].x_axis[0] &&
            this.bound1[0] < playerArray[i].x_axis[1] &&
            this.bound1[1] > playerArray[i].y_axis[0] &&
            this.bound1[1] < playerArray[i].y_axis[1]) ||
            (this.bound2[0] > playerArray[i].x_axis[0] &&
              this.bound2[0] < playerArray[i].x_axis[1] &&
              this.bound2[1] > playerArray[i].y_axis[0] &&
              this.bound2[1] < playerArray[i].y_axis[1]) ||
            (this.bound3[0] > playerArray[i].x_axis[0] &&
              this.bound3[0] < playerArray[i].x_axis[1] &&
              this.bound3[1] > playerArray[i].y_axis[0] &&
              this.bound3[1] < playerArray[i].y_axis[1]) ||
            (this.bound4[0] > playerArray[i].x_axis[0] &&
              this.bound4[0] < playerArray[i].x_axis[1] &&
              this.bound4[1] > playerArray[i].y_axis[0] &&
              this.bound4[1] < playerArray[i].y_axis[1])) &&
          playerArray[i].hp > 0 &&
          this.hp > 0 
          // &&
          // this.socketID != playerArray[i].socketID
        ) {

          this.hp -= 1;
          playerArray[i].hp -= 1;
          clearBullet();

          if (i == 0) {
            setTimeout(() => {
              io.emit('announce' , 'Green win') 
            }, 100);
            
          } else if (i == 1 ) {
            setTimeout(() => {
              io.emit('announce' , 'Red win') 
            }, 100);
          }


          console.log(playerArray[i].socketID, this.socketID);
        }
      }
      this.hitObs(brickArray);
      this.hitObs(steelArray);
    }, 100 / frameRatePerSecond);
  }
  hitObs(obsArray: any[]) {
    for (let i = 0; i < obsArray.length; i++) {
      let disBulletBrick = getDistance(
        this.x,
        this.y,
        obsArray[i].centerX,
        obsArray[i].centerY
      );

      if (disBulletBrick < obsArray[i].radius + this.radius && this.hp >= 1) {
        switch (obsArray) {
          case brickArray:
            obsArray.splice(i, 1);
            this.hp = 0;
            clearBullet();
            break;
          case steelArray:
            this.hp = 0;
            clearBullet();
            break;
        }
        this.hp = 0;
      }
    }
  }
}

export function clearBullet() {
  for (let g = 0; g < bulletArray.length; g++) {
    if (bulletArray[g].hp <= 0) {
      let removed = bulletArray.splice(g, 1);
      console.log("bingo");
    }
  }
}

export function addBulletToArray(
  direction: string,
  x: number,
  y: number,
  socketID: any
) {
  bulletArray.push(new Bullet(direction, x, y, socketID));
}
