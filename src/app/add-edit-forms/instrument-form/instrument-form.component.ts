import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Instrument } from '@app/shared/instrument';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-instrument-form',
  templateUrl: './instrument-form.component.html',
  styleUrls: ['./instrument-form.component.css']
})
export class InstrumentFormComponent implements OnInit {
  name: FormControl;
  voiceNumber: FormControl;
  pitch: FormControl;
  error = null;
  instrumentForm: FormGroup;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.createFormControls();
    this.createForm();
  }
  createFormControls() {
    this.name = new FormControl('', Validators.required);
    this.voiceNumber = new FormControl('', [Validators.required, Validators.min(1)]);
    this.pitch = new FormControl('', Validators.required);
  }

  createForm() {
    this.instrumentForm = new FormGroup({
      name: this.name,
      voiceNumber: this.voiceNumber,
      pitch: this.pitch
    });
  }

  add(formDirective: FormGroupDirective) {
    const instrument = new Instrument(this.name.value, this.pitch.value, this.voiceNumber.value);
    this.http.post(environment.server + environment.instrument_endpoint, instrument).subscribe(resp => {
      this.error = resp;
      this.clear(formDirective);
    }, err => {
      this.error = err;
    })
  }

  clear(formDirective: FormGroupDirective) {
    this.instrumentForm.reset();
    formDirective.resetForm();
  }
}
