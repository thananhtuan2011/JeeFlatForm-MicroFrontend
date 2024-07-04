import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewAllimgComponent } from './preview-allimg.component';

describe('PreviewAllimgComponent', () => {
  let component: PreviewAllimgComponent;
  let fixture: ComponentFixture<PreviewAllimgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewAllimgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewAllimgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
