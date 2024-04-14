'use client'

import React from 'react';
import styles from './page.module.css';
import { useSearchParams } from 'next/navigation';
import Page, { Header, Body } from "../../../components/Page";

interface Assignment {
  id: number;
  courseId: number;
  name: string;
  dueDate: string;
  weight: string;
  state: string;
  grade: string; // New field for storing the grade
}

interface Course {
  id: number;
  name: string;
}

function handleClick(assignment: Assignment, course: Course) {
  if (assignment.state == 'not-submitted' || assignment.state == 'submitted') {
    location.href=`/student/assignments/submission?id=${assignment.id}`;
  } else if (assignment.state == 'graded') {
    location.href=`/student/assignments/review?id=${assignment.id}`;
  }
}

const getBubbleClass = (state: string, index: number) => {
  switch (state) {
    case 'not-submitted':
      return index === 0 ? styles['bubble-full'] : styles['bubble-empty'];
    case 'submitted':
      return index <= 1 ? styles['bubble-full'] : styles['bubble-empty'];
    case 'graded':
      return styles['bubble-full'];
    default:
      return '';
  }
};

const getButtonClass = (state: string) => {
  switch (state) {
    case 'not-submitted':
      return styles['assignment-submit'];
    case 'submitted':
      return styles['assignment-edit'];
    case 'graded':
      return styles['assignment-review'];
    default:
      return '';
  }
};

const getButtonText = (state: string) => {
  switch (state) {
    case 'not-submitted':
      return 'Submit';
    case 'submitted':
      return 'Edit';
    case 'graded':
      return 'Review';
    default:
      return '';
  }
};

const StudentAssignments = () => {
  const searchParams = useSearchParams();
  const submitted = searchParams.get('submitted');

  // Dummy data
  const coursesData: Course[] = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'English' },
  ];

  let assignmentsData: Assignment[] = [
    { id: 1, courseId: 1, name: 'Assignment 1', dueDate: 'March 20, 2024', weight: '20%', state: ((submitted === 'true') ? 'submitted' : 'not-submitted'), grade: 'Grading Incomplete' },
    { id: 2, courseId: 1, name: 'Assignment 2', dueDate: 'March 25, 2024', weight: '30%', state: 'submitted', grade: 'B+' },
    { id: 3, courseId: 2, name: 'Assignment 1', dueDate: 'March 20, 2024', weight: '25%', state: 'graded', grade: 'A' },
    { id: 4, courseId: 2, name: 'Assignment 2', dueDate: 'March 25, 2024', weight: '25%', state: 'not-submitted', grade: 'Grading Incomplete' },
  ];

  // Handle stored assignment data
  const storedData = localStorage.getItem("assignments");
  if (storedData) {
    // If stored data exists
    // Load stored assignment data
    assignmentsData = JSON.parse(storedData);
  } else {
    // If no stored data exists (fresh instance)
    // Store default assignment data
    localStorage.setItem("courses", JSON.stringify(coursesData));
    localStorage.setItem("assignments", JSON.stringify(assignmentsData));
  }
  
  return (
    <Page>
      <Header text="Assignments" />
      <Body>
        <div className={styles['student-assignments']}>
          {coursesData.map((course) => (
            <div key={course.id} className={styles['course-container']}>
              <div className={styles['course-info']}>
                <h2>{course.name}</h2>
              </div>
              <div className={styles['assignment-list']}>
                {assignmentsData
                  .filter((assignment) => assignment.courseId === course.id)
                  .map((assignment) => (
                    <div key={assignment.id} className={styles.assignment}>
                      <h3 className={styles['assignment-title']}>{assignment.name}</h3>
                      <p>Due Date: {assignment.dueDate}</p>
                      <div>
                      <span><b>Weight</b>: {assignment.weight}</span>
                      </div>
                      <div>
                      <span><b>Grade</b>: {assignment.state === 'graded' ? assignment.grade : 'Grading Incomplete'}</span>
                      </div>
                      <div className={styles['progress-indicator']}>
                      <div className={styles['key-value-pair']}>
                      <span className={styles['bubble-text']}>Open</span>
                      <div className={`${styles['bubble']} ${getBubbleClass(assignment.state, 0)}`}></div>
                      </div>
                      <div className={styles['key-value-pair']}>
                      <span className={styles['bubble-text']}>Submitted</span>
                      <div className={`${styles['bubble']} ${getBubbleClass(assignment.state, 1)}`}></div>
                      </div>
                      <div className={styles['key-value-pair']}>
                      <span className={styles['bubble-text']}>Graded</span>
                      <div className={`${styles['bubble']} ${getBubbleClass(assignment.state, 2)}`}></div>
                      </div>
                      </div>
                      <button className={`${styles['assignment-button']} ${getButtonClass(assignment.state)}`}
                              onClick={() => handleClick(assignment, course)}
                      >
                        {getButtonText(assignment.state)}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Body>
    </Page>
  );
};

export default StudentAssignments;
