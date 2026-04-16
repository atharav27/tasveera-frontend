export type ReportType = "financial" | "operational" | "vendor" | "travel" | "custom";

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  generatedAt: string;
  period: {
    from: string;
    to: string;
  };
  fileUrl?: string;
}

export interface ReportFilter {
  type?: ReportType;
  dateRange?: {
    from: Date;
    to: Date;
  };
  vendorId?: string;
}

export interface ReportData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

export interface ReportCard {
  id: string;
  title: string;
  description: string;
  onViewReport?: () => void;
}

export interface ReportCategory {
  id: string;
  title: string;
  icon: string;
  defaultExpanded: boolean;
}

export interface ReportCategoryData extends ReportCategory {
  reports: ReportCard[];
}
