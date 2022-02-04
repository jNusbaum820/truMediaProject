import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPlayerComponent } from './loading-player.component';

describe('LoadingPlayerComponent', () => {
  let component: LoadingPlayerComponent;
  let fixture: ComponentFixture<LoadingPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingPlayerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
