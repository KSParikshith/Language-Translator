import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguagetransComponent } from './languagetrans.component';

describe('LanguagetransComponent', () => {
  let component: LanguagetransComponent;
  let fixture: ComponentFixture<LanguagetransComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguagetransComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LanguagetransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
