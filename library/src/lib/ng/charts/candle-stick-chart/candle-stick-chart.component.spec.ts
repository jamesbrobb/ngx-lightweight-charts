import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TVCandleStickChartComponent } from './candle-stick-chart.component';

describe('CandleStickChartComponent', () => {
  let component: TVCandleStickChartComponent;
  let fixture: ComponentFixture<TVCandleStickChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TVCandleStickChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TVCandleStickChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
