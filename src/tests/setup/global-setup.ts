import { startDocker } from './docker-manager';

export default async () => {
  console.log('Global Setup');
  await startDocker();
};
