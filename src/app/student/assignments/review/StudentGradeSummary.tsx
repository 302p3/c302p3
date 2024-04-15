import styles from './page.module.css';

const rubricHTML = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rubric</title>
    <style>
      body {
        background-color: white; /* Set background color of the body */
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: center;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
  </head>
  <body>
    <h2>Rubric</h2>
    <table>
      <tr>
        <th>Categories</th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <td>Grammar</td>
        <td>There are too many grammatical mistakes; the paper is unreadable. (0)</td>
        <td>Needs significant improvement in grammar; readability is affected. (3)</td>
        <td>There are some grammatical mistakes, but the paper is readable. (5)</td>
        <td>Shows good command of grammar with minor errors; overall readability is maintained. (8)</td>
        <td>There are no grammatical mistakes. Awesome work! (10)</td>
      </tr>
      <tr>
        <td>Content</td>
        <td>Organization lacks coherence; does not introduce the topic or preview the essay structure effectively. (0)</td>
        <td>Introduction of the topic and preview of the essay structure are adequate; arguments and evidence are somewhat organized in a logical sequence. (5)</td>
        <td>Effectively introduces the topic and previews the essay structure; arguments and evidence are logically presented in a clear and structured manner. (10)</td>
        <td>Provides a clear introduction to the topic and a well-structured essay outline; arguments and evidence are logically organized with strong coherence. (15)</td>
        <td>Exceptional organization with a compelling introduction, well-developed structure, and seamless flow of ideas; arguments and evidence are presented with exceptional clarity and coherence. (20)</td>
      </tr>
    </table>
  </body>
  </html>
`;


export const StudentGradeSummary = () => {
  // Assuming rubric data and student marks data are available
  const rubricData = [
    { category: "Grammar", max_marks: 10 },
    { category: "Content", max_marks: 20 }
    // Add more rubric categories as needed
  ];

  const studentMarksData = [
    { category: "Grammar", student_marks: 8 },
    { category: "Content", student_marks: 15 }
    // Add student marks for each category
  ];

  // Calculate total marks and total student marks
  const totalMarks = rubricData.reduce((total, { max_marks }) => total + max_marks, 0);
  const totalStudentMarks = studentMarksData.reduce((total, { student_marks }) => total + student_marks, 0);
  const percentageMark = ((totalStudentMarks / totalMarks) * 100).toFixed(1);

  // Function to show rubric
  const handleShowRubric = () => {
    // Open a new tab
    const newTab = window.open();
    
    // Write the HTML content to the new tab
    newTab.document.write(rubricHTML);
  
    // Close the document stream to ensure proper rendering
    newTab.document.close();
  };
  
  return (
    <div className={styles['left-column-content']}>
      <button className={styles['grade-summary-button']} onClick={handleShowRubric} style={{ marginBottom: 10 }}>
        Show Rubric
      </button>
      <table className={styles['grade-summary-table']}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {rubricData.map(({ category, max_marks }, index) => {
            const studentMarks = studentMarksData[index]?.student_marks || 0;
            const gradeFraction = `${studentMarks}/${max_marks}`;
            return (
              <tr key={category}>
                <td>{category}</td>
                <td>{gradeFraction}</td>
              </tr>
            );
          })}
          <tr className={styles['grade-summary-total']}>
            <td>Total</td>
            <td>{`${totalStudentMarks}/${totalMarks} = ${percentageMark}%`}</td>
          </tr>
        </tbody>
      </table>
      <button className={styles['advanced-view-button']} onClick={()=>location.href='review/advanced_view'} style={{ marginTop: 10 }}>
        Show advanced view
      </button>
    </div>
  );
};