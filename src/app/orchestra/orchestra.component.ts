import { Component, OnInit } from '@angular/core';
import { Instrument } from '@app/shared/instrument';
import { Observable } from 'rxjs/Observable';
import { DataService } from '@app/shared/service/data.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { GenericFile } from '@app/shared/GenericFile';
import { MatSelect, MatAutocompleteSelectedEvent } from '@angular/material';
import { RestService } from '@app/shared/service/rest.service';
import { DbDictionariesService } from '@app/shared/service/db-dictionaries.service';

@Component({
  selector: 'app-orchestra',
  templateUrl: './orchestra.component.html',
  styleUrls: ['./orchestra.component.css']
})
export class OrchestraComponent implements OnInit {
  public title: string = 'Orchiestra';
  public instrFormControl: FormControl;
  protected instruments: Array<Instrument> = [];
  protected metaDataPDFList: Array<GenericFile> = [];
  protected filteredInstruments: Observable<Instrument[]>;

  constructor(private dataService: DataService, private rest: RestService, private dbDict: DbDictionariesService) {
    this.instrFormControl = new FormControl();
    this.filteredInstruments = this.instrFormControl.valueChanges
      .pipe(startWith<string | Instrument>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(instr => instr ? this.filterInstr(instr) : this.instruments.slice())).pipe(map(arr => arr.sort((a, b) => a.voiceNumber - b.voiceNumber)));
  }

  ngOnInit() {
    this.dataService.instruments.subscribe(instruments => this.instruments = instruments);
    this.dbDict.updateInstruments(true);
  }
  filterInstr(name: any) {
    if (name instanceof Instrument) {
      return this.instruments.filter(instr => instr.name === name.name);
    }
    return this.instruments.filter(instr => instr.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  displayInstrument(instr: Instrument): string | null {
    return instr ? instr.name + ' ' + instr.voiceNumber : null;
  }
  instrumentSelected(option: MatAutocompleteSelectedEvent) {
    if (option.option.value) {
      this.rest.getFileMetadataWithPreviewByInstrument(option.option.value).subscribe(resp => {
        this.metaDataPDFList = resp;
      })
    }
  }
}
