import {Observable, of, Subject, Subscription} from "rxjs";
import {isMultiStreamOutput, isOutputWithData, MultiStream, MultiStreamOutput} from "./multi-stream";

describe('MultiStream', () => {
  let source1: Subject<string>;
  let source2: Subject<string>;
  let source3: Subject<string>;
  let obs1: Observable<string>;
  let obs2: Observable<string>;
  let obs3: Observable<string>;
  let multiStream: MultiStream<string>;
  let sub: Subscription;

  beforeEach(() => {
    source1 = new Subject<string>();
    source2 = new Subject<string>();
    source3 = new Subject<string>();

    obs1 = source1.asObservable();
    obs2 = source2.asObservable();
    obs3 = source3.asObservable();

    multiStream = new MultiStream<string>();
    multiStream.updateObservables([obs1, obs2, obs3]);
  });

  afterEach(() => {
    if(!sub) {
      return;
    }
    sub.unsubscribe();
  });

  it('should emit values when any of supplied sources emit', () => {

    const result: (MultiStreamOutput<string> | undefined)[] = [],
      expectedResult: (MultiStreamOutput<string> | undefined)[] = [
        undefined,
        {source: obs1, data: 'a'},
        {source: obs2, data: 'c'},
        {source: obs3, data: 'd'},
      ];

    sub = multiStream.stream$.subscribe((arg) => {
      result.push(arg);
    });

    source1.next('a');
    source2.next('c');
    source3.next('d');

    result.forEach((arg, index) => {
      expect(arg?.source).toBe(expectedResult[index]?.source);
      expect(arg?.data).toBe(expectedResult[index]?.data);
    });
  });

  it('should no longer observe overwritten observables', () => {

    source1.next('1-a');
    source2.next('2-a');
    source3.next('3-a');

    expect(source1.observed).toBe(true);
    expect(source2.observed).toBe(true);
    expect(source3.observed).toBe(true);

    multiStream.updateObservables([obs2]);

    expect(source1.observed).toBe(false);
    expect(source2.observed).toBe(true);
    expect(source3.observed).toBe(false);

    const result: (MultiStreamOutput<string> | undefined)[] = [];

    sub = multiStream.stream$.subscribe((arg) => {
      result.push(arg);
    });

    source1.next('1-b');
    source2.next('2-b');
    source3.next('3-b');

    expect(result.length).toEqual(2);
    expect(result[1]?.data).toEqual('2-b');
  })

  it('should reset current value to undefined if all observables cleared with an empty array', () => {

    source1.next('a');
    source2.next('c');
    source3.next('d');

    multiStream.updateObservables([]);

    const result: (MultiStreamOutput<string> | undefined)[] = [];

    sub = multiStream.stream$.subscribe((arg) => {
      result.push(arg);
    });

    expect(result).toEqual([undefined]);
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

