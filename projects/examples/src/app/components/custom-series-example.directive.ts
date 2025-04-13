import {Directive, effect, inject, input} from "@angular/core";
import {TVChartCollectorDirective, TVChart} from "ngx-lightweight-charts";
import {CustomData, CustomSeriesOptions, ICustomSeriesPaneView, ISeriesApi, Time} from "lightweight-charts";


@Directive({
  selector: '[customSeriesExample]',
  standalone: true
})
export class CustomSeriesExampleDirective<HorzScaleItem = Time> {

  readonly #collector = inject(TVChartCollectorDirective);

  data = input<CustomData<HorzScaleItem>[]>();
  customSeriesView = input.required<ICustomSeriesPaneView<HorzScaleItem>>({alias: 'customSeriesExample'});
  seriesOptions = input<CustomSeriesOptions>({} as CustomSeriesOptions);

  #series?: ISeriesApi<'Custom', HorzScaleItem>;

  constructor() {

    effect(() => {
      this.#collector.charts()?.forEach((chart) => {
        const data = this.data(),
          customSeriesView= this.customSeriesView();

        if(!data || !customSeriesView) {
          return;
        }

        ({
          series: this.#series as any
        } = chart.addAdditionalSeries('Custom', this.seriesOptions(), customSeriesView));

        this.#series?.setData(data);
      });
    });
  }
}
