import {filter, map, share, Subject, takeUntil, tap} from "rxjs";
import {MouseEventParams} from "lightweight-charts";
import {isMultiStreamOutput, MultiStream} from "../sync/multi-stream";
import {TVChart} from "../tv-chart";


export class CrosshairService<HorzScaleItem> {

  #charts?: TVChart<any, HorzScaleItem>[];

  readonly #destroy = new Subject<void>();
  readonly #destroyed$ = this.#destroy.asObservable();

  readonly #crosshairPosition = new MultiStream<MouseEventParams<HorzScaleItem>>();
  readonly crosshairPosition$ = this.#crosshairPosition.stream$.pipe(
    filter(isMultiStreamOutput),
    map(arg => {
      const data = arg.data,
        result: {[key: string | number]: any} = {};

      if (!data.time || !data.logical) {
        return null;
      }

      this.#charts?.forEach((chart, index) => {
        result[chart.id || index] = chart.series?.dataByIndex(data.logical as number);
      });

      return result;
    }),
    share()
  );

  constructor() {
    this.crosshairPosition$.pipe(
      takeUntil(this.#destroyed$),
    ).subscribe();
  }

  register(charts: TVChart<any, HorzScaleItem>[], clearExisting: boolean = true) {
    if(clearExisting || !this.#charts) {
      this.#charts = [];
    }

    charts = charts.filter(arg => !this.#charts!.includes(arg));

    this.#charts = this.#charts.concat(charts);
    this.#updateStream();
  }

  deregister(chart: TVChart<any, HorzScaleItem>): void {

    if(!this.#charts) {
      return;
    }

    const index = this.#charts.indexOf(chart);

    if(index === -1) {
      return;
    }

    this.#charts.splice(index, 1);
    this.#updateStream();
  }

  destroy(): void {
    this.#crosshairPosition.destroy();
    this.#destroy.next();
    this.#destroy.complete();
  }

  #updateStream(): void {

    if (!this.#charts) {
      return;
    }

    this.#crosshairPosition.updateObservables(
      this.#charts.map(chart => chart.crossHairMove$)
    )
  }
}
