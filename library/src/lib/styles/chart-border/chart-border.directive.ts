import {Directive, effect, inject, input} from '@angular/core';
import {TVChartCollectorDirective} from "../../chart-collector/chart-collector.directive";


@Directive({
  selector: '[tvChartBorder]',
  standalone: true,
  hostDirectives: [TVChartCollectorDirective]
})
export class TVChartBorderDirective {

  borderColor = input<string>('#555');

  #collector = inject(TVChartCollectorDirective);

  constructor() {
    effect(() => {
      const chart = this.#collector.chart();

      if(!chart) {
        return;
      }

      chart.applyOptions(this.#getStyles());
    });
  }

  #getStyles() {
    return {
      timeScale: {
        borderColor: this.borderColor()
      },
      leftPriceScale: {
        borderColor: this.borderColor()
      },
      rightPriceScale: {
        borderColor: this.borderColor()
      }
    }
  }

}
