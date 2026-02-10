export async function getInitialMaintenanceStatus() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/status`, {
      next: { revalidate: 60 }, // 60초마다 재검증 (정적 생성 가능)
    });
    if (!res.ok) return false;

    // Check if response is JSON before parsing
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.warn("Status endpoint returned non-JSON response");
      return false;
    }

    const data = await res.json();
    return data.maintenance ?? false;
  } catch (error) {
    console.error("Failed to fetch maintenance status:", error);
    return false;
  }
}
