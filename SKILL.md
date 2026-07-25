Claude Code Skill: Static Business Website Generator
Goal

Build a high-performance, secure, SEO-friendly static website for a printer sales and service business.

The generated website must be easy to maintain, have almost zero runtime dependencies, and follow modern web standards.

Business Information

Business Location

Rajkot
Gujarat
India

Business Type

Sales, service and wholesale distribution of printers and printer spare parts.

Brands include (not limited to):

Canon
HP
Brother
Epson
Ricoh
Xerox
Kyocera
Pantum
TVS
Samsung printers
Other major printer manufacturers

Business Services

New Printer Sales
Printer Installation
Printer Repair
Annual Maintenance Contracts (AMC)
On-site Printer Service
Corporate Printer Solutions
Printer Rental (optional if enabled)
Cartridge Refilling
Cartridge Sales
Toner Sales

Products

Sell retail and wholesale for printer consumables and spare parts including:

Toner cartridges
Ink cartridges
Drum units
Fuser units
Transfer belts
Pickup rollers
Separation pads
Maintenance kits
Print heads
Formatter boards
Logic boards
Power supplies
Scanner assemblies
Cables
Sensors
Gears
Rollers
Motors
Encoders
Waste toner containers
Ribbon cartridges
Developer units

Support nearly every major printer model.

Website Requirements

The website must be completely static.

Allowed:

HTML5
Modern CSS
Minimal JavaScript only where absolutely necessary

Avoid:

React
Angular
Vue
Next.js
Nuxt
Svelte
Astro
Node server
SSR
Large build pipelines
Runtime dependencies

The generated website should be deployable directly on:

GitHub Pages
Cloudflare Pages
Netlify
AWS S3
Any static hosting
UI

Use

https://oat.ink/

as the design inspiration and component library.

Requirements

Clean
Professional
Modern
Fast
Responsive
Accessible

Do not introduce additional UI libraries unless absolutely required.

Performance

Target:

Lighthouse 95+
First Contentful Paint under 1 second
Largest Contentful Paint under 2 seconds
CLS near zero
Minified assets
Lazy-loaded images
Responsive images
SVG icons where possible
No unnecessary JavaScript
Accessibility

Must follow WCAG 2.2 AA.

Include

Proper heading hierarchy
Semantic HTML
Keyboard navigation
Focus indicators
Color contrast
Screen reader support
Alt text
ARIA only where necessary
SEO

Include

Meta title
Meta description
Canonical URL
Open Graph tags
Twitter Card tags
robots.txt
sitemap.xml
Structured data (JSON-LD)
Local Business schema
Organization schema
Breadcrumb schema where applicable

Optimize every page for search engines.

Security Requirements

Follow defense-in-depth security practices suitable for a static website.

Content Security Policy

Generate a strict CSP.

Example principles:

default-src 'self'
object-src 'none'
base-uri 'self'
frame-ancestors 'none'
form-action 'self'
script-src 'self'
style-src 'self'
img-src 'self' data:
font-src 'self'
connect-src 'self'

Do not allow arbitrary third-party resources unless explicitly approved.

Security Headers

Recommend configuration for

Content-Security-Policy
Strict-Transport-Security
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Cross-Origin-Resource-Policy
Cross-Origin-Opener-Policy
Cross-Origin-Embedder-Policy (if appropriate)
X-Frame-Options (or rely on CSP frame-ancestors)
Cache-Control
General Security

Never use

inline JavaScript
eval()
new Function()
unsafe-inline
unsafe-eval
document.write()

Sanitize any user-provided data before rendering.

Do not load resources from unknown CDNs.

No analytics unless explicitly requested.

Avoid fingerprinting scripts.

Forms

If a contact form exists,

prefer

Netlify Forms
Cloudflare Forms
Formspree
Static serverless endpoints

Never expose secrets in client-side code.

External Resources

Avoid third-party assets whenever possible.

Host

fonts
icons
images

locally.

Folder Structure
/
├── index.html
├── about/
├── products/
├── services/
├── brands/
├── contact/
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── sitemap.xml
├── robots.txt
├── manifest.webmanifest
└── favicon.ico
Recommended Pages
Home
About Us
Brands
Printer Sales
Printer Services
Spare Parts
Cartridge Refilling
Wholesale
Contact
Privacy Policy
Terms of Service
Contact Page

Include

Phone
WhatsApp
Email
Business Address
Google Maps embed (optional)
Business Hours
Images

Optimize images.

Requirements

WebP preferred
AVIF where supported
Lazy loading
Width/height specified
Responsive images
CSS

Prefer

CSS Variables
Modern CSS
Flexbox
Grid
Container queries where appropriate

Avoid CSS frameworks.

JavaScript

JavaScript should be optional.

Use it only for:

Mobile navigation
Image gallery (if present)
Theme toggle (optional)

No JavaScript-heavy animations.

Browser Support

Support latest versions of

Chrome
Edge
Firefox
Safari

Progressively enhance features.

Deployment

Website should work without modification on

GitHub Pages
Netlify
Cloudflare Pages
AWS S3 static hosting
Code Quality

Generate

Clean HTML
Modular CSS
Well-commented code where helpful
No duplicated code
Consistent naming
W3C-valid HTML
Deliverables

Generate:

Complete static website
SEO metadata
Structured data
Security header recommendations
Optimized assets
README with deployment instructions
Maintenance guide
Lighthouse optimization notes
Accessibility checklist
Security checklist


####
Business Information
Business Name

Shiv Printer House

Business Type

Printer sales, printer service, printer spare parts retail and wholesale.

Address

Shiv Printer House (Ground Floor)
#69, Samrudhi Bhawan
Gondal Road
Bhaktinagar Station Plot
Bhakti Nagar
Rajkot – 360001
Gujarat
India

Google Maps

Design the Contact page so a Google Maps embed can easily be added later if required.

Contact Persons

Alpesh Shingala

Mobile: +91 99794 68675

Nalin Shingala

Mobile: +91 96871 06227
Business Location

Rajkot, Gujarat, India

Contact Page Requirements

The Contact page should prominently display:

Business name
Complete postal address
Click-to-call links for both contact numbers (tel: links)
WhatsApp click-to-chat links for both contact numbers
Email address (placeholder if not yet provided)
Business hours
Embedded Google Map (optional and configurable)
Contact form (optional)
Directions section
Nearby landmark (if available)
Footer

Every page should include a footer containing:

Shiv Printer House
Complete business address
Rajkot, Gujarat, India
Contact numbers
Quick navigation links
Copyright notice
Privacy Policy
Terms & Conditions
Local SEO

Generate LocalBusiness JSON-LD using the above address and contact information.

Include:

Business name
Address
Postal code (360001)
City (Rajkot)
State (Gujarat)
Country (India)
Telephone numbers
Business category
Geographic coordinates (only if explicitly provided)
Opening hours (leave configurable if not supplied)
Contact Links

Generate clickable links using:

tel:+919979468675
tel:+919687106227

Generate WhatsApp links using:

https://wa.me/919979468675
https://wa.me/919687106227

These should be available from both the Contact page and the website header on mobile devices.

Business Identity

The website should consistently use the following branding:

Shiv Printer House

Rajkot, Gujarat, India

Specializing in:

Printer Sales
Printer Repair & Service
Printer Spare Parts
Toner & Ink Cartridges
Cartridge Refilling
Retail & Wholesale Printer Components
Multi-brand Printer Solutions

One additional recommendation for the skill: add a section instructing Claude to avoid placeholder content. Instead, it should either ask for missing business information (such as email address, business hours, GST number, logo, and social media links) or clearly mark those fields as configurable. This helps ensure the generated website is production-ready rather than filled with generic placeholder text.