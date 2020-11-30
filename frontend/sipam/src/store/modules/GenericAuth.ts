import { BasicToken, AuthState } from '@/types/store';

const emptyToken = {
  access: undefined,
  refresh: undefined,
} as BasicToken;

const emptyState = {
  token: emptyToken,
  username: 'Please Login Here',
  loggedIn: false,
  authHeader: undefined,
} as AuthState;

export default {
  emptyState,
};
