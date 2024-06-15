# ngx-lightweight-charts

An easily extendable Angular wrapper for Trading View lightweight-charts

---
1) [Getting started](#1)
2) [Displaying a chart](#2)
3) [Common chart inputs and outputs](#3)
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

(Generic type `T` extends [SeriesType][9] and `HorzItemScale` defaults to `Time`)

| Input                      | type                                            |
|:---------------------------|:------------------------------------------------|
| id                         | string                                          |
| options                    | DeepPartial\<[ChartOptions][1]>                 |
| seriesOptions              | [SeriesPartialOptionsMap][2][T]                 |
| data                       | [SeriesDataItemTypeMap][3]\<HorzScaleItem>[T][] |
| markers                    | [SeriesMarker][4]\<HorzScaleItem>[]             |

| Output                     | type                                  |
|:---------------------------|:--------------------------------------|
| initialised                | TVChart<T, HorzScaleItem>             |
| chartClick                 | [MouseEventParams][5]\<HorzScaleItem> |
| chartDBLClick              | [MouseEventParams][5]\<HorzScaleItem> |
| crosshairMoved             | [MouseEventParams][5]\<HorzScaleItem> |
| visibleTimeRangeChanged    | [Range][6]\<HorzScaleItem>            |
| visibleLogicalRangeChanged | [LogicalRange][7] &#124; null         |
| sizeChanged                | number                                |
| dataChanged                | [DataChangedScope][8]                 |


[1]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/TimeChartOptions
[2]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/SeriesPartialOptionsMap
[3]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/SeriesDataItemTypeMap
[4]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/SeriesMarker
[5]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/MouseEventParams
[6]: https://tradingview.github.io/lightweight-charts/docs/api/interfaces/Range
[7]: https://tradingview.github.io/lightweight-charts/docs/api#logicalrange
[8]: https://tradingview.github.io/lightweight-charts/docs/api#datachangedscope
[9]: https://tradingview.github.io/lightweight-charts/docs/api#seriestype
