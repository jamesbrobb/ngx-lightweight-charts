import {Directive, effect, inject, input} from '@angular/core';
import {ChartOptions, DeepPartial} from "lightweight-charts";
import {TVChartCollectorDirective} from "../chart-collector/chart-collector.directive";


@Directive({
  selector: '[tvChartGroup]',
  standalone: true
})
export class TVChartGroupDirective {

  groupOptions = input<DeepPartial<ChartOptions>>();
  showAllTimeScales = input<boolean>(false);
  minimumWidth = input<number>(80);

  readonly #collector = inject(TVChartCollectorDirective);

  constructor() {
    effect(() => {
      const charts = this.#collector.charts();

      if(!charts) {
        return;
      }

      charts.forEach((chart, index, charts) => {
        chart.applyOptions(
          this.#getStyles(index === charts.length - 1)
        );
      })
    });
  }

  #getStyles(isBottomTimeScale: boolean) {
    return {
      timeScale: {
        visible: isBottomTimeScale || this.showAllTimeScales(),
      },
      rightPriceScale: {
        minimumWidth: this.minimumWidth(),
      }
    }
  }
}
