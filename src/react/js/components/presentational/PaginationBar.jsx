import React from 'react';
import PropTypes from 'prop-types';

/**
 * Pagination bar
 *
 * @param {number} currentPage
 * @param {number} pagesTotal
 * @param {string} permalink
 * @param {function} flipPage
 * @constructor
 */
const PaginationBar = ({
  currentPage, pagesTotal, permalink, flipPage,
}) => (
  <div className="navigation-bar">
    <ul className="pagination">
      <li><a href="" onClick={(e) => { e.preventDefault(); flipPage('previous'); }}>Previous</a></li>
      <li><a href="" onClick={(e) => { e.preventDefault(); flipPage('first'); }}>First</a></li>
      <li className="active">
        <a href="">
          <span>{currentPage}</span>
          <span> / </span>
          <span>{pagesTotal}</span>
        </a>
      </li>
      <li><a href={permalink}>Permalink</a></li>
      <li><a href="" onClick={(e) => { e.preventDefault(); flipPage('last'); }}>Last</a></li>
      <li><a href="" onClick={(e) => { e.preventDefault(); flipPage('next'); }}>Next</a></li>
    </ul>
  </div>
);

PaginationBar.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pagesTotal: PropTypes.number.isRequired,
  permalink: PropTypes.string.isRequired,
  flipPage: PropTypes.func.isRequired,
};

export default PaginationBar;
