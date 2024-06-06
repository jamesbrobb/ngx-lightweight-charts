import {Range, SeriesType, Time} from "lightweight-charts";
import {Handler} from "./subscription-handler";
import {TVChart} from "../charts";


export class TimescaleVisibleTimeRangeChangeHandler<T extends SeriesType> implements Handler<Range<Time> | null> {

  readonly #chart: TVChart<T>;

  constructor(chart: TVChart<T>) {
    this.#chart = chart;
  }

  subscribe(handler: (arg: Range<Time> | null) => void): void {
    this.#chart.timeScale?.subscribeVisibleTimeRangeChange(handler);
  }

  unsubscribe(handler: (arg: Range<Time> | null) => void): void {
    this.#chart.timeScale?.unsubscribeVisibleTimeRangeChange(handler);
  }
}
