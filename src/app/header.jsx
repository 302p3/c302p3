// Header.jsx
'use client'
import styles from './header.css';

const Header = () => {
  // TODO there is most definitely a better way to get a name for the current page, this is beyond hacky
  const currentPath =  window.location.pathname;
  let currentPage = currentPath.split('/').pop();
  if (currentPage === '') {
    currentPage = 'Login';
  }
  //capitalize the first letter of the current page
  currentPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  function goBack() {
    //TODO there is a better way to do this, but this is the way that gets the prototype done on time
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

  function conditionalBackButton() {
    if (currentPage === 'Login') {
      return <span/>;
    }
    return (
      <button onClick={goBack}>
        ← Back
      </button>
    );
  }

  return (
    <header className='header'>
      {conditionalBackButton()}
      <span className='pageTitle'>
      {currentPage}
      </span>
    </header>
  );
};

export default Header;