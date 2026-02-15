import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="pagination">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ArrowLeftIcon />
        <span className="ml-1 hidden sm:inline">Précédent</span>
      </Button>
      <span className="pagination-page">
        Page {currentPage} sur {totalPages}
      </span>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <span className="mr-1 hidden sm:inline">Suivant</span>
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
