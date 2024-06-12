import {Observable} from "rxjs";
import {IChartApiBase, MouseEventParams, Time} from "lightweight-charts";
import {SubscriptionStreamHandler} from "../subscriptions";
import {ChartSubscriptions} from "./chart.types";


export class ChartStreams<HorzScaleItem = Time> implements ChartSubscriptions<HorzScaleItem> {
  readonly #crossHairMove: SubscriptionStreamHandler<MouseEventParams<HorzScaleItem>>;
  readonly #click: SubscriptionStreamHandler<MouseEventParams<HorzScaleItem>>;
  readonly #dblClick: SubscriptionStreamHandler<MouseEventParams<HorzScaleItem>>;

  get crossHairMove$(): Observable<MouseEventParams<HorzScaleItem>> {
    return this.#crossHairMove.stream$;
  }

  get click$(): Observable<MouseEventParams<HorzScaleItem>> {
    return this.#click.stream$;
  }

  get dblClick$(): Observable<MouseEventParams<HorzScaleItem>> {
    return this.#dblClick.stream$;
  }

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
  }

  destroy(): void {
    this.#crossHairMove.destroy();
    this.#click.destroy();
    this.#dblClick.destroy();
  }
}
