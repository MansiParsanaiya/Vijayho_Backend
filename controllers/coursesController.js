// courseController.js
const courses = [
    { id: 1, name: 'React' },
    { id: 2, name: 'Flutter' },
    { id: 3, name: 'Graphics Designing' },
    { id: 4, name: 'c language' },
    // Add more courses as needed
  ];
  
  // Controller function to get all courses
  exports.getAllCourses = (req, res) => {
    res.json(courses);
  };
  