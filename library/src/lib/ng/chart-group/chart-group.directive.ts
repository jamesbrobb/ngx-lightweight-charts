import deepmerge from "deepmerge";
import {Directive, effect, inject, input} from '@angular/core';
import {ChartOptions, DeepPartial, SeriesType} from "lightweight-charts";
import {TVChartCollectorDirective} from "../chart-collector/chart-collector.directive";
import {filterChartsByIds} from "../../core";


@Directive({
  selector: '[tvChartGroup]',
  standalone: true
})
export class TVChartGroupDirective<T extends SeriesType, HorzItemScale> {

  ids = input<string | string[]>('', {alias: 'tvChartGroup'});
  groupOptions = input<DeepPartial<ChartOptions>>();
  showAllTimeScales = input<boolean>(false);
  minimumWidth = input<number>(80);

  readonly #collector = inject(TVChartCollectorDirective<T, HorzItemScale>);

  constructor() {
    effect(() => {

      this.#collector.charts()
        ?.filter(filterChartsByIds(this.ids()))
        .forEach((chart, index, charts) => {
          chart.applyOptions(
            this.#getStyles(index === charts.length - 1)
          );
        })
    });
  }

  #getStyles(isBottomTimeScale: boolean): DeepPartial<ChartOptions> {
    const options = this.groupOptions() || {},
      group: DeepPartial<ChartOptions> = {
        timeScale: {
          visible: isBottomTimeScale || this.showAllTimeScales(),
        },
        rightPriceScale: {
          minimumWidth: this.minimumWidth(),
        }
      };

    return deepmerge(group, options)
  }
}
