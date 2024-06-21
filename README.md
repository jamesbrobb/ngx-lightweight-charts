# ngx-lightweight-charts

An easily extendable Angular wrapper for Trading View lightweight-charts

### What it is.

A wrapper that exposes core chart functionality within an Angular app, and allows new functionality to be easily added.

### What it's not.

A (re)implementation of the entire `lightweight-charts` [api][11]. 

### How to use.

---
1) [Getting started](#1)
2) [Displaying a chart](#2)
3) [Common chart inputs and outputs](#3)
4) [TVChart - accessing the underlying IChartAPI and ISeriesApi instance](#4)
5) [Implemented behaviour](#5)
6) [Adding behaviour](#6)
---

# 1.

### Getting started

Installation

```bash
npm i ngx-lightweight-charts
```

Add providers

```ts
import { ApplicationConfig } from '@angular/core';
import { getTVChartDefaultProviders } from "ngx-lightweight-charts";


export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    getTVChartDefaultProviders()
  ]
};
```

# 2.

### Displaying a chart

There are two ways:

Either use the `tvChart` directive, specifying the type of chart to be displayed.

```html
<div tvChart="Line" [data]="lineData"></div>
```

Or use one of the following convenience components that wrap `tvChart` to create a specific chart type.

```html
<tv-area-chart [data]="pointData"></tv-area-chart>
```
```html
<tv-bar-chart [data]="barData"></tv-bar-chart>
```
```html
<tv-baseline-chart [data]="pointData"></tv-baseline-chart>
```
```html
<tv-candlestick-chart [data]="klineData"></tv-candlestick-chart>
```
```html
<tv-histogram-chart [data]="pointData"></tv-histogram-chart>
```
```html
<tv-line-chart [data]="pointData"></tv-line-chart>
```

# 3.

### Common chart inputs and outputs

All charts expose the following signal based inputs and outputs:

(Generic type `T` extends [SeriesType][9] and `HorzItemScale` defaults to [Time][15])

| Input                      | type                                            |
|:---------------------------|:------------------------------------------------|
| id                         | string                                          |
| options                    | DeepPartial\<[ChartOptions][1]>                 |
| seriesOptions              | [SeriesPartialOptionsMap][2][T]                 |
| data                       | [SeriesDataItemTypeMap][3]\<HorzScaleItem>[T][] |
| markers                    | [SeriesMarker][4]\<HorzScaleItem>[]             |
<br/>

| Output                     | type                                  |
|:---------------------------|:--------------------------------------|
| initialised                | TVChart<T, HorzScaleItem>             |
| chartClick                 | [MouseEventParams][5]\<HorzScaleItem> |
| chartDBLClick              | [MouseEventParams][5]\<HorzScaleItem> |
| crosshairMoved             | [MouseEventParams][5]\<HorzScaleItem> |
| visibleTimeRangeChanged    | [Range][6]\<HorzScaleItem>            |
| visibleLogicalRangeChanged | [LogicalRange][7] \| null             |
| sizeChanged                | number                                |
| dataChanged                | [DataChangedScope][8]                 |


# 4.

### TVChart - accessing the underlying [IChartAPI][10] instance

`TVChart` is the core class that creates, manages and exposes a trading view [chart][10] and its associated [series][12].

For convenience `TVChart` implements the majority of the `IChartApi` interface and also exposes the `IChartApi`, `ITimeScaleApi` and `ISeriesApi` subscriptions as RXJS streams.

It also exposes the underlying [chart][10], [timeScale][13], [priceScale][14] and [series][12] through accessors.

---

Every chart directive/component is simply a container that initialises an injected `TVChart` instance and exposes
a limited set of inputs and outputs to interact with the core functionality of the chart and series.

Once a `TVChart` has been initialised, there are 2 ways to access it:

1). Through the `initialised` output of the chart directive/component

```ts
import {Component} from "@angular/core";
import {TVChartDirective, TVChart} from "ngx-lightweight-chart";
import {LineData} from "lightweight-charts";

@Component({
  selector: 'my-component',
  standalone: true,
  imports: [
    TVChartDirective
  ],
  template: `
    <div tvChart="Line" [data]="chartData" (initialised)="onChartInit($event)"></div>
  `
})
export class MyComponent {

  chartData: LineData[]

  onChartInit(chart: TVChart<"Line">) {
    //... perform some action through the TVChart API
  }
}
```

2). Through the `tvChartCollector` directive when creating reusable functionality, which can be used to access and interact with a single `TVChart` or a collection.

The `tvChartCollector` also ensures that all `TVChart` instances have been fully initialised before exposing them for access through the `charts` signal. 

Accessing a single `TVChart` instance:

```html
<div tvChart="Line" [data]="chartData" tvChartCollector myDirective></div>
```

```ts
import {Directive, effect, inject} from "@angular/core";
import {TVChartCollectorDirective} from "./chart-collector.directive";
import {TVChart} from "./tv-chart";

@Directive({
  selector: '[myDirective]',
  standalone: true
})
export class MyDirective {
  readonly #collector = inject(TVChartCollectorDirective);

  constructor() {
    effect(() => {
      this.#collector.charts().forEach((chart: TVChart<any>) => {
        //... perform some action through the TVChart API
      });
    });
  }
}
```

Accessing multiple TVChart instances:

```html
<div tvChartCollector myDirective>
  <tv-candlestick-chart [data]="klineData"></tv-candlestick-chart>
  <tv-histogram-chart [data]="pointData"></tv-histogram-chart>
  <tv-line-chart [data]="pointData"></tv-line-chart>
</div>
```

```ts
import {Directive, effect, inject} from "@angular/core";
import {TVChartCollectorDirective} from "./chart-collector.directive";
import {TVChart} from "./tv-chart";

@Directive({
  selector: '[myDirective]',
  standalone: true
})
export class MyDirective {
  readonly #collector = inject(TVChartCollectorDirective);

  constructor() {
    effect(() => {
      this.#collector.charts().forEach((chart: TVChart<any>) => {
        //... perform some action through the TVChart API
      });
    });
  }
}
```

You may have noticed that the implementation of `MyDirective` is the same for both the single and multiple instance examples. This is intentional.
The `TVChartCollectorDirective.charts` signal always returns an array of charts (whether collecting a single or multiple)
allowing the flexibility to easily implement directives or components that work with single and/or multiple charts.

The `tvChartCollector` also accepts an array of id's to facilitate the filtering of charts by id:

```html
<div [tvChartCollector]="['one, 'two']" myDirective>
  <tv-candlestick-chart id="one" [data]="klineData"></tv-candlestick-chart>
  <tv-histogram-chart id="two" [data]="pointData"></tv-histogram-chart>
  <tv-line-chart [data]="pointData"></tv-line-chart>
</div>
```

```ts
import {Directive, effect, inject} from "@angular/core";
import {TVChartCollectorDirective} from "./chart-collector.directive";
import {TVChart} from "./tv-chart";

@Directive({
  selector: '[myDirective]',
  standalone: true
})
export class MyDirective {
  readonly #collector = inject(TVChartCollectorDirective);

  constructor() {
    effect(() => {
      this.#collector.charts().forEach((chart: TVChart<any>) => {
        //... perform something only on chart "one" and "two"
      });
    });
  }
}
```
# 5.

### Implemented behaviour

### `TVChartGroupDirective`

Visually groups multiple charts

```html
<div tvChartCollector tvChartGroup>
  <tv-area-chart [data]="pointData"></tv-area-chart>
  <tv-histogram-chart [data]="pointData"></tv-histogram-chart>
  <tv-line-chart [data]="pointData"></tv-line-chart>
</div>
```

![Chart group!](/assets/chart-group.png "Chart group")

### `TVChartSyncDirective`

Syncs the visible logical range (scale and position) and crosshair of multiple charts

```html
<div tvChartCollector tvChartSync>
  <tv-candlestick-chart [data]="klineData"></tv-candlestick-chart>
  <tv-histogram-chart [data]="pointData"></tv-histogram-chart>
</div>
```

![Chart sync!](/assets/chart-sync.png "Chart sync")

# 6.

### Adding behaviour

To add your own behaviour it's as simple as doing the following:

```html
<div tvChart="Line" [data]="chartData" tvChartCollector yourDirective></div>
```

```ts
import {Directive, effect, inject} from "@angular/core";
import {TVChartCollectorDirective} from "./chart-collector.directive";
import {TVChart} from "./tv-chart";

@Directive({
  selector: '[yourDirective]',
  standalone: true
})
export class YourDirective {
  readonly #collector = inject(TVChartCollectorDirective);

  constructor() {
    effect(() => {
      this.#collector.charts().forEach((chart: TVChart<any>) => {
        //... perform some action through the TVChart API
      });
    });
  }
}
```

[1]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/TimeChartOptions
[2]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/SeriesPartialOptionsMap
[3]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/SeriesDataItemTypeMap
[4]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/SeriesMarker
[5]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/MouseEventParams
[6]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/Range
[7]: https://tradingview.github.io/lightweight-charts/docs/api#logicalrange
[8]: https://tradingview.github.io/lightweight-charts/docs/api#datachangedscope
[9]: https://tradingview.github.io/lightweight-charts/docs/api#seriestype
[10]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/IChartApi
[11]: https://tradingview.github.io/lightweight-charts/docs/api
[12]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ISeriesApi
[13]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/ITimeScaleApi
[14]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/IPriceScaleApi
[15]: https://tradingview.github.io/lightweight-charts/docs/api#time
