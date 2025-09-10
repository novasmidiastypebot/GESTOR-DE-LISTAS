import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage, endPage;

    if (totalPages <= 7) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 4) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 3 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <span className="text-sm text-white/70">
        Página {currentPage} de {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handlePageClick(1)}
          disabled={currentPage === 1}
          className="hover:bg-white/10 text-white/70"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="hover:bg-white/10 text-white/70"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {pageNumbers[0] > 1 && (
            <>
                <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white/70" onClick={() => handlePageClick(1)}>1</Button>
                <span className="text-white/50">...</span>
            </>
        )}

        {pageNumbers.map(page => (
          <Button
            key={page}
            size="sm"
            onClick={() => handlePageClick(page)}
            className={page === currentPage 
              ? "btn-gradient text-white" 
              : "bg-white/10 hover:bg-white/20 text-white/70"
            }
          >
            {page}
          </Button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
                <span className="text-white/50">...</span>
                <Button size="sm" className="bg-white/10 hover:bg-white/20 text-white/70" onClick={() => handlePageClick(totalPages)}>{totalPages}</Button>
            </>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="hover:bg-white/10 text-white/70"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handlePageClick(totalPages)}
          disabled={currentPage === totalPages}
          className="hover:bg-white/10 text-white/70"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;