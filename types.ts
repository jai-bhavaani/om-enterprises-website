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

export { ButtonVariant } from './components/Button';

export interface Project {
  title: string;
  name: string;
  scope: string;
  status: string;
  images: string[];
}