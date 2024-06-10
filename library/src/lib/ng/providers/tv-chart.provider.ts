import {inject, Provider} from "@angular/core";
import {SeriesType} from "lightweight-charts";
import {ChartFactory, SeriesFactory, tvChartFactory, TVChart} from "../../core";


export const tvChartProvider: Provider = {
  provide: TVChart,
  useFactory: tvChartProviderFactory
}


export const tvChartExistenceCheckProvider: Provider = {
  provide: TVChart,
  useFactory: () => {
    const parentChart = inject(TVChart, {optional: true, skipSelf: true});
    return parentChart || tvChartProviderFactory();
  }
}


export function tvChartProviderFactory<T extends SeriesType>(): TVChart<T> {
  const chartFactory = inject(ChartFactory),
    seriesFactory = inject(SeriesFactory);

  return tvChartFactory(chartFactory, seriesFactory);
}
