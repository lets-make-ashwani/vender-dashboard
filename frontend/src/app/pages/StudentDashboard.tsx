import { Routes, Route, Navigate } from 'react-router';
import { BookOpen, Award, Download, HelpCircle, UserCircle, Settings, BarChart3, Play, CheckCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';

const sidebarItems = [
  { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  { icon: BookOpen, label: 'My Courses', path: '/courses' },
  { icon: Award, label: 'Certificates', path: '/certificates' },
  { icon: Download, label: 'Downloads', path: '/downloads' },
  { icon: HelpCircle, label: 'Support', path: '/support' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Rahul!</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="text-3xl font-bold text-foreground mb-1">3</p>
            <p className="text-muted-foreground">Active Courses</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <Award className="w-12 h-12 text-success mx-auto mb-3" />
            <p className="text-3xl font-bold text-foreground mb-1">2</p>
            <p className="text-muted-foreground">Certificates Earned</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-warning mx-auto mb-3" />
            <p className="text-3xl font-bold text-foreground mb-1">68%</p>
            <p className="text-muted-foreground">Average Progress</p>
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Continue Learning</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card hover>
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-light to-accent rounded-[12px] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-16 h-16 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">JEE Advanced Preparation</h3>
                <p className="text-sm text-muted-foreground mb-3">Physics - Chapter 5: Thermodynamics</p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary font-semibold">75%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <Button size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-light to-accent rounded-[12px] flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-16 h-16 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-2">CBSE Mathematics</h3>
                <p className="text-sm text-muted-foreground mb-3">Algebra - Quadratic Equations</p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary font-semibold">60%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <Button size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Tests</h3>
          <div className="space-y-3">
            {[
              { subject: 'Physics Mock Test 5', date: 'June 10, 2026', time: '10:00 AM' },
              { subject: 'Mathematics Chapter Test', date: 'June 12, 2026', time: '2:00 PM' },
              { subject: 'Chemistry Weekly Test', date: 'June 15, 2026', time: '11:00 AM' }
            ].map((test, idx) => (
              <div key={idx} className="p-4 bg-muted rounded-[12px] flex justify-between items-center">
                <div>
                  <p className="font-semibold text-foreground">{test.subject}</p>
                  <p className="text-sm text-muted-foreground">{test.date} at {test.time}</p>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {[
              { title: 'Completed Chapter 4', course: 'JEE Physics', date: '2 days ago' },
              { title: 'Scored 95% in Mock Test', course: 'Mathematics', date: '5 days ago' },
              { title: 'Finished Module 2', course: 'Chemistry', date: '1 week ago' }
            ].map((achievement, idx) => (
              <div key={idx} className="p-4 bg-success/10 rounded-[12px] flex gap-3">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.course} • {achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const MyCourses = () => {
  const courses = [
    { title: 'JEE Advanced Preparation', progress: 75, totalLectures: 250, completedLectures: 187, instructor: 'Dr. Rajesh Kumar' },
    { title: 'CBSE Mathematics', progress: 60, totalLectures: 150, completedLectures: 90, instructor: 'Prof. Amit Verma' },
    { title: 'Physics Masterclass', progress: 45, totalLectures: 180, completedLectures: 81, instructor: 'Dr. Suresh Patel' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {courses.map((course, idx) => (
          <Card key={idx} hover>
            <div className="aspect-video bg-gradient-to-br from-primary-light to-accent rounded-[12px] mb-4 flex items-center justify-center">
              <BookOpen className="w-20 h-20 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{course.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">Instructor: {course.instructor}</p>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="text-primary font-semibold">{course.progress}%</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {course.completedLectures} of {course.totalLectures} lectures completed
              </p>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Play className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
              <Button variant="outline">View Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Certificates = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { course: 'CBSE Class 9 Mathematics', date: 'May 15, 2026', grade: 'A+' },
        { course: 'Physics Foundation Course', date: 'April 20, 2026', grade: 'A' }
      ].map((cert, idx) => (
        <Card key={idx} hover>
          <div className="aspect-video bg-gradient-to-br from-primary to-primary-dark rounded-[12px] mb-4 flex items-center justify-center">
            <Award className="w-20 h-20 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{cert.course}</h3>
          <p className="text-sm text-muted-foreground mb-3">Completed on {cert.date}</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Grade:</span>
            <span className="text-lg font-bold text-primary">{cert.grade}</span>
          </div>
          <Button variant="outline" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </Button>
        </Card>
      ))}

      <Card className="border-2 border-dashed border-border flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Award className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Complete more courses to earn certificates</p>
        </div>
      </Card>
    </div>
  </div>
);

const Profile = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold text-primary">R</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Rahul Kumar</h2>
          <p className="text-muted-foreground">Student ID: STU00123</p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Email</span>
            <span className="text-foreground font-semibold">rahul@example.com</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Phone</span>
            <span className="text-foreground font-semibold">+91 98765 43210</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Class</span>
            <span className="text-foreground font-semibold">Class 12</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">School</span>
            <span className="text-foreground font-semibold">Delhi Public School</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-foreground mb-4">Learning Statistics</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary-light rounded-[12px]">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-success/10 rounded-[12px]">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">358</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-warning/10 rounded-[12px]">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-[12px]">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold text-foreground">87%</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar items={sidebarItems} basePath="/student" />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<MyCourses />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/downloads" element={<div className="p-6"><h1 className="text-3xl font-bold">Downloads</h1></div>} />
          <Route path="/support" element={<div className="p-6"><h1 className="text-3xl font-bold">Support</h1></div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Settings</h1></div>} />
        </Routes>
      </main>
    </div>
  );
}
