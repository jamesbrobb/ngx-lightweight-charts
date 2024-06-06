import {Handler} from "./subscription-handler";
import {LogicalRange, SeriesType} from "lightweight-charts";
import {TVChart} from "../charts";


export class TimescaleVisibleLogicalRangeChangeHandler<T extends SeriesType> implements Handler<LogicalRange | null> {

  readonly #chart: TVChart<T>;

  constructor(chart: TVChart<T>) {
    this.#chart = chart;
  }

  subscribe(handler: (arg: LogicalRange | null) => void): void {
    this.#chart.timeScale?.subscribeVisibleLogicalRangeChange(handler);
  }

  unsubscribe(handler: (arg: LogicalRange | null) => void): void {
    this.#chart.timeScale?.unsubscribeVisibleLogicalRangeChange(handler);
  }
}
