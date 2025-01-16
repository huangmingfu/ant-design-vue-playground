export interface Initial {
  serializedState?: string;
  initialized?: () => void;
}

export type SerializeState = Record<string, string> & {
  _o?: UserOptions;
};

export interface UserOptions {
  showHidden?: boolean;
}
