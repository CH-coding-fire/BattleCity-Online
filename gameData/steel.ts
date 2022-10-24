export let steelArray: Steel[] = [];

export class Steel {
  x_Pos_Tile: number;
  y_Pos_Tile: number;
  w: number = 15;
  h: number = 15;
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  radius: number = 7.5;
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
