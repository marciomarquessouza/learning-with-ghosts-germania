import mitt from "mitt";

export type AsyncHandler<Payload> = (
  payload: Payload,
  done: () => void,
) => void | Promise<void>;

export type EventMap = Record<string, unknown>;

/**
    * @example
    * type Events = {
    *   "eliza/lesson:sowing": undefined;
    * };
    * 
    * const lessonEvents = createAsyncMitt<Events>();
    * 
    * lessonEvents.on("eliza/lesson:sowing", ({ onFinish }, done) => {
    *   // ... animation / logic ...
    *   onFinish();
    *   done(); // REQUIRED: resolves the emitAsync
    * });
    * 
    * console.log("Before Animation")
    * await lessonEvents.emitAsync("eliza/lesson:sowing";
    * console.log("After Animation")
 */
export function createAsyncMitt<Events extends EventMap>() {
  type InternalEvents = {
    [K in keyof Events]: { payload: Events[K]; done: () => void };
  };

  const emitter = mitt<InternalEvents>();

  const handlerMap = new Map<
    keyof Events,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Map<AsyncHandler<any>, any> // For internal library use. It's not worth the effort to correct this type.
  >();

  function on<K extends keyof Events>(
    type: K,
    handler: AsyncHandler<Events[K]>,
  ) {
    const wrapper = async ({ payload, done }: InternalEvents[K]) => {
      await handler(payload, done);
    };

    if (!handlerMap.has(type)) {
      handlerMap.set(type, new Map());
    }

    handlerMap.get(type)!.set(handler, wrapper);
    emitter.on(type, wrapper);
  }

  function off<K extends keyof Events>(
    type: K,
    handler: AsyncHandler<Events[K]>,
  ) {
    const typeMap = handlerMap.get(type);
    if (!typeMap) return;

    const wrapper = typeMap.get(handler);
    if (!wrapper) return;

    emitter.off(type, wrapper);
    typeMap.delete(handler);

    if (typeMap.size === 0) {
      handlerMap.delete(type);
    }
  }

  function emitAsync<K extends keyof Events>(
    type: K,
    payload: Events[K],
  ): Promise<void> {
    return new Promise((resolve) => {
      let resolved = false;

      const done = () => {
        if (resolved) return;
        resolved = true;
        resolve();
      };

      emitter.emit(type, { payload, done });
    });
  }

  return { on, off, emitAsync };
}
