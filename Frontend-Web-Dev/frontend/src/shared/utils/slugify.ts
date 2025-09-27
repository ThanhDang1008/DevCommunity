import slugify from "slugify";

interface SlugifyOptions {
  replacement?: string;
  remove?: RegExp;
  lower?: boolean;
  strict?: boolean;
  locale?: string;
  trim?: boolean;
}

const slugifyOptions: SlugifyOptions = {
  lower: true,
  locale: "vi",
};

export const convertToSlug = (text: string) => {
  return slugify(text, slugifyOptions);
};

export const convertSlugToText = (slug: string) => {
  //slug: giang-vien-le-anh-xuan_lecturer-1729093094293-842738763.html
  const split_html = slug.split(".html");
  const text = split_html[0].split("_");
  const id = text[text.length - 1];
  //lecturer-1729093094293-842738763
  //console.log(id);
  return id;
};
