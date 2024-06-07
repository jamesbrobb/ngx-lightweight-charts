import {MouseEventParams, SeriesType, Time} from "lightweight-charts";
import {SubscriptionHandler} from "./subscription-stream-handler";
import {TVChart} from "../charts";


export class ChartClickHandler<T extends SeriesType> implements SubscriptionHandler<MouseEventParams<Time>> {

  readonly #chart: TVChart<T>;

  constructor(chart: TVChart<T>) {
    this.#chart = chart;
  }

  subscribe(handler: (arg: MouseEventParams<Time>) => void): void {
    this.#chart.chart?.subscribeClick(handler);
  }

  unsubscribe(handler: (arg: MouseEventParams<Time>) => void): void {
    this.#chart.chart?.unsubscribeClick(handler);
  }
}
