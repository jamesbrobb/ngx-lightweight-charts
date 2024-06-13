import {Directive, effect, inject, input} from '@angular/core';
import {TVChartCollectorDirective} from "../../chart-collector/chart-collector.directive";


@Directive({
  selector: '[tvChartBorder]',
  standalone: true
})
export class TVChartBorderDirective {

  borderColor = input<string>('#555');

  #collector = inject(TVChartCollectorDirective);

  constructor() {
    effect(() => {
      const charts = this.#collector.charts();

      if(!charts) {
        return;
      }

      charts.forEach(chart => {
        chart.applyOptions(this.#getStyles());
      })
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
