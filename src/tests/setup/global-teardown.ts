import { stopDocker } from './docker-manager';

export default async () => {
  console.log('Global Teardown');
  await stopDocker();
};
