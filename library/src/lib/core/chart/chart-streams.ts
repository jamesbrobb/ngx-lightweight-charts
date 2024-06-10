import {Observable} from "rxjs";
import {IChartApi, MouseEventParams, Time} from "lightweight-charts";
import {SubscriptionStreamHandler} from "../subscriptions";
import {ChartSubscriptions} from "./chart.types";


export class ChartStreams implements ChartSubscriptions {
  readonly #crossHairMove: SubscriptionStreamHandler<MouseEventParams<Time>>;
  readonly #click: SubscriptionStreamHandler<MouseEventParams<Time>>;
  readonly #dblClick: SubscriptionStreamHandler<MouseEventParams<Time>>;

  get crossHairMove$(): Observable<MouseEventParams<Time>> {
    return this.#crossHairMove.stream$;
  }

  get click$(): Observable<MouseEventParams<Time>> {
    return this.#click.stream$;
  }

  get dblClick$(): Observable<MouseEventParams<Time>> {
    return this.#dblClick.stream$;
  }

  constructor(chart: IChartApi) {
    this.#crossHairMove = new SubscriptionStreamHandler(
      chart.subscribeCrosshairMove,
      chart.unsubscribeCrosshairMove
    );
    this.#click = new SubscriptionStreamHandler(
      chart.subscribeClick,
      chart.unsubscribeClick
    );
    this.#dblClick = new SubscriptionStreamHandler(
      chart.subscribeCrosshairMove,
      chart.unsubscribeCrosshairMove
    );
  }

  destroy(): void {
    this.#crossHairMove.destroy();
    this.#click.destroy();
    this.#dblClick.destroy();
  }
}
