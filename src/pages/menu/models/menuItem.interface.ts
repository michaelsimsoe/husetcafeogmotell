export interface MenuItem {
  item: {
    name: { no: string; en: string };
    description: { no: string; en: string };
    price: string;
    allergenes?: { no: string[]; en: string[] };
    placement?: number;
  };
}
