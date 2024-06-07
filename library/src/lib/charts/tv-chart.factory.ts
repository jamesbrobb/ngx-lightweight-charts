import {SeriesType} from "lightweight-charts";
import {TVChart} from "./tv-chart";
import {ChartFactory} from "../chart";
import {SeriesFactory} from "../series";


export function tvChartFactory<T extends SeriesType>(
  chartFactory: ChartFactory,
  seriesFactory: SeriesFactory
): TVChart<T> {

  return new TVChart<T>(chartFactory, seriesFactory);
}
