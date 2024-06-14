import {Observable} from "rxjs";
import {IChartApiBase, MouseEventParams, Time} from "lightweight-charts";
import {SubscriptionStreamHandler} from "../subscriptions";
import {ChartSubscriptions} from "./chart.types";


export class ChartStreams<HorzScaleItem = Time> implements ChartSubscriptions<HorzScaleItem> {
  readonly #crossHairMove: SubscriptionStreamHandler<MouseEventParams<HorzScaleItem>>;
  readonly #click: SubscriptionStreamHandler<MouseEventParams<HorzScaleItem>>;
  readonly #dblClick: SubscriptionStreamHandler<MouseEventParams<HorzScaleItem>>;

  readonly crossHairMove$: Observable<MouseEventParams<HorzScaleItem>>;
  readonly click$: Observable<MouseEventParams<HorzScaleItem>>;
  readonly dblClick$: Observable<MouseEventParams<HorzScaleItem>>;


  constructor(chart: IChartApiBase<HorzScaleItem>) {
    this.#crossHairMove = new SubscriptionStreamHandler(
      chart.subscribeCrosshairMove.bind(chart),
      chart.unsubscribeCrosshairMove.bind(chart)
    );
    this.#click = new SubscriptionStreamHandler(
      chart.subscribeClick.bind(chart),
      chart.unsubscribeClick.bind(chart)
    );
    this.#dblClick = new SubscriptionStreamHandler(
      chart.subscribeDblClick.bind(chart),
      chart.unsubscribeClick.bind(chart)
    );

    this.crossHairMove$ = this.#crossHairMove.stream$;
    this.click$ = this.#click.stream$;
    this.dblClick$ = this.#dblClick.stream$;
  }

  destroy(): void {
    this.#crossHairMove.destroy();
    this.#click.destroy();
    this.#dblClick.destroy();
  }
}
