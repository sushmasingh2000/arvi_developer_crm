import React from "react";

const ReportCard = ({ title, value }) => {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--border)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
    >
      {/* Glow Effect */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,144,64,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Title */}
      <h3
        className="text-sm font-medium tracking-wide uppercase"
        style={{
          color: "var(--text-muted)",
        }}
      >
        {title}
      </h3>

      {/* Value */}
      <p
        className="text-3xl font-bold mt-3"
        style={{
          color: "var(--text-main)",
        }}
      >
        {value}
      </p>

      {/* Bottom Accent Line */}
      <div
        className="mt-4 h-[3px] rounded-full"
        style={{
          background:
            "linear-gradient(to right, var(--primary), transparent)",
        }}
      />
    </div>
  );
};

export default ReportCard;