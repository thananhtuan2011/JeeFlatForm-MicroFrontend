import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewfileComponent } from './previewfile.component';

describe('PreviewfileComponent', () => {
  let component: PreviewfileComponent;
  let fixture: ComponentFixture<PreviewfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
