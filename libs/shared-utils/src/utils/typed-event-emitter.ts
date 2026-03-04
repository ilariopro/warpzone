/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventEmitter } from 'events';

interface TypedEventEmitter<Events extends EventMap> {
  addListener<E extends keyof Events>(event: E, listener: Events[E], context?: any): this;
  on<E extends keyof Events>(event: E, listener: Events[E], context?: any): this;
  once<E extends keyof Events>(event: E, listener: Events[E], context?: any): this;
  prependListener<E extends keyof Events>(event: E, listener: Events[E], context?: any): this;
  prependOnceListener<E extends keyof Events>(event: E, listener: Events[E], context?: any): this;

  off<E extends keyof Events>(event: E, listener: Events[E]): this;
  removeAllListeners<E extends keyof Events>(event?: E): this;
  removeListener<E extends keyof Events>(event: E, listener: Events[E]): this;

  emit<E extends keyof Events>(event: E, ...args: Parameters<Events[E]>): boolean;
  eventNames(): (keyof Events | string | symbol)[];
  rawListeners<E extends keyof Events>(event: E): Events[E][];
  listeners<E extends keyof Events>(event: E): Events[E][];
  listenerCount<E extends keyof Events>(event: E): number;

  getMaxListeners(): number;
  setMaxListeners(maxListeners: number): this;
}

type EventMap = {
  [key: string]: (...args: any[]) => void;
};

const createEventEmitter = <T extends EventMap>() => {
  return new EventEmitter() as TypedEventEmitter<T>;
};

export { createEventEmitter, type TypedEventEmitter };
