import { useState } from "react";
import styles from "./Summary.module.css";
import { CaretDownFill, CaretUpFill } from "react-bootstrap-icons";

type SummaryOptions = {
  summary: string;
  originalText: string;
  comments: string[];
  conclusion: string;
  gradeEffect?: {
    category: string;
    points: number;
  };
};

export default function Summary(options: SummaryOptions) {
  const [open, setOpen] = useState(false);

  function onSummaryClick() {
    setOpen(!open);
  }

  return (
    <div className={styles.container}>
      <div className={styles.summary} onClick={onSummaryClick} style={{ position: "relative" }}>
        <div style={{ width: "calc(100% - 5px)" }}>
          {options.summary}
        </div>
        {
          open
          ?
          <CaretUpFill style={{ position: "absolute", top: 5, right: 5 }} />
          :
          <CaretDownFill style={{ position: "absolute", top: 5, right: 5 }} />
        }
      </div>
      <div className={open ? `${styles.content} ${styles.shown}` : styles.content}>
        <h3 style={{ marginBottom: 5 }}>Original Text</h3>
        <hr style={{ marginBottom: 5 }} />
        <blockquote className={styles.quote}>
          {options.originalText}
        </blockquote>

        <br />
        <h3 style={{ marginBottom: 5 }}>Comments</h3>
        <hr style={{ marginBottom: 5 }} />
        <div style={{ marginLeft: 10, marginTop: 10 }}>
          <ul style={{ marginLeft: 15 }}>
            {options.comments.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>

        <br />
        <h3 style={{ marginBottom: 5 }}>Conclusion</h3>
        <hr style={{ marginBottom: 5 }} />
        <div style={{ marginLeft: 10, marginTop: 10 }}>
          {options.conclusion} {options.gradeEffect ? <b>({options.gradeEffect.points} {options.gradeEffect.category.toLocaleLowerCase()} points)</b> : ""}
        </div>


      </div>
    </div>
  );
}