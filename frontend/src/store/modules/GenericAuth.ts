import { BasicToken, AuthState } from '@/types/store.ts';

const emptyToken = {
  access: undefined,
  refresh: undefined,
} as BasicToken;

const emptyState = {
  token: emptyToken,
  username: 'Please Login Here',
  loggedIn: false,
} as AuthState;

export default {
  emptyState,
};
