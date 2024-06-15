import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {AreaData, AreaSeriesPartialOptions, Time} from "lightweight-charts";
import {TVChartDirective} from "../chart.directive";
import {tvChartProvider} from "../../providers/tv-chart.provider";
import {TVChartInputsDirective, tvChartInputsDirectiveHostDef} from "../chart-inputs.directive";
import {tvChartOutputsDirectiveHostDef} from "../charts-outputs.directive";


@Component({
  selector: 'tv-area-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [tvChartProvider],
  hostDirectives: [
    tvChartInputsDirectiveHostDef,
    tvChartOutputsDirectiveHostDef
  ],
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVAreaChartComponent {
  seriesOptions = input<AreaSeriesPartialOptions>({});
  data = input<AreaData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
