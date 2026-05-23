import React from "react";
import { Skeleton } from "@mui/material";

const CustomTable = ({
  tablehead = [],
  tablerow = [],
  className,
  isLoading,
}) => {
  return (
    <div className={`w-full overflow-x-auto ${className || ""}`}>
      <table className="min-w-full table-auto divide-y text-sm" style={{ borderColor: 'var(--border)' }}>
        
        <thead style={{ backgroundColor: 'var(--card-bg)' }}>
          <tr>
            {Array.isArray(tablehead) &&
              tablehead.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-semibold uppercase whitespace-nowrap"
                  style={{ 
                    color: 'var(--text-muted)', 
                    border: '1px solid var(--border)' 
                  }}
                >
                  {column}
                </th>
              ))}
          </tr>
        </thead>

        <tbody style={{ backgroundColor: 'var(--input-bg)' }}>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.isArray(tablehead) &&
                  tablehead.map((_, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 whitespace-nowrap"
                      style={{ border: '1px solid var(--border)' }}
                    >
                      <Skeleton animation="wave" height={20} sx={{ bgcolor: 'rgba(200,144,64,0.1)' }} />
                    </td>
                  ))}
              </tr>
            ))
          ) : tablerow.length === 0 ? (
            <tr>
              <td
                colSpan={tablehead?.length || 1}
                className="text-center px-4 py-6"
                style={{ color: 'var(--text-muted)' }}
              >
                No data found
              </td>
            </tr>
          ) : (
            tablerow.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition-colors cursor-pointer"
                style={{ borderColor: 'var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--input-bg)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {Array.isArray(row) &&
                  row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 whitespace-nowrap text-sm"
                      style={{ 
                        color: 'var(--text-main)', 
                        border: '1px solid var(--border)' 
                      }}
                    >
                      {cell}
                    </td>
                  ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;