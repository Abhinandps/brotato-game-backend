import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {

 client = new Redis();

 publish(channel: string, data: any) {
   this.client.publish(channel, JSON.stringify(data))
 }

}
