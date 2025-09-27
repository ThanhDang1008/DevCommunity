"use client";
import LoginForm from "./_components/form";
import NextAuthWrapper from "@/lib/next.auth.wrapper";




export default function Page() {
  return (
    <>
      <div
        style={{
          backgroundImage:
            "linear-gradient(to bottom, #4d6d9f, #5186b5, #589fc8, #65b9d9, #78d2e8)",
          overflow: "hidden",
        }}
      >
        <NextAuthWrapper>
          <LoginForm />
        </NextAuthWrapper>
      </div>
    </>
  );
}
