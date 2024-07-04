import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateCenterComponent } from './template-center.component';

describe('TemplateCenterComponent', () => {
  let component: TemplateCenterComponent;
  let fixture: ComponentFixture<TemplateCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateCenterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
