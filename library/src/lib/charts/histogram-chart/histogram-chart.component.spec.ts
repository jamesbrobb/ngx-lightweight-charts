import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramChartComponent } from './histogram-chart.component';

describe('HistogramChartComponent', () => {
  let component: HistogramChartComponent;
  let fixture: ComponentFixture<HistogramChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistogramChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistogramChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
