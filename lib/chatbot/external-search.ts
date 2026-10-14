/** Provider-neutral extension point. No external search account is configured. */
export interface ExternalEvidence {
  title: string;
  url: string;
  text: string;
  publishedAt?: string;
  official: boolean;
}
export interface ExternalSearchProvider {
  search(query: string, signal: AbortSignal): Promise<ExternalEvidence[]>;
}
export const externalSearchProvider: ExternalSearchProvider | null = null;
