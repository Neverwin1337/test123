import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/';
const cookieHeader = 'userId=s%3A1.yQdeJ1s4GsXb%2FbxjrNeDrVoLVUdFleHogFcbmR05ouE; userType=s%3Astaff.SwDlaK0qA4lvZHTqjqokxt38rBJSIQnX4zzXagkj1lg';

async function testGetGradeByStudentAndCourse() {
  const url = `${BASE_URL}grades/by-student-course`;
console.log(url)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      student_id: 1,
      course_id: 1,
    }),
  });

  const data = await res.json().catch(() => ({}));

  console.log('Status:', res.status);
  console.log('Body:', data);
}

testGetGradeByStudentAndCourse().catch(console.error);