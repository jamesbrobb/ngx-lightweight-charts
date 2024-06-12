import {IChartApiBase, ISeriesApi, SeriesPartialOptionsMap, SeriesType, Time} from "lightweight-charts";
import {SeriesStreams} from "./series-streams";
import {SeriesSubscriptions} from "./series.types";


type SeriesCreationFn<T extends SeriesType, HorzScaleItem = Time> = (options: SeriesPartialOptionsMap[T]) => ISeriesApi<T, HorzScaleItem>;


export type SeriesFactoryReturnType<T extends SeriesType, HorzScaleItem = Time> = {
  series?: ISeriesApi<T, HorzScaleItem>
  seriesSubscriptions?: SeriesSubscriptions
}


export class SeriesFactory {

  create<T extends SeriesType, HorzScaleItem = Time>(
    type: T,
    chart: IChartApiBase<HorzScaleItem>,
    seriesOptions: SeriesPartialOptionsMap[T]
  ): SeriesFactoryReturnType<T, HorzScaleItem> {

    const series = this.#createSeries<T, HorzScaleItem>(type, chart, seriesOptions),
      seriesSubscriptions = series ? new SeriesStreams(series) : undefined;

    if(!series) {
      console.log(`Series of type ${type} could not be created`);
    }

    return {
      series,
      seriesSubscriptions
    }
  }

  #createSeries<T extends SeriesType, HorzScaleItem>(
    type: T,
    chart: IChartApiBase<HorzScaleItem>,
    seriesOptions: SeriesPartialOptionsMap[T]
  ): ISeriesApi<T, HorzScaleItem> | undefined {

    const fn: SeriesCreationFn<T, HorzScaleItem> | undefined = this.#getSeriesCreationFn(type, chart);

    if(!fn) {
      return;
    }

    return fn.call(chart, seriesOptions);
  }

  #getSeriesCreationFn<T extends SeriesType, HorzScaleItem>(type: T, chart: IChartApiBase<HorzScaleItem>): SeriesCreationFn<T, HorzScaleItem> | undefined {

    let fn: any | undefined;

    switch(type) {
      case 'Candlestick':
        fn = chart.addCandlestickSeries;
        break;
      case 'Histogram':
        fn = chart.addHistogramSeries;
        break;
      case 'Line':
        fn = chart.addLineSeries;
        break;
      case 'Area':
        fn = chart.addAreaSeries;
        break;
      case 'Bar':
        fn = chart.addBarSeries;
        break;
      case 'Baseline':
        fn = chart.addBaselineSeries;
        break;
      case 'Custom':
        fn = chart.addCustomSeries;
        break;
    }

    return fn as SeriesCreationFn<T, HorzScaleItem> | undefined;
  }
}
