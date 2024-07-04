import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessDownloadComponent } from './process-download.component';

describe('ProcessDownloadComponent', () => {
  let component: ProcessDownloadComponent;
  let fixture: ComponentFixture<ProcessDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
