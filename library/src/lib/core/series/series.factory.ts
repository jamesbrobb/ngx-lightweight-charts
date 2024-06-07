import {IChartApi, ISeriesApi, SeriesPartialOptionsMap, SeriesType, Time} from "lightweight-charts";


type SeriesCreationFn<T extends SeriesType, HorzScaleItem = Time> = (options: SeriesPartialOptionsMap[T]) => ISeriesApi<T, HorzScaleItem>;


export type SeriesFactoryReturnType<T extends SeriesType, HorzScaleItem = Time> = {
  series: ISeriesApi<T, HorzScaleItem> | undefined;
  dataChangeHandler: any | undefined
}



export class SeriesFactory {

  create<T extends SeriesType, HorzScaleItem = Time>(
    type: T,
    chart: IChartApi,
    seriesOptions: SeriesPartialOptionsMap[T]
  ): SeriesFactoryReturnType<T, HorzScaleItem> {

    const series = this.#createSeries<T, HorzScaleItem>(type, chart, seriesOptions);

    if(!series) {
      console.log(`Series of type ${type} could not be created`);
    }

    return {
      series,
      dataChangeHandler: undefined
    }
  }

  #createSeries<T extends SeriesType, HorzScaleItem>(
    type: T,
    chart: IChartApi,
    seriesOptions: SeriesPartialOptionsMap[T]
  ): ISeriesApi<T, HorzScaleItem> | undefined {

    const fn: SeriesCreationFn<T, HorzScaleItem> | undefined = this.#getSeriesCreationFn(type, chart);

    if(!fn) {
      return;
    }

    return fn.call(chart, seriesOptions);
  }

  #getSeriesCreationFn<T extends SeriesType, HorzScaleItem>(type: T, chart: IChartApi): SeriesCreationFn<T, HorzScaleItem> | undefined {

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
