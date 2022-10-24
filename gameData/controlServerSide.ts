import playerClass, {
  findRoomAndAddPlayerInArray,
  playerArray,
} from "./playerClass";

export let selectControlTarget = function (modeNum: any) {
  for (let i = 0; i < playerArray.length; i++) {
    if (playerArray[i] == modeNum) {
      return playerArray[i];
    }
  }
  return null;
};
