import {
  organizeWebinarProvider,
  organizeWebinarDependencies,
} from './organize-webinar.provider';

export const APP_DEPENDENCIES = Array.from(
  new Set([...organizeWebinarDependencies]),
);

export const FEATURES_PROVIDERS = [organizeWebinarProvider];
