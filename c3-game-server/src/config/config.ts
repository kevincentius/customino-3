
export const websocketGatewayOptions = {
  cors: {
    origin: [
      process.env.CLIENT_URL ?? 'http://localhost:4200',
    ],
    credentials: true,
  }
};
