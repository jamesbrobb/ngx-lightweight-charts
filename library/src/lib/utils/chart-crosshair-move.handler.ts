import {MouseEventParams, SeriesType, Time} from "lightweight-charts";
import {Handler} from "./subscription-handler";
import {TVChart} from "../charts";


export class ChartCrosshairMoveHandler<T extends SeriesType> implements Handler<MouseEventParams<Time>> {

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
