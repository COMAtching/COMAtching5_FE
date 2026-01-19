// 일부러 엉망으로 짠 테스트 코드
import { useEffect, useState } from "react";

export default function TestComponent() {
  const [data, setData] = useState<any>(null); // any 타입 사용 (지적 대상)

  useEffect(() => {
    // 의존성 배열에 fetch 함수나 관련 변수가 빠져있음 (지적 대상)
    fetch("https://api.example.com/data")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        console.log("데이터 들어옴!!!!"); // 프로덕션에 로그 남김 (지적 대상)
      });
  }, []);

  return (
    <div>
      {/* 렌더링 최적화 안 됨 */}
      <h1>{data ? data.title : "Loading..."}</h1>
    </div>
  );
}
