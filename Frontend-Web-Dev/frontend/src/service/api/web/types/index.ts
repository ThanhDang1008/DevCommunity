export type ItemChildCategory = {
  title: string;
  value: string;
};

export type MainCategory = {
  title: string;
  value: string;
  children?: ItemChildCategory[];
};

export interface InfoWeb {
  logo?: string;
  footer?: {
    content?: string;
  };
  header?: MainCategory[]
  select_header?: string[];
  content?: MainCategory[];
  select_content?: string[];
}

export type ReadDataWebResponse = {
  message: string;
  data: InfoWeb;
}

export type ReadDataWebNextResponse = {
  message: string;
  data: InfoWeb;
}

export type UpdateDataWebResponse = {
  message: string;
  data: InfoWeb;
}
