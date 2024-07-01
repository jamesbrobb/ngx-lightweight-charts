import {Directive, effect, inject} from "@angular/core";
import {TVChartCollectorDirective, TVChart} from "ngx-lightweight-charts";


@Directive({
  selector: '[yourDirective]',
  standalone: true
})
export class YourDirective {
  readonly #collector = inject(TVChartCollectorDirective);

  constructor() {
    effect(() => {
      this.#collector.charts()?.forEach((chart: TVChart<any>) => {
        //... perform some action through the TVChart API
      });
    });
  }
}
