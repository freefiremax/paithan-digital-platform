import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Header Global Citizen Search & Alignment Verification', () => {
  const headerPath = path.join(process.cwd(), 'components/layout/Header.tsx');
  const searchPath = path.join(process.cwd(), 'components/search/HeaderGlobalSearch.tsx');
  const publicLayoutPath = path.join(process.cwd(), 'app/[locale]/(public)/layout.tsx');

  const enMessages = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages/en.json'), 'utf8'));
  const mrMessages = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages/mr.json'), 'utf8'));
  const hiMessages = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'messages/hi.json'), 'utf8'));

  it('should render Header component inside the public layout', () => {
    const layoutContent = fs.readFileSync(publicLayoutPath, 'utf8');
    expect(layoutContent).toContain('import { Header } from "@/components/layout/Header";');
    expect(layoutContent).toContain('<Header />');
  });

  it('should import and place HeaderGlobalSearch directly in Header.tsx', () => {
    const headerContent = fs.readFileSync(headerPath, 'utf8');
    expect(headerContent).toContain('import { HeaderGlobalSearch } from \'@/components/search/HeaderGlobalSearch\';');
    expect(headerContent).toContain('<HeaderGlobalSearch />');
  });

  it('should have HeaderGlobalSearch placed horizontally next to Ask AI Assistant in Header.tsx', () => {
    const headerContent = fs.readFileSync(headerPath, 'utf8');
    expect(headerContent).toMatch(/<HeaderGlobalSearch \/>[\s\S]*?<Link[\s\S]*?chatbot[\s\S]*?aiAssistant/);
  });

  it('should include Satyameva Jayate horizontally aligned on the same row with vertical divider in HeaderGlobalSearch', () => {
    const searchContent = fs.readFileSync(searchPath, 'utf8');
    // Check horizontal flex container with search input, divider and satyamevajayate
    expect(searchContent).toContain('hidden lg:flex items-center');
    expect(searchContent).toContain('h-[44px]');
    expect(searchContent).toContain('bg-slate-300'); // vertical divider
    expect(searchContent).toContain('satyamevaJayate'); // Devanagari motto
    expect(searchContent).toContain('inline-flex items-center text-[13px] font-semibold tracking-wider');
  });

  it('should have symmetrical translation keys for search placeholder and motto across all 3 locales', () => {
    expect(enMessages.header.searchPlaceholder).toBe('Search services, notices, taxes & more…');
    expect(mrMessages.header.searchPlaceholder).toBe('सेवा, सूचना, कर आणि अधिक शोधा…');
    expect(hiMessages.header.searchPlaceholder).toBe('सेवाएं, सूचनाएं, कर और अधिक खोजें…');

    expect(enMessages.header.satyamevaJayate).toBe('सत्यमेव जयते');
    expect(mrMessages.header.satyamevaJayate).toBe('सत्यमेव जयते');
    expect(hiMessages.header.satyamevaJayate).toBe('सत्यमेव जयते');
  });

  it('should provide direct shortcuts covering taxes, notices, certificates, grievances, wards, and tourism', () => {
    const searchContent = fs.readFileSync(searchPath, 'utf8');
    expect(searchContent).toContain('/services/taxation');
    expect(searchContent).toContain('/services/water-supply');
    expect(searchContent).toContain('/services/civil-registration');
    expect(searchContent).toContain('/grievances/new');
    expect(searchContent).toContain('/nagar-parishad/ward-map');
    expect(searchContent).toContain('/nagar-parishad/notifications');
    expect(searchContent).toContain('/tourism/jayakwadi');
    expect(searchContent).toContain('/heritage/museum');
  });
});
