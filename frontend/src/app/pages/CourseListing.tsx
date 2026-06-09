import { useState } from 'react';
import { Link } from 'react-router';
import { Search, BookOpen, Star, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const courses = [
  { id: 1, title: 'JEE Advanced Preparation', category: 'Engineering', class: 'Class 11-12', price: 15999, rating: 4.8, students: 5234 },
  { id: 2, title: 'NEET Complete Course', category: 'Medical', class: 'Class 11-12', price: 14999, rating: 4.9, students: 4567 },
  { id: 3, title: 'CBSE Mathematics', category: 'School', class: 'Class 10', price: 8999, rating: 4.7, students: 8901 },
  { id: 4, title: 'Physics Masterclass', category: 'Science', class: 'Class 11-12', price: 9999, rating: 4.6, students: 3456 },
  { id: 5, title: 'Chemistry Complete', category: 'Science', class: 'Class 11-12', price: 9999, rating: 4.8, students: 4123 },
  { id: 6, title: 'Biology for NEET', category: 'Medical', class: 'Class 11-12', price: 10999, rating: 4.9, students: 3890 },
  { id: 7, title: 'English Literature', category: 'School', class: 'Class 9-10', price: 6999, rating: 4.5, students: 6234 },
  { id: 8, title: 'Social Science', category: 'School', class: 'Class 10', price: 5999, rating: 4.6, students: 7123 },
  { id: 9, title: 'Computer Science', category: 'Technology', class: 'Class 11-12', price: 11999, rating: 4.7, students: 5678 }
];

export default function CourseListing() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  const classes = ['All', 'Class 9-10', 'Class 10', 'Class 11-12'];
  const categories = ['All', 'Engineering', 'Medical', 'School', 'Science', 'Technology'];
  const priceRanges = ['All', 'Under ₹7,000', '₹7,000 - ₹12,000', 'Above ₹12,000'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === 'All' || course.class === selectedClass;
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;

    let matchesPrice = true;
    if (priceRange === 'Under ₹7,000') matchesPrice = course.price < 7000;
    else if (priceRange === '₹7,000 - ₹12,000') matchesPrice = course.price >= 7000 && course.price <= 12000;
    else if (priceRange === 'Above ₹12,000') matchesPrice = course.price > 12000;

    return matchesSearch && matchesClass && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="bg-gradient-to-br from-primary-light to-accent py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground mb-6">Explore Courses</h1>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <Card>
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Filters</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Class</h4>
                  <div className="space-y-2">
                    {classes.map((cls) => (
                      <label key={cls} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="class"
                          checked={selectedClass === cls}
                          onChange={() => setSelectedClass(cls)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm">{cls}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === range}
                          onChange={() => setPriceRange(range)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-sm">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedClass('All');
                    setSelectedCategory('All');
                    setPriceRange('All');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </Card>
          </aside>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} hover>
                  <div className="aspect-video bg-gradient-to-br from-primary-light to-accent rounded-[12px] mb-4 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary" />
                  </div>

                  <div className="mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-1 rounded-[8px]">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{course.class}</p>

                  <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-semibold text-foreground">{course.rating}</span>
                    </div>
                    <span>{course.students.toLocaleString()} students</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-2xl font-bold text-primary">₹{course.price.toLocaleString()}</span>
                    <Link to={`/courses/${course.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
