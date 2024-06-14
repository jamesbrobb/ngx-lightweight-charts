import {TimescaleSubscriptions} from "./timescale.types";
import {ITimeScaleApi, LogicalRange, Range, Time} from "lightweight-charts";
import {SubscriptionStreamHandler} from "../subscriptions";
import {Observable} from "rxjs";


export class TimescaleStreams<HorzScaleItem = Time> implements TimescaleSubscriptions<HorzScaleItem> {
  readonly #visibleTimeRangeChange: SubscriptionStreamHandler<Range<HorzScaleItem> | null>;
  readonly #visibleLogicalRangeChange: SubscriptionStreamHandler<LogicalRange | null>;
  readonly #sizeChange: SubscriptionStreamHandler<number>;

  readonly visibleTimeRangeChange$: Observable<Range<HorzScaleItem> | null>;
  readonly visibleLogicalRangeChange$: Observable<LogicalRange | null>;
  readonly sizeChange$: Observable<number>;


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

    this.visibleTimeRangeChange$ = this.#visibleTimeRangeChange.stream$;
    this.visibleLogicalRangeChange$ = this.#visibleLogicalRangeChange.stream$;
    this.sizeChange$ = this.#sizeChange.stream$;
  }

  destroy(): void {
    this.#visibleTimeRangeChange.destroy();
    this.#visibleLogicalRangeChange.destroy();
    this.#sizeChange.destroy();
  }
}
