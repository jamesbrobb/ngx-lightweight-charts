import {Component, inject} from '@angular/core';
import {
  HistogramData,
  LineData,
  OhlcData,
  SeriesMarker,
  SeriesMarkerPosition,
  SeriesMarkerShape,
  Time
} from "lightweight-charts";
import {Table} from "apache-arrow";
import {TABLE_DATA} from "./loader/arrow_loader";
import {TVChartDirective, TVChartGroupDirective, TVChartBorderDirective} from "ngx-lightweight-charts";

import {
  interval,
  take,
  Subject,
  mergeMap,
  BehaviorSubject,
  tap,
  switchMap,
  from,
  timer,
  filter,
  Observable,
  bufferCount
} from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    TVChartDirective,
    TVChartGroupDirective,
    TVChartBorderDirective
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly #data = inject(TABLE_DATA);

  klines?: OhlcData<Time>[];
  volume?: HistogramData<Time>[];
  markers?: SeriesMarker<Time>[];
  rsiValues?: LineData<Time>[];

  constructor() {
    this.#data.data$.subscribe(data => {
      this.#parseData(data);
    });

    //this.testIt();
  }

  #parseData(table: Table | undefined): void {
    if(!table) {
      return;
    }
    console.time('parseData');
    table = table.select([
      'start_datetime',
      'open',
      'high',
      'low',
      'close',
      'volume',
      'rsi',
      'has_indicator'
    ]);

    const klines: OhlcData<Time>[] = [],
      volume: HistogramData<Time>[] = [],
      markers: SeriesMarker<Time>[] = [],
      rsiValues: LineData<Time>[] = [];

    for (const row of table) {
      const dt = row.toJSON(),
        time = (dt['start_datetime'] / 1000) as Time,
        rsi: number = dt['rsi'] || 0;

      klines.push({
        time,
        open: dt['open'],
        high: dt['high'],
        low: dt['low'],
        close: dt['close']
      });

      volume.push({
        time,
        value: dt['volume']
      });

      rsiValues.push({
        time,
        value: rsi,
        color: rsi > 70 ? '#F9D402' : rsi < 30 ? '#9C598D' : '#7fbe9e99'
      });

      const value = dt['has_indicator'];

      if(!value) {
        continue;
      }

      markers.push(this.#createMarker(value, time, dt['close'].toFixed(2)));
    }
    console.timeEnd('parseData');

    this.klines = klines;
    this.volume = volume;
    this.markers = markers;
    this.rsiValues = rsiValues;
  }

  #createMarker(value: number, time: Time, price: number): SeriesMarker<Time> {

    let position: SeriesMarkerPosition = 'aboveBar',
      color: string = '#fff',
      shape: SeriesMarkerShape = 'arrowDown',
      text: string = 'Sell @';

    if(value === 1) {
      position = 'belowBar';
      color = '#fff';
      shape = 'arrowUp';
      text = 'Buy @';
    }

    return {
      time,
      position,
      color,
      shape,
      text: `${text}${price}`
    };
  }

  obs3 = new Subject<Observable<boolean>[]>();
  obs3$ = this.obs3.asObservable();
  obs2 = new BehaviorSubject<boolean>(false);
  obs2$ = this.obs2.asObservable()//.pipe(share());
  obs1$ = timer(1000).pipe(
    tap(() => {
      this.obs2.next(true);
    })
  );
  obs4$ = interval(500).pipe(
    take(5),
    tap(() => {
      this.obs3.next([this.obs2$, this.obs2$, this.obs2$]);
    })
  );

  testIt() {

    this.obs3$
      .pipe(
        switchMap((obs) => {
          return from(obs).pipe(
            mergeMap((o) => {
              return o.pipe(
                filter((v) => v)
              )
            }),
            bufferCount(obs.length),
          )
        }),
        tap((arg) => console.log('tap', arg))
      ).subscribe()


    this.obs1$.subscribe({
      next: (arg: any) => console.log('1', arg),
      complete: () => console.log('1 completed'),
    });

    this.obs4$.subscribe({
      next: (arg: any) => console.log('4', arg),
      complete: () => console.log('4 completed'),
    });
  }
}
