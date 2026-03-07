export type EventMap = Record<string, unknown>;

export type BaseEventMap = Record<string, unknown>;

export type SyncEventMap = BaseEventMap;

export type ClearEvent = { remove: () => void };

export type AsyncEventMap = {
  [K in keyof BaseEventMap]: {
    data: BaseEventMap[K];
    done: () => void;
  };
};

export type SyncHandler<Payload> = (payload: Payload) => void;
export type AsyncHandler<Payload> = (
  payload: Payload,
  done: () => void,
) => void | Promise<void>;
