import {SeriesType} from "lightweight-charts";
import {TVChart} from "./tv-chart";
import {ChartFactory} from "../core/chart";
import {SeriesFactory} from "../core/series";


export function tvChartFactory<T extends SeriesType>(
  chartFactory: ChartFactory,
  seriesFactory: SeriesFactory
): TVChart<T> {

  return new TVChart<T>(chartFactory, seriesFactory);
}
