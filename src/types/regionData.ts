export interface ChartDataSet {
  type?: string;
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  yAxisID?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}

export interface Analysis {
  behavior: string;
  growth: string;
}

export interface Chart {
  title: string;
  analysis: Analysis;
  chartData: ChartData;
}

export interface Impact {
  social: string;
  political: string;
  economic: string;
}

export interface TimelineEvent {
  year: string;
  event: string;
  detailedEvent: string;
  image: string;
}

export interface CompanyDescription {
  title: string;
  content: string;
  logoUrl?: string;
  imageUrl?: string;
  accordionItems?: { title: string; content: string }[];
}

export interface RepresentativeCompany {
  name: string;
  logo: string;
  backgroundImage: string;
  description: CompanyDescription[];
}

export interface MapInfo {
  title: string;
  image: string;
  description: string;
  metadata?: {
    source: string;
    date: string;
  };
}

export interface GdpDepartment {
    name: string;
    activities: { [year: string]: number };
    percentages: { [activity: string]: number };
}

export interface GdpData {
    nacional: {
        values: number[];
        percentages: number[];
    };
    regional: {
        departments: GdpDepartment[];
        colors: { [year: string]: string };
    };
}

export interface Sector {
  name: string;
  pageTitle: string;
  introduction: string;
  impactImage: string;
  chartImage: string;
  representativeCompany: RepresentativeCompany;
  chartData: ChartData; // This seems to be a legacy/single chart data
  analysis: Analysis;
  impact: Impact;
  timeline: TimelineEvent[];
  maps: MapInfo[];
  charts: Chart[]; // This is the main array of charts
  representativeCompanies: RepresentativeCompany[];
  gdp: GdpData;
  activeCompanyIndex: number;
}

export interface RegionData {
  Primario: Sector;
  Secundario: Sector;
  Terciario: Sector;
  Cuaternario: Sector;
  Quinario: Sector;
}
