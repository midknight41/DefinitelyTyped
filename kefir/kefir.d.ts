// Type definitions for Kefir 3.3.0
// Project: http://rpominov.github.io/kefir/
// Definitions by: Aya Morisawa <https://github.com/AyaMorisawa>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference path="../node/node.d.ts" />

declare module "kefir" {

	export interface Subscription {
		unsubscribe(): void;
		closed: boolean; // Actually, `readonly` but it's avaiable in tsc starting with 2.0.0
	}

	export interface Observer<T, S> {
		value?: (value: T) => void;
		error?: (error: S) => void;
		end?: () => void;
	}

	export interface Observable<T, S> {
		// Subscribe / add side effects
		onValue(callback: (value: T) => void): void;
		offValue(callback: (value: T) => void): void;
		onError(callback: (error: S) => void): void;
		offError(callback: (error: S) => void): void;
		onEnd(callback: () => void): void;
		offEnd(callback: () => void): void;
		onAny(callback: (event: Event<T | S>) => void): void;
		offAny(callback: (event: Event<T | S>) => void): void;
		log(name?: string): void;
		offLog(name?: string): void;
		flatten<U>(transformer?: (value: T) => U[]): Stream<U, S>;
		toPromise(PromiseConstructor?: any): any;
		toESObservable(): any;
		// This method is designed to replace all other methods for subscribing
		observe(params: Observer<T, S>): Subscription;
		observe(
			onValue?: (value: T) => void,
			onError?: (error: S) => void,
			onEnd?: () => void
		): Subscription;
	}

	export interface Stream<T, S> extends Observable<T, S> {
		toProperty(getCurrent?: () => T): Property<T, S>;

		// Modify an stream
		map<U>(fn: (value: T) => U): Stream<U, S>;
		filter(predicate?: (value: T) => boolean): Stream<T, S>;
		take(n: number): Stream<T, S>;
		takeWhile(predicate?: (value: T) => boolean): Stream<T, S>;
		last(): Stream<T, S>;
		skip(n: number): Stream<T, S>;
		skipWhile(predicate?: (value: T) => boolean): Stream<T, S>;
		skipDuplicates(comparator?: (a: T, b: T) => boolean): Stream<T, S>;
		diff(fn?: (prev: T, next: T) => T, seed?: T): Stream<T, S>;
		scan(fn: (prev: T, next: T) => T, seed?: T): Stream<T, S>;
		delay(wait: number): Stream<T, S>;
		throttle(wait: number, options?: {leading?: boolean, trailing?: boolean}): Stream<T, S>;
		debounce(wait: number, options?: {immediate: boolean}): Stream<T, S>;
		valuesToErrors<U>(handler?: (value: T) => {convert: boolean, error: U}): Stream<void, S | U>;
		errorsToValues<U>(handler?: (error: S) => {convert: boolean, value: U}): Stream<T | U, void>;
		mapErrors<U>(fn: (error: S) => U): Stream<T, U>;
		filterErrors(predicate?: (error: S) => boolean): Stream<T, S>;
		endOnError(): Stream<T, S>;
		takeErrors(n: number): Stream<T, S>;
		ignoreValues(): Stream<void, S>;
		ignoreErrors(): Stream<T, void>;
		ignoreEnd(): Stream<T, S>;
		beforeEnd<U>(fn: () => U): Stream<T | U, S>;
		slidingWindow(max: number, mix?: number): Stream<T[], S>;
		bufferWhile(predicate: (value: T) => boolean): Stream<T[], S>;
		bufferWithCount(count: number, options?: {flushOnEnd: boolean}): Stream<T[], S>;
		bufferWithTimeOrCount(interval: number, count: number, options?: {flushOnEnd: boolean}): Stream<T[], S>;
		transduce<U>(transducer: any): Stream<U, S>;
		withHandler<U, V>(handler: (emitter: Emitter<U, S>, event: Event<T | S>) => void): Stream<U, S>;

		// Combine streams
		combine<U, V, W>(otherObs: Stream<U, V>, combinator?: (value: T, ...values: U[]) => W): Stream<W, S | V>;
		zip<U, V, W>(otherObs: Stream<U, V>, combinator?: (value: T, ...values: U[]) => W): Stream<W, S | V>;
		merge<U, V>(otherObs: Stream<U, V>): Stream<T | U, S | V>;
		concat<U, V>(otherObs: Stream<U, V>): Stream<T | U, S | V>;
		flatMap<U, V>(transform: (value: T) => Stream<U, V>): Stream<U, V>;
		flatMapLatest<U, V>(fn: (value: T) => Stream<U, V>): Stream<U, V>;
		flatMapFirst<U, V>(fn: (value: T) => Stream<U, V>): Stream<U, V>;
		flatMapConcat<U, V>(fn: (value: T) => Stream<U, V>): Stream<U, V>;
		flatMapConcurLimit<U, V>(fn: (value: T) => Stream<U, V>, limit: number): Stream<U, V>;
		flatMapErrors<U, V>(transform: (error: S) => Stream<U, V>): Stream<U, V>;

		// Combine two streams
		filterBy<U>(otherObs: Observable<boolean, U>): Stream<T, S>;
		sampledBy<U, V, W>(otherObs: Observable<U, V>, combinator?: (a: T, b: U) => W): Stream<W, S>;
		skipUntilBy<U, V>(otherObs: Observable<U, V>): Stream<U, V>;
		takeUntilBy<U, V>(otherObs: Observable<U, V>): Stream<U, V>;
		bufferBy<U, V>(otherObs: Observable<U, V>, options?: {flushOnEnd: boolean}): Stream<T[], S>;
		bufferWhileBy<U>(otherObs: Observable<boolean, U>, options?: {flushOnEnd?: boolean, flushOnChange?: boolean}): Stream<T[], S>;
		awaiting<U, V>(otherObs: Observable<U, V>): Stream<boolean, S>;
	}

	export interface Property<T, S> extends Observable<T, S> {
		changes(): Stream<T, S>;

		// Modify an property
		map<U>(fn: (value: T) => U): Property<U, S>;
		filter(predicate?: (value: T) => boolean): Property<T, S>;
		take(n: number): Property<T, S>;
		takeWhile(predicate?: (value: T) => boolean): Property<T, S>;
		last(): Property<T, S>;
		skip(n: number): Property<T, S>;
		skipWhile(predicate?: (value: T) => boolean): Property<T, S>;
		skipDuplicates(comparator?: (a: T, b: T) => boolean): Property<T, S>;
		diff(fn?: (prev: T, next: T) => T, seed?: T): Property<T, S>;
		scan(fn: (prev: T, next: T) => T, seed?: T): Property<T, S>;
		delay(wait: number): Property<T, S>;
		throttle(wait: number, options?: {leading?: boolean, trailing?: boolean}): Property<T, S>;
		debounce(wait: number, options?: {immediate: boolean}): Property<T, S>;
		valuesToErrors<U>(handler?: (value: T) => {convert: boolean, error: U}): Property<void, S | U>;
		errorsToValues<U>(handler?: (error: S) => {convert: boolean, value: U}): Property<T | U, void>;
		mapErrors<U>(fn: (error: S) => U): Property<T, U>;
		filterErrors(predicate?: (error: S) => boolean): Property<T, S>;
		endOnError(): Property<T, S>;
		takeErrors(n: number): Stream<T, S>;
		ignoreValues(): Property<void, S>;
		ignoreErrors(): Property<T, void>;
		ignoreEnd(): Property<T, S>;
		beforeEnd<U>(fn: () => U): Property<T | U, S>;
		slidingWindow(max: number, mix?: number): Property<T[], S>;
		bufferWhile(predicate: (value: T) => boolean): Property<T[], S>;
		bufferWithCount(count: number, options?: {flushOnEnd: boolean}): Property<T[], S>;
		bufferWithTimeOrCount(interval: number, count: number, options?: {flushOnEnd: boolean}): Property<T[], S>;
		transduce<U>(transducer: any): Property<U, S>;
		withHandler<U, V>(handler: (emitter: Emitter<T, S>, event: Event<T | S>) => void): Property<U, S>;

		// Combine properties
		combine<U, V, W>(otherObs: Property<U, V>, combinator?: (value: T, ...values: U[]) => W): Property<W, S | V>;
		zip<U, V, W>(otherObs: Property<U, V>, combinator?: (value: T, ...values: U[]) => W): Property<W, S | V>;
		merge<U, V>(otherObs: Property<U, V>): Property<T | U, S | V>;
		concat<U, V>(otherObs: Property<U, V>): Property<T | U, S | V>;
		flatMap<U, V>(transform: (value: T) => Property<U, V>): Property<U, V>;
		flatMapLatest<U, V>(fn: (value: T) => Property<U, V>): Property<U, V>;
		flatMapFirst<U, V>(fn: (value: T) => Property<U, V>): Property<U, V>;
		flatMapConcat<U, V>(fn: (value: T) => Property<U, V>): Property<U, V>;
		flatMapConcurLimit<U, V>(fn: (value: T) => Property<U, V>, limit: number): Property<U, V>;
		flatMapErrors<U, V>(transform: (error: S) => Property<U, V>): Property<U, V>;

		// Combine two properties
		filterBy<U>(otherObs: Observable<boolean, U>): Property<T, S>;
		sampledBy<U, V, W>(otherObs: Observable<U, V>, combinator?: (a: T, b: U) => W): Property<W, S>;
		skipUntilBy<U, V>(otherObs: Observable<U, V>): Property<U, V>;
		takeUntilBy<U, V>(otherObs: Observable<U, V>): Property<U, V>;
		bufferBy<U, V>(otherObs: Observable<U, V>, options?: {flushOnEnd: boolean}): Property<T[], S>;
		bufferWhileBy<U>(otherObs: Observable<boolean, U>, options?: {flushOnEnd?: boolean, flushOnChange?: boolean}): Property<T[], S>;
		awaiting<U, V>(otherObs: Observable<U, V>): Property<boolean, S>;
	}

	export interface ObservablePool<T, S> extends Observable<T, S> {
		plug(obs: Observable<T, S>): void;
		unPlug(obs: Observable<T, S>): void;
	}

	export interface Event<T> {
		type: string;
		value: T;
	}

	export interface Emitter<T, S> {
		emit(value: T): void;
		error(error: S): void;
		end(): void;
		emitEvent(event: {type: string, value: T | S}): void;
	}

	// Create a stream
	export function never(): Stream<void, void>;
	export function later<T>(wait: number, value: T): Stream<T, void>;
	export function interval<T>(interval: number, value: T): Stream<T, void>;
	export function sequentially<T>(interval: number, values: T[]): Stream<T, void>;
	export function fromPoll<T>(interval: number, fn: () => T): Stream<T, void>;
	export function withInterval<T, S>(interval: number, handler: (emitter: Emitter<T, S>) => void): Stream<T, S>;
	export function fromCallback<T>(fn: (callback: (value: T) => void) => void): Stream<T, void>;
	export function fromNodeCallback<T, S>(fn: (callback: (error: S, result: T) => void) => void): Stream<T, S>;
	export function fromEvents<T, S>(target: EventTarget | NodeJS.EventEmitter | { on: Function, off: Function }, eventName: string, transform?: (value: T) => S): Stream<T, S>;
	export function stream<T, S>(subscribe: (emitter: Emitter<T, S>) => Function | void): Stream<T, S>;
	export function fromESObservable<T, S>(observable: any): Stream<T, S>

	// Create a property
	export function constant<T>(value: T): Property<T, void>;
	export function constantError<T>(error: T): Property<void, T>;
	export function fromPromise<T, S>(promise: any): Property<T, S>;

	// Combine observables
	export function combine<T, S, U>(obss: Observable<T, S>[], passiveObss: Observable<T, S>[], combinator?: (...values: T[]) => U): Observable<U, S>;
	export function combine<T, S, U>(obss: Observable<T, S>[], combinator?: (...values: T[]) => U): Observable<U, S>;
	export function zip<T, S, U>(obss: Observable<T, S>[], passiveObss?: Observable<T, S>[], combinator?: (...values: T[]) => U): Observable<U, S>;
	export function merge<T, S>(obss: Observable<T, S>[]): Observable<T, S>;
	export function concat<T, S>(obss: Observable<T, S>[]): Observable<T, S>;
	export function pool<T, S>(): ObservablePool<T, S>;
	export function repeat<T, S>(generator: (i: number) => Observable<T, S> | boolean): Observable<T, S>;
}
