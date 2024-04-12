import React from 'react';
import { ArrowLeft } from 'react-bootstrap-icons';
import styles from "./Page.module.css";

export function Header({ text, children, hasBackButton = true } : { text?: string, children?: React.ReactNode, hasBackButton?: boolean }) {
    const headerContent = children ? children : <h1>{text}</h1>;

    if (!text && !children) {
        throw new Error("<Header /> must have either the text property or child nodes");
    }
    
    function onBackClicked() {
        //TODO: there is a better way to do this, but this is the way that gets the prototype done on time
        const currentPath =  location.href;
        const pathArray = currentPath.split('/');
        //remove the last element of the path
        pathArray.pop();
        // if on the instructor or student page, these dont exist, so go back one more
        if (pathArray[pathArray.length - 1] === 'instructor' || pathArray[pathArray.length - 1] === 'student') {
        pathArray.pop();
        }
        const newPath = pathArray.join('/');
        location.href = newPath;
    }

    return <div className={styles.header}>
        <ArrowLeft onClick={onBackClicked} style={{ width: 32, height: "100%", color: "#fff", cursor: "pointer" }} />
        {headerContent}
    </div>;
};

export function Body({ children } : { children: React.ReactElement }) {
    return <div>
        {children}
    </div>;
};

export default function Page({ children } : { children: React.ReactNode }) {
    return <>
        <div>
            {children}
        </div>
    </>;
};