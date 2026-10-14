from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/pdf/paithan-platform-cost-estimate.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont('Arial', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold', 'C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='ArialBold', italic='Arial', boldItalic='ArialBold')
NAVY = colors.HexColor('#142D39')
TEAL = colors.HexColor('#06796E')
GOLD = colors.HexColor('#BB8A32')
LIGHT = colors.HexColor('#EDF5F3')
styles = getSampleStyleSheet()
for name in ['Normal', 'BodyText']:
    styles[name].fontName = 'Arial'
    styles[name].fontSize = 10
    styles[name].leading = 14
    styles[name].textColor = NAVY
styles.add(ParagraphStyle(name='TitleCustom', fontName='ArialBold', fontSize=30, leading=35, textColor=NAVY, spaceAfter=16))
styles.add(ParagraphStyle(name='Section', fontName='ArialBold', fontSize=22, leading=27, textColor=NAVY, spaceAfter=14))
styles.add(ParagraphStyle(name='Sub', fontName='ArialBold', fontSize=12, leading=16, textColor=TEAL, spaceBefore=10, spaceAfter=6))
styles.add(ParagraphStyle(name='SmallCustom', fontName='Arial', fontSize=8, leading=11, textColor=NAVY))
styles.add(ParagraphStyle(name='Cell', fontName='Arial', fontSize=9, leading=12, textColor=NAVY))
styles.add(ParagraphStyle(name='CellHead', fontName='ArialBold', fontSize=9, leading=12, textColor=colors.white))
story = []

def p(text, style='BodyText'):
    story.append(Paragraph(text, styles[style]))
    story.append(Spacer(1, 3 if style == 'SmallCustom' else 7))

def heading(number, title):
    p(f'{number} / COST &amp; OPERATIONS', 'SmallCustom')
    p(title, 'Section')

def table(headers, rows, widths):
    data = [[Paragraph(escape(str(x)), styles['CellHead']) for x in headers]]
    data += [[Paragraph(escape(str(x)), styles['Cell']) for x in row] for row in rows]
    t = Table(data, colWidths=widths, repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY), ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 9), ('RIGHTPADDING', (0,0), (-1,-1), 9),
        ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [LIGHT, colors.white]),
        ('LINEBELOW', (0,0), (-1,0), 1, TEAL),
        ('LINEBELOW', (0,1), (-1,-1), .3, colors.HexColor('#D8E5E1')),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

def note(text):
    t = Table([[Paragraph(text, styles['BodyText'])]], colWidths=[499])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),LIGHT),('BOX',(0,0),(-1,-1),.5,TEAL),('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),12),('BOTTOMPADDING',(0,0),(-1,-1),12)]))
    story.append(t)
    story.append(Spacer(1,12))

def page(): story.append(PageBreak())

sources = [
 ('1', 'Vercel pricing and Hobby eligibility', 'https://vercel.com/pricing'),
 ('2', 'Vercel Hobby plan', 'https://vercel.com/docs/plans/hobby'),
 ('3', 'Neon live pricing', 'https://neon.com/pricing'),
 ('4', 'Cloudinary Image and Video API pricing', 'https://cloudinary.com/pricing'),
 ('5', 'Cloudinary credit accounting', 'https://cloudinary.com/documentation/billing_and_plans'),
 ('6', 'Gemini Developer API pricing', 'https://ai.google.dev/gemini-api/docs/pricing'),
 ('7', 'Upstash Redis pricing', 'https://upstash.com/pricing/redis'),
 ('8', 'Cloudflare Turnstile plans', 'https://developers.cloudflare.com/turnstile/plans/'),
 ('9', 'Cloudflare Pro', 'https://www.cloudflare.com/en-au/plans/pro/'),
 ('10', 'Resend transactional email pricing', 'https://resend.com/pricing'),
 ('11', 'Zoho Mail pricing', 'https://www.zoho.com/en-in/mail/zohomail-pricing.html'),
 ('12', 'Domain registration and renewal checkout', 'https://www.hostinger.com/in/domain-name-search'),
 ('13', 'Sentry pricing - live page unavailable to research tool', 'https://sentry.io/pricing/'),
]

p('PAITHAN DIGITAL PLATFORM', 'Sub')
p('Website cost<br/>and maintenance<br/>estimate', 'TitleCustom')
p('Prepared for Prasanna | 14 October 2026 | INR budgeting edition')
note('<b>Recommended launch allowance: ₹12,000 per month</b><br/>Working example: approximately ₹5,157 for infrastructure and reserves, plus ₹6,000 for six hours of maintenance. Keep the remaining allowance for small usage changes. This is a planning budget, not a vendor quotation.')
table(['Stage', 'Tools + domain equivalent', 'With maintenance'], [
 ('Prototype / learning', '₹125/month equivalent; annual domain paid separately', '₹125 if maintained yourself'),
 ('Small public launch', '₹5,157/month planning example', '₹11,157/month; allocate ₹12,000'),
 ('Higher usage', '₹46,923/month planning example', '₹61,923/month including 15 support hours'),
], [133,183,183])
p('Do not buy every paid plan now. Prioritise the domain, suitable hosting, production database recovery and a controlled chatbot budget. Retain free image delivery, Turnstile and monitoring while they meet your actual needs.')
p('What this estimate covers', 'Sub')
p('Existing stack costs, upgrade triggers, chatbot token calculations, launch setup, annual commitments, maintenance labour and optional future integrations. Existing development already completed is not charged again.')
p('Accuracy boundary', 'Sub')
p('Published USD prices were checked against official pages. Actual bills depend on traffic, database activity, media bandwidth, tokens, seats, taxes and the exchange rate at payment. Account invoices and usage dashboards were not audited. Sentry paid pricing remains unverified and is marked as an allowance.')
page()

heading('01', 'What the project actually uses')
table(['Service', 'Role in this project', 'Budget position'], [
 ('Vercel', 'Next.js application, API routes, deployment and delivery', 'Keep as primary host; paid plan for a public client/commercial launch [1,2].'),
 ('Neon PostgreSQL + Prisma', 'Accounts, civic records and chatbot knowledge storage', 'Database hosting is billable; Prisma ORM has no separate subscription in this setup.'),
 ('Cloudinary', 'Upload and media delivery configuration', 'Keep Free initially; review image/video credits before upgrade.'),
 ('Google Gemini API', 'General chatbot answers; optional embeddings', 'Usage-based API, separate from a consumer AI subscription.'),
 ('Upstash Redis', 'Distributed request rate limiting', 'Free or PAYG; commands include limiter operations, not only page visits.'),
 ('Sentry', 'Error monitoring SDK and configuration', 'Start free; upgrade for volume/team needs, after a live quote.'),
 ('Cloudflare Turnstile', 'Form bot protection', 'Free; does not require Cloudflare Pro [8].'),
 ('GitHub + open-source libraries', 'Source control, CI, Auth.js, React, Next.js', 'No extra framework licence cost assumed; CI/account limits can add fees.'),
], [113,190,196])
p('Inspected: package.json, .env.example, chatbot settings/client and map components. Configuration support does not prove an account is on a paid plan or that every feature is enabled in production.', 'SmallCustom')
p('Additional systems worth preparing', 'Sub')
p('A branded support mailbox; transactional email for grievance receipts/password flows; independent uptime alerts; tested database/media backups; billing alerts; and a named maintenance owner. The repository scan did not find a transactional email provider or a payment SDK. These are proposed additions, not current charges.')
p('The current ward map uses a local embedded map. No Google Maps/Mapbox API subscription is evidenced by the inspected components. Do not purchase a map API unless you add live geocoding, routes or paid tiles.')
page()

heading('02', 'Published prices and upgrade triggers')
table(['Service', 'Free / paid reference', 'When to pay'], [
 ('Vercel [1,2]', 'Hobby $0, personal non-commercial only. Pro $20/month for one deploying seat, with $20 usage credit; added paid seats/overages cost extra.', 'Client/commercial launch, collaboration or exhausted limits.'),
 ('Neon [3]', 'Free: 100 CU-hours and 1 GB per project. Launch: $0.106/CU-hour + $0.35/GB-month; no monthly minimum. Recovery history is extra.', 'Sustained usage, more storage or stronger recovery requirements.'),
 ('Cloudinary [4,5]', 'Free: 25 shared monthly credits. Plus: $99 month-to-month or $89/month annual equivalent; 225 credits.', 'Actual combined storage, bandwidth and transformations exceed Free. Not 25 GB for each category.'),
 ('Upstash [7]', 'Free: 500K commands/month, 250 MB. PAYG: $0.20/100K commands. Fixed reference: $10/month; replication can add cost.', 'Rate-limiter operations exceed Free or predictable capacity is needed.'),
 ('Cloudflare [8,9]', 'Turnstile Free. Optional Pro website plan: $25/month. DNS/CDN plan is separate from Turnstile.', 'Only for required security/CDN features; not needed merely to use a domain.'),
 ('Sentry [13]', 'Keep available free plan initially. Paid Team estimate: $30/month allowance, NOT a verified current checkout price.', 'Team access, retention or event quotas justify a quote. Check dashboard before purchase.'),
], [105,260,134])
p('USD-to-INR assumption: ₹90 per $1, selected for budgeting, not quoted as today\'s exchange rate. Thus $20 = ₹1,800, $99 = ₹8,910 and $25 = ₹2,250 before tax and FX costs.', 'SmallCustom')
p('Avoid duplicate bills', 'Sub')
p('Vercel is already the host: do not also buy a shared-hosting bundle for the same app. Ordinary HTTPS certificate provisioning is included with Vercel custom domains; a separately purchased SSL certificate is not assumed. Cloudflare Workers/R2, Neon extra backend products and a second vector database are not required by the present architecture.')
page()

heading('03', 'How much does the chatbot cost?')
p('Use paid <b>Gemini 3.5 Flash-Lite</b> for economical routine answers, subject to quality testing. Current code tries 3.8 Flash first, then 3.5 Flash-Lite; this is not a Lite-only deployment. Local deterministic replies use no generation tokens.')
table(['Standard API [6]', 'Input / 1M tokens', 'Output / 1M tokens'], [
 ('3.5 Flash-Lite', '$0.30', '$2.50'),
 ('3.8 Flash, through 31 Dec 2026', '$0.75', '$3.75'),
 ('3.8 Flash, from 1 Jan 2027', '$1.50', '$7.50'),
], [237,131,131])
p('Calculation assumption: each model response averages 2,000 input tokens (instructions, history and retrieval included) and 400 billable output tokens, including thinking. One successful model call per response; no live search, embeddings, caching storage or billed failed attempts included.')
note('<b>Per response = input tokens × input rate / 1,000,000 + output tokens × output rate / 1,000,000.</b><br/>Lite example: 2,000 × $0.30 / 1M + 400 × $2.50 / 1M = $0.0016, or ₹0.144 before tax/FX.')
table(['Model-backed responses / month', 'All Lite', 'All 3.8 now', 'All 3.8 Jan 2027'], [
 ('1,000', '$1.60 / ₹144', '$3 / ₹270', '$6 / ₹540'),
 ('10,000', '$16 / ₹1,440', '$30 / ₹2,700', '$60 / ₹5,400'),
 ('50,000', '$80 / ₹7,200', '$150 / ₹13,500', '$300 / ₹27,000'),
], [178,107,107,107])
p('A 20% Flash / 80% Lite mix is ₹1,692 at 10,000 model replies or ₹8,460 at 50,000, using current prices. If half of all chat turns are local replies, only the remaining half enters this token model. Real prompts can be much larger; measure usage metadata rather than character count.')
p('Free tier has model/project-specific limits. Paid access improves capacity but does not guarantee uptime or correctness. Paying does not fine-tune the model. ChatGPT/Claude/Gemini consumer subscriptions do not pay this website\'s API bill. Optional live Google Search grounding introduces separate search charges; it is not configured now.', 'SmallCustom')
page()

heading('04', 'Monthly budgets you can reproduce')
p('All figures are INR. Small launch assumes about 10K visits, 1K model replies, intermittent database usage, 2 mailboxes, one deploying seat and media within Free. Higher usage assumes 100K visits, 50K model replies, two deploying seats and paid media/monitoring. Visits alone cannot predict compute or bandwidth.')
table(['Line item', 'Small launch', 'Higher usage'], [
 ('Vercel seats + usage allowance', '1,800 ($20)', '5,400 ($40 seats + $20 usage)'),
 ('Neon compute + live storage', '1,350 ($15 allowance)', '7,184 (720 CU-h + 10 GB)'),
 ('Gemini model usage', '450 ($5 allowance)', '8,460 (50K replies, 20/80 mix)'),
 ('Cloudinary', '0 (within Free)', '8,910 ($99 Plus monthly)'),
 ('Sentry', '0 (within free quota)', '2,700 ($30 unverified allowance)'),
 ('Upstash', '180 ($2 / 1M PAYG commands)', '900 ($10 fixed reference)'),
 ('Cloudflare DNS / Turnstile / optional Pro', '0', '2,250 ($25 Pro assumed needed)'),
 ('Transactional email', '0 (within Resend Free)', '1,800 ($20 Pro)'),
 ('Branded mailboxes', '180 (2 × $1 annual equivalent)', '450 (5 × $1 annual equivalent)'),
 ('Backup/history/uptime provision', '180 (planning allowance)', '450 (planning allowance)'),
 ('Tool subtotal', '4,140', '38,504'),
 ('Tax + FX reserve on tool subtotal*', '892', '8,294'),
 ('Domain equivalent: ₹1,500/year', '125', '125'),
 ('Infrastructure planning total', '5,157', '46,923'),
 ('Maintenance: ₹1,000/hour assumed', '6,000 (6 h)', '15,000 (15 h)'),
 ('All-in monthly / annual equivalent', '11,157 / 133,884', '61,923 / 743,076'),
], [279,110,110])
p('*Illustrative reserve = subtotal × (1.18 × 1.03 - 1), rounded to nearest rupee. Uses an 18% tax scenario and 3% FX/card buffer, not a tax ruling; actual tax treatment and card fees depend on vendor/customer billing. Domain ₹1,500 is a checkout-inclusive planning provision. Labour taxes, if applicable, are additional. Neon higher example: (720 × $0.106 + 10 × $0.35) × ₹90 = ₹7,183.80, rounded.', 'SmallCustom')
page()

heading('05', 'Domain, setup and annual payments')
table(['Purchase / work', 'Planning amount', 'Notes'], [
 ('Domain registration / renewal', '₹800-₹2,000 per year; provision ₹1,500', 'Ordinary non-premium .in/.com. Promotional first-year offers are not renewal prices. Check exact name, term, fees and GST [12].'),
 ('Initial launch hardening', '₹12,000-₹24,000 once', '12-24 h × assumed ₹1,000/h for domain/OAuth, backups, alerts, email, QA and handover; estimate, not contractor quote.'),
 ('2 mailboxes annual prepayment', '₹2,160 before tax/FX', '2 × $1 × 12 × ₹90; included as ₹180/month above, not an additional recurring line [11].'),
 ('New features / major redesign', 'Separate scoped quotation', 'Not included in routine support or already-completed project work.'),
 ('Optional Cloudinary annual Plus', '$1,068/year = ₹96,120 before tax/FX', '$89 × 12. Compare annual commitment with $99 monthly; choose only after measuring demand [4].'),
], [143,141,215])
p('Cash timing', 'Sub')
p('Domain and annual email are paid upfront even though shown as monthly equivalents. The small-launch first-year example ₹133,884 already includes ₹1,500 for domain and ₹2,160 for email; do not add them twice. Adding launch setup gives approximately <b>₹145,884-₹157,884 for year one</b>, before any labour tax or unplanned features.')
p('A practical launch reserve', 'Sub')
p('Keep roughly <b>₹20,000-₹35,000 available for setup and first payments</b>, followed by the ₹12,000 monthly operating allowance. This is rounded cash planning; it is not a deposit requirement from any provider. Self-maintenance removes the external labour bill, but the work and time still exist.')
p('Domain work beyond buying the name', 'Sub')
p('Connect the domain to Vercel, set the canonical URL, update OAuth authorised URLs, configure email DNS (SPF/DKIM/DMARC), confirm HTTPS and redirects, and set renewal reminders. Domain ownership and vendor accounts should stay with the project owner. A civic-looking design alone does not make the platform an authorised government service; agree branding and permissions before launch.')
page()

heading('06', 'What to add, and what can wait')
table(['Requirement', 'Cost position', 'Recommendation'], [
 ('Transactional email [10]', 'Free: 3K/month, 100/day. Pro $20/month for 50K; extra emails $0.90/1K.', 'Add for citizen receipts and account workflows. Domain mailbox and sending API serve different purposes.'),
 ('Branded mailbox [11]', 'Mail Lite reference $1/user/month billed yearly; 5 GB. Local checkout can differ.', 'Start with support/admin mailboxes. Aliases can reduce paid seat count.'),
 ('Backups + restore practice', '₹180-₹450 monthly provision above; may need more.', 'Daily database backup or suitable restore retention; independent copy of critical uploads; restore drill. Provision is not a vendor quote.'),
 ('Uptime checks + alerts', 'Free initially; paid SLA needs quotation.', 'Monitor website, API and chatbot with synthetic probes; avoid sensitive test data.'),
 ('SMS / WhatsApp / OTP', 'Not integrated; provider + country/template charges.', 'Add only if users need these channels. Request a volume quote; excluded from totals.'),
 ('Payments', 'No payment SDK found; fees vary by method/provider.', 'Only if collecting money. Settlement, refunds and support need a separate design/budget.'),
 ('Live maps / web search', 'No paid map API or live search assumed.', 'Add if required; geocoding/search requests create new meters. Keep existing local map otherwise.'),
 ('Security / accessibility audit', 'Separate professional quote.', 'Use for public civic deployment where scope, data or procurement demands it. No compliance certification assumed.'),
], [120,181,198])
p('Maintenance scope for the six-hour example', 'Sub')
p('2 h dependency/security updates and deploy checks; 1 h error review; 1 h backups/restore and uptime checks; 1 h verified content/chatbot corrections; 1 h minor fixes and billing review. Large changes, translations, new integrations, incident response beyond these hours and 24/7 on-call are excluded.')
p('Check usage weekly for the first month. At 70-80% of a free quota, optimise or budget an upgrade. Set provider alerts/caps where available; an alert is not necessarily a hard spending limit. Compress hero media, cache public data, bound model context, sample Sentry events and avoid unnecessary deploying seats.')
page()

heading('07', 'Purchase order and source register')
p('Recommended order', 'Sub')
p('<b>Now:</b> ordinary domain, appropriate Vercel plan, production recovery strategy and controlled Gemini billing. <b>Next:</b> branded mailbox, citizen email notifications and independent alerts. <b>Later:</b> paid Cloudinary, Sentry or Cloudflare only after measured demand. No subscriptions were purchased or changed for this report.')
p('Before approving a recurring budget', 'Sub')
p('Collect the last 30 days of Vercel usage, Neon CU-hours/storage/history, Cloudinary credits, Gemini token/model counts, Redis commands and Sentry event counts. Confirm deploying users, required mailboxes and recovery expectations. Replace the ₹90 exchange assumption and tax/FX reserve with invoice values. These steps turn this estimate into a forecast based on your actual workload.')
p('Official sources checked 14 October 2026', 'Sub')
for num, title, url in sources:
    p(f'<b>[{num}] {escape(title)}</b><br/><link href="{url}" color="#06796E">{escape(url)}</link>', 'SmallCustom')
p('Important verification notes', 'Sub')
p('Sentry\'s current public pricing page could not be retrieved; $30 is a provisional allowance only. Domain checkout is name-specific and the public renewal table was not fully exposed, so the domain line is a reserve rather than an exact renewal quote. Mail pricing is the displayed USD reference, not a guaranteed India-specific offer. Budget quantities, labour rates and reserves are author assumptions, not claims from provider pages.', 'SmallCustom')

def decorate(c, doc):
    w,h=A4
    c.setFillColor(TEAL); c.rect(0,h-10,w,10,fill=1,stroke=0)
    c.setStrokeColor(colors.HexColor('#D8E5E1')); c.line(48,44,w-48,44)
    c.setFont('Arial',8); c.setFillColor(NAVY)
    c.drawString(48,30,'PAITHAN DIGITAL PLATFORM  |  Planning estimate - 14 Oct 2026')
    c.drawRightString(w-48,30,f'{doc.page}')

doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=43,bottomMargin=60,title='Paithan Digital Platform - Cost and Maintenance Estimate',author='Prepared for Prasanna')
doc.build(story,onFirstPage=decorate,onLaterPages=decorate)
print(OUT)
