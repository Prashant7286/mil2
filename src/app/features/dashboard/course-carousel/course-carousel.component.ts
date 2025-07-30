import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent } from '../course-card/course-card.component';

@Component({
  selector: 'app-course-carousel',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  templateUrl: './course-carousel.component.html',
  styleUrl: './course-carousel.component.css'
})
export class CourseCarouselComponent {
  @Input() title = '';
  @Input() courses: any[] = [];

  scrollCarousel(direction: 'left' | 'right') {
    const carousel = document.querySelector('.carousel-section .carousel') as HTMLElement;
    if (!carousel) return;
    const scrollAmount = 320;
    if (direction === 'left') {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
