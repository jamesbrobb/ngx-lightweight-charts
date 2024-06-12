import {Directive, input} from "@angular/core";
import {ChartOptions, DeepPartial, SeriesMarker} from "lightweight-charts";


@Directive({
  selector: '[tvChartInputs]',
  standalone: true,
})
export class TVChartInputsDirective<HorzScaleItem> {
  id = input<string>();
  options = input<DeepPartial<ChartOptions>>();
  markers = input<SeriesMarker<HorzScaleItem>[]>();
}


export const tvChartInputsDirectiveHostDef = {
  directive: TVChartInputsDirective,
  inputs: ['id', 'options', 'markers']
}
