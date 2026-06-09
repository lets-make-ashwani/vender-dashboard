import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  BookText,
  FlaskConical,
  Atom,
  GraduationCap,
  Trophy,
} from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { PopularCourseCard } from './PopularCourseCard';
import './PopularCourses.css';

const PopularCourseCardSkeleton: React.FC = () => {
  return (
    <div className="popular-card rounded-[24px] p-6" style={{ background: '#f9fafb' }}>
      <div className="card-icon w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-white shadow-sm">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <div className="card-content">
        <Skeleton className="w-[60%] h-8 mt-[20px] mb-2" />
        <Skeleton className="w-[90%] h-4" />
      </div>
      <div className="card-arrow absolute bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm" style={{ opacity: 0.5 }}>
        <Skeleton className="w-6 h-6 rounded-full" />
      </div>
    </div>
  );
};

// Icon mapping helper
const iconMap: Record<string, React.ReactNode> = {
  'BookOpen': <BookOpen size={24} />,
  'BookText': <BookText size={24} />,
  'FlaskConical': <FlaskConical size={24} />,
  'Atom': <Atom size={24} />,
  'GraduationCap': <GraduationCap size={24} />,
  'Trophy': <Trophy size={24} />,
};

// API Types
interface ApiClass {
  id: number;
  name: string;
  slug: string;
  order: number;
  description: string;
  bg_color: string | null;
  icon: string | null;
  icon_color: string | null;
  unique_alias: string | null;
}

interface ApiBoard {
  id: number;
  name: string;
  official_title: string;
  slug: string;
  order: number;
  description: string;
  classes: ApiClass[];
}

interface PopularCourse {
  title: string;
  subtitle: string;
  iconName: string | null;
  bgColor: string;
  accentColor: string;
  path: string;
  board?: string;
}

export const PopularCourses: React.FC = () => {
  const [courses, setCourses] = useState<PopularCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularCourses = async () => {
      try {
        setIsLoading(true);
        // Mock API call simulation
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockApiResponse = {
          "success": true,
          "message": "Boards",
          "status_code": 200,
          "data": [
            {
              "id": 1,
              "name": "CBSE Science",
              "official_title": "Central Board of Secondary Education",
              "slug": "cbse-science",
              "order": 1,
              "description": "Central Board of Secondary Education",
              "classes": [
                {
                  "id": 1,
                  "name": "Class 9",
                  "slug": "class-9",
                  "order": 9,
                  "description": "Secondary school - Grade 9",
                  "bg_color": "#EBF5FF",
                  "icon": "BookOpen",
                  "icon_color": "#3B82F6",
                  "unique_alias": null
                },
                {
                  "id": 2,
                  "name": "Class 10",
                  "slug": "class-10",
                  "order": 10,
                  "description": "Secondary school - Grade 10",
                  "bg_color": "#E6FFFA",
                  "icon": "BookText",
                  "icon_color": "#319795",
                  "unique_alias": null
                },
                {
                  "id": 3,
                  "name": "Class 11",
                  "slug": "class-11",
                  "order": 11,
                  "description": "Senior secondary - Grade 11 (Science)",
                  "bg_color": "#F5F3FF",
                  "icon": "FlaskConical",
                  "icon_color": "#8B5CF6",
                  "unique_alias": null
                },
                {
                  "id": 4,
                  "name": "Class 12",
                  "slug": "class-12",
                  "order": 12,
                  "description": "Senior secondary - Grade 12 (Science)",
                  "bg_color": "#FFF5F5",
                  "icon": "Atom",
                  "icon_color": "#F56565",
                  "unique_alias": null
                }
              ]
            },
            {
              "id": 2,
              "name": "UP Board",
              "official_title": "Uttar Pradesh Madhyamik Shiksha Parishad",
              "slug": "up-board",
              "order": 2,
              "description": "string",
              "classes": [
                {
                  "id": 1,
                  "name": "Class 9",
                  "slug": "class-9",
                  "order": 9,
                  "description": "Secondary school - Grade 9",
                  "bg_color": "#EBF5FF",
                  "icon": "BookOpen",
                  "icon_color": "#3B82F6",
                  "unique_alias": null
                },
                {
                  "id": 2,
                  "name": "Class 10",
                  "slug": "class-10",
                  "order": 10,
                  "description": "Secondary school - Grade 10",
                  "bg_color": "#E6FFFA",
                  "icon": "BookText",
                  "icon_color": "#319795",
                  "unique_alias": null
                }
              ]
            },
            {
              "id": 3,
              "name": "Bihar Board",
              "official_title": "Bihar School Examination Board",
              "slug": "bihar-board",
              "order": 3,
              "description": "string",
              "classes": [
                {
                  "id": 3,
                  "name": "Class 11",
                  "slug": "class-11",
                  "order": 11,
                  "description": "Senior secondary - Grade 11 (Science)",
                  "bg_color": "#F5F3FF",
                  "icon": "FlaskConical",
                  "icon_color": "#8B5CF6",
                  "unique_alias": null
                }
              ]
            }
          ]
        }

        const colorSchemes = [
          { bg: '#fffaf3', accent: '#ff6b1a' }, // Class 9
          { bg: '#eefdf5', accent: '#16a34a' }, // Class 10
          { bg: '#f5f0ff', accent: '#7c3aed' }, // Class 11
          { bg: '#fff0f3', accent: '#ef4444' }  // Class 12
        ];

        // Transform nested board/class data into flat popular course cards
        const transformedData: PopularCourse[] = (mockApiResponse.data as any[]).flatMap((board: ApiBoard) =>
          board.classes.map((cls: ApiClass, index) => {
            const scheme = colorSchemes[index % 4];
            return {
              title: cls.name,
              subtitle: cls.description,
              bgColor: scheme.bg,
              accentColor: scheme.accent,
              iconName: cls.icon,
              path: `/courses`,
              board: board.name.split(' ')[0] // Short name for badge
            };
          })
        );

        // Only show 4 featured courses on homepage
        setCourses(transformedData.slice(0, 4));
      } catch (error) {
        console.error("Error fetching popular courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularCourses();
  }, []);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="popular-section">
        <div className="section-title">
          <GraduationCap size={40} className="text-[#071b4d]" />
          <span>
            Start Learning <span className="text-[#ff6b1a]">By Class</span>
          </span>
        </div>

        <div className="popular-courses-grid">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <PopularCourseCardSkeleton key={index} />
            ))
          ) : (
            courses.map((course, index) => (
              <PopularCourseCard
                key={index}
                title={course.title}
                subtitle={course.subtitle}
                icon={iconMap[course.iconName || "BookOpen"] || <BookOpen size={32} />}
                badge={course.board}
                backgroundColor={course.bgColor}
                accentColor={course.accentColor}
                path={course.path}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};