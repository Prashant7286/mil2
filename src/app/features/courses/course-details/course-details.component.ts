import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data.service';

import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../dashboard/header/header.component';
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent]
})
export class CourseDetailsComponent implements OnInit {
  course: any;
  author: any;
  curriculum: any[] = [];
  selectedTab: string = 'overview';
  testimonials: any[] = [];
  expandedSection: number | null = 0;
  allExpanded: boolean = false;
  expandAllSections() {
    this.allExpanded = !this.allExpanded;
    if (this.allExpanded) {
      this.expandedSection = null;
    }
  }

  toggleSection(idx: number) {
    this.expandedSection = this.expandedSection === idx ? null : idx;
  }

  getTotalLectures(): number {
    if (!this.curriculum) return 0;
    return this.curriculum.reduce((sum: number, sec: any) => sum + (sec.lectures?.length || 0), 0);
  }

  getTotalDuration(): string {
    if (!this.curriculum) return '0 min';
    const total = this.curriculum.reduce((sum: number, sec: any) => sum + (sec.lectures?.reduce((s: number, l: any) => s + (l.durationMinutes || 0), 0) || 0), 0);
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    return hours > 0 ? `${hours}h ${mins}m total length` : `${mins} min total length`;
  }

  getSectionDuration(section: any): string {
    if (!section || !section.lectures) return '0 min';
    const total = section.lectures.reduce((sum: number, l: any) => sum + (l.durationMinutes || 0), 0);
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;
  }

  relatedCourses = [
    {
      title: 'Artificial Intelligence Professional Certificate',
      thumbnailUrl: 'https://i.imgur.com/3q6CqYq.png',
      durationText: '24 Hours',
      lastUpdated: '2/2024',
      rating: 4.8,
      reviewCount: 63838,
      badge: 'Highest Rated'
    },
    {
      title: 'Machine Learning A-Z: AI, Python & R',
      thumbnailUrl: 'https://i.imgur.com/nNn1y4J.png',
      durationText: '24 Hours',
      lastUpdated: '1/2024',
      rating: 4.6,
      reviewCount: 53843,
      badge: 'Highest Rated'
    },
    {
      title: 'The Data Science Course: Complete Data Science Bootcamp',
      thumbnailUrl: 'https://i.imgur.com/gK9fI5P.png',
      durationText: '26 Hours',
      lastUpdated: '12/2023',
      rating: 4.5,
      reviewCount: 35959,
      badge: 'Bestseller'
    },
    {
      title: 'Python for Data Science and Machine Learning Bootcamp',
      thumbnailUrl: 'https://i.imgur.com/Y8L4En5.png',
      durationText: '45.5 Hours',
      lastUpdated: '11/2023',
      rating: 4.2,
      reviewCount: 27659,
      badge: null
    },
    {
      title: 'Tableau for Beginners: Get Certified in Data Visualization',
      thumbnailUrl: 'https://i.imgur.com/3q6CqYq.png',
      durationText: '18 Hours',
      lastUpdated: '10/2023',
      rating: 4.0,
      reviewCount: 19559,
      badge: null
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.dataService.getCourseById(courseId).subscribe(course => {
      this.course = course;
      this.dataService.getUserById(course.authorId).subscribe(author => {
        this.author = author;
      });
      this.dataService.getCurriculumByCourseId(courseId).subscribe(curriculum => {
        this.curriculum = curriculum;
      });
      this.loadTestimonials(courseId);
    });
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  loadTestimonials(courseId: number) {
    this.dataService.getReviewsByCourseId(courseId).subscribe(reviews => {
      if (reviews && reviews.length) {
        this.dataService.getUsers().subscribe(users => {
          this.testimonials = reviews.map(r => {
            const user = users.find(u => u.id === r.userId);
            return {
              ...r,
              fullName: user?.fullName || 'Anonymous',
              avatarUrl: user?.avatarUrl || '',
              track: user?.track || ''
            };
          });
        });
      } else {
        // 2 default testimonials if none exist in db.json
        this.testimonials = [
          {
            rating: 4.8,
            comment: 'The Google Data Analytics course was a pivotal moment in my career. I went from having a basic understanding of spreadsheets to confidently performing complex queries in SQL and building amazing dashboards in Tableau.',
            fullName: 'Wade Warren',
            avatarUrl: 'https://i.pravatar.cc/150?u=wwarren',
            track: 'Learning for U.S'
          },
          {
            rating: 4.7,
            comment: 'I was stuck in a marketing role with no room for growth. This data analytics program was a game-changer. The curriculum is incredibly well-structured, taking you from the basics of data cleaning to advanced machine learning concepts.',
            fullName: 'Jacob Jones',
            avatarUrl: 'https://i.pravatar.cc/150?u=jjones',
            track: 'Learning for India'
          }
        ];
      }
    });
  }
}
