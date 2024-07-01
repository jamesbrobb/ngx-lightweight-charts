import deepmerge from "deepmerge";
import {
  Directive,
  ElementRef,
  OnInit,
  OnDestroy,
  inject,
  input,
  effect,
} from '@angular/core';

import {
  ChartOptions,
  ColorType,
  DeepPartial, ICustomSeriesPaneView,
  LineStyle,
  SeriesDataItemTypeMap,
  SeriesPartialOptionsMap,
  SeriesType
} from "lightweight-charts";
import {TVChart} from "../../core";
import {tvChartProviderWithExistenceCheck} from "../providers/tv-chart.provider";
import {TVChartInputsDirective, tvChartInputsDirectiveHostDef} from "./chart-inputs.directive";
import {tvChartOutputsDirectiveHostDef} from "./charts-outputs.directive";


export const DEFAULT_CHART_OPTIONS: DeepPartial<ChartOptions> = {
  height: 300,
  autoSize: true,
  timeScale: {
    fixRightEdge: true,
    lockVisibleTimeRangeOnResize: true,
    timeVisible: true,
    secondsVisible: false,
  },
  crosshair: {
    vertLine: {
      style: LineStyle.LargeDashed
    },
    horzLine: {
      style: LineStyle.LargeDashed
    },
  }
}


export const DEFAULT_DARK_CHART_OPTIONS: DeepPartial<ChartOptions> = deepmerge(
  DEFAULT_CHART_OPTIONS, {
  layout: {
    background: { type: ColorType.Solid, color: '#222' },
    textColor: '#DDD',
  },
  grid: {
    vertLines: { color: '#444' },
    horzLines: { color: '#444' },
  },
  timeScale: {
    borderColor: '#555',
  },
  leftPriceScale: {
    borderColor: '#555'
  },
  rightPriceScale: {
    borderColor: '#555'
  },
  crosshair: {
    vertLine: {
      color: '#fff',
      labelBackgroundColor: '#aaa',
      style: LineStyle.SparseDotted
    },
    horzLine: {
      color: '#fff',
      labelBackgroundColor: '#aaa',
      style: LineStyle.SparseDotted
    },
  }
});



@Directive({
  selector: '[tvChart]',
  standalone: true,
  providers: [tvChartProviderWithExistenceCheck],
  hostDirectives: [
    tvChartInputsDirectiveHostDef,
    tvChartOutputsDirectiveHostDef
  ]
})
export class TVChartDirective<T extends SeriesType, HorzScaleItem> implements OnInit, OnDestroy {

  type = input.required<T>({alias: 'tvChart'});
  seriesOptions = input<SeriesPartialOptionsMap[T]>();
  data = input<SeriesDataItemTypeMap<HorzScaleItem>[T][]>();
  customSeriesView = input<ICustomSeriesPaneView<HorzScaleItem>>();

  readonly #inputs = inject(TVChartInputsDirective);
  readonly #element = inject(ElementRef<HTMLElement>).nativeElement;
  readonly #chart = inject(TVChart<T, HorzScaleItem>);

  constructor() {

    effect(() => {
      const options = this.#inputs.options();
      if(!options) {
        return;
      }
      this.#chart.applyOptions(options);
    });

    effect(() => {
      const seriesOptions = this.seriesOptions();
      if(!seriesOptions) {
        return;
      }
      this.#chart.applySeriesOptions(seriesOptions);
    });

    effect(() => {
      const data = this.data();
      if(!data) {
        return;
      }
      this.#chart.setData(data);
    });

    effect(() => {
      const markers = this.#inputs.markers();
      if(!markers) {
        return;
      }
      this.#chart.setMarkers(markers);
    });
  }

  ngOnInit() {
    const options = deepmerge(DEFAULT_CHART_OPTIONS, this.#inputs.options() || {});
    this.#chart.initialise(
      this.#element,
      this.type(),
      this.#inputs.id(),
      options,
      this.seriesOptions() || {},
      ...(this.customSeriesView() ? [this.customSeriesView()] : [] as any)
    );
  }

  ngOnDestroy() {
    this.#chart.remove();
  }
}
