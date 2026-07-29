"use client";

export default function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label style={{ fontSize: 12.5, fontWeight: 700, color: "#6E6E73", display: "block", marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", border: "1px solid #E2E1D9", borderRadius: 10, padding: "11px 13px", fontSize: 14.5 }}
      />
    </div>
  );
}
