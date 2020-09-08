import { MenuItem } from './menuItem.interface';

export interface MenuModel {
  name: { en: string; no: string };
  description: { no: string; en: string };
  placement?: number;
  menuItems: MenuItem[];
}
