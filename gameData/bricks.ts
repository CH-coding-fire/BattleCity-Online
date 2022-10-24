// import { heightOfCanvas } from "../public/sizeOfcanvas"; //! Why it does not work??

const [heightOfCanvas, widthOfCanvas] = [600, 600]; //*Set the size of the canvas in server, it should be the same as client side
const tileLength = 30; //*The size of one tile is equal to a tank

//* Therefore, there are 600/30 = 20 tiles in a row or column

export let brickArray: Brick[] = [];

export class Brick {
  x_Pos_Tile: number; //*Top left hand corner
  y_Pos_Tile: number; //*Top left hand corner
  w: number = 15; //* The size of bricks are 1/4 of tanks
  h: number = 15;
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  radius: number = 7.5; //! Probably need to be lower, like 6.5
  RightBound_X: number;
  BottomBoundY_Y: number;
  hp: number = 1;
  buildNum = 1;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.x_Pos_Tile = x * 15;
    this.y_Pos_Tile = y * 15;
    this.RightBound_X = this.w + this.x_Pos_Tile;
    this.BottomBoundY_Y = this.h + this.y_Pos_Tile;
    this.centerX = this.x_Pos_Tile + this.w / 2;
    this.centerY = this.y_Pos_Tile + this.h / 2;
  }
}
