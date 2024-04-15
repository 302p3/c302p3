'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'react-bootstrap-icons';
import styles from './page.module.css';
import * as yaml from 'js-yaml'; // Import the js-yaml library
import Page, { Header, Body } from "../../../../components/Page";
import { StudentGradeSummary } from './StudentGradeSummary';
import { useSearchParams } from 'next/navigation';

const yamlContent = `
    rubric:
      - category: Grammar
        max_marks: 10
      - category: Content
        max_marks: 20

    comments:
      - position:
          start: 1
          end: 5
        content: "You need to work on your grammar in this paragraph."
        id: 1
        type: "instructor"
      - position:
          start: 7
          end: 9
        content: "Great job on including relevant content here!"
        id: 2
        type: "instructor"
      - position:
          start: 11
          end: 15
        content: "Testing!"
        id: 3
        type: "instructor"
      - position:
          start: 4450
          end: 4600
        content: "I believe that this is creative because of ..."
        id: 4
        type: "ai"
      - position:
          start: 8000
          end: 9000
        content: "This has a high probability of being written using ChatGPT."
        id: 5
        type: "plagiarism"
  `;


const StudentReviewPage = () => {
  // Parse YAML content
  const [data, setData] = useState<{
    rubric: { category: string, max_marks: number }[],
    comments: { position: { start: number, end: number }, content: string, id: number, type: "instructor"|"ai"|"plagiarism" }[],
  }>(yaml.load(yamlContent) as any);
  const [nextId, setNextId] = useState(data.comments.length + 1);
  const [resizeTrigger, setResizeTrigger] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(-1);
  const [aiView, setAiView] = useState(false);
  const params = useSearchParams();

  // Extract rubric and comments from data object
  const { comments } = data;

  // Text content of the assignment
  let assignmentContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  assignmentContent = assignmentContent.repeat(100); // uncomment to extend lorem ipsum to test scrolling

  const [generalCommentText, setGeneralCommentText] = useState("This essay demonstrates a remarkable depth of understanding on the topic, utilizing a sophisticated blend of research and critical analysis. The structure is clear and logical, guiding the reader seamlessly through complex ideas. Moreover, the language is both eloquent and precise, showcasing a mastery of communication. Overall, this essay exemplifies excellence in scholarship and is a testament to the author's intellectual prowess.");

  const commentDivs = comments.sort((a, b) => a.position.end - b.position.end).map(({ content, id, type }, index: number) => {
    return (
      <div
        key={index}
        data-comment-id={id}
        className={styles['comment']}
        onClick={() => setActiveCommentId(id)}
        >
        <div style={{ position: "relative" }}>
          <div className={styles['comment-x-line']} data-comment-id={id}></div>
          <b>{type === "ai" || type === "plagiarism" ? "AI Comment" : "Comment"}</b> <br />
          <hr /><br />
          <div contentEditable={type === "instructor"} onInput={() => onResize()}>{content}</div>
        </div>
      </div>
    );
  });

  const commentLineDivs = comments.map(comment => ([
    <div key={0} className={styles['comment-x-line']} data-comment-id={comment.id}></div>,
    <div key={1} className={styles['comment-y-line']} data-comment-id={comment.id}></div>
  ])).reduce((a, b) => a.concat(b));

  const onResize = useCallback(function() {
    // Yes. this is a copy of the onResize function below.
    // I have this copy.
    if (aiView) return;

    let cannotBeLessThan = 0; // overlap check
    for (let i = 0; i < commentDivs.length; i++) {
      const commentReactDiv = commentDivs[i] as React.ReactElement;
      const id = commentReactDiv.props["data-comment-id"];

      // Position comment to as close to its text as possible
      const highlightedText = document.querySelector(`.${styles['highlighted-text']}[data-comment-id="${id}"]`) as HTMLSpanElement;
      const commentDiv = document.querySelector(`.${styles['comment']}[data-comment-id="${id}"]`) as HTMLDivElement;
      commentDiv.style.position = 'absolute';

      let positionedTop = highlightedText.offsetTop;
      if (i > 0) {
        // Check if we are overlapping with predecessor
        if (cannotBeLessThan > positionedTop) {
          positionedTop = cannotBeLessThan;
        }
      }
      commentDiv.style.top = `${positionedTop}px`;
      cannotBeLessThan = positionedTop + commentDiv.offsetHeight + 10;  // add 10 for a tiny gap.
    
      const commentXLineDiv = commentDiv.querySelector(`.${styles['comment-x-line']}`) as HTMLDivElement;
      commentXLineDiv.style.top = "-11px";
      commentXLineDiv.style.left = "-30px";
    }

    for (const commentLineDiv of commentLineDivs) {
      const id = commentLineDiv.props["data-comment-id"];
      const highlightedText = document.querySelector(`.${styles['highlighted-text']}[data-comment-id="${id}"]`) as HTMLSpanElement;
      const commentDiv = document.querySelector(`.${styles['comment']}[data-comment-id="${id}"]`) as HTMLDivElement;

      const commentXLineDiv = document.querySelector(`div[data-component="comments"] .${styles['comment-x-line']}[data-comment-id="${id}"]`)! as HTMLDivElement;
      commentXLineDiv.style.top = `${highlightedText.offsetTop}px`;
      commentXLineDiv.style.left = `${highlightedText.offsetLeft}px`;
      commentXLineDiv.style.width = `${(highlightedText.parentElement!.offsetWidth + 40) - highlightedText.offsetLeft}px`;

      const commentYLineDiv = document.querySelector(`div[data-component="comments"] .${styles['comment-y-line']}[data-comment-id="${id}"]`)! as HTMLDivElement;
      if (highlightedText.offsetTop > commentDiv.offsetTop) {
        commentYLineDiv.style.top = `${commentDiv.offsetTop}px`;
        commentYLineDiv.style.height = `${highlightedText.offsetTop - commentDiv.offsetTop}px`;
      } else {
        commentYLineDiv.style.top = `${highlightedText.offsetTop}px`;
        commentYLineDiv.style.height = `${commentDiv.offsetTop - highlightedText.offsetTop}px`;
      }
      commentYLineDiv.style.left = "calc(60vw - 20px)";
      console.log(commentYLineDiv, highlightedText.offsetTop - commentDiv.offsetTop);
    }
  }, [ commentDivs, commentLineDivs, aiView ]);

  useEffect(() => {
    document.querySelectorAll(`.${styles['comment']}`).forEach(commentDiv => commentDiv.classList.remove(styles.active));
    document.querySelectorAll(`.${styles['comment-x-line']}`).forEach(lineDiv => lineDiv.classList.remove(styles.active));
    document.querySelectorAll(`.${styles['comment-y-line']}`).forEach(lineDiv => lineDiv.classList.remove(styles.active));
    if (activeCommentId === -1) {
      return;
    }
    const commentDivs = document.querySelectorAll(`.${styles['comment']}[data-comment-id="${activeCommentId}"], .${styles['comment-x-line']}[data-comment-id="${activeCommentId}"], .${styles['comment-y-line']}[data-comment-id="${activeCommentId}"]`);
    commentDivs.forEach(div => div.classList.add(styles.active));
  }, [activeCommentId]);

  function onCommentClick(event: React.MouseEvent<HTMLSpanElement>) {
    const target = event.target as HTMLElement;
    const id = target.getAttribute("data-comment-id");
    setActiveCommentId(parseInt(id!));
  }

  useEffect(() => {
    if (resizeTrigger) {
      setResizeTrigger(false);
      onResize();
    }
  }, [resizeTrigger, commentDivs, commentLineDivs, onResize]);

  useEffect(() => {
    // First, just place the comments wherever we can.
    // commentDivs is sorted from the top comment to the bottom comment by position

    function trigger() {
      setResizeTrigger(true);
    }
    trigger();

    window.addEventListener("resize", trigger);
    return () => window.removeEventListener("resize", trigger);
  }, [resizeTrigger]);

  // Render comments with highlighted text
  return (
    <Page>
      <Header>
        <h1>Review Assignment</h1>
      </Header>
      <div>
        <Body>
          <div className={styles['main-layout']}>
            <div className={styles['review-page']}>
              <div className={styles['left-column']}>
                <h2 style={{ margin: 0 }}>English</h2>
                <div className={`${styles['assignment-details']}`}> {/* Apply left-column-content style here */}
                  <h3>Rubric Details</h3>
                </div>
                <div className={`${styles['assignment-details-widget']}`}>
                  {StudentGradeSummary()}
                </div>
                <br />
                <div className={styles['general-comments-section']}>
                  <h3>General Comment</h3>
                  <p>
                    I think overall your essay could use a lot more work. Please see me after class.
                  </p>
                  <br /><br />
                </div>
              </div>
              <div className={styles['assignment-and-comments']} style={{ position: "relative" }}>
                <div data-component="comments">
                  {aiView ? null : commentLineDivs}
                </div>
                <div className={styles['center-column']}>
                  <div className={styles['assignment-header']}>
                    <h1>Assignment Name</h1>
                  </div>
                  <div className={styles['ipsum-content']}>
                    <h2>{aiView ? "Assignment Summary" : "Assignment Content"}</h2>
                    {/* Split the assignment content and wrap sections corresponding to comments with spans */}
                    {
                      aiView
                      ?
                        <>
                        </>
                      :
                      comments.map((comment, index: number) => {
                        const { start, end } = comment.position;
                        const beforeComment = index === 0 ? assignmentContent.slice(0, start) : "";
                        const commentText = assignmentContent.slice(start, end + 1);

                        const afterCommentEndPos = index === comments.length - 1 ? assignmentContent.length : comments[index + 1].position.start;
                        const afterComment = assignmentContent.slice(end + 1, afterCommentEndPos);
                        return (
                          <React.Fragment key={index}>
                            <span>{beforeComment}</span>
                            <span
                              className={
                                comment.type === "plagiarism"
                                ?
                                  `${styles['highlighted-text']} ${styles['plagiarism']}`
                                :
                                  comment.type === "ai"
                                  ? `${styles['highlighted-text']} ${styles['ai']}`
                                  : styles['highlighted-text']}
                              data-comment-id={comment.id}
                              onClick={onCommentClick}
                            >
                              {commentText}
                            </span>
                            <span>{afterComment}</span>
                          </React.Fragment>
                        );
                      })
                    }
                  </div>
                </div>
                <div className={styles['right-column']}>
                  {
                    !aiView
                    ?
                    <>
                      <h3>Assignment Comments</h3>
                      <hr style={{ marginTop: 5, borderBottom: "1px solid #bbb" }} />
                      {commentDivs}
                    </>
                    :
                      <div></div>
                  }
                </div>
              </div>
            </div>
          </div>
        </Body>
      </div>
    </Page>
  );
};

export default StudentReviewPage;