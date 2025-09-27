import SpinLoading from "@/components/ui/loading/SpinLoading";
// import Footer from "@components/footer";
import Conatainer from "@/components/layout/home/container";
import Header from "@components/layout/header";

export default async function Loading() {
  return (
    <>
      <Header />
      <Conatainer>
        <SpinLoading />
      </Conatainer>
      {/* <Footer /> */}
    </>
  );
}
