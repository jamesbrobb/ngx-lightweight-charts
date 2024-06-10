import {TimescaleSubscriptions} from "./timescale.types";
import {ITimeScaleApi, LogicalRange, Range, Time} from "lightweight-charts";
import {SubscriptionStreamHandler} from "../subscriptions";
import {Observable} from "rxjs";


export class TimescaleStreams implements TimescaleSubscriptions {
  readonly #visibleTimeRangeChange: SubscriptionStreamHandler<Range<Time> | null>;
  readonly #visibleLogicalRangeChange: SubscriptionStreamHandler<LogicalRange | null>;
  readonly #sizeChange: SubscriptionStreamHandler<number>;

  get visibleTimeRangeChange$(): Observable<Range<Time> | null> {
    return this.#visibleTimeRangeChange.stream$;
  }

  get visibleLogicalRangeChange$(): Observable<LogicalRange | null> {
    return this.#visibleLogicalRangeChange.stream$;
  }

  get sizeChange$(): Observable<number> {
    return this.#sizeChange.stream$;
  }

  constructor(timescale: ITimeScaleApi<Time>) {
    this.#visibleTimeRangeChange = new SubscriptionStreamHandler(
      timescale.subscribeVisibleTimeRangeChange,
      timescale.unsubscribeVisibleTimeRangeChange
    );
    this.#visibleLogicalRangeChange = new SubscriptionStreamHandler(
      timescale.subscribeVisibleLogicalRangeChange,
      timescale.unsubscribeVisibleLogicalRangeChange
    );
    this.#sizeChange = new SubscriptionStreamHandler(
      timescale.subscribeSizeChange,
      timescale.unsubscribeSizeChange
    );
  }

  destroy(): void {
    this.#visibleTimeRangeChange.destroy();
    this.#visibleLogicalRangeChange.destroy();
    this.#sizeChange.destroy();
  }
}
