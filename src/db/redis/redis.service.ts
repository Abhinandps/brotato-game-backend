import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {

  private pubClient = new Redis();
  private subClient = new Redis();

  publish(channel: string, data: unknown) {
    this.pubClient.publish(channel, JSON.stringify(data));
  }

  async psubscribe(
    pattern: string,
    handler: (channel: string, payload: any) => void,
  ) {
    await this.subClient.psubscribe(pattern);
    this.subClient.on("pmessage", (_pattern, channel, message) => {
      try {
        const payload = JSON.parse(message);
        handler(channel, payload);
      } catch {
        handler(channel, message);
      }
    });
  }

  async onModuleDestroy() {
    await this.pubClient.quit();
    await this.subClient.quit();
  }

}
