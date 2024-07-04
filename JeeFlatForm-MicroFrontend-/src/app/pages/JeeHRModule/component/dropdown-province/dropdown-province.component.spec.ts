import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownProvinceComponent } from './dropdown-province.component';


describe('DropdownProvinceComponent', () => {
  let component: DropdownProvinceComponent;
  let fixture: ComponentFixture<DropdownProvinceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownProvinceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownProvinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
