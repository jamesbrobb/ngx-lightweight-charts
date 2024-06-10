import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {TVChartDirective, TVChartInputsDirective} from "../chart.directive";
import {AreaData, AreaSeriesPartialOptions, Time} from "lightweight-charts";
import {tvChartProvider} from "../../providers/tv-chart.provider";


@Component({
  selector: 'tv-area-chart',
  standalone: true,
  imports: [TVChartDirective],
  providers: [tvChartProvider],
  hostDirectives: [{
    directive: TVChartInputsDirective,
    inputs: ['id', 'options', 'markers']
  }],
  templateUrl: './area-chart.component.html',
  styleUrl: './area-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TVAreaChartComponent {
  seriesOptions = input<AreaSeriesPartialOptions>({});
  points = input<AreaData<Time>[]>();

  readonly inputs = inject(TVChartInputsDirective);
}
