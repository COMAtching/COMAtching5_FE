"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAdminProducts, useDeleteProduct } from "@/hooks/useAdminProducts";
import ProductCreateForm from "./ProductCreateForm";
import {
  ArrowLeft,
  Package,
  Loader2,
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
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2a2d42] bg-[#161827] text-[#8b8fa3] transition-colors duration-200 hover:border-[#8b5cf6]/40 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6]">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white sm:text-xl">
                상품 관리
              </h1>
              <p className="text-xs text-[#6b7094]">
                전체 {products.length}개 상품
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            showCreateForm
              ? "border border-[#2a2d42] bg-[#161827] text-[#8b8fa3] hover:text-white"
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
                : "bg-[#161827] text-[#6b7094] hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 상품 목록 */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#6b7094]" />
          <p className="mt-4 text-sm text-[#6b7094]">
            상품 목록 불러오는 중...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#161827]">
            <Inbox size={28} className="text-[#4a4e69]" />
          </div>
          <p className="text-base font-medium text-[#6b7094]">
            등록된 상품이 없습니다
          </p>
          <p className="mt-1 text-sm text-[#4a4e69]">
            상품 등록 버튼을 눌러 새 상품을 추가하세요
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`flex flex-col rounded-2xl border bg-[#161827]/80 transition-all duration-200 sm:flex-row sm:items-center sm:justify-between ${
                product.isActive
                  ? "border-[#1e2030] hover:border-[#2a2d42]"
                  : "border-[#1e2030] opacity-50"
              }`}
            >
              {/* 상품 정보 */}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-sm font-semibold text-white">
                    {product.name}
                  </h3>

                  {/* 상태 배지 */}
                  <div className="flex items-center gap-1.5">
                    {product.isActive ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        <ToggleRight size={10} />
                        판매 중
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400">
                        <ToggleLeft size={10} />
                        판매 중지
                      </span>
                    )}
                    {product.isBundle && (
                      <span className="rounded-full bg-[#6366f1]/10 px-2 py-0.5 text-[10px] font-bold text-[#818cf8]">
                        번들
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#6b7094]">{product.description}</p>

                {/* 구성품 */}
                <div className="flex flex-wrap gap-1.5">
                  {product.rewards.map((r) => (
                    <span
                      key={r.itemType}
                      className="rounded-md bg-[#1e2030] px-2 py-0.5 text-[11px] font-medium text-[#a0a3bd]"
                    >
                      {r.itemName} ×{r.quantity}
                    </span>
                  ))}
                  {product.bonusRewards.map((r) => (
                    <span
                      key={`bonus-${r.itemType}`}
                      className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-400"
                    >
                      +{r.itemName} ×{r.quantity} (보너스)
                    </span>
                  ))}
                </div>
              </div>

              {/* 가격 + 액션 */}
              <div className="flex items-center gap-4 border-t border-[#1e2030] px-5 py-3 sm:border-t-0 sm:border-l sm:py-5">
                <div className="text-right">
                  <p className="text-xs text-[#4a4e69]">가격</p>
                  <p className="text-sm font-bold text-white">
                    {formatPrice(product.price)}
                  </p>
                  <p className="text-[10px] text-[#4a4e69]">
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
                        : "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
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
