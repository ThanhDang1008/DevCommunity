import Image from "next/image";
import { readDataWebNext } from "@/service/api/web";
import Link from "next/link";
import { LOGO_DEFAULT } from "@/constants/Common";

const Logo = async () => {
  let urlLogo = LOGO_DEFAULT;
  try {
    const response = await readDataWebNext(true);
    // console.log("response: ", response);
    if (response?.status === 200) {
      urlLogo = response?.data?.data?.logo || LOGO_DEFAULT;
    }
  } catch (error) {}

  // console.log("urlLogo: ", urlLogo);

  return (
    <>
      <Link title="Trang chủ" href="/" className="logo">
        <Image
          src={urlLogo}
          alt="logo"
          width={200}
          height={100}
          className="hidden sm:block h-8 object-cover hover:opacity-80 transition duration-200 cursor-pointer"
          priority={true}
        />
      </Link>
    </>
  );
};

export default Logo;
