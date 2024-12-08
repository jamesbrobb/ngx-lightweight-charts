import {map, Observable, of, Subject, Subscription, tap} from "rxjs";
import {isMultiStreamOutput, isOutputWithData, MultiStream, MultiStreamOutput} from "./multi-stream";
import { TestScheduler } from "rxjs/testing";

describe('MultiStream', () => {
  let source1: Subject<string>;
  let source2: Subject<string>;
  let source3: Subject<string>;
  let obs1: Observable<string>;
  let obs2: Observable<string>;
  let obs3: Observable<string>;
  let multiStream: MultiStream<string>;
  let sub: Subscription;

  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  beforeEach(() => {
    source1 = new Subject<string>();
    source2 = new Subject<string>();
    source3 = new Subject<string>();

    obs1 = source1.asObservable();
    obs2 = source2.asObservable();
    obs3 = source3.asObservable();

    multiStream = new MultiStream<string>();
    multiStream.setObservables([obs1, obs2, obs3]);
  });

  afterEach(() => {
    if(!sub) {
      return;
    }
    sub.unsubscribe();
  });

  it('should emit values when any of supplied sources emit', () => {

    testScheduler.run(({ hot, expectObservable }) => {
      const source1$ = hot('a---b---c---|');
      const source2$ = hot('-d---e---f--|');
      const source3$ = hot('--g---h---i-|');
      const expected = 'adg-beh-cfi-|';

      const multiStream = new MultiStream<string>();
      multiStream.setObservables([source1$, source2$, source3$]);

      expectObservable(multiStream.stream$).toBe(expected, {
        a: {source: source1$, data: 'a'},
        b: {source: source1$, data: 'b'},
        c: {source: source1$, data: 'c'},
        d: {source: source2$, data: 'd'},
        e: {source: source2$, data: 'e'},
        f: {source: source2$, data: 'f'},
        g: {source: source3$, data: 'g'},
        h: {source: source3$, data: 'h'},
        i: {source: source3$, data: 'i'}
      });
    });
  });

  it('should no longer observe overwritten observables', () => {
    /*testScheduler.run(({ hot, expectObservable }) => {
      const source1$ = hot('a-b-c-|', {
        a: '1-a',
        b: '1-b',
        c: '1-c'
      });
      const source2$ = hot('d-e-f-|', {
        d: '2-a',
        e: '2-b',
        f: '2-c'
      });
      const source3$ = hot('g-h-i-|', {
        g: '3-a',
        h: '3-b',
        i: '3-c'
      });

      const multiStream = new MultiStream<string>();

      // Start with all sources
      multiStream.setObservables([source1$, source2$, source3$]);

      // At frame 4, switch to just source2$
      hot('---x-|').subscribe(() => {
        multiStream.setObservables([source2$]);
      });

      const expected = 'adg-(e)-f-|';

      expectObservable(multiStream.stream$).toBe(expected, {
        a: {source: source1$, data: '1-a'},
        d: {source: source2$, data: '2-a'},
        g: {source: source3$, data: '3-a'},
        e: {source: source2$, data: '2-b'},
        f: {source: source2$, data: '2-c'}
      });
    });*/
    const result: (MultiStreamOutput<string> | undefined)[] = [];

    sub = multiStream.stream$.subscribe((arg) => {
      result.push(arg);
    });

    source1.next('1-a');
    source2.next('2-a');
    source3.next('3-a');

    expect(source1.observed).toBe(true);
    expect(source2.observed).toBe(true);
    expect(source3.observed).toBe(true);

    multiStream.setObservables([obs2]);

    expect(source1.observed).toBe(false);
    expect(source2.observed).toBe(true);
    expect(source3.observed).toBe(false);

    source1.next('1-b');
    source2.next('2-b');
    source3.next('3-b');

    expect(result.length).toEqual(4);
    expect(result[result.length - 1]?.data).toEqual('2-b');
  });

  it('should not save previous values', () => {

    source1.next('a');
    source2.next('c');
    source3.next('d');

    multiStream.setObservables([]);

    const result: (MultiStreamOutput<string> | undefined)[] = [];

    sub = multiStream.stream$.subscribe((arg) => {
      result.push(arg);
    });

    expect(result).toEqual([]);
  });

  it('should unsubscribe all supplied observables on destroy', () => {

    expect(source1.observed).toBe(true);
    expect(source2.observed).toBe(true);
    expect(source3.observed).toBe(true);

    multiStream.destroy();

    expect(source1.observed).toBe(false)
    expect(source2.observed).toBe(false);
    expect(source3.observed).toBe(false);
  });

  it('should close all subscriptions to stream$ on destroy', () => {

    const sub1 = multiStream.stream$.subscribe();
    const sub2 = multiStream.stream$.subscribe();

    expect(sub1.closed).toBe(false);
    expect(sub2.closed).toBe(false);

    multiStream.destroy();

    expect(sub1.closed).toBe(true);
    expect(sub2.closed).toBe(true);
  });
});

describe('isMultiStreamOutput', () => {

  it('should correctly identify MultiStreamOutput', () => {

    const validOutput1: MultiStreamOutput<number[]> = {
      source: of(),
      data: [1, 2, 3],
    };

    const validOutput2: MultiStreamOutput<string[]> = {
      source: of(),
      data: ["1", "2", "3"],
    };

    expect(isMultiStreamOutput(validOutput1)).toBe(true);
    expect(isMultiStreamOutput(validOutput2)).toBe(true);
  });

  it('should return false for undefined', () => {
    expect(isMultiStreamOutput(undefined)).toBe(false);
  });
});

describe('isOutputWithData', () => {
  it('should return true for output with data', () => {
    const outputWithData: MultiStreamOutput<number[]> = {
      source: of(),
      data: [1, 2, 3],
    };
    expect(isOutputWithData(outputWithData)).toBe(true);
  });

  it('should return false for output without data', () => {
    const outputWithoutData: MultiStreamOutput<null> = {
      source: of(),
      data: null
    };
    expect(isOutputWithData(outputWithoutData)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isOutputWithData(undefined)).toBe(false);
  });
});

