"use client";

function toCsv(rows: Record<string, unknown>[], columns: string[]) {
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.join(",");
  const body = rows
    .map((r) => columns.map((c) => escape(r[c])).join(","))
    .join("\n");
  return `${header}\n${body}`;
}

export function ExportCsvButton({
  rows,
  columns,
  filename
}: {
  rows: Record<string, unknown>[];
  columns: string[];
  filename: string;
}) {
  function download() {
    const blob = new Blob([toCsv(rows, columns)], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      disabled={rows.length === 0}
      className="border border-concrete px-5 py-2.5 font-body text-xs font-bold uppercase tracking-[0.2em] text-bone/80 transition-colors hover:border-flame hover:text-flame disabled:opacity-40"
    >
      Export CSV
    </button>
  );
}
