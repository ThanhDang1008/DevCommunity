import { readDataWebNext } from "@/service/api/web";

export const randomContent = async () => {
  let arr = null;
  try {
    const response = await readDataWebNext(true);
    if (response.status === 200) {
      arr = response?.data?.data?.content || []
    }
  } catch (error) {}

  //   const arr = [
  //     {
  //       value: "suc-khoe",
  //     },
  //     {
  //       value: "giai-tri",
  //     },
  //     {
  //       value: "doi-song",
  //     },
  //     {
  //       value: "the-gioi",
  //     },
  //     {
  //       value: "giao-duc",
  //     },
  //     {
  //       value: "the-thao",
  //     },
  //     {
  //       value: "kinh-doanh",
  //     },
  //     {
  //       value: "thoi-su",
  //     },
  //     {
  //       value: "chinh-tri",
  //     },
  //     {
  //       value: "khoa-hoc-va-cong-nghe",
  //     },
  //   ];
  const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Hoán đổi vị trí
    }
    return array;
  };
  let shuffledArr = [];
  shuffledArr = shuffleArray(arr || []);
  //console.log("shuffledArr", shuffledArr);

  return shuffledArr;
};
