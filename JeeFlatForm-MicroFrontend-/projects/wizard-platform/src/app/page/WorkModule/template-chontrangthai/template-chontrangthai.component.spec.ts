import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateChonTrangThaiComponent } from './template-chontrangthai.component';

describe('TemplateChonTrangThaiComponent', () => {
  let component: TemplateChonTrangThaiComponent;
  let fixture: ComponentFixture<TemplateChonTrangThaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateChonTrangThaiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateChonTrangThaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
