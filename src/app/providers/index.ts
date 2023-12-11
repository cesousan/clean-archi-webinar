import {
  authDependencies,
  authProvider,
  authGuardProvider,
} from './auth.provider';
import {
  organizeWebinarProvider,
  organizeWebinarDependencies,
} from './organize-webinar.provider';

export const APP_DEPENDENCIES = Array.from(
  new Set([...organizeWebinarDependencies, ...authDependencies]),
);

export const FEATURES_PROVIDERS = [
  organizeWebinarProvider,
  authProvider,
  authGuardProvider,
];
