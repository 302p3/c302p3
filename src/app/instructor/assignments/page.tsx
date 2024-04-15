'use client'

import React, { useState } from 'react';
import styles from './page.module.css';
import Page, { Header, Body } from "../../../components/Page";




const InstructorAssignments = () => {
  // Dummy assignments data
  const [assignments, setAssignments] = useState([
    { id: 1, name: 'Assignment 1', dueDate: '2024-03-20', markedCount: 5, totalCount: 5, marksPublished: false },
    { id: 2, name: 'Assignment 2', dueDate: '2024-03-25', markedCount: 3, totalCount: 10, marksPublished: false },
    { id: 3, name: 'Assignment 3', dueDate: '2024-05-01', markedCount: 0, totalCount: 10, marksPublished: false },
    // Add more assignments as needed
  ]);

  const handleReview = (assignmentId: number, studentId: number) => {
    // Handle review functionality here
    console.log(`Reviewing assignment with ID: ${assignmentId} on student with ID: ${studentId}`);
    location.href = `/instructor/assignments/review?student=${studentId}`;
  };

  const handlePublishMarks = (assignmentId: number) => {
    const TargetAssignmentIndex = assignments.findIndex((assignment) => assignment.id === assignmentId);
    if (TargetAssignmentIndex === -1) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }
    const updatedAssignments = [...assignments];
    updatedAssignments[TargetAssignmentIndex].marksPublished = true;
    setAssignments(updatedAssignments);
  };

  const handleNewAssignment = () => {
    // Handle creation of a new assignment functionality here
    console.log('Creating a new assignment');
    location.href = "/instructor/assignments/create"
  };

  // generate dummy data for students
  const getUnmarkedStudents = (assignmentId: number) => {
    const targetAssignment = assignments.find((assignment) => assignment.id === assignmentId);
    if (!targetAssignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }
    const unmarkedStudents = targetAssignment.totalCount - targetAssignment.markedCount;
    const StudentList = [];
    for (let i = 1; i <= unmarkedStudents; i++) {
      StudentList.push({ id: i, name: `Student ${i}` });
    }
    return StudentList;
  }
  const getMarkedStudents = (assignmentId: number) => {
    const targetAssignment = assignments.find((assignment) => assignment.id === assignmentId);
    if (!targetAssignment) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }
    const unmarkedStudentCount = targetAssignment.totalCount - targetAssignment.markedCount;
    const StudentList = [];
    for (let i = 1; i <= targetAssignment.markedCount; i++) {
      StudentList.push({ id: i, name: `Student ${i + unmarkedStudentCount}` });
    }
    return StudentList;
  }

  return (
    <Page>
      <Header text="Create Assignment" />
      <Body>
        <div>
          <div className={styles.assignmentsContainer}>
            <div className={styles.buttons}>
              <button onClick={handleNewAssignment}>Create New Assignment</button>
            </div>
            {assignments.map((assignment) => (
              <div key={assignment.id} className={styles.assignmentTile}>
                <div className={styles.assignmentInfo}>
                  <h3>{assignment.name}</h3>
                  <p>Due Date: {assignment.dueDate}</p>
                  {/* display a count of marked assignments if past due date */}
                  {Date.now() > Date.parse(assignment.dueDate) ?
                    <span>{assignment.markedCount} / {assignment.totalCount} Marked ({assignment.marksPublished ? "Published" : "Unpublished"})</span>
                    :
                    null}
                </div>
                <div className={styles.actions}>
                  {/* Allow instructor to review assignments if past due date */}
                  {Date.now() > Date.parse(assignment.dueDate) ?
                    <div className={styles.dropdown}>
                      <button className={styles.dropbtn}>Review Students</button>
                      <div className={styles.dropdownContent}>
                        {assignment.markedCount != assignment.totalCount ? (<p>Unmarked Submissions:</p>) : null}
                        <div className={styles.studentList}>
                          {getUnmarkedStudents(assignment.id).map((student) => (
                            <button key={student.id} onClick={() => handleReview(assignment.id, student.id)}>{student.name}</button>
                          ))}
                        </div>
                        {assignment.markedCount > 0 ? (<p>Marked Submissions:</p>) : null}
                        <div className={styles.studentList}>
                          {getMarkedStudents(assignment.id).map((student) => (
                            <button key={student.id} onClick={() => handleReview(assignment.id, student.id)}>{student.name}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    :
                    null}
                  {/* allow instructor to publish marks if all submissions are marked */}
                  {(assignment.markedCount == assignment.totalCount && !assignment.marksPublished) ?
                    (<button onClick={() => handlePublishMarks(assignment.id)}>Publish Marks</button>)
                    :
                    null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Body>
    </Page>
  );
};

export default InstructorAssignments;
