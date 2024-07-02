import {Directive, effect, inject} from "@angular/core";
import {TVChartCollectorDirective, TVChart} from "ngx-lightweight-charts";


@Directive({
  selector: '[resizeExample]',
  standalone: true
})
export class ResizeExampleDirective {

  readonly #collector = inject(TVChartCollectorDirective);

  constructor() {
    effect(() => {
      this.#collector.charts()?.forEach((chart: TVChart<any>) => {
        const paneSize = chart.chart?.paneSize();
        console.log(paneSize);
        if(!paneSize) {
          return;
        }

        const options = chart.options;

        console.log(options?.height);
        console.log(options?.autoSize)

        //chart.resize(paneSize.width, 300, true);

        //chart.applyOptions({autoSize: true, height: 300});
        //chart.applyOptions({autoSize: true});
      })
    });
  }
}
