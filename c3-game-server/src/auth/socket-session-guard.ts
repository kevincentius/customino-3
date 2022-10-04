// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class SocketSessionGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     console.log('SocketSession activated');
//     const client = context?.switchToWs()?.getClient<ConnectedSocket>();
//     return SocketSessionGuard.verifyToken(
//       this.jwtService,
//       client,
//       client.request['token'],
//     );
//   }

//   static async verifyToken(
//     jwtService: JwtService,
//     socket: ConnectedSocket,
//     token?: string,
//   ) {
//     if (
//       socket.conn.userId &&
//       (await jwtService.verifyAsync(socket.conn.token))
//     ) {
//       return true;
//     }

//     if (!token) return false;

//     socket.conn.token = token;
//     const { sub } = await jwtService.decode(token);
//     socket.conn.userId = sub;
//     console.log(`Setting connection userId to "${sub}"`);
//     return true;
//   }
// }