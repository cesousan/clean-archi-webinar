import * as path from 'path';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';

let instance: StartedDockerComposeEnvironment | null = null;

export const startDocker = async () => {
  const composeFilePath = path.resolve(__dirname);
  const composeFileName = 'docker-compose.yml';
  instance = await new DockerComposeEnvironment(
    composeFilePath,
    composeFileName,
  ).up();
};

export const stopDocker = async () => {
  if (!instance) {
    return;
  }
  try {
    await instance.down();
    instance = null;
  } catch (error) {
    console.error('Error stopping docker env', error);
  }
};

export const getDockerEnvironment = () => {
  if (!instance) {
    throw new Error('Docker environment not available');
  }
  return instance;
};
