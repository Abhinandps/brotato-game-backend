import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MatchResult, MatchResultSchema } from "./match-result.schema";
import { MatchResultService } from "./match-result.service";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? "<ADD YOUR Mongodb URI>"),
    MongooseModule.forFeature([{ name: MatchResult.name, schema: MatchResultSchema }]),
  ],
  providers: [MatchResultService],
  exports: [MatchResultService],
})
export class MongoModule {}
