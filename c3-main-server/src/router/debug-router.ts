import { DebugResponse } from "@shared/debug-response";
import { Request, Response, Router } from "express";

export const debugRouter = Router();

debugRouter.get('/test', (req: Request, res: Response) => {
  res.send({
    gameServerUrl: process.env.DEPLOYMENT == 'LIVE' ? 'https://poc-c3-game-server.herokuapp.com' : 'http://localhost:3001',
    debugMessage: 'Hello from the main server (REST API)',
  } as DebugResponse);
});
