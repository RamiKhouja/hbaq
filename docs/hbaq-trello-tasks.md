# Hbaq Trello Tasks

Use each item as a Trello card. Suggested labels are shown in brackets.

## Foundation

- [structure] Audit missing models, migrations, and referenced tables.
- [structure] Decide which Mesmia features stay, move to legacy, or get removed.
- [structure] Rename inconsistent domain fields such as `pended`, `rn`, `Adress`, `subTotal`, and `companyGroup_id`.
- [structure] Create a fresh database migration checklist.
- [structure] Add Hbaq project setup notes to the README.
- [structure] Replace Mesmia/pastry naming across public pages, emails, invoices, translations, and assets.
- [structure] Define final Hbaq roles and account types.
- [structure] Define order, payment, delivery, and commercial account statuses.

## Catalog

- [backend] Add or restore missing catalog models: `Brand`, `Attribute`, `AttOption`, `ProductOption`, and required migrations.
- [backend] Add product fields for Hbaq grocery data: SKU, barcode, origin, package size, storage info, organic flag, active status, and freshness fields if needed.
- [backend] Add inventory fields for available quantity, unit, low-stock threshold, lot/batch, and expiration date if needed.
- [backend] Make product slugs unique and safe.
- [backend] Add parent-category product query support so parent categories can include child category products.
- [backend] Add category display order and visibility support.
- [backend] Add validation to prevent category parent loops.
- [backend] Build backend search/filter query for menu products.
- [backend] Add product attribute assignment support.
- [admin] Update product create/edit forms for Hbaq product fields.
- [admin] Add admin filters to product list: category, stock, active, featured, pricing missing, and search.
- [admin] Add category hierarchy management in admin.
- [admin] Add category ordering and visibility controls.
- [admin] Add attribute and option management screens.
- [admin] Add product attribute selection to product create/edit.
- [admin] Add product duplicate action.
- [admin] Add product import/export plan for products, inventory, and price tiers.
- [frontend] Build `/menu` catalog page with category filters.
- [frontend] Add attribute filters to `/menu`.
- [frontend] Add text search, price range, availability, sorting, and pagination to `/menu`.
- [frontend] Add mobile filter drawer for catalog filters.
- [frontend] Make catalog filters URL-driven.
- [frontend] Update product cards for grocery units, stock state, and translated product names.
- [frontend] Update product detail page for grocery fields and price display.

## Commercial Accounts

- [backend] Add account type field or commercial profile relation.
- [backend] Create commercial account statuses: draft, submitted, pending review, approved, rejected, suspended.
- [backend] Add company document fields and secure file storage.
- [backend] Add commercial registration validation.
- [backend] Restrict commercial document access to authorized admin users.
- [backend] Add approval audit fields: reviewed_by, reviewed_at, status_changed_at.
- [backend] Decide and implement company-to-user relationship.
- [backend] Add or restore `CompanyGroup` model and migration.
- [backend] Link companies to company groups.
- [backend] Add notification hooks for submitted, approved, rejected, and document-update-request states.
- [admin] Build pending commercial applications list.
- [admin] Build commercial company detail/review page.
- [admin] Add approve, reject, suspend, and request-documents actions.
- [admin] Add internal notes for commercial applications.
- [admin] Add company group management screens.
- [admin] Assign company group during commercial approval.
- [frontend] Add retail vs commercial choice to registration.
- [frontend] Add commercial registration form with company fields and document uploads.
- [frontend] Add pending commercial account state after submission.
- [frontend] Add rejected/request-more-documents state with next action.
- [frontend] Add commercial CTA in navigation and homepage.

## Pricing

- [backend] Add or restore `PriceOption`/price-tier model and migration.
- [backend] Define price tier fields: product, unit, min quantity, max quantity, customer type, company group, unit price, currency, active dates.
- [backend] Add validation to prevent overlapping price tiers.
- [backend] Define fallback price behavior when no commercial tier matches.
- [backend] Create centralized pricing service.
- [backend] Support guest, retail, pending commercial, and approved commercial pricing in pricing service.
- [backend] Apply product discounts/promotions inside the pricing service.
- [backend] Add price calculation API that does not leak commercial prices.
- [backend] Add unit tests for price tier boundaries.
- [backend] Add unit tests for commercial eligibility and company group pricing.
- [admin] Add price tier table to admin product detail.
- [admin] Add create/edit/delete price tier forms.
- [admin] Add duplicate tier action for faster product pricing setup.
- [admin] Add warning for products missing valid prices.
- [admin] Add price import/export support if bulk maintenance is required.
- [frontend] Show retail price for guests and normal users.
- [frontend] Show commercial price tiers only for approved commercial users.
- [frontend] Add quantity-based price preview on product detail.
- [frontend] Add tier hints such as "buy 10+ for X" for eligible users.
- [frontend] Show applied tier and unit price in cart lines.

## Cart And Checkout

- [backend] Decide guest cart strategy: session, localStorage, or server guest token.
- [backend] Make cart routes work for guest, retail, and commercial contexts.
- [backend] Store cart line snapshots: product name, quantity, unit, unit price, line total, tier id, pricing type, currency.
- [backend] Recalculate cart totals from line items instead of manual add/subtract.
- [backend] Add checkout validation for price changes and stock changes.
- [backend] Store full order line snapshots at checkout.
- [backend] Add guest order contact and address fields.
- [backend] Add secure guest order tracking token.
- [backend] Add commercial checkout fields: company, VAT, purchase order number, invoice notes.
- [backend] Add minimum order rules for commercial groups if needed.
- [frontend] Update cart UI for unit price, line total, applied tier, and savings.
- [frontend] Add guest checkout form.
- [frontend] Add optional account creation after guest checkout.
- [frontend] Add saved address selection for logged-in users.
- [frontend] Add commercial checkout fields and validation messages.
- [frontend] Add order success page for guest and logged-in users.
- [frontend] Update order history and order detail pages for Hbaq.
- [admin] Add B2B vs retail label to admin order list.
- [admin] Show buyer, company, line snapshots, notes, and pricing type on order detail.

## Payment

- [structure] Choose launch payment methods and providers.
- [backend] Add payment statuses: unpaid, pending, paid, failed, refunded, partially refunded.
- [backend] Add payment transactions table.
- [backend] Add provider reference fields to transactions.
- [backend] Implement cash/bank transfer/manual payment flow.
- [backend] Implement online payment callbacks or webhooks when provider is chosen.
- [admin] Add payment status and reference display to order detail.
- [admin] Add manual payment confirmation action.
- [frontend] Add payment method selection in checkout.
- [frontend] Add payment pending/failed/success states.

## Delivery And Fulfillment

- [structure] Define delivery zones, fees, and unavailable areas.
- [structure] Decide pickup vs delivery rules.
- [backend] Add delivery zones and fee calculation.
- [backend] Add scheduled delivery date/time slot support if needed.
- [backend] Separate payment status from fulfillment phase.
- [backend] Add fulfillment phases: pending, confirmed, preparing, ready, out for delivery, delivered, canceled.
- [backend] Add delivery assignment support.
- [backend] Add notifications for key fulfillment changes.
- [admin] Add order filters by date, status, payment, customer type, company, and delivery zone.
- [admin] Add fulfillment timeline to order detail.
- [admin] Add delivery staff assignment action.
- [admin] Add printable invoice and picking list.
- [frontend] Show delivery fee during checkout.
- [frontend] Show order phase on order detail/tracking page.

## Home And Design

- [frontend] Split `Home.jsx` into section components.
- [frontend] Create `HomeHero` component.
- [frontend] Create `HomeBenefits` component.
- [frontend] Create `HomeCategories` component.
- [frontend] Create `HomeFeaturedProducts` component.
- [frontend] Create `WholesaleCTA` component.
- [frontend] Create `SeasonalDeals` component if needed.
- [frontend] Create `HomeNewsletter` component if needed.
- [frontend] Replace hardcoded home arrays with backend props.
- [backend] Update `HomeController` to load Hbaq categories, featured products, seasonal sections, and testimonials.
- [frontend] Add empty states for home sections with no data.
- [frontend] Define Hbaq product card component.
- [frontend] Define Hbaq category card component.
- [frontend] Update `ClientLayout` header for Hbaq.
- [frontend] Add nested category navigation.
- [frontend] Add language switcher, account menu, cart badge, and commercial CTA to layout.
- [frontend] Add mobile navigation.
- [structure] Define Hbaq design tokens: colors, typography, spacing, buttons, forms, badges, alerts.
- [frontend] Update Tailwind theme with Hbaq palette.
- [frontend] Remove old pastry/brown styling where no longer needed.
- [frontend] Check mobile, tablet, and desktop responsive layouts.

## Multilingual

- [structure] Normalize translation key naming in `en.json`, `fr.json`, and `ar.json`.
- [frontend] Replace hardcoded public-facing strings with translation keys.
- [frontend] Complete missing French translations.
- [frontend] Add Hbaq translations for home, menu, product, cart, checkout, commercial registration, orders, and account pages.
- [admin] Add translations for admin commercial review and pricing screens.
- [frontend] Add product/category translation fallback handling.
- [frontend] Set document direction based on language.
- [frontend] Review RTL alignment for Arabic across layout, cards, filters, cart, and checkout.
- [backend] Format dates, currency, and quantities by locale where rendered server-side.
- [backend] Verify Arabic invoice/PDF rendering.

## Roles, Security, And QA

- [backend] Centralize role and permission checks.
- [backend] Add policies for orders, company documents, product pricing, and admin actions.
- [backend] Prevent users from reading other users' orders.
- [backend] Prevent unauthorized access to commercial documents.
- [backend] Protect commercial price APIs.
- [backend] Add backend validation to product, category, price tier, registration, company document, and checkout requests.
- [backend] Add upload validation for document type and size.
- [backend] Add feature tests for guest checkout.
- [backend] Add feature tests for retail checkout.
- [backend] Add feature tests for approved commercial checkout.
- [backend] Add feature tests for pending commercial pricing behavior.
- [backend] Add admin tests for commercial approval.
- [backend] Add admin tests for price tier creation.
- [frontend] Add frontend smoke tests later if Playwright is introduced.

## Launch

- [structure] Create production launch checklist.
- [structure] Configure production environment variables.
- [structure] Verify domain, SSL, storage links, queues, backups, logs, and email sending.
- [structure] Seed launch categories, products, admin users, company groups, delivery zones, and translations.
- [structure] Run full test order as guest.
- [structure] Run full test order as retail user.
- [structure] Run full test order as approved commercial user.
- [structure] Check mobile performance and image sizes.
- [structure] Add analytics and error monitoring if desired.

## Decisions To Make Before Implementation

- [structure] Choose account model: separate role, account type, or company status.
- [structure] Decide whether one company can have multiple users.
- [structure] Decide whether one user can belong to multiple companies.
- [structure] Decide whether commercial prices depend only on quantity or also company group, company-specific negotiation, unit, season, or delivery zone.
- [structure] Decide if guests can see hints about commercial pricing.
- [structure] Confirm required commercial documents.
- [structure] Choose launch payment methods.
- [structure] Decide if fresh-product batch/expiration tracking is needed at launch.
- [structure] Decide whether `/shop` and `/menu` both stay or `/menu` becomes the main catalog.
- [structure] Decide which old Mesmia features stay: services, occasions/events, requests, testimonials, CEO/about, wallet.
- [structure] Confirm launch currency and tax rules.
