import {Table, tableFromIPC, Field} from "apache-arrow";
import {APP_INITIALIZER, inject, InjectionToken} from "@angular/core";
import {BehaviorSubject} from "rxjs";


const filePath = './assets/data/15m_14_70_30.arrow';


export class ArrowDataLoader {

  private readonly _data = new BehaviorSubject<Table|undefined>(undefined);
  readonly data$ = this._data.asObservable();

  async loadData(filePath: string): Promise<Table> {
    console.time('loadData');
    const response = await fetch(filePath);
    console.timeEnd('loadData');
    console.time('convertData');
    let table = await tableFromIPC(response);
    console.timeEnd('convertData');
    this._data.next(table);

    return table;
  }

  handleFile(file: File): void {
    const reader = new FileReader();
    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      let table = tableFromIPC(arrayBuffer);
      console.log(table);
      //table = this._convertTable(table);
      this._data.next(table);
    };
    reader.readAsArrayBuffer(file);
  }

  extractDataFromTable(table: Table) {
    console.time('extractData');
    const result: {[key: string]: any} = {};
    let field: Field
    for(field of table.schema.fields) {
      result[field.name] = table.getChild(field.name)?.toArray();
    }
    console.timeEnd('extractData');
    return result;
  }

  private _extractDataFromTable2(table: Table) {
    console.time('extractData');
    let extractedData = [];
    for (const row of table) {
      extractedData.push(row.toJSON());
    }
    console.timeEnd('extractData');
    return {blah: extractedData};
  }
}

export const TABLE_DATA = new InjectionToken<ArrowDataLoader>("TABLE_DATA");

export const tableDataProviders = [
  {
    provide: APP_INITIALIZER,
    useFactory: () => {
      const td = inject(TABLE_DATA)
      return () => td.loadData(filePath);
    },
    multi: true
  },
  {
    provide: TABLE_DATA,
    useValue: new ArrowDataLoader()
  }
];
