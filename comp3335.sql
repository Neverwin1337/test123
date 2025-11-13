-- create table student  
CREATE TABLE students (
  `id` INT NOT NULL AUTO_INCREMENT,
  `password` BLOB NULL,
  `last_name` VARCHAR(45) NULL,
  `first_name` VARCHAR(45) NULL,
  `gender` VARCHAR(45) NULL,
  `identification_number` BLOB NULL,
  `address` BLOB NULL,
  `email` BLOB NULL,
  `phone` BLOB NULL,
  `enrollment_year` INT NULL,
  `guardian_id` INT NULL,
  `guardian_relation` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));




-- create table guardians 
CREATE TABLE guardians (
  `id` INT NOT NULL AUTO_INCREMENT,
  `password` BLOB NULL,
  `last_name` VARCHAR(45) NULL,
  `first_name` VARCHAR(45) NULL,
  `email` BLOB NULL,
  `phone` BLOB NULL,
  PRIMARY KEY (`id`));


--  add foreign key “guardian_id: the ID of a student’s guardian (foreign key)”
ALTER TABLE students
ADD CONSTRAINT fk_student_guardian_id
FOREIGN KEY (guardian_id) REFERENCES guardians(id);


--  create table staffs 
	CREATE TABLE staffs (
  `id` INT NOT NULL AUTO_INCREMENT,
  `password` BLOB NULL,
  `last_name` VARCHAR(45) NULL,
  `first_name` VARCHAR(45) NULL,
  `gender` VARCHAR(45) NULL,
  `identification_number` BLOB NULL,
  `address` BLOB NULL,
  `email` BLOB NULL,
  `phone` BLOB NULL,
  `department` VARCHAR(45) NULL,
  `role` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

-- create table courses 
CREATE TABLE courses ( 
 `id` INT NOT NULL AUTO_INCREMENT,
`course_name` VARCHAR(45) NULL,
 PRIMARY KEY (`id`));

--  create table grade
	CREATE TABLE grades (
  `id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `term` VARCHAR(45) NULL,
  `grade` BLOB NULL,
  `comments` BLOB NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT fk_grades_student_id FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_grades_course_id FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- create table disciplinary_records
    CREATE TABLE disciplinary_records (
  `id` INT NOT NULL AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `date` DATE NULL,
  `staff_id` INT NOT NULL,
  `descriptions` BLOB NULL,
  PRIMARY KEY (`id`),
 CONSTRAINT fk_disciplinary_records_student_id FOREIGN KEY (student_id) REFERENCES students(id),
  CONSTRAINT fk_disciplinary_records_staff_id FOREIGN KEY (staff_id) REFERENCES staffs(id)
);


