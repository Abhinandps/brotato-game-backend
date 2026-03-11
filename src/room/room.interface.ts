import { Enemy } from "../game/enemy.interface";
import { GameInput } from "../game/game-input.interface";
import { Player } from "../player/player.interface";

export interface Room {
  id: string;
  players: Map<string, Player>;
  enemies: Map<string, Enemy>;
  inputs: GameInput[];
  resultSaved: boolean;
  state: "WAITING" | "RUNNING" | "FINISHED";
}
