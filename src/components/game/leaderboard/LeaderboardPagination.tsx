import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface LeaderboardPaginationProps {
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const LeaderboardPagination = ({
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
}: LeaderboardPaginationProps) => {
  const t = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={onPreviousPage}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">{t.leaderboard.previous}</span>
          </PaginationPrevious>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive={true}>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={onNextPage}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          >
            <span className="sr-only">{t.leaderboard.next}</span>
            <ChevronRight className="h-4 w-4" />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};