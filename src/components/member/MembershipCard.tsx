"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function MembershipCard({
  memberId,
  name,
  status
}: {
  memberId: string;
  name: string;
  status: string;
}) {
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(`MFLH:${memberId}`, {
      margin: 1,
      width: 320,
      color: { dark: "#080808", light: "#F2F0EB" }
    })
      .then(setQr)
      .catch(() => setQr(""));
  }, [memberId]);

  return (
    <div className="overflow-hidden border border-concrete bg-[#0d0d0d]">
      <div className="flex items-center justify-between bg-flame px-5 py-3">
        <span className="font-display text-2xl uppercase text-ink">
          MFLH Collective
        </span>
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-ink">
          {status}
        </span>
      </div>
      <div className="flex flex-col items-center gap-4 p-6">
        {qr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qr}
            alt="Your membership QR code"
            className="h-56 w-56"
            width={224}
            height={224}
          />
        ) : (
          <div className="flex h-56 w-56 items-center justify-center bg-zinc-900 font-body text-xs text-bone/40">
            Generating…
          </div>
        )}
        <div className="text-center">
          <p className="font-display text-3xl uppercase">{name}</p>
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-bone/40">
            Scan at the front desk to check in
          </p>
        </div>
      </div>
    </div>
  );
}
