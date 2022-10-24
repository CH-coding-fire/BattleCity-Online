export let waterArray: Water[] = [];

export class Water {
  x_Pos_Tile: number;
  y_Pos_Tile: number;
  w: number = 15;
  h: number = 15;
  x: number;
  y: number;
  RightBound_X: number;
  BottomBoundY_Y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.x_Pos_Tile = x * 15;
    this.y_Pos_Tile = y * 15;
    this.RightBound_X = this.w + this.x_Pos_Tile;
    this.BottomBoundY_Y = this.h + this.y_Pos_Tile;
  }
}
