import { StateCreator, createStore } from 'zustand';
import {
  DevtoolsOptions,
  PersistOptions,
  devtools,
  persist,
} from 'zustand/middleware';

type Token = string;

type State = {
  token: Token | null;
  refreshToken: Token | null;
};

type Actions = {
  updateTokens: (token: Token | null, refreshToken: Token | null) => void;
  clearTokens: () => void;
};

type SessionState = State & Actions;

const createSessionSlice: StateCreator<
  SessionState,
  [['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  SessionState
> = (set) => ({
  token: null,
  refreshToken: null,
  updateTokens: (token: Token | null, refreshToken: Token | null) =>
    set(
      { token: token || null, refreshToken: refreshToken || null },
      false,
      'updateTokens',
    ),
  clearTokens: () =>
    set({ token: null, refreshToken: null }, false, 'clearTokens'),
});

const persistOptions: PersistOptions<SessionState> = { name: 'session' };
const devtoolsOptions: DevtoolsOptions = { name: 'SessionStore' };

export const sessionStore = createStore<SessionState>()(
  devtools(persist(createSessionSlice, persistOptions), devtoolsOptions),
);

export const hasAccessToken = () => Boolean(sessionStore.getState().token);
export const hasRefreshToken = () =>
  Boolean(sessionStore.getState().refreshToken);

export function accessAuthorizationHeader() {
  if (hasAccessToken()) {
    return { Authorization: `Bearer ${sessionStore.getState().token}` };
  }
}
export function refreshAuthorizationHeader() {
  if (hasRefreshToken()) {
    return { Authorization: `Bearer ${sessionStore.getState().refreshToken}` };
  }
}
