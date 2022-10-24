import { brickArray, Brick } from "./bricks";
import { steelArray, Steel } from "./steel";
import { waterArray, Water } from "./water";
import { plantArray, Plant } from "./plant";

export function createEnvironmentOjb(matrixOfMap: number[][]) {
  for (let i: number = 0; i < matrixOfMap.length; i++) {
    for (let j: number = 0; j < matrixOfMap[i].length; j++) {
      let ii: number = i * 2;
      let jj: number = j * 2;
      switch (matrixOfMap[i][j]) {
        case 1:
          brickArray.push(new Brick(jj, ii));
          brickArray.push(new Brick(jj, ii + 1));
          brickArray.push(new Brick(jj + 1, ii));
          brickArray.push(new Brick(jj + 1, ii + 1));
          break;

        case 2:
          steelArray.push(new Steel(jj, ii));
          steelArray.push(new Steel(jj, ii + 1));
          steelArray.push(new Steel(jj + 1, ii));
          steelArray.push(new Steel(jj + 1, ii + 1));
          break;

        case 3:
          waterArray.push(new Water(jj, ii));
          waterArray.push(new Water(jj, ii + 1));
          waterArray.push(new Water(jj + 1, ii));
          waterArray.push(new Water(jj + 1, ii + 1));
          break;
        case 4:
          plantArray.push(new Plant(jj, ii));
          plantArray.push(new Plant(jj, ii + 1));
          plantArray.push(new Plant(jj + 1, ii));
          plantArray.push(new Plant(jj + 1, ii + 1));
          break;

        default:
          break;
      }
    }
  }
}

export let map1: number[][] = [
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 4, 3, 3, 0, 0, 0, 0, 2, 0, 0],
  [0, 0, 4, 0, 0, 0, 0, 0, 0, 4, 4, 3, 3, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 2, 2, 4, 4, 3, 3, 0, 4, 4, 4, 4, 4, 0],
  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 3, 3, 0, 4, 4, 4, 0, 0, 0],
  [4, 0, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0],
  [0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 2, 2, 0, 0],
  [0, 0, 0, 4, 4, 4, 4, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 4, 0, 0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 4, 0, 0, 0, 0],
  [0, 4, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 2, 0, 4, 1, 3, 0],
  [4, 4, 4, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 0],
  [4, 4, 4, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 3, 0],
  [4, 4, 1, 0, 1, 0, 0, 0, 0, 4, 0, 4, 0, 4, 0, 4, 0, 0, 3, 0],
  [4, 4, 4, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 4, 0, 0, 0],
  [0, 4, 0, 0, 1, 0, 2, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 4, 0, 0, 4],
  [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

////Create the map
