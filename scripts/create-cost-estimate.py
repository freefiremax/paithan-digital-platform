"""Essential-only budget requested by the project owner."""
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf/paithan-platform-cost-estimate.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Arial','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold',italic='Arial',boldItalic='ArialBold')
NAVY=colors.HexColor('#142D39'); TEAL=colors.HexColor('#06796E'); LIGHT=colors.HexColor('#EDF5F3')
s=getSampleStyleSheet()
for name,font,size,leading,color in [('Body','Arial',10,14,NAVY),('TitleNew','ArialBold',25,30,NAVY),('SubNew','ArialBold',12,16,TEAL),('SmallNew','Arial',8,11,NAVY),('Head','ArialBold',9,12,colors.white),('CellNew','Arial',9,12,NAVY)]:
    s.add(ParagraphStyle(name=name,fontName=font,fontSize=size,leading=leading,textColor=color))
story=[]
def p(text,style='Body'):
    story.append(Paragraph(text,s[style]));story.append(Spacer(1,6))
def table(headers,rows,widths):
    data=[[Paragraph(escape(x),s['Head']) for x in headers]]
    data += [[Paragraph(escape(x),s['CellNew']) for x in row] for row in rows]
    t=Table(data,colWidths=widths,repeatRows=1)
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),NAVY),('VALIGN',(0,0),(-1,-1),'TOP'),('ROWBACKGROUNDS',(0,1),(-1,-1),[LIGHT,colors.white]),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
    story.append(t);story.append(Spacer(1,10))
p('PAITHAN DIGITAL PLATFORM | 14 OCTOBER 2026','SubNew')
p('Only the essentials.<br/>Minimum operating budget.','TitleNew')
p('<b>The earlier ₹12,000/month was not a mandatory tool bill.</b> It included external maintenance labour and optional provisions. This version removes them. You can maintain the site yourself without a compulsory monthly support contract.')
p('Services the current website depends on','SubNew')
table(['Essential service','Why needed','Payment requirement'],[
('Vercel hosting [1,2]','Runs the website and backend API.','Public client/commercial launch: Pro $20/month for one deploying seat, about ₹1,800 before tax/FX. Eligible personal non-commercial Hobby can remain ₹0.'),
('Neon database [3]','Accounts, civic records and chatbot knowledge.','₹0 within Free: 100 CU-hours/month and 1 GB/project. Paid is conditional, not mandatory from day one.'),
('Gemini API [4]','General AI answers beyond local website replies.','₹0 within free quotas. Use paid API billing when general chat demand outgrows them; no fixed subscription required.'),
('Cloudinary [5]','Current upload/media workflow.','₹0 within Free: 25 shared credits/month. No need to pay merely because it is integrated.'),
('Upstash [6]','Distributed rate limiting for backend/chatbot requests.','₹0 within Free: 500K commands/month. PAYG only when needed: $0.20/100K commands.'),
('Cloudflare Turnstile [7]','Existing bot-protected forms.','₹0. Cloudflare Pro is not required for Turnstile.'),
('Custom domain','Your chosen branded address; site can technically run on its Vercel address.','Reserve ₹800-₹2,000/year; budget example ₹1,500/year. Paid annually, not monthly.'),
],[107,155,237])
p('<b>Excluded:</b> paid Sentry, email subscriptions, SMS, payments, live map APIs, extra hosting, separately purchased SSL and maintenance labour. Keep free Sentry if useful; it is not required to serve pages. Domain pricing is a planning reserve, not a name-specific quote.','SmallNew')
story.append(PageBreak())
p('What will you actually spend?','TitleNew')
p('Planning conversion: ₹90/USD, not a live exchange quote. One deploying seat; Vercel usage stays within included credit; Cloudinary and Upstash stay within Free. These are bounded examples, not unlimited-traffic guarantees.')
table(['Monthly line','Lowest public launch','Modest paid usage'],[
('Vercel Pro','$20 = ₹1,800','$20 = ₹1,800'),
('Neon','₹0 inside Free','₹495 provision: 50 CU-h + 0.5 GB = $5.475 (₹492.75, rounded up)'),
('Gemini','₹0 inside free limits','₹270: 1K model replies, 2K input + 400 output tokens, all 3.8 Flash'),
('Cloudinary / Upstash / Turnstile','₹0 inside allowances','₹0 inside allowances'),
('Service subtotal','₹1,800','₹2,565'),
('Illustrative tax + FX reserve*','₹388','₹553'),
('Domain: ₹1,500 / 12','₹125','₹125'),
('Total monthly equivalent','₹2,313','₹3,243'),
],[159,170,170])
p('<b>Start with ₹2,500-₹3,500/month as an allowance for light usage.</b> Domain cash is paid annually. The totals already contain its ₹125 monthly equivalent; do not add it twice. No external maintenance labour is included.')
p('*Reserve = service subtotal × (1.18 × 1.03 - 1), rounded: an illustrative 18% tax and 3% FX/card buffer, not a tax ruling. Actual fees/taxes vary; domain reserve is assumed checkout-inclusive. Annual equivalents: ₹27,756 and ₹38,916 respectively.','SmallNew')
p('Pay only where usage requires it','SubNew')
p('Neon Launch: $0.106/CU-hour + $0.35/GB-month, no monthly minimum; history and other metered features extra. Upstash PAYG 1M commands = $2, about ₹180 before tax/FX. Cloudinary credits combine storage, bandwidth and transformations; hero video can use them quickly. Track actual usage and upgrade only the affected service.','SmallNew')
p('Current chatbot tries 3.8 Flash first, then 3.5 Flash-Lite. At 1K model replies with 2K input/400 output tokens each: Lite ₹144; 3.8 ₹270, before tax/FX. Thinking counts as output. 3.8 rates double on 1 January 2027. Local replies have no generation charge. Free quotas do not guarantee uninterrupted general AI.','SmallNew')
p('No fixed low bill can guarantee operation under any traffic or attack. Keep rate limits, caching, upload limits, backups and spend controls active. Maintain these yourself; paid labour is optional. Actual billing accounts were not audited; no application settings or subscriptions changed.','SmallNew')
p('Official pricing references checked 14 October 2026','SubNew')
refs=[('1','Vercel','https://vercel.com/pricing'),('2','Hobby eligibility','https://vercel.com/docs/plans/hobby'),('3','Neon','https://neon.com/pricing'),('4','Gemini','https://ai.google.dev/gemini-api/docs/pricing'),('5','Cloudinary','https://cloudinary.com/documentation/billing_and_plans'),('6','Upstash','https://upstash.com/pricing/redis'),('7','Turnstile','https://developers.cloudflare.com/turnstile/plans/')]
for num,name,url in refs:
    p(f'[{num}] <link href="{url}" color="#06796E">{name}: {url}</link>','SmallNew')
def footer(c,doc):
    w,h=A4;c.setFillColor(TEAL);c.rect(0,h-9,w,9,stroke=0,fill=1)
    c.setFont('Arial',8);c.setFillColor(NAVY);c.drawString(48,28,'Essential-only budget | Checked 14 Oct 2026 | No purchases made');c.drawRightString(w-48,28,str(doc.page))
doc=SimpleDocTemplate(str(OUT),pagesize=A4,leftMargin=48,rightMargin=48,topMargin=40,bottomMargin=50,title='Paithan Platform - Essential Operating Costs',author='Prepared for Prasanna')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(OUT)
