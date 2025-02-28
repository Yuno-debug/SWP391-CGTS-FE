import React from 'react';
import './Pagination.css';

function Pagination({ activePage, setActivePage, totalPages }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="prev-next"
        disabled={activePage === 1}
        onClick={() => setActivePage(activePage - 1)}
      >
        &laquo;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={activePage === page ? "active" : ""}
          onClick={() => setActivePage(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="prev-next"
        disabled={activePage === totalPages}
        onClick={() => setActivePage(activePage + 1)}
      >
        &raquo;
      </button>
    </div>
  );
}

export default Pagination;
