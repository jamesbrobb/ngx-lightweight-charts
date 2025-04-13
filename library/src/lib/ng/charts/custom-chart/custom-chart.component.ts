import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {TVChartDirective} from "../chart.directive";
import {tvChartProvider} from "../../providers/tv-chart.provider";
import {TVChartInputsDirective, tvChartInputsDirectiveHostDef} from "../chart-inputs.directive";
import {tvChartOutputsDirectiveHostDef} from "../charts-outputs.directive";
import {CustomData, CustomSeriesPartialOptions, ICustomSeriesPaneView, Time} from "lightweight-charts";


@Component({
    selector: 'tv-custom-series-chart',
    imports: [TVChartDirective],
    providers: [tvChartProvider],
    hostDirectives: [
        tvChartInputsDirectiveHostDef,
        tvChartOutputsDirectiveHostDef
    ],
    templateUrl: './custom-chart.component.html',
    styleUrl: './custom-chart.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVChartCustomSeriesComponent<HorzScaleItem = Time> {
  seriesOptions = input<CustomSeriesPartialOptions>({});
  data = input<CustomData<HorzScaleItem>[]>();
  customSeriesView = input<ICustomSeriesPaneView<HorzScaleItem>>();

  readonly inputs = inject(TVChartInputsDirective);
}
