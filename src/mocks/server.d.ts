import { SetupServer } from 'msw/node';

declare module '../mocks/server' {
  const server: SetupServer;
  export { server };
}
