import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportWordComponent } from './export-word.component';

describe('ExportWordComponent', () => {
  let component: ExportWordComponent;
  let fixture: ComponentFixture<ExportWordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportWordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
