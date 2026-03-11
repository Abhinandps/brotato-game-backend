import { Enemy } from "./enemy.interface";
import { Player } from "../player/player.interface";

export function randomX(): number {
  return Math.floor(Math.random() * 1000);
}

export function randomY(): number {
  return Math.floor(Math.random() * 1000);
}

export function distance(a: Player, b: Enemy): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}
