'use client'

import React, { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Page, { Body, Header } from '@/components/Page';

const rubricHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mathematics Rubric</title>
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
    <h2>Mathematics Rubric</h2>
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

const Submission = () => {
  const searchParams = useSearchParams();
  const submitted = searchParams.get('submitted');

  // Dummy assignment data
  const assignment = {
    name: 'Assignment 1',
    dueDate: '2024-03-20',
    className: 'Mathematics',
    rubricUrl: 'https://example.com/rubric'
  };

  // Variables
  const [assignmentUploaded, setAssignmentUploaded] = useState((submitted === "true"));

  const handleFileUpload = (event) => {
    // Handle file drop functionality here (not implemented yet)
    event.preventDefault();
    console.log('File uploaded');
    setAssignmentUploaded(true);
  };

  const handleSubmit = () => {
    // Handle submit functionality here (not implemented yet)
    console.log('Assignment submitted');
    location.href='/student/assignments?submitted=true'
  };

  const goBack = () => {
    // Handle go back functionality here (not implemented yet)
    console.log('Go back');
    location.href='/student/assignments'
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
                    <p>Upload a different file?</p>
                    <input type="file" id="assignment" name="assignment" onChange={handleFileUpload} />
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
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </Body>
    </Page>
  );
};

export default Submission;