export const getStepTitle = (step: number): string => {
  switch (step) {
    case 1:
      return "전공이 어떻게 되세요?";
    case 2:
      return "성별을 알려주세요";
    case 3:
      return "본인의 MBTI를 알려 주세요";
    case 4:
      return "연락빈도를 알려 주세요";
    default:
      return "";
  }
};
