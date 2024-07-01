import {
  CustomData,
  CustomSeriesOptions,
  IChartApiBase,
  ICustomSeriesPaneView,
  ISeriesApi,
  SeriesPartialOptionsMap,
  SeriesType,
} from "lightweight-charts";
import {SeriesStreams} from "./series-streams";
import {SeriesSubscriptions} from "./series.types";


type SeriesCreationFn<T extends SeriesType, HorzScaleItem> = (options: SeriesPartialOptionsMap[T]) => ISeriesApi<T, HorzScaleItem>

export type SeriesFactoryReturnType<T extends SeriesType, HorzScaleItem> = {
  series?: ISeriesApi<T, HorzScaleItem>
  seriesSubscriptions?: SeriesSubscriptions
}

export type RequiresCustomData<T extends SeriesType, HorzScaleItem> = T extends 'Custom' ? CustomData<HorzScaleItem> : never
export type RequiresCustomSeriesView<T extends SeriesType, HorzScaleItem> = T extends 'Custom' ? [customSeriesView: ICustomSeriesPaneView<HorzScaleItem>] : []


function isCustomSeriesOptions(type: SeriesType, options: any): options is CustomSeriesOptions {
  return type === 'Custom';
}

function isCustomSeriesView<HorzScaleItem>(view: ReadonlyArray<any>): view is [ICustomSeriesPaneView<HorzScaleItem>] {
  return view.length > 0;
}


export class SeriesFactory {

  create<T extends SeriesType, HorzScaleItem>(
    type: T,
    chart: IChartApiBase<HorzScaleItem>,
    seriesOptions: SeriesPartialOptionsMap[T],
    ...customSeriesView: RequiresCustomSeriesView<T, HorzScaleItem>
  ): SeriesFactoryReturnType<T, HorzScaleItem> {

    const series = this.#createSeries(type, chart, seriesOptions, ...customSeriesView),
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
    seriesOptions: SeriesPartialOptionsMap[T],
    ...customSeriesView: RequiresCustomSeriesView<T, HorzScaleItem>
  ): ISeriesApi<T, HorzScaleItem> | undefined {

    if(isCustomSeriesOptions(type, seriesOptions)) {

      if(!isCustomSeriesView(customSeriesView)) {
        throw new Error('Custom series requires a custom view');
      }

      // TODO - fix narrowing issue to remove as
      return chart.addCustomSeries(customSeriesView[0], seriesOptions) as ISeriesApi<T, HorzScaleItem>;

    } else{

      const fn: SeriesCreationFn<T, HorzScaleItem> | undefined = this.#getSeriesCreationFn(type, chart);

      if(!fn) {
        return;
      }

      return fn.call(chart, seriesOptions);
    }
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
    }

    return fn as SeriesCreationFn<T, HorzScaleItem> | undefined;
  }
}
