import {
  ChartOptions, ChartOptionsImpl,
  createChart,
  createChartEx,
  DeepPartial,
  IChartApiBase,
  IHorzScaleBehavior,
  Time
} from "lightweight-charts";
import {ChartSubscriptions} from "./chart.types";
import {ChartStreams} from "./chart-streams";
import {TimescaleStreams, TimescaleSubscriptions} from "../timescale";


export type ChartFactoryReturnType<HorzScaleItem = Time> = {
  chart: IChartApiBase<HorzScaleItem>,
  chartSubscriptions: ChartSubscriptions<HorzScaleItem>,
  timescaleSubscriptions: TimescaleSubscriptions<HorzScaleItem>
};


type getOptionsType<T, HorzScaleItem> = [T] extends [never] ? ChartOptions :
  T extends IHorzScaleBehavior<HorzScaleItem> ? ReturnType<T['options']> : never

type blah<T> = T extends ChartOptions ? T : never

type getScaleBehaviorType<T, HorzScaleItem> = T extends IHorzScaleBehavior<HorzScaleItem> ? T : never


export class ChartFactory {

  create<
    HorzScaleItem = Time,
    THorzScaleBehavior extends IHorzScaleBehavior<HorzScaleItem> = never
  >(
    container: string | HTMLElement,
    options?: DeepPartial<getOptionsType<THorzScaleBehavior, HorzScaleItem>>,
    horzScaleBehavior?: getScaleBehaviorType<THorzScaleBehavior, HorzScaleItem>

  ): ChartFactoryReturnType<HorzScaleItem> {

    let chart: IChartApiBase<HorzScaleItem>;

    if(!horzScaleBehavior) {
      chart = createChart(container, options as DeepPartial<ChartOptions>) as unknown as IChartApiBase<HorzScaleItem>;
    } else {
      chart = createChartEx(container, horzScaleBehavior, options as any);
    }

    const chartSubscriptions = new ChartStreams<HorzScaleItem>(chart),
      timescaleSubscriptions = new TimescaleStreams<HorzScaleItem>(chart.timeScale());

    return {
      chart,
      chartSubscriptions,
      timescaleSubscriptions
    }
  }
}
