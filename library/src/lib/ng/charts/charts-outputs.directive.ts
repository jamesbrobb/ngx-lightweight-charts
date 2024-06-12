import {Directive, inject} from "@angular/core";
import {SeriesType} from "lightweight-charts";
import {TVChart} from "../../core";
import {outputFromObservable} from "@angular/core/rxjs-interop";


@Directive({
  selector: '[tvChartOutputs]',
  standalone: true,
})
export class TVChartOutputsDirective<T extends SeriesType, HorzScaleItem> {

  readonly #chart = inject(TVChart<T, HorzScaleItem>);

  readonly initialised = outputFromObservable(this.#chart.initialised$);
  readonly chartClick = outputFromObservable(this.#chart.click$);
  readonly chartDBLClick = outputFromObservable(this.#chart.dblClick$);
  readonly crosshairMoved = outputFromObservable(this.#chart.crossHairMove$);
  readonly visibleTimeRangeChanged = outputFromObservable(this.#chart.visibleTimeRangeChange$);
  readonly visibleLogicalRangeChanged = outputFromObservable(this.#chart.visibleLogicalRangeChange$);
  readonly sizeChanged = outputFromObservable(this.#chart.sizeChange$);
  readonly dataChanged = outputFromObservable(this.#chart.dataChange$);
}


export const tvChartOutputsDirectiveHostDef = {
  directive: TVChartOutputsDirective,
  outputs: [
    'initialised',
    'chartClick',
    'chartDBLClick',
    'crosshairMoved',
    'visibleLogicalRangeChanged',
    'visibleTimeRangeChanged',
    'sizeChanged',
    'dataChanged'
  ]
}
