'use client'

import React, { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import Page, { Body, Header } from '@/components/Page';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'next/navigation';

const Submission = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const edit = searchParams.get('edit') == "true";

  // Get assignment data
  let coursesData = JSON.parse(localStorage.getItem("courses"));
  let assignmentsData = JSON.parse(localStorage.getItem("assignments"));
  const assignmentData = assignmentsData.find((element) => element.id == id);
  const courseData = coursesData.find((element) => element.id == assignmentData.courseId);
  
  const assignment = {
    name: assignmentData.name,
    dueDate: assignmentData.dueDate,
    className: courseData.name,
  };

  const rubricHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${assignment.className} Rubric</title>
      <style>
        body {
          background-color: white; /* Set background color of the body */
          font-family: Arial, sans-serif; /* Use a common font for better readability */
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px; /* Add some margin at the bottom for spacing */
        }
        th, td {
          border: 1px solid black;
          padding: 8px;
          text-align: center;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold; /* Make table headers bold */
        }
        td:first-child {
          text-align: left; /* Align first column content to the left */
        }
      </style>
    </head>
    <body>
      <h2>${assignment.className} Rubric</h2>
      <table>
        <tr>
          <th>Criteria</th>
          <th>Score</th>
        </tr>
        <tr>
          <td>Less than 25% errors</td>
          <td>0</td>
        </tr>
        <tr>
          <td>25-75% correct</td>
          <td>50</td>
        </tr>
        <tr>
          <td>75-100% correct</td>
          <td>100</td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Variables
  const [assignmentUploaded, setAssignmentUploaded] = useState((!edit && assignmentData.state == "submitted"));

  const handleFileUpload = (event) => {
    // Handle file drop functionality here
    event.preventDefault();
    console.log('File uploaded');
    setAssignmentUploaded(true);
    toast.success("Assignment Successfully Uploaded!", {
      position: "top-center",
      autoClose: 2500
    });
  };

  const handleSubmit = () => {
    // Handle submit functionality
    console.log('Assignment submitted');
    localStorage.setItem("assignments", JSON.stringify(assignmentsData.map((element) => {
      if (element.id == id) {
        return { ...element, state: "submitted" };
      }
      return element;
    })));
    location.href='/student/assignments';
  };

  const goBack = () => {
    // Handle go back functionality
    console.log('Go back');
    if (edit) {
      location.href=`/student/assignments/submission?id=${id}`;
    } else {
      location.href=`/student/assignments`;
    }
  };

  const showRubricInNewTab = () => {
    const newTab = window.open();
    newTab.document.write(rubricHTML);
    newTab.document.close();
  };

  return (
    <Page>
      <Header text="Submit Assignment" />
      <Body>
        <div className={styles.container}>
          <ToastContainer />
          <div className={styles.header}>
            <h1>{assignment.name}</h1>
            <div className={styles.submissionInfo}>
              <div className={styles.infoContainer}>Due Date: {assignment.dueDate}</div>
              <div className={styles.infoContainer}>Class Name: {assignment.className}</div>
              <button onClick={showRubricInNewTab}>View Rubric</button>
            </div>
          </div>
          { assignmentUploaded ? (
            <>
              <div className={styles.submittedAssignment}>
                <Image
                  src="/assignmentP1.png"
                  alt="assignment page 1"
                  width={600}
                  height={800}
                />
                <Image
                  src="/assignmentP2.png"
                  alt="assignment page 2"
                  width={600}
                  height={800}
                />
                <div className={styles.reupload}>
                  <a href={`/student/assignments/submission?id=${id}&edit=true`}>Upload a different file?</a>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.dropArea} onDrop={handleFileUpload} onDragOver={(e) => e.preventDefault()}>
              <div>
                <p>Drag and drop your file here</p>
                <input type="file" id="assignment" name="assignment" onChange={handleFileUpload} />
              </div>
            </div>
          )}
          <div className={styles.buttons}>
            <button onClick={goBack}>Back</button>
            { (edit || assignmentData.state != "submitted") ? (
                <button onClick={handleSubmit}>Submit</button>
              ) : null }
          </div>
        </div>
      </Body>
    </Page>
  );
};

export default Submission;