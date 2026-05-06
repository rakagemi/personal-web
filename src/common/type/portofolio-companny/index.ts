import { PortfolioAsset } from "../portofolio-asset";

export type PortfolioCompany = {
    id: string;
    slug: string;
    name: string;
    role: string;
    period: string;
    location: string;
    summary: string;
    description: string;
    key_responsibilities: string[];
    image_url: string;
    image_dark_url: string;
    created_at: string;
    project_overview: string,
    project_team: string[],
    assets: PortfolioAsset[];
};