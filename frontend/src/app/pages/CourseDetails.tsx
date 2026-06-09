import { useParams, Link } from 'react-router';
import { BookOpen, Clock, Users, Award, CheckCircle, Star, Play } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';

const courseData: any = {
  '1': {
    title: 'JEE Advanced Preparation',
    category: 'Engineering',
    class: 'Class 11-12',
    price: 15999,
    rating: 4.8,
    students: 5234,
    duration: '12 months',
    lectures: 250,
    instructor: 'Dr. Rajesh Kumar',
    description: 'Complete preparation course for JEE Advanced with comprehensive coverage of Physics, Chemistry, and Mathematics. Includes live classes, recorded lectures, practice tests, and doubt clearing sessions.',
    benefits: [
      'Live interactive classes',
      '250+ video lectures',
      'Weekly mock tests',
      'Study material & notes',
      'Doubt clearing sessions',
      '24/7 support',
      'Previous year papers',
      'Mobile app access'
    ],
    curriculum: [
      { module: 'Physics', topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Modern Physics'] },
      { module: 'Chemistry', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'] },
      { module: 'Mathematics', topics: ['Calculus', 'Algebra', 'Trigonometry', 'Coordinate Geometry'] }
    ]
  },
  '2': {
    title: 'NEET Complete Course',
    category: 'Medical',
    class: 'Class 11-12',
    price: 14999,
    rating: 4.9,
    students: 4567,
    duration: '12 months',
    lectures: 220,
    instructor: 'Dr. Priya Sharma',
    description: 'Comprehensive NEET preparation covering Physics, Chemistry, and Biology with expert faculty and proven teaching methodology.',
    benefits: [
      'Live interactive classes',
      '220+ video lectures',
      'Weekly mock tests',
      'Study material & notes',
      'Doubt clearing sessions',
      '24/7 support',
      'NCERT coverage',
      'Mobile app access'
    ],
    curriculum: [
      { module: 'Physics', topics: ['Mechanics', 'Optics', 'Modern Physics'] },
      { module: 'Chemistry', topics: ['Physical Chemistry', 'Organic Chemistry', 'Inorganic Chemistry'] },
      { module: 'Biology', topics: ['Botany', 'Zoology', 'Human Physiology', 'Genetics'] }
    ]
  },
  '3': {
    title: 'CBSE Mathematics',
    category: 'School',
    class: 'Class 10',
    price: 8999,
    rating: 4.7,
    students: 8901,
    duration: '10 months',
    lectures: 150,
    instructor: 'Prof. Amit Verma',
    description: 'Complete CBSE Class 10 Mathematics course with chapter-wise coverage, practice problems, and exam preparation.',
    benefits: [
      'NCERT textbook coverage',
      '150+ video lectures',
      'Chapter-wise tests',
      'Sample papers',
      'Previous year questions',
      'Doubt sessions',
      'Study notes',
      'Board exam tips'
    ],
    curriculum: [
      { module: 'Algebra', topics: ['Polynomials', 'Linear Equations', 'Quadratic Equations'] },
      { module: 'Geometry', topics: ['Triangles', 'Circles', 'Coordinate Geometry'] },
      { module: 'Trigonometry', topics: ['Ratios', 'Identities', 'Applications'] },
      { module: 'Statistics', topics: ['Mean, Median, Mode', 'Probability'] }
    ]
  }
};

export default function CourseDetails() {
  const { id } = useParams();
  const course = courseData[id || '1'] || courseData['1'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-3">
                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-[8px]">
                  {course.category}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-primary-foreground/90 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-white" />
                  <span>{course.rating} rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  <span>{course.lectures} lectures</span>
                </div>
              </div>
            </div>

            <div>
              <Card className="sticky top-20">
                <div className="aspect-video bg-gradient-to-br from-primary-light to-accent rounded-[12px] mb-4 flex items-center justify-center">
                  <BookOpen className="w-20 h-20 text-primary" />
                </div>
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-primary mb-2">₹{course.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
                <Button className="w-full mb-3" size="lg">Enroll Now</Button>
                <Button variant="outline" className="w-full">Add to Wishlist</Button>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <h2 className="text-2xl font-bold text-foreground mb-4">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-foreground mb-4">Course Curriculum</h2>
              <div className="space-y-4">
                {course.curriculum.map((module: any, idx: number) => (
                  <div key={idx} className="border border-border rounded-[12px] p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      {module.module}
                    </h3>
                    <ul className="space-y-2 ml-7">
                      {module.topics.map((topic: string, topicIdx: number) => (
                        <li key={topicIdx} className="text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-foreground mb-4">Instructor</h2>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">{course.instructor[0]}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{course.instructor}</h3>
                  <p className="text-muted-foreground mb-3">Expert Educator</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span>{course.rating} rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <h3 className="font-semibold text-foreground mb-4">Course Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Duration: {course.duration}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Play className="w-5 h-5 text-primary" />
                  <span>{course.lectures} Video Lectures</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>Study Material Included</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Certificate on Completion</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Lifetime Access</span>
                </div>
              </div>
            </Card>

            <Card className="mt-6">
              <h3 className="font-semibold text-foreground mb-4">Related Courses</h3>
              <div className="space-y-3">
                {[1, 2, 3].filter(i => i.toString() !== id).slice(0, 2).map((i) => {
                  const relatedCourse = courseData[i.toString()];
                  return (
                    <Link key={i} to={`/courses/${i}`}>
                      <div className="p-3 bg-muted rounded-[12px] hover:bg-primary-light transition-colors">
                        <h4 className="font-semibold text-sm text-foreground mb-1">{relatedCourse.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{relatedCourse.class}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-semibold">₹{relatedCourse.price.toLocaleString()}</span>
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 fill-warning text-warning" />
                            <span>{relatedCourse.rating}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
