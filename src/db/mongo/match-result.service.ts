import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MatchResult, MatchResultDocument } from "./match-result.schema";

@Injectable()
export class MatchResultService {
  constructor(
    @InjectModel(MatchResult.name)
    private matchResultModel: Model<MatchResultDocument>,
  ) {}

  async saveResult(data: MatchResult) {
    const doc = new this.matchResultModel(data);
    return doc.save();
  }
}
