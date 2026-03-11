import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MatchResultDocument = MatchResult & Document;

@Schema({ timestamps: true })
export class MatchResult {
  @Prop({ required: true })
  roomId: string;

  @Prop({ type: Array, required: true })
  players: {
    id: string;
    score: number;
    hp: number;
  }[];

  @Prop({ type: Array, required: true })
  enemies: {
    id: string;
    hp: number;
  }[];

  @Prop({ required: true })
  state: "WAITING" | "RUNNING" | "FINISHED";
}

export const MatchResultSchema = SchemaFactory.createForClass(MatchResult);
