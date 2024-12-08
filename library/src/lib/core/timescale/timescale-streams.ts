import {Observable} from "rxjs";
import {TimescaleSubscriptions} from "./timescale.types";
import {ITimeScaleApi, LogicalRange, Range, Time} from "lightweight-charts";
import {SubscriptionStreamHandler} from "../subscriptions";


export class TimescaleStreams<HorzScaleItem = Time> implements TimescaleSubscriptions<HorzScaleItem> {
  readonly #visibleTimeRangeChange: SubscriptionStreamHandler<Range<HorzScaleItem> | null>;
  readonly #visibleLogicalRangeChange: SubscriptionStreamHandler<LogicalRange | null>;
  readonly #sizeChange: SubscriptionStreamHandler<number>;

  get visibleTimeRangeChange$(): Observable<Range<HorzScaleItem> | null> {
    return this.#visibleTimeRangeChange.stream$;
  }

  get visibleLogicalRangeChange$(): Observable<LogicalRange | null> {
    return this.#visibleLogicalRangeChange.stream$;
  }

  get sizeChange$(): Observable<number> {
    return this.#sizeChange.stream$;
  }

  constructor(timescale: ITimeScaleApi<HorzScaleItem>) {
    this.#visibleTimeRangeChange = new SubscriptionStreamHandler(
      timescale.subscribeVisibleTimeRangeChange.bind(timescale),
      timescale.unsubscribeVisibleTimeRangeChange.bind(timescale)
    );
    this.#visibleLogicalRangeChange = new SubscriptionStreamHandler(
      timescale.subscribeVisibleLogicalRangeChange.bind(timescale),
      timescale.unsubscribeVisibleLogicalRangeChange.bind(timescale)
    );
    this.#sizeChange = new SubscriptionStreamHandler(
      timescale.subscribeSizeChange.bind(timescale),
      timescale.unsubscribeSizeChange.bind(timescale)
    );
  }

  destroy(): void {
    this.#visibleTimeRangeChange.destroy();
    this.#visibleLogicalRangeChange.destroy();
    this.#sizeChange.destroy();
  }
}
