export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  trend: 'up' | 'down' | 'neutral';
  change: string;
}

export enum ButtonVariant {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  OUTLINE = 'OUTLINE',
  GHOST = 'GHOST'
}

export interface Project {
  name: string;
  client: string;
  status: string;
  id: string;
  images: string[];
}