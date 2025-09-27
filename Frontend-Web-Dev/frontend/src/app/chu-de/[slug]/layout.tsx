import CustomCursor from "@/components/cursor/CustomCursor";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
