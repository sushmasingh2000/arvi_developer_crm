import React from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IconButton } from "@mui/material";

const CustomToPagination = ({ setPage, page, data }) => {
  const totalPages = data?.totalPage || 1;
  const currentPage = data?.currPage || 1;

  return (
    <div
      className="w-full flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-2 sm:gap-4 rounded mt-4"
      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)', padding: '8px 12px' }}
    >
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base">
        <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>
          Total Pages: <span style={{ color: 'var(--text-main)' }}>{totalPages}</span>
        </span>
        <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>
          Current Page: <span style={{ color: 'var(--text-main)' }}>{currentPage}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`transition-transform duration-200 rounded-full ${page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
          sx={{ color: 'var(--primary)' }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className={`transition-transform duration-200 rounded-full ${page >= totalPages ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
          sx={{ color: 'var(--primary)' }}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default CustomToPagination;