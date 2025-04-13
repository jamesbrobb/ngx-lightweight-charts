import {Component, effect, inject, input, viewChild} from '@angular/core';
import {
  CandlestickData,
  CandlestickSeriesPartialOptions,
  HistogramData,
  HistogramSeriesPartialOptions,
  ISeriesApi
} from "lightweight-charts";

import {TVChartDirective} from "../chart.directive";
import {TVChartInputsDirective, tvChartInputsDirectiveHostDef} from "../chart-inputs.directive";
import {tvChartProvider} from "../../providers/tv-chart.provider";
import {TVChart} from "../../../core";
import {tvChartOutputsDirectiveHostDef} from "../charts-outputs.directive";


const DEFAULT_DARK_SERIES_OPTIONS: CandlestickSeriesPartialOptions = {
  wickUpColor: 'rgb(54, 116, 217)',
  upColor: 'rgb(54, 116, 217)',
  wickDownColor: 'rgb(225, 50, 85)',
  downColor: 'rgb(225, 50, 85)',
  borderVisible: false,
}


const DEFAULT_HISTOGRAM_SERIES_OPTIONS: HistogramSeriesPartialOptions = {
  color: '#26a69a',
  priceFormat: {
    type: 'volume',
  },
  priceScaleId: ''
}


@Component({
    selector: 'tv-candlestick-chart',
    imports: [TVChartDirective],
    providers: [tvChartProvider],
    hostDirectives: [
        tvChartInputsDirectiveHostDef,
        tvChartOutputsDirectiveHostDef
    ],
    templateUrl: './candlestick-chart.component.html',
    styleUrl: './candlestick-chart.component.scss'
})
export class TVCandleStickChartComponent<HorzScaleItem> {

  seriesOptions = input<CandlestickSeriesPartialOptions>({});
  volumeOptions = input<HistogramSeriesPartialOptions>(DEFAULT_HISTOGRAM_SERIES_OPTIONS);

  data = input<CandlestickData<HorzScaleItem>[]>();
  volume = input<HistogramData<HorzScaleItem>[]>();

  chart = viewChild<TVChartDirective<'Candlestick', HorzScaleItem>, TVChart<'Candlestick', HorzScaleItem>>(
    TVChartDirective<'Candlestick', HorzScaleItem>,
    {read: TVChart}
  );

  readonly inputs = inject(TVChartInputsDirective<HorzScaleItem>);

  #histogramSeries?: ISeriesApi<'Histogram', HorzScaleItem>;

  constructor() {

    effect(() => {
      const data = this.volume(),
        chart = this.chart()?.chart;

      if(!data || !chart) {
        return;
      }
      this.#setVolume(data);
    });
  }

  #setVolume(data: HistogramData<HorzScaleItem>[]): void {
    if(!this.#histogramSeries) {
      this.#initialiseHistogram();
    }
    this.#histogramSeries!.setData(data);
  }

  #initialiseHistogram(): void {

    const chart = this.chart();

    if(!chart) {
      console.warn('TVCandleStickChartComponent::initialiseHistogram - Chart not initialised')
      return;
    }

    ({series: this.#histogramSeries} = chart.addAdditionalSeries('Histogram', this.volumeOptions()));

    if(!this.#histogramSeries) {
      return;
    }

    this.#histogramSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
    });
  }
}
