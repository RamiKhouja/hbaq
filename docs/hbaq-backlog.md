# Hbaq Product Backlog

## Context

Hbaq is moving from the old Mesmia B2C pastry-shop base into a B2B/B2C organic grocery, fruit, and vegetable commerce platform. The current Laravel/Inertia/React codebase already contains useful foundations: translated product and category fields, parent-child categories, product media, carts, orders, addresses, admin roles, company screens, attributes, and some price-option logic. Some referenced business objects appear incomplete or missing from the current file tree, especially `PriceOption`, `CompanyGroup`, `Cart`, `Brand`, `Attribute`, `AttOption`, and their migrations/models. These should be stabilized before building new B2B behavior on top.

This backlog is written as semi-detailed stories with implementation tasks, acceptance notes, and open questions.

## Milestone 0: Project Baseline And Mesmia Cleanup

### Story: Audit And Stabilize The Current Schema

As a developer, I want the existing controllers, models, migrations, and frontend pages to agree on the same domain model so that new Hbaq work does not sit on broken Mesmia leftovers.

Tasks:

- Inventory all referenced models and tables: products, categories, product_categories, pictures, carts, purchases, orders, companies, company groups, price options, attributes, brands, inventories, profiles, services, requests.
- Add or restore missing model classes and migrations, or remove dead references if those features are intentionally postponed.
- Confirm whether `Cart`, `PriceOption`, `CompanyGroup`, `Brand`, `Attribute`, `AttOption`, and `ProductOption` are missing from git or intentionally excluded.
- Fix inconsistent naming: `pended` vs verified/approved, `rn` vs commercial register, `Adress` typo, `subTotal` casing, `companyGroup_id` vs `company_group_id`.
- Run a fresh migration on an empty database and document the required seed data.
- Add a short project README section describing Hbaq, local setup, and required env values.

Acceptance notes:

- A fresh clone can run migrations without class/table errors.
- Main public routes, admin product routes, registration, login, and cart routes do not crash from missing model references.
- Known postponed Mesmia features are listed clearly rather than silently half-working.

### Story: Remove Or Archive Mesmia-Specific Content

As a site owner, I want pastry-shop naming, copy, colors, assets, and routes removed or archived so Hbaq feels coherent from the first page.

Tasks:

- Search for Mesmia/pastry terminology in React, translations, invoices, emails, seed data, and images.
- Replace shop copy with Hbaq organic grocery, wholesale, and retail wording.
- Decide which old pages stay: services, occasions, requests, testimonials, CEO/about sections.
- Move old reusable UI to `Old*` components only where it is intentionally kept for reference.
- Update logos, favicon, email templates, invoice branding, and metadata.

Acceptance notes:

- A customer never sees Mesmia or pastry language in the normal Hbaq flow.
- Old components are either removed or named as legacy/reference code.

## Milestone 1: Product, Category, And Catalog Foundation

### Story: Model Hbaq Product Data

As an admin, I want product records to support grocery and fresh-produce information so that listings are accurate for retail and wholesale buyers.

Tasks:

- Define product fields: translated name, translated description, SKU/barcode, unit, package size, weight, origin, organic certification flag, harvest/arrival date if needed, storage instructions, shelf-life, main image, gallery, active/inactive, featured/new flags.
- Decide which old pastry fields remain: ingredients and instructions may still fit some groceries, but should be renamed or generalized if needed.
- Add inventory fields suitable for fresh products: in-stock, available quantity, unit, low-stock threshold, optional lot/batch, optional expiration date.
- Make product create/edit pages handle these fields in Arabic, French, and English.
- Ensure product URLs/slugs are unique and generated safely across languages.

Acceptance notes:

- Admin can create a fresh produce item, a packaged grocery item, and a bulk case item without using pastry-specific fields.
- Public product pages display unit, package size, freshness/stock status, and translated content.

### Story: Support Parent And Child Categories

As a shopper, I want to browse parent and child categories so that I can find products by department and subdepartment.

Tasks:

- Keep `categories.parent_id` and build admin UI that makes hierarchy clear.
- Prevent invalid category loops where a category becomes its own ancestor.
- Decide category types: replace or clarify old `menu`/`event` values for Hbaq, such as catalog, seasonal, wholesale, promotion.
- Add menu visibility, image, translated short description, and display order.
- Load parent categories with children in client layout, homepage, menu page, and filters.
- Include child category products when browsing a parent category, unless explicitly configured otherwise.

Acceptance notes:

- Parent category pages can show all child products.
- Header/menu navigation supports at least two category levels.
- Admin can create, edit, hide, and reorder categories.

### Story: Product Attributes And Faceted Filtering

As a customer, I want to filter the menu by attributes and categories so that I can quickly find organic, local, packaged, or wholesale products.

Tasks:

- Restore/complete Attribute and Attribute Option models if they are intended for Hbaq.
- Define attribute examples: organic, local, imported, unit type, brand, origin country, certification, storage type, dietary labels, wholesale availability.
- Add product-attribute assignment in admin product create/edit.
- Build `/menu` as the main catalog page with search, category filters, attribute filters, price range, availability, sort order, pagination, and mobile filter drawer.
- Make filters URL-driven so links can be shared.
- Add backend query handling instead of only client-side filtering.

Acceptance notes:

- Filtering by parent category, child category, and multiple attributes returns expected products.
- Search covers translated names and descriptions.
- Filters work in Arabic, French, and English UI.

## Milestone 2: B2B Commercial Accounts

### Story: Commercial Registration Request

As a commercial buyer, I want to register with company documents so that I can access wholesale pricing after approval.

Tasks:

- Add account type choice: retail/customer vs commercial/business.
- For commercial registration, collect company name, legal form if needed, tax/VAT number, commercial register number, representative name, phone, billing address, delivery addresses, VAT document upload, commercial register upload, and optional authorization document.
- Store uploaded documents securely and restrict admin-only access.
- Create commercial account status: draft, submitted, pending review, approved, rejected, suspended.
- Do not expose tiered commercial prices until approved.
- Send confirmation/notification emails for submission, approval, rejection, and document update requests.

Acceptance notes:

- A normal customer can still register without business documents.
- A commercial applicant can submit documents and sees a pending state.
- Admin can review documents and approve or reject the account.

### Story: Admin Commercial Account Review

As an admin, I want to review commercial applications so that only validated businesses receive wholesale pricing.

Tasks:

- Build a pending commercial applications list with filters by status and date.
- Build a company detail page with submitted fields, uploaded documents, assigned group, notes, approval actions, and rejection reason.
- Add audit fields: reviewed_by, reviewed_at, status_changed_at.
- Add internal notes and document re-upload request reason.
- Decide whether multiple users can belong to the same company.

Acceptance notes:

- Admin can approve, reject, suspend, and request more documents.
- Commercial approval changes what prices the user sees in the storefront and cart.

### Story: Company Groups For Pricing

As an admin, I want to assign companies to groups so that different commercial segments can receive different price tiers.

Tasks:

- Complete `CompanyGroup` model, migration, controller, routes, and admin UI if missing.
- Define group fields: translated name, label/code, priority, active flag, default status.
- Link company/user to one group or multiple groups based on your business rule.
- Decide fallback behavior when a commercial account has no group.
- Seed groups such as retail, commercial default, reseller, restaurant, supermarket.

Acceptance notes:

- A company can be assigned to a group during approval.
- Pricing lookup can use the approved buyer's group.

## Milestone 3: Quantity-Based And Eligibility-Based Pricing

### Story: Price Tiers Per Product And Quantity

As an admin, I want each product to have quantity price tiers so that larger orders can receive wholesale discounts.

Tasks:

- Define `price_tiers` or complete `price_options`: product_id, customer_type, company_group_id, unit, min_qty, max_qty nullable, unit_price, currency, active, starts_at, ends_at, discount fields if needed.
- Decide if tiers are inclusive: example `qty < 10`, `10 <= qty < 50`, `qty >= 50`.
- Add validation preventing overlapping ranges for the same product/unit/group/customer type.
- Add admin UI to create, edit, duplicate, delete, and reorder tiers per product.
- Show a tier table on admin product detail.
- Add import/export support for prices if bulk catalog maintenance is expected.

Acceptance notes:

- Admin can configure retail price and commercial tiered prices for the same product.
- Invalid overlapping tier ranges are rejected.
- A product always has a safe fallback price.

### Story: Pricing Service

As a developer, I want one pricing service to calculate product prices so that product pages, cart, checkout, and orders stay consistent.

Tasks:

- Create a backend pricing service/class that accepts product, quantity, unit, user/account context, date, and optional company group.
- Return unit price, total line price, matched tier, currency, and whether pricing is retail or commercial.
- Apply discounts/promotions in one place, not separately in controllers.
- Support guest pricing, normal user pricing, pending commercial pricing, and approved commercial pricing.
- Add PHPUnit tests for boundary quantities and group-specific prices.

Acceptance notes:

- Quantity 9, 10, 49, and 50 select the expected tiers.
- Guest and normal users never receive commercial-only pricing.
- Pending commercial accounts see retail pricing or a clear pending message, based on chosen business rule.

### Story: Store Price Snapshots In Cart And Orders

As a merchant, I want carts and orders to keep price snapshots so that historical invoices do not change when product prices change later.

Tasks:

- Update purchases/cart lines to store product_id, product name snapshot, quantity, unit, unit_price, line_total, matched price tier id, pricing type, currency, and tax fields if needed.
- Recalculate line totals on cart quantity updates using the pricing service.
- Recalculate cart subtotal from line items instead of manually adding/subtracting.
- Store full order line snapshots at checkout.
- Add guardrails for changed product availability or price before checkout.

Acceptance notes:

- Updating quantity from 5 to 10 changes unit price if a lower tier applies.
- Historical orders keep the old price even after admin edits tiers.
- Cart totals do not drift after repeated updates/removals.

### Story: Show Pricing Clearly In Storefront

As a buyer, I want to understand price tiers before adding to cart so that I can choose economical quantities.

Tasks:

- For guests and retail users, show retail price and optionally a "commercial prices available after approval" message.
- For approved commercial users, show the tier table or "buy X+ for Y" hints.
- On product card and product detail, update displayed unit price as quantity changes.
- On cart lines, show unit price, total, and savings if a tier was applied.
- Keep labels translated and RTL-ready.

Acceptance notes:

- The displayed price before add-to-cart matches the cart price after add-to-cart.
- Commercial-only pricing is not leaked to unauthorized users through API responses.

## Milestone 4: Cart, Checkout, Payment, And Delivery

### Story: Guest Checkout

As a guest, I want to buy without signing in so that retail checkout stays low-friction.

Tasks:

- Decide whether guest cart uses session storage, localStorage, or a server-side guest token.
- Allow guest checkout with email, phone, shipping address, billing details, and optional account creation after order.
- Ensure cart routes currently behind `auth` are adjusted for guest-safe checkout.
- Keep order tracking accessible by secure token or email/phone verification.

Acceptance notes:

- A guest can add products, update quantities, checkout, and receive order confirmation.
- Guest orders have `user_id` nullable and enough contact/address data for fulfillment.

### Story: Authenticated Retail Checkout

As a normal customer, I want saved addresses and order history so that repeat purchases are faster.

Tasks:

- Make cart creation reliable on user registration/login.
- Add address book management for shipping and billing addresses.
- Allow selecting saved address at checkout.
- Show order history and order detail pages with current Hbaq design.

Acceptance notes:

- A logged-in customer can checkout using a saved address.
- Order history shows totals, payment status, delivery phase, and line items.

### Story: Commercial Checkout Rules

As a commercial buyer, I want B2B checkout rules that fit larger orders and business paperwork.

Tasks:

- Define minimum order amount or minimum quantities per commercial group if needed.
- Support purchase order number or internal reference.
- Support billing address, company name, VAT number, invoice notes, and document fields.
- Decide payment options for commercial accounts: online, cash/card on delivery, bank transfer, pay later, invoice terms.
- Add admin order labels showing B2B vs retail.

Acceptance notes:

- Commercial checkout applies approved tier pricing and B2B rules.
- Orders clearly identify company and buyer user.

### Story: Payment Integration

As a buyer, I want supported payment options so that I can complete an order confidently.

Tasks:

- Choose payment providers and methods for Tunisia/target market.
- Define statuses: unpaid, pending payment, paid, failed, refunded, partially refunded.
- Add payment transaction records and provider references.
- Implement payment confirmation callbacks/webhooks if using online payments.
- Keep cash/bank transfer flows explicit for admin validation.

Acceptance notes:

- Payment status is independent from delivery/order phase.
- Admin can see payment method, status, reference, and amount.

### Story: Delivery And Fulfillment

As an operations user, I want delivery management so that orders move from pending to delivered reliably.

Tasks:

- Define delivery zones, fees, free-delivery thresholds, and unavailable areas.
- Add scheduled delivery date/time slots if needed for fresh produce.
- Support pickup vs delivery if pickup remains available.
- Add admin order workflow: pending, confirmed, preparing, ready, out for delivery, delivered, canceled.
- Assign delivery staff and show delivery notes.
- Send customer notifications on important phase changes.

Acceptance notes:

- Checkout calculates delivery fee from address/zone or selected method.
- Admin can advance fulfillment phase and customer sees updated status.

## Milestone 5: Home Page And Visual Redesign

### Story: Adopt The New Home Template As Components

As a developer, I want the new `resources/js/Pages/Client/Home.jsx` layout split into sections so that the homepage is maintainable and data-driven.

Tasks:

- Extract home sections into components such as `HomeHero`, `HomeBenefits`, `HomeCategories`, `HomeFeaturedProducts`, `WholesaleCTA`, `SeasonalDeals`, `Testimonials`, and `HomeNewsletter`.
- Replace hardcoded sample arrays with props from `HomeController`.
- Decide which sections are controlled from admin and which are static.
- Update `HomeController` queries for Hbaq: featured products, visible parent categories, seasonal/wholesale categories, approved testimonials.
- Add loading/empty states where content is missing.

Acceptance notes:

- Home page renders real products/categories from the database.
- Each section is independently editable and reusable.

### Story: Hbaq Design System

As a customer, I want the site to feel like an organic grocery and wholesale marketplace, not a pastry shop.

Tasks:

- Define colors, typography, spacing, button styles, cards, forms, tables, badges, alerts, and icons.
- Update Tailwind theme tokens and remove old brown/pastry palette where no longer needed.
- Ensure responsive layouts for mobile, tablet, desktop.
- Build reusable product cards, category cards, price-tier display, empty states, and admin table patterns.
- Check RTL styling for Arabic.

Acceptance notes:

- Public pages share a consistent Hbaq visual language.
- Arabic layout does not break nav, cards, checkout, or admin forms.

### Story: Client Layout And Navigation

As a shopper, I want simple navigation to catalog, categories, cart, account, language, and commercial registration.

Tasks:

- Update `ClientLayout` with Hbaq logo, category menu, search, language switcher, account menu, cart badge, and commercial CTA.
- Support guest, retail user, commercial pending, commercial approved, staff/admin states.
- Ensure admin users still redirect appropriately.
- Add mobile navigation with nested categories.

Acceptance notes:

- Header works for all user states.
- Language switcher persists choice and updates direction.

## Milestone 6: Multilingual And Localization

### Story: Complete Arabic, French, And English UI Translation

As a multilingual shopper, I want the full customer journey in my language.

Tasks:

- Normalize translation key structure in `resources/js/lang/*.json`.
- Fill missing French keys; current French file is much smaller than English/Arabic.
- Translate all new Hbaq copy for home, menu, product, cart, checkout, commercial registration, orders, emails, and admin review screens.
- Add fallback handling for missing product/category translations.
- Remove hardcoded English labels from React components.

Acceptance notes:

- No obvious hardcoded public-facing English remains in Arabic or French mode.
- Missing translation keys are visible during development and fixed before release.

### Story: RTL And Locale Formatting

As an Arabic user, I want the layout, numbers, dates, and forms to feel natural.

Tasks:

- Set document `dir` based on selected language.
- Review Tailwind classes for left/right assumptions.
- Format dates, currency, and quantities by locale.
- Ensure PDFs/invoices render Arabic correctly.

Acceptance notes:

- Arabic navigation, product cards, filters, checkout, and invoice are readable and aligned.

## Milestone 7: Admin Operations

### Story: Admin Product Catalog Management

As catalog staff, I want efficient product management so that frequent grocery updates are easy.

Tasks:

- Add product list filters by category, status, stock, featured, commercial pricing missing, and search.
- Add duplicate product action for similar produce.
- Add bulk import/export for products, inventory, and price tiers.
- Add image management improvements and validation.
- Add product active/inactive status.

Acceptance notes:

- Staff can find and update products quickly.
- Products missing required pricing or stock data are easy to identify.

### Story: Admin Order Management

As admin/staff/delivery, I want a clear order dashboard for retail and commercial orders.

Tasks:

- Separate payment status from fulfillment phase.
- Add order filters: date, status, payment, delivery method, customer type, company, delivery zone.
- Add order detail with line snapshots, buyer details, company details, notes, documents, and timeline.
- Add printable invoice and picking list.
- Add delivery assignment and status updates.

Acceptance notes:

- Staff can process an order from pending to delivered.
- Commercial invoices include company/VAT details.

### Story: Roles And Permissions

As the business owner, I want staff permissions to match responsibilities.

Tasks:

- Define roles: admin, staff/catalog, sales, delivery, customer, commercial customer.
- Replace broad string checks with centralized policies/middleware where practical.
- Prevent delivery users from accessing catalog/company settings.
- Ensure commercial-only APIs require approved account status.

Acceptance notes:

- Each role can access only the pages and actions it needs.

## Milestone 8: Quality, Security, And Launch Readiness

### Story: Security And Validation Hardening

As a site owner, I want user data, documents, prices, and orders protected.

Tasks:

- Add backend validation to registration, company documents, product forms, price tiers, checkout, and uploads.
- Restrict document file types, size, visibility, and access.
- Protect price APIs from exposing commercial tiers to unauthorized users.
- Add authorization checks before reading order details or documents.
- Review CSRF/session behavior for guest cart and checkout.

Acceptance notes:

- Users cannot access another customer's order or company documents.
- Commercial prices are only returned for approved eligible buyers.

### Story: Test Critical Buying Flows

As a developer, I want tests around pricing and checkout so that future changes do not silently break revenue logic.

Tasks:

- Add unit tests for pricing tier boundaries and account eligibility.
- Add feature tests for guest add-to-cart/checkout, retail checkout, commercial approved checkout, and pending commercial blocked/fallback behavior.
- Add admin tests for price tier creation and commercial approval.
- Add frontend smoke tests if Playwright is added later.

Acceptance notes:

- Pricing tests cover exact boundary cases like 9, 10, 49, 50.
- Checkout tests prove order snapshots keep the selected price.

### Story: Launch Checklist

As the team, we want a launch checklist so that Hbaq is ready for real customers.

Tasks:

- Verify domain, SSL, email sending, storage links, queues, backups, logs, and payment webhooks.
- Configure production env values and disable debug.
- Seed initial categories, products, groups, admin users, delivery zones, and translations.
- Check mobile performance and image sizes.
- Add analytics and basic error monitoring if desired.

Acceptance notes:

- Production can process a test retail order, guest order, and approved commercial order end to end.

## Suggested First Sprint

1. Stabilize schema and missing models/tables.
2. Decide commercial account statuses and company/group relationship.
3. Implement or refactor the pricing service with tests.
4. Split the current home page into data-driven components.
5. Build the `/menu` filter foundation with category and text search.

## Open Questions For Validation

- Should commercial buyers be a separate `role`, a `user.account_type`, or a company/account status attached to normal users?
- Can one company have multiple users, and can one user belong to multiple companies?
- Are commercial price tiers based only on quantity, or also on company group, negotiated company-specific prices, product unit, delivery zone, or season?
- Should guests and normal users see that better commercial tiers exist, or should those prices be completely hidden?
- What are the exact required documents in your market: VAT certificate, tax ID, commercial register, professional card, authorization letter?
- What payment methods should launch first: cash on delivery, bank transfer, online card, wallet, cheque, invoice terms?
- Do fresh products need batch/expiration/arrival-date tracking now, or later?
- Should `/shop` remain separate from `/menu`, or should `/menu` become the main catalog page?
- Which old Mesmia features should survive: services, occasions/events, requests, testimonials, CEO/about, wallet?
- What currencies and tax rules should be supported at launch?
