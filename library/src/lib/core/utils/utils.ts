import {TVChart} from "../tv-chart";
import {SeriesType} from "lightweight-charts";


export function filterChartsByIds<T extends SeriesType, HorxItemScale>(
  ids: string | string[]
): (chart: TVChart<T, HorxItemScale>) => boolean {

  const values = Array.isArray(ids) ? ids : !ids ? [] : [ids];

  return (chart: TVChart<T, HorxItemScale>) => {
    return !values.length || !!(chart.id && values.includes(chart.id));
  }
}
