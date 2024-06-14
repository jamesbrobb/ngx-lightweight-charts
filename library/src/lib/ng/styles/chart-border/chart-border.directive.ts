import {Directive, effect, inject, input} from '@angular/core';
import {TVChartCollectorDirective} from "../../chart-collector/chart-collector.directive";
import {TVChart} from "../../../core";
import {SeriesType} from "lightweight-charts";


export type ChartBorderStyles = {
  borderColor?: string
  borderVisible?: boolean
}


@Directive({
  selector: '[tvChartBorder]',
  standalone: true
})
export class TVChartBorderDirective<T extends SeriesType, HorzItemScale> {

  borderStyles = input.required<ChartBorderStyles>({alias: 'tvChartBorder'});

  readonly #collector = inject(TVChartCollectorDirective<T, HorzItemScale>);

  constructor() {
    effect(() => {
      this.#collector.charts()?.forEach(chart => {
        chart.applyOptions(this.#getStyles(chart) || {});
      })
    });
  }

  #getStyles(chart: TVChart<T, HorzItemScale>) {
    const borderStyles = this.borderStyles(),
      current = chart.options;

    if(!current) {
      return;
    }

    return {
      timeScale: {
        borderColor: borderStyles.borderColor || current.timeScale?.borderColor,
        borderVisible: borderStyles.borderVisible || current.timeScale?.borderVisible
      },
      leftPriceScale: {
        borderColor: borderStyles.borderColor || current.leftPriceScale?.borderColor,
        borderVisible: borderStyles.borderVisible || current.leftPriceScale?.borderVisible
      },
      rightPriceScale: {
        borderColor: borderStyles.borderColor || current.rightPriceScale?.borderColor,
        borderVisible: borderStyles.borderVisible || current.rightPriceScale?.borderVisible
      }
    }
  }
}
