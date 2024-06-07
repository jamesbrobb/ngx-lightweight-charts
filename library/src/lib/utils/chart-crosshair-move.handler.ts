import {MouseEventParams, SeriesType, Time} from "lightweight-charts";
import {SubscriptionHandler} from "./subscription-stream-handler";
import {TVChart} from "../charts";


export class ChartCrosshairMoveHandler<T extends SeriesType> implements SubscriptionHandler<MouseEventParams<Time>> {

  readonly #chart: TVChart<T>;

  constructor(chart: TVChart<T>) {
    this.#chart = chart;
  }

  subscribe(handler: (arg: MouseEventParams<Time>) => void): void {
    this.#chart.chart?.subscribeCrosshairMove(handler);
  }

  unsubscribe(handler: (arg: MouseEventParams<Time>) => void): void {
    this.#chart.chart?.unsubscribeCrosshairMove(handler);
  }
}
