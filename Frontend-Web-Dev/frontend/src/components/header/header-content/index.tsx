import Link from "next/link";
import { cache } from "react";

import { readDataWebNext } from "@/service/api/web";
import type {
  MainCategory,
  ItemChildCategory,
} from "@/service/api/web/types";
// import Sidebar from "../Sidebar";
import Account from "@/modules/user/components/NameAccount";

const readDataWebNextCache = cache(readDataWebNext);

const HeaderContent = async () => {
  //console.log("___data: ", data);
  let mainCategories: MainCategory[] = [];
  const totalItemRender = 9;

  try {
    const response = await readDataWebNextCache(true);
    if (response.status === 200) {
      mainCategories = response?.data?.data?.header || [];
    }
  } catch (error) {}

  //console.log("mainCategories: ", mainCategories);

  return (
    <>
      <div className="header-content">
        <ul className="nav-list">
          <li className="nav-item">
            <Link title={"Bài viết mới nhất"} href={`#bai-viet-moi-nhat`}>
              <h2>🔥 News</h2>
            </Link>
          </li>
          {mainCategories &&
            mainCategories.length > 0 &&
            mainCategories.map((category: MainCategory, index: number) => {
              if (index <= totalItemRender) {
                return (
                  <li key={index} className="nav-item">
                    <Link
                      title={category.title}
                      href={`/chu-de${category.value}`}
                    >
                      <h2>{category.title}</h2>
                    </Link>
                    {category.children && category.children.length > 0 && (
                      <ul className="sub-menu">
                        {category.children.map(
                          (childCategory: ItemChildCategory, index: number) => (
                            <li key={index} className="sub-menu-item">
                              <Link
                                title={childCategory.title}
                                href={`/chu-de${category.value}${childCategory.value}`}
                              >
                                <span>{childCategory.title}</span>
                              </Link>
                            </li>
                          )
                        )}
                      </ul>
                    )}
                  </li>
                );
              }
            })}
          {mainCategories && mainCategories.length > totalItemRender && (
            <li className="nav-item">
              <Link title="Xem thêm" href="#">
                <i className="bi bi-three-dots"></i>
              </Link>
              <ul className="sub-menu">
                {mainCategories.map((category: MainCategory, index: number) => {
                  // console.log("category: ", category,index);
                  if (index > totalItemRender) {
                    return (
                      <li key={index} className="sub-menu-item">
                        <Link
                          title={category.title}
                          href={`/chu-de${category.value}`}
                        >
                          <h2>{category.title}</h2>
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <ul className="sub-sub-menu">
                            {category.children.map(
                              (
                                childCategory: ItemChildCategory,
                                index: number
                              ) => (
                                <li key={index} className="sub-sub-menu-item">
                                  <Link
                                    title={childCategory.title}
                                    href={`/chu-de${category.value}${childCategory.value}`}
                                  >
                                    <span>{childCategory.title}</span>
                                  </Link>
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </li>
                    );
                  }
                })}
              </ul>
            </li>
          )}
          {/* <li className="nav-item">
          <ThemeToggleButton />
        </li> */}
        </ul>
        <div>
          <Account />
        </div>
      </div>
    </>
  );
};

// export default HeaderContent;
