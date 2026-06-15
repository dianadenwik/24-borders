export interface Country {
  names: {
    common: string;
    official?: string;
  };
  capitals?: { name: string }[];
  region?: string;
  subregion?: string;
  population?: number;
  flag?: {
    url_svg?: string;
    url_png?: string;
    description?: string;
  };
  codes: {
    alpha_2: string;
    alpha_3?: string;
  };
  languages?: { name: string; native_name?: string }[];
  currencies?: Record<string, { name: string; symbol: string }>;
}

export type FetchState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };
