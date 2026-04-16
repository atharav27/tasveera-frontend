import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

export interface DetailRow {
  label: string;
  value: string | ReactNode | ((props: { label: string }) => ReactNode);
  customRender?: boolean;
}

export interface DetailColumn {
  rows: DetailRow[];
}

export interface DetailSection {
  icon: LucideIcon;
  heading: string;
  columns: DetailColumn[];
}

export interface HeaderBadge {
  label: string;
  className: string;
}

export interface HeaderActionButton {
  label: string;
  icon: ReactNode;
  onClick: () => void;
}

export interface DetailCardHeader {
  title: string;
  badge?: HeaderBadge;
  subtitle?: string;
  actionButton?: HeaderActionButton;
}

export interface DetailCardProps {
  header?: DetailCardHeader;
  sections: DetailSection[];
  className?: string;
}

