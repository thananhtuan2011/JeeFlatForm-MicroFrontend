import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewConfigStatusComponent } from './view-config-status.component';


describe('DepartmentProjectTabComponent', () => {
  let component: ViewConfigStatusComponent;
  let fixture: ComponentFixture<ViewConfigStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewConfigStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewConfigStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
