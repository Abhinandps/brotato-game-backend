import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("meta")
@Controller("meta")
export class MetaController {
  @Get("websocket")
  @ApiOperation({ summary: "List WebSocket events for this backend" })
  getWebSocketEvents() {
    return {
      namespace: "/",
      incoming: [
        {
          event: "joinRoom",
          payload: { playerId: "string" },
        },
        {
          event: "playerInput",
          payload: {
            roomId: "string",
            playerId: "string",
            dx: "number",
            dy: "number",
            action: "string",
          },
        },
      ],
      outgoing: [
        {
          event: "playerJoined",
          payload: { playerId: "string" },
        },
        {
          event: "stateUpdate",
          payload: {
            roomId: "string",
            players: "Player[]",
            enemies: "Enemy[]",
            state: "WAITING | RUNNING | FINISHED",
          },
        },
        {
          event: "gameEvent",
          payload: {
            roomId: "string",
            type: "matchEnded",
          },
        },
      ],
    };
  }
}
