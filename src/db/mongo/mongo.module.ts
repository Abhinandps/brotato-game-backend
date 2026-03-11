import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MatchResult, MatchResultSchema } from "./match-result.schema";
import { MatchResultService } from "./match-result.service";

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? "mongodb+srv://psabhinand333s_db_user:k5uzC8LO0duJeRXX@cluster0.n5tiw9k.mongodb.net/game"),
    MongooseModule.forFeature([{ name: MatchResult.name, schema: MatchResultSchema }]),
  ],
  providers: [MatchResultService],
  exports: [MatchResultService],
})
export class MongoModule {}
