"use server";

type LoginState = {
  success: boolean;
  message: string;
};

export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  // Mock delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // TODO: 실제 백엔드 API 호출로 교체 필요
  // const response = await fetch("https://api.comatching.com/login", {
  //   method: "POST",
  //   body: JSON.stringify({ email, password }),
  //   headers: { "Content-Type": "application/json" },
  // });

  // Mock logic
  if (email === "test@test.com" && password === "1234") {
    return { success: true, message: "" };
  }

  return { success: false, message: "이메일 혹은 비밀번호가 틀립니다" };
}
