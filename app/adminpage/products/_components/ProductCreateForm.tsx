"use client";

import React, { useState } from "react";
import {
  useCreateProduct,
  type CreateProductBody,
  type CreateProductReward,
} from "@/hooks/admin/useAdminProducts";
import { Loader2, Plus, Minus } from "lucide-react";

interface ProductCreateFormProps {
  onSuccess: () => void;
}

const EMPTY_REWARD: CreateProductReward = {
  itemType: "MATCHING_TICKET",
  quantity: 1,
};

export default function ProductCreateForm({
  onSuccess,
}: ProductCreateFormProps) {
  const createMutation = useCreateProduct();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(1000);
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [isBundle, setIsBundle] = useState(false);
  const [rewards, setRewards] = useState<CreateProductReward[]>([
    { ...EMPTY_REWARD },
  ]);
  const [bonusRewards, setBonusRewards] = useState<CreateProductReward[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 기본 유효성 검증
    if (!name.trim()) {
      setError("상품명을 입력해주세요.");
      return;
    }
    if (!description.trim() || description.length > 50) {
      setError("설명은 1~50자로 입력해주세요.");
      return;
    }
    if (price < 1) {
      setError("가격은 1원 이상이어야 합니다.");
      return;
    }
    if (rewards.length === 0) {
      setError("구성품을 최소 1개 이상 추가해주세요.");
      return;
    }

    const body: CreateProductBody = {
      name: name.trim(),
      description: description.trim(),
      price,
      displayOrder,
      isActive,
      isBundle,
      rewards,
      bonusRewards,
    };

    createMutation.mutate(body, {
      onSuccess: () => {
        // 폼 초기화
        setName("");
        setDescription("");
        setPrice(1000);
        setDisplayOrder(0);
        setIsActive(true);
        setIsBundle(false);
        setRewards([{ ...EMPTY_REWARD }]);
        setBonusRewards([]);
        onSuccess();
      },
      onError: (err) => {
        const msg = err.response?.data?.message || "상품 등록에 실패했습니다.";
        setError(msg);
      },
    });
  };

  const updateReward = (
    index: number,
    field: keyof CreateProductReward,
    value: string | number,
    list: CreateProductReward[],
    setter: React.Dispatch<React.SetStateAction<CreateProductReward[]>>,
  ) => {
    const updated = [...list];
    if (field === "itemType") {
      updated[index] = {
        ...updated[index],
        itemType: value as CreateProductReward["itemType"],
      };
    } else {
      updated[index] = { ...updated[index], quantity: Number(value) };
    }
    setter(updated);
  };

  const inputClass =
    "h-10 w-full rounded-lg border border-[#2a2d42] bg-[#0f1117] px-3 text-sm text-white placeholder-[#4a4e69] outline-none transition-all focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/30";
  const selectClass =
    "h-10 rounded-lg border border-[#2a2d42] bg-[#0f1117] px-3 text-sm text-white outline-none transition-all focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/30";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#1e2030] bg-[#161827]/80 p-6"
    >
      <h2 className="mb-5 text-base font-bold text-white">새 상품 등록</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 상품명 */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-[#a0a3bd]">상품명</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="매칭권 10개 (+옵션권 5개)"
            required
            className={inputClass}
          />
        </div>

        {/* 설명 */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-xs font-medium text-[#a0a3bd]">
            설명 (50자 이하)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="매칭권과 옵션권을 함께 충전해요."
            required
            maxLength={50}
            className={inputClass}
          />
        </div>

        {/* 가격 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#a0a3bd]">
            가격 (원)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={1}
            required
            className={inputClass}
          />
        </div>

        {/* 정렬 순서 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-[#a0a3bd]">
            표시 순서 (낮을수록 먼저)
          </label>
          <input
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            min={0}
            required
            className={inputClass}
          />
        </div>

        {/* 토글: 활성 / 번들 */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-[#a0a3bd]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-[#2a2d42] bg-[#0f1117] accent-[#6366f1]"
            />
            판매 활성
          </label>
          <label className="flex items-center gap-2 text-sm text-[#a0a3bd]">
            <input
              type="checkbox"
              checked={isBundle}
              onChange={(e) => setIsBundle(e.target.checked)}
              className="h-4 w-4 rounded border-[#2a2d42] bg-[#0f1117] accent-[#6366f1]"
            />
            번들 상품
          </label>
        </div>
      </div>

      {/* 구성품 (rewards) */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium text-[#a0a3bd]">
            구성품 (실제 지급)
          </label>
          <button
            type="button"
            onClick={() => setRewards([...rewards, { ...EMPTY_REWARD }])}
            className="flex items-center gap-1 text-xs font-medium text-[#6366f1] hover:text-[#818cf8]"
          >
            <Plus size={12} /> 추가
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {rewards.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                value={r.itemType}
                onChange={(e) =>
                  updateReward(
                    i,
                    "itemType",
                    e.target.value,
                    rewards,
                    setRewards,
                  )
                }
                className={selectClass + " flex-1"}
              >
                <option value="MATCHING_TICKET">매칭권</option>
                <option value="OPTION_TICKET">옵션권</option>
              </select>
              <input
                type="number"
                value={r.quantity}
                onChange={(e) =>
                  updateReward(
                    i,
                    "quantity",
                    e.target.value,
                    rewards,
                    setRewards,
                  )
                }
                min={1}
                className={inputClass + " !w-20"}
              />
              <span className="text-xs text-[#4a4e69]">개</span>
              {rewards.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setRewards(rewards.filter((_, idx) => idx !== i))
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  <Minus size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 보너스 구성품 */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium text-[#a0a3bd]">
            보너스 구성품 (표시용)
          </label>
          <button
            type="button"
            onClick={() =>
              setBonusRewards([...bonusRewards, { ...EMPTY_REWARD }])
            }
            className="flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300"
          >
            <Plus size={12} /> 추가
          </button>
        </div>
        {bonusRewards.length === 0 ? (
          <p className="text-xs text-[#4a4e69]">보너스 구성품 없음</p>
        ) : (
          <div className="flex flex-col gap-2">
            {bonusRewards.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <select
                  value={r.itemType}
                  onChange={(e) =>
                    updateReward(
                      i,
                      "itemType",
                      e.target.value,
                      bonusRewards,
                      setBonusRewards,
                    )
                  }
                  className={selectClass + " flex-1"}
                >
                  <option value="MATCHING_TICKET">매칭권</option>
                  <option value="OPTION_TICKET">옵션권</option>
                </select>
                <input
                  type="number"
                  value={r.quantity}
                  onChange={(e) =>
                    updateReward(
                      i,
                      "quantity",
                      e.target.value,
                      bonusRewards,
                      setBonusRewards,
                    )
                  }
                  min={1}
                  className={inputClass + " !w-20"}
                />
                <span className="text-xs text-[#4a4e69]">개</span>
                <button
                  type="button"
                  onClick={() =>
                    setBonusRewards(bonusRewards.filter((_, idx) => idx !== i))
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  <Minus size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p className="mt-4 text-sm font-medium text-red-400">* {error}</p>
      )}

      {/* 제출 */}
      <button
        type="submit"
        disabled={createMutation.isPending}
        className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-sm font-semibold text-white shadow-lg shadow-[#6366f1]/20 transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {createMutation.isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          "상품 등록"
        )}
      </button>
    </form>
  );
}
