import { SubscriptionStreamHandler } from "./subscription-stream-handler";
import {tap} from "rxjs";


describe('SubscriptionStreamHandler', () => {

  it('should subscribe to the supplied handler once subscribed', () => {
    const subFn = jest.fn(),
      unsubFn = jest.fn(),
      sub = new SubscriptionStreamHandler(
        subFn,
        unsubFn
      );

    const subscription = sub.stream$.subscribe();

    expect(subFn).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
  });

  it('should call the supplied unsubscribe function once there are no more subscriptions', () => {
    const subFn = jest.fn(),
      unsubFn = jest.fn(),
      sub = new SubscriptionStreamHandler(
        subFn,
        unsubFn
      );

    const subscription = sub.stream$.subscribe();
    subscription.unsubscribe();

    expect(unsubFn).toHaveBeenCalledTimes(1);
  });

  it('should re-subscribe to the handler if all subscriptions are unsubscribed and then a new subscriber is added', () => {
    const subFn = jest.fn(),
      unsubFn = jest.fn(),
      sub = new SubscriptionStreamHandler(
        subFn,
        unsubFn
      );

    let subscription = sub.stream$.subscribe();
    subscription.unsubscribe();
    subscription = sub.stream$.subscribe();

    expect(subFn).toHaveBeenCalledTimes(2);

    subscription.unsubscribe();
  });

  it('should be multicast', (done) => {
    const subFn = jest.fn(),
      unsubFn = jest.fn(),
      sub = new SubscriptionStreamHandler(
        subFn,
        unsubFn
      ),
      stream = sub.stream$.pipe(tap({
        /*subscribe: () => console.log('SUBSCRIBED'),
        unsubscribe: () => console.log('UNSUBSCRIBED'),
        finalize: () => console.log('FINALIZE'),*/
      })),
    subscription1 = stream.subscribe(),
    subscription2 = stream.subscribe();

    done();
  });

  it('should output the params of the supplied handler function', (done) => {

    let handlerFn: any;

    const testParam = { value: 'test' },
      subscribeFn = jest.fn((handler: (param: any) => void) => {
        handlerFn = handler;
      }),
      unsubscribeFn = jest.fn(),
      sub = new SubscriptionStreamHandler<typeof testParam>(
        subscribeFn,
        unsubscribeFn
      ),
      subscription = sub.stream$.subscribe((param: typeof testParam) => {
        expect(param).toEqual(testParam);
        subscription.unsubscribe();
        done();
      });

    if(!handlerFn) {
      return;
    }

    /*
     * lightweight-charts passes 3 separate params to a handler function
     * BUT
     * fromEventPattern forwards all params as ...params
     * So we need to pass an array of 3 params to the handler to simulate this behaviour
     */
    handlerFn([testParam, undefined, undefined]);
  });

  it('should complete and unsubscribe all subscriptions on destroy', () => {
    const subFn = jest.fn(),
      unsubFn = jest.fn(),
      sub = new SubscriptionStreamHandler(
        subFn,
        unsubFn
      ),
      subscription1 = sub.stream$.subscribe(),
      subscription2 = sub.stream$.subscribe();

    sub.destroy();

    expect(subscription1.closed).toEqual(true);
    expect(subscription2.closed).toEqual(true);

    const subscription3 = sub.stream$.subscribe();

    expect(subscription3.closed).toEqual(true);
  });
});
