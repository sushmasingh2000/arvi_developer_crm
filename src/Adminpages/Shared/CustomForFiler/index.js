import React from "react";
import { TextField, Button } from "@mui/material";
import { FilterAlt, FileDownload } from "@mui/icons-material";

const CustomFilter = ({ formik, onFilter, onClear, onExport }) => {
  return (
    <div
      className="grid grid-cols-2 sm:flex gap-3 md:gap-3 px-3 py-1 mb-5"
      style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center">
        <span className="text-xs text-center mr-3" style={{ color: 'var(--text-muted)' }}>From:</span>
        <TextField
          size="small"
          type="date"
          id="start_date"
          name="start_date"
          value={formik.values.start_date}
          onChange={formik.handleChange}
          className="!min-w-[110px] !md:min-w-[200px]"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'var(--text-main)',
              '& fieldset': { borderColor: 'var(--border)' },
              '&:hover fieldset': { borderColor: 'var(--primary)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
            '& input::-webkit-calendar-picker-indicator': { filter: 'invert(0.7)' },
          }}
        />
      </div>

      <div className="flex items-center">
        <span className="text-xs text-center mr-3" style={{ color: 'var(--text-muted)' }}>To:</span>
        <TextField
          size="small"
          type="date"
          id="end_date"
          name="end_date"
          value={formik.values.end_date}
          onChange={formik.handleChange}
          className="!min-w-[110px] !md:min-w-[200px]"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'var(--text-main)',
              '& fieldset': { borderColor: 'var(--border)' },
              '&:hover fieldset': { borderColor: 'var(--primary)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
            '& input::-webkit-calendar-picker-indicator': { filter: 'invert(0.7)' },
          }}
        />
      </div>

      <div className="flex">
        <TextField
          size="small"
          type="search"
          id="search"
          name="search"
          placeholder="Search"
          value={formik.values.search}
          onChange={formik.handleChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'var(--text-main)',
              '& fieldset': { borderColor: 'var(--border)' },
              '&:hover fieldset': { borderColor: 'var(--primary)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
            '& input::placeholder': { color: 'var(--text-muted)' },
          }}
        />
      </div>

      <div className="flex gap-2 !ml-7 md:!ml-0">
        <Button
          onClick={onFilter}
          variant="contained"
          startIcon={<FilterAlt />}
          sx={{
            backgroundColor: 'var(--primary)',
            color: '#000',
            fontWeight: 600,
            '&:hover': { backgroundColor: 'var(--primary-hover)' },
          }}
        >
          Filter
        </Button>

        <Button
          onClick={onClear}
          variant="outlined"
          sx={{
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
            '&:hover': { borderColor: 'var(--primary)', color: 'var(--primary)' },
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
};

export default CustomFilter;