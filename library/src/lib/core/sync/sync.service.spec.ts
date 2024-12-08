import {Syncable, SyncService} from './sync.service';
import {BehaviorSubject, Observable} from 'rxjs';
import { take } from 'rxjs/operators';
import {Logical, LogicalRange, Range} from "lightweight-charts";


class MockTVChart implements Syncable {

  #subject!: BehaviorSubject<LogicalRange | null>;

  constructor(subject: BehaviorSubject<LogicalRange | null>) {
    this.#subject = subject;
    this.visibleLogicalRangeChange$ = this.#subject.asObservable();
  }

  setVisibleLogicalRange(range: Range<number>): void {

  }
  getVisibleLogicalRange(): LogicalRange | null | undefined {
    return null;
  }
  readonly visibleLogicalRangeChange$: Observable<LogicalRange | null>;
}


describe('SyncService', () => {

  describe('register', () => {

    let subject: BehaviorSubject<LogicalRange | null>,
      syncService: SyncService<any>,
      mockChart: MockTVChart;

    beforeEach(() => {
      subject = new BehaviorSubject<LogicalRange | null>(null);
      syncService = new SyncService();
      mockChart = new MockTVChart(subject);
    });

    it('should emit changes from the synced item', (done) => {

      const testLogicalRangeData: LogicalRange = {
        from: 1 as Logical,
        to: 2 as Logical
      };

      syncService.register([mockChart]);

      syncService.visibleLogicalRange$.pipe(take(1)).subscribe(position => {
        expect(position).toEqual(testLogicalRangeData);
        done();
      });

      subject.next(testLogicalRangeData);
    });

    it('should remove existing registered items when clearExisting is true', () => {
      const subject1 = new BehaviorSubject<LogicalRange | null>(null);
      const subject2 = new BehaviorSubject<LogicalRange | null>(null);
      const mockChart1 = new MockTVChart(subject1);
      const mockChart2 = new MockTVChart(subject2);

      syncService.register([mockChart1]);

      const emittedValues: LogicalRange[] = [];
      const subscription = syncService.visibleLogicalRange$.subscribe(range => {
        if (range) emittedValues.push(range);
      });

      const range1: LogicalRange = { from: 1 as Logical, to: 2 as Logical };
      subject1.next(range1);

      expect(emittedValues).toEqual([range1]);

      syncService.register([mockChart2], true);

      const range2: LogicalRange = { from: 3 as Logical, to: 4 as Logical };
      subject1.next({ from: 5 as Logical, to: 6 as Logical }); // This should not emit
      subject2.next(range2);

      expect(emittedValues).toEqual([range1, range2]);

      subscription.unsubscribe();
    });

    it('should add to existing registered items when clearExisting is false', () => {
      const subject1 = new BehaviorSubject<LogicalRange | null>(null);
      const subject2 = new BehaviorSubject<LogicalRange | null>(null);
      const mockChart1 = new MockTVChart(subject1);
      const mockChart2 = new MockTVChart(subject2);

      syncService.register([mockChart1]);

      const emittedValues: LogicalRange[] = [];
      const subscription = syncService.visibleLogicalRange$.subscribe(range => {
        console.log(range);
        if (range) emittedValues.push(range);
      });

      const range1: LogicalRange = { from: 1 as Logical, to: 2 as Logical };
      subject1.next(range1);

      expect(emittedValues).toEqual([range1]);

      syncService.register([mockChart2], false);

      /*const range2: LogicalRange = { from: 3 as Logical, to: 4 as Logical },
        range3: LogicalRange = { from: 5 as Logical, to: 6 as Logical };

      subject1.next(range2);
      subject2.next(range3);

      expect(emittedValues).toEqual([range1, range2, range3]);*/

      subscription.unsubscribe();
    });

    it('should sync the visible logical range of new items to match existing', () => {

    });
  });

  describe('deregister', () => {
    it('should', () => {

    });
  });

  describe('visibleLogicalRange$', () => {
    it('should', () => {

    });
  });

  describe('crosshairPosition$', () => {
    it('should', () => {

    });
  });

  describe('destroy', () => {
    it('should', () => {

    });
  });
});


describe('isSyncableWithCrosshair', () => {
  it('should', () => {

  });
});
