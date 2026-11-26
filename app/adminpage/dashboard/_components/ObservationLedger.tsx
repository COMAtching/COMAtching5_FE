"use client";

import { type ReactNode, useState } from "react";
import { ChevronDown, ListOrdered } from "lucide-react";

export interface Observation {
  eventId: string;
  capturedAt: string;
  transactionDate: string;
  transactionTime: string | null;
  counterparty: string | null;
  amountKrw: number;
}

const previewSize = 5;
const captureDate = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const captureTime = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export default function ObservationLedger({
  rows,
  loading,
  failed,
  refreshButton,
}: {
  rows: Observation[];
  loading: boolean;
  failed: boolean;
  refreshButton: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? rows : rows.slice(0, previewSize);
  return (
    <section
      aria-labelledby="observation-title"
      className="border-admin-edge bg-admin-panel overflow-hidden rounded-2xl border shadow-sm"
    >
      <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="text-admin-info bg-admin-info/10 hidden size-10 shrink-0 items-center justify-center rounded-xl sm:flex">
            <ListOrdered size={20} aria-hidden="true" />
          </span>
          <div>
            <h3
              id="observation-title"
              className="text-admin-ink text-base font-bold"
            >
              원본 관측 내역
            </h3>
            <p className="text-admin-muted mt-1 text-xs">
              전체 금액 · 최근 수집 30건 · 한국 시각
            </p>
          </div>
        </div>
        {refreshButton}
      </header>
      {failed && (
        <p
          role="alert"
          className="text-admin-danger border-admin-edge border-t px-4 py-3 text-sm sm:px-6"
        >
          원본 관측 내역을 새로 불러오지 못했습니다.
        </p>
      )}
      {visible.length > 0 ? (
        <table
          id="recent-bank-observations"
          className="w-full text-left text-sm"
        >
          <caption className="sr-only">서버 접수순 원본 입금 관측 내역</caption>
          <thead className="border-admin-edge bg-admin-subtle/60 text-admin-muted border-y text-xs">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium sm:pl-6">
                입금자<span className="sm:hidden"> · 거래 시각</span>
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2.5 font-medium sm:table-cell"
              >
                은행 거래 시각
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2.5 font-medium sm:table-cell"
              >
                수집 시각
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-right font-medium sm:pr-6"
              >
                입금액<span className="sm:hidden"> · 수집 시각</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-admin-edge divide-y">
            {visible.map((row) => {
              const captured = new Date(row.capturedAt);
              const paidDate = row.transactionDate.replaceAll("-", ".");
              const paidTime = row.transactionTime ?? "시각 미표시";
              const collectedDate = captureDate
                .formatToParts(captured)
                .filter((part) => part.type !== "literal")
                .map((part) => part.value)
                .join(".");
              const collectedTime = captureTime.format(captured);
              return (
                <tr key={row.eventId} className="hover:bg-admin-subtle/40">
                  <td className="px-4 py-3 sm:pl-6">
                    <span className="text-admin-ink font-semibold [overflow-wrap:anywhere]">
                      {row.counterparty || "입금자 미표시"}
                    </span>
                    <span className="text-admin-muted mt-1 block text-xs tabular-nums sm:hidden">
                      {paidDate} {paidTime}
                    </span>
                  </td>
                  <td className="text-admin-secondary hidden px-3 py-3 tabular-nums sm:table-cell">
                    {paidTime}
                    <span className="text-admin-muted block text-xs">
                      {paidDate}
                    </span>
                  </td>
                  <td className="text-admin-secondary hidden px-3 py-3 tabular-nums sm:table-cell">
                    <time dateTime={row.capturedAt}>
                      {collectedTime}
                      <span className="text-admin-muted block text-xs">
                        {collectedDate}
                      </span>
                    </time>
                  </td>
                  <td className="px-4 py-3 text-right sm:pr-6">
                    <strong className="text-admin-success tabular-nums">
                      +{row.amountKrw.toLocaleString("ko-KR")}원
                    </strong>
                    <time
                      dateTime={row.capturedAt}
                      className="text-admin-muted mt-1 block text-xs tabular-nums sm:hidden"
                    >
                      {collectedDate} {collectedTime}
                    </time>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        !failed && (
          <p
            role="status"
            className="border-admin-edge text-admin-muted border-t px-4 py-8 text-center text-sm"
          >
            {loading
              ? "원본 관측 내역을 조회하고 있습니다."
              : "아직 수집한 입금 내역이 없습니다."}
          </p>
        )
      )}
      {rows.length > previewSize && (
        <footer className="border-admin-edge flex items-center justify-between gap-3 border-t px-4 py-2 sm:px-6">
          <span className="text-admin-muted text-xs tabular-nums">
            {visible.length} / {rows.length}건 표시
          </span>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="recent-bank-observations"
            onClick={() => setExpanded(!expanded)}
            className="text-admin-secondary hover:bg-admin-hover inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold focus-visible:outline-2"
          >
            {expanded ? "접기" : "전체 보기"}{" "}
            <ChevronDown
              aria-hidden="true"
              size={15}
              className={expanded ? "rotate-180" : ""}
            />
          </button>
        </footer>
      )}
    </section>
  );
}
