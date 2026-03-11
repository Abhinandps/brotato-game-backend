import { Enemy } from "../game/enemy.interface";
import { Player } from "../player/player.interface";

export interface Room {
  id: string;
  players: Map<string, Player>;
  enemies: Map<string, Enemy>;
  state: "WAITING" | "RUNNING" | "FINISHED";
}
