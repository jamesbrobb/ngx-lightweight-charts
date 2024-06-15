# ngx-lightweight-charts

An Angular wrapper for Trading View lightweight-charts

---
1) [Getting started](#1)
2) [Displaying a chart](#2)
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

```angular17html
<div tvChart="Line" [data]="lineData"></div>
```
