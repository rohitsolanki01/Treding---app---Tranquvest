import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: '100vh', padding: '2rem' }}
    >
      <img
        src="media/pagenotFound.svg"
        alt="Page Not Found"
        className="img-fluid mb-4"
        style={{ maxWidth: '350px', height: 'auto' }}
      />
      <p className='text-muted mb-4'>Sorry, the page you are looking for doesn't exist </p>
      <Link
        to="/"
        className="button px-2 py-2"
        style={{ textDecoration: 'none' }}
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
