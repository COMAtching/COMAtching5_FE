"use client";

import { formatTicketUnits } from "@/lib/utils/ticket-units";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

import React, { useState } from "react";
import Link from "next/link";
import {
  useAdminProducts,
  useDeleteProduct,
} from "@/hooks/admin/useAdminProducts";
import ProductCreateForm from "./ProductCreateForm";
import {
  ArrowLeft,
  Package,
  Plus,
  Trash2,
  X,
  Inbox,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

type FilterType = "all" | "bundle" | "individual";

export default function AdminProducts() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const isBundleParam =
    filter === "all" ? undefined : filter === "bundle" ? true : false;

  const {
    data: productsData,
    isLoading,
    refetch,
  } = useAdminProducts(isBundleParam);
  const deleteMutation = useDeleteProduct();

  const products = productsData?.data ?? [];

  const handleDelete = (productId: number) => {
    if (deleteConfirmId === productId) {
      deleteMutation.mutate(productId, {
        onSuccess: () => setDeleteConfirmId(null),
      });
    } else {
      setDeleteConfirmId(productId);
    }
  };

  const formatPrice = (price: number) => price.toLocaleString("ko-KR") + "원";

  return (
    <div className="mx-auto min-h-dvh max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* 헤더 */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/adminpage/main"
            className="border-admin-line bg-admin-panel text-admin-secondary hover:text-admin-ink flex h-10 w-10 items-center justify-center rounded-xl border transition-colors duration-200 hover:border-[#8b5cf6]/40"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-admin-ink text-lg font-bold sm:text-xl">
                상품 관리
              </h1>
              <p className="text-admin-muted text-xs">
                전체 {products.length}개 상품
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            showCreateForm
              ? "border-admin-line bg-admin-panel text-admin-secondary hover:text-admin-ink border"
              : "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-[#6366f1]/20 hover:shadow-xl"
          }`}
        >
          {showCreateForm ? (
            <>
              <X size={16} />
              닫기
            </>
          ) : (
            <>
              <Plus size={16} />
              상품 등록
            </>
          )}
        </button>
      </header>

      {/* 상품 등록 폼 */}
      {showCreateForm && (
        <div className="mb-8">
          <ProductCreateForm
            onSuccess={() => {
              setShowCreateForm(false);
              refetch();
            }}
          />
        </div>
      )}

      {/* 필터 탭 */}
      <div className="mb-6 flex gap-2">
        {(
          [
            { key: "all", label: "전체" },
            { key: "bundle", label: "번들" },
            { key: "individual", label: "개별" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              filter === key
                ? "bg-[#6366f1] text-white"
                : "bg-admin-panel text-admin-muted hover:text-admin-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 상품 목록 */}
      {isLoading ? (
        <LoadingSpinner label="상품 목록 불러오는 중" />
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="bg-admin-panel mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
            <Inbox size={28} className="text-admin-muted" />
          </div>
          <p className="text-admin-muted text-base font-medium">
            등록된 상품이 없습니다
          </p>
          <p className="text-admin-muted mt-1 text-sm">
            상품 등록 버튼을 눌러 새 상품을 추가하세요
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-admin-panel/80 flex flex-col rounded-2xl border transition-all duration-200 sm:flex-row sm:items-center sm:justify-between ${
                product.isActive
                  ? "border-admin-edge hover:border-admin-line"
                  : "border-admin-edge opacity-50"
              }`}
            >
              {/* 상품 정보 */}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-admin-ink text-sm font-semibold">
                    {formatTicketUnits(product.name)}
                  </h3>

                  {/* 상태 배지 */}
                  <div className="flex items-center gap-1.5">
                    {product.isActive ? (
                      <span className="typo-10-700 text-admin-success flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5">
                        <ToggleRight size={10} />
                        판매 중
                      </span>
                    ) : (
                      <span className="typo-10-700 text-admin-danger flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5">
                        <ToggleLeft size={10} />
                        판매 중지
                      </span>
                    )}
                    {product.isBundle && (
                      <span className="typo-10-700 text-admin-violet rounded-full bg-[#6366f1]/10 px-2 py-0.5">
                        번들
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-admin-muted text-xs">
                  {formatTicketUnits(product.description)}
                </p>

                {/* 구성품 */}
                <div className="flex flex-wrap gap-1.5">
                  {product.rewards.map((r) => (
                    <span
                      key={r.itemType}
                      className="bg-admin-subtle text-admin-secondary rounded-md px-2 py-0.5 text-[11px] font-medium"
                    >
                      {r.itemName} {r.quantity}장
                    </span>
                  ))}
                  {product.bonusRewards.map((r) => (
                    <span
                      key={`bonus-${r.itemType}`}
                      className="text-admin-warning rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium"
                    >
                      +{r.itemName} {r.quantity}장 (보너스)
                    </span>
                  ))}
                </div>
              </div>

              {/* 가격 + 액션 */}
              <div className="border-admin-edge flex items-center gap-4 border-t px-5 py-3 sm:border-t-0 sm:border-l sm:py-5">
                <div className="text-right">
                  <p className="text-admin-muted text-xs">가격</p>
                  <p className="text-admin-ink text-sm font-bold">
                    {formatPrice(product.price)}
                  </p>
                  <p className="typo-10-500 text-admin-muted">
                    순서: {product.displayOrder}
                  </p>
                </div>

                {product.isActive && (
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteMutation.isPending}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                      deleteConfirmId === product.id
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                        : "text-admin-danger border border-red-500/30 bg-red-500/10 hover:bg-red-500/20"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <Trash2 size={13} />
                    {deleteConfirmId === product.id ? "확인" : "판매 중지"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
