

export const websocketGatewayOptions = {
  cors: {
    origin: [
      'http://localhost:4200',
      'https://poc-c3-client.netlify.app',
    ],
    credentials: true,
  }
};
