# Feature Specification: Corpora Ecosystem

**Feature Branch**: `001-corpora-ecosystem`
**Created**: 2025-12-14
**Status**: Draft
**Input**: Corporate transportation ecosystem connecting Corporates, Vendors, Drivers, and Corpora Admin through unified technology framework.

## Clarifications

### Session 2025-12-14
- Q: Should the spec include ALL PRD features or scope to February 2026 deadline? → A: Include all PRD features, mark lower-priority items as "Phase 2" candidates
- Q: Driver App platform scope - Android only or both platforms for MVP? → A: Both Android and iOS included in MVP (Full scope per PRD line 2843)

## Overview

Corpora is a corporate transportation ecosystem designed to bring transparency, efficiency, and accountability to how organizations manage vendor-driven travel. The platform connects three primary entities—Corporates, Transport Vendors, and Drivers—through a unified technology framework, with Corpora operating as a neutral technology facilitator (not a transport provider).

**Core Value Proposition**:
- Corporates gain end-to-end control of employee and guest travel with verified mileage and transparent invoicing
- Vendors manage bookings, assign drivers, and maintain accurate financial records digitally
- Drivers execute trips with GPS-verified mileage and OTP-secured ride completion
- Fallback vendor support through Corpora's trusted vendor network ensures uninterrupted service

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Corporate Books and Tracks a Ride (Priority: P1)

A Corporate Travel Desk user books transportation for an employee or guest, selects a vendor, and monitors the ride through completion with GPS verification and OTP-secured start/end.

**Why this priority**: This is the core transaction that enables all value in the ecosystem. Without ride booking and tracking, no other features have purpose. It directly addresses the problem of inflated billing and lack of transparency.

**Independent Test**: Can be fully tested by creating a booking, having a driver execute the ride with OTP verification, and verifying GPS distance matches billing. Delivers immediate value of transparent, verified transportation.

**Acceptance Scenarios**:

1. **Given** a logged-in Travel Desk user with linked vendors, **When** they create a ride booking with passenger details, pickup/drop locations, and vehicle class, **Then** the booking is created and vendor receives the assignment notification
2. **Given** an assigned driver with the Driver App, **When** they arrive at pickup location and enter the guest's start OTP, **Then** the ride officially begins and GPS tracking activates
3. **Given** an ongoing ride with GPS tracking, **When** the driver reaches drop location and enters the end OTP, **Then** the ride completes with verified distance/time logged automatically
4. **Given** a completed ride, **When** the Corporate user views ride summary, **Then** they see actual vs planned route, GPS-verified distance, start/end times, and driver details

---

### User Story 2 - Vendor Manages Fleet and Drivers (Priority: P1)

A Vendor Admin onboards their drivers and vehicles with required KYC documents, maintains compliance status, and assigns drivers to rides received from corporates.

**Why this priority**: Without vendor fleet management and compliance, rides cannot be assigned to verified drivers/vehicles. This is foundational to the trusted vendor relationship model.

**Independent Test**: Can be fully tested by a vendor adding drivers/vehicles with documents, system verifying compliance, and successfully assigning a verified driver to a ride.

**Acceptance Scenarios**:

1. **Given** a verified Vendor Admin, **When** they add a new driver with license, ID proof, and background verification certificate, **Then** the driver enters pending verification status until Corpora approves
2. **Given** a driver with valid documents, **When** a document expires, **Then** the system suspends the driver from ride assignments and notifies vendor of required renewal
3. **Given** a vendor receives a ride request from a corporate, **When** they assign an available verified driver and vehicle, **Then** the driver app receives the assignment and corporate sees driver/vehicle details
4. **Given** a vehicle with insurance expiring in 30 days, **When** the system runs daily compliance check, **Then** vendor receives alert notification at 30, 15, and 7 days before expiry

---

### User Story 3 - Driver Executes Ride with OTP and Expense Logging (Priority: P1)

A Driver receives ride assignment on their mobile app, navigates to pickup, verifies ride start/end with OTP, and logs any additional expenses (tolls, parking) with receipts.

**Why this priority**: Drivers are the execution layer. Without driver app functionality for OTP verification and GPS tracking, the core value proposition of verified billing cannot be achieved.

**Independent Test**: Can be fully tested with a driver receiving assignment, completing ride with OTPs, logging expenses, and verifying all data syncs to vendor/corporate dashboards.

**Acceptance Scenarios**:

1. **Given** a driver logged into the app with assigned ride, **When** they accept the assignment, **Then** the ride locks to that driver and navigation to pickup location is available
2. **Given** a driver at pickup location (within 100 meters), **When** they enter the guest's start OTP, **Then** the ride officially starts with GPS tracking activated
3. **Given** an ongoing ride, **When** the driver incurs a toll charge, **Then** they can log the expense with amount, category, and photo of receipt that syncs to vendor billing
4. **Given** a driver at drop location, **When** they enter the end OTP, **Then** the ride completes and summary shows total distance, duration, and logged expenses

---

### User Story 4 - Corpora Admin Onboards Corporate and Vendor (Priority: P2)

A Corpora Operations Admin creates new corporate and vendor accounts, verifies KYC documents, links vendors to corporates, and configures rate structures.

**Why this priority**: Platform cannot operate without onboarded entities. This enables the ecosystem but is administrative setup rather than daily operational value.

**Independent Test**: Can be fully tested by creating a corporate account, onboarding a vendor with documents, linking them, setting up rates, and verifying the corporate can see and select the vendor.

**Acceptance Scenarios**:

1. **Given** a Corpora Operations Admin, **When** they create a new corporate with KYC documents (PAN, GST, MSA), **Then** the corporate enters pending verification status
2. **Given** a verified corporate account, **When** they refer a vendor, **Then** the vendor receives onboarding invitation and appears in corporate's vendor list upon verification
3. **Given** a linked corporate-vendor pair, **When** Corpora Admin configures rate catalog (packages, extra KM/hour rates), **Then** rates become active after approval and are visible in booking flow
4. **Given** a vendor with expired GST registration, **When** Corpora Admin reviews compliance, **Then** they can suspend the vendor until documents are renewed

---

### User Story 5 - Vendor Submits Invoice and Corporate Pays via Corpora (Priority: P2)

After ride completion, a Vendor submits ride-level invoice with expenses to Corpora for review. Corpora verifies, generates corporate invoice with platform fee, and manages B2B payment flow.

**Why this priority**: Revenue flow is essential for business sustainability but follows ride completion. The manual B2B payment model reduces initial complexity.

**Independent Test**: Can be fully tested by vendor submitting invoice with receipts, Corpora reviewing/approving, corporate receiving consolidated invoice, and payment status tracking.

**Acceptance Scenarios**:

1. **Given** a completed ride, **When** vendor submits invoice with auto-populated fare and uploaded toll/parking receipts, **Then** invoice enters Corpora review queue with pending status
2. **Given** an invoice under Corpora review, **When** reviewer verifies GPS distance matches claimed distance and receipts are valid, **Then** invoice is marked approved for corporate billing
3. **Given** approved vendor invoices, **When** billing cycle closes, **Then** Corpora generates consolidated corporate invoice with vendor amounts plus Corpora platform fee
4. **Given** a corporate receives invoice, **When** they raise a dispute on specific rides, **Then** Corpora routes dispute to vendor with evidence and tracks resolution within SLA

---

### User Story 6 - Corporate Uses Cab by Corpora Fallback (Priority: P2)

When a corporate has no vendor available in a region or their vendor cannot fulfill a booking, they can manually select "Cab by Corpora" to use Corpora's trusted vendor network.

**Why this priority**: Ensures service continuity which is critical for corporate confidence, but is a fallback rather than primary flow.

**Independent Test**: Can be fully tested by booking a ride in a region with no linked vendor, selecting Cab by Corpora, and verifying ride execution and billing through Corpora.

**Acceptance Scenarios**:

1. **Given** a corporate creating a booking with no linked vendor in the pickup region, **When** they view vendor dropdown, **Then** "Cab by Corpora" appears as an option
2. **Given** selection of Cab by Corpora, **When** booking is submitted, **Then** Corpora Admin assigns from trusted vendor pool and driver details appear in corporate dashboard
3. **Given** a completed Cab by Corpora ride, **When** billing is processed, **Then** corporate pays Corpora's standard rate (not their contracted rate) and Corpora settles with trusted vendor internally

---

### User Story 7 - Live Ride Monitoring with SOS Handling (Priority: P2)

Corporate Travel Desk monitors all ongoing rides on a live map, receives alerts for SLA breaches or route deviations, and handles SOS emergencies with immediate escalation.

**Why this priority**: Safety and real-time visibility are key differentiators for corporate trust, but depend on rides being successfully booked first.

**Independent Test**: Can be fully tested by having active rides, viewing live map, triggering a test SOS, and verifying escalation to all relevant parties.

**Acceptance Scenarios**:

1. **Given** active rides in the system, **When** Travel Desk views monitoring dashboard, **Then** they see live map with all vehicle positions, ETAs, and color-coded SLA status
2. **Given** a ride with route deviation exceeding 500m or 10%, **When** system detects deviation, **Then** alert is triggered to corporate dashboard and vendor with route comparison
3. **Given** a driver triggering SOS button, **When** SOS is activated, **Then** location pings every 5 seconds to corporate, vendor, and Corpora support until acknowledged
4. **Given** an SOS event, **When** Corpora support acknowledges, **Then** SOS status changes and all parties are notified of acknowledgment

---

### User Story 8 - Reporting and Analytics Dashboard (Priority: P3)

Corporate Admin accesses comprehensive reports on ride usage, spending, vendor performance, and SLA compliance to make data-driven transportation decisions.

**Why this priority**: Analytics provide strategic value but require accumulated ride data to be meaningful. Operational features must come first.

**Independent Test**: Can be fully tested by generating reports after sufficient ride data exists, verifying accuracy against actual ride records.

**Acceptance Scenarios**:

1. **Given** a Corporate Admin with historical ride data, **When** they access analytics dashboard, **Then** they see KPIs including total rides, distance, spend, SLA compliance percentage
2. **Given** filter options, **When** Admin filters by date range, department, or vendor, **Then** all metrics and visualizations update to reflect filtered data
3. **Given** reporting module, **When** Admin generates SLA performance report, **Then** report shows vendor rankings by on-time arrival, no-show rate, and invoice accuracy
4. **Given** scheduled reports configured, **When** schedule triggers, **Then** report is auto-generated and emailed to configured recipients

---

### User Story 9 - Support Ticketing and Escalation (Priority: P3)

Users raise support tickets for ride issues, billing disputes, or compliance concerns. Tickets follow SLA-bound workflows with escalation to Corpora management if unresolved.

**Why this priority**: Support handling ensures issue resolution but is reactive. Core features must work before support becomes heavily utilized.

**Independent Test**: Can be fully tested by creating a ticket, tracking status updates, testing escalation triggers, and verifying resolution workflow.

**Acceptance Scenarios**:

1. **Given** a completed ride with an issue, **When** Corporate user raises ticket from ride summary, **Then** ticket is auto-linked to booking ID, vendor, and ride logs
2. **Given** a ticket submitted, **When** acknowledgment SLA (5 minutes) is breached, **Then** ticket auto-escalates to Corpora Ops Manager with breach notification
3. **Given** a ticket marked resolved, **When** corporate user reviews resolution, **Then** they can accept (closes ticket) or reopen within 48 hours with additional comments
4. **Given** repeated unresolved tickets (>3 in 7 days), **When** threshold is reached, **Then** auto-escalation to Corpora Head of Operations with summary report

---

### Edge Cases

- What happens when driver loses GPS signal mid-ride? System caches data locally and syncs when online; ride continues with last known position until signal restored.
- What happens when guest provides wrong OTP? Driver cannot start/end ride; system prompts retry with option for corporate to regenerate OTP.
- What happens when vendor rejects ride assignment? System alerts corporate Travel Desk who can manually reassign to another vendor or select Cab by Corpora.
- What happens when driver's document expires mid-ride? Ride continues to completion; driver is then suspended from new assignments until renewal.
- What happens when corporate disputes invoice after payment? Dispute is logged for credit adjustment on future invoices; original payment stands.
- What happens when SOS is triggered accidentally? Driver can cancel within 30 seconds; after that, acknowledgment is required from Corpora support.
- What happens when guest doesn't show up? Driver marks no-show via app after waiting period; corporate is billed per contract terms; ride marked as completed with no-show status.
- What happens when booking overlaps with same guest's existing ride? System prevents booking creation with validation error showing conflicting ride details.
- What happens when booking violates travel policy? System blocks submission with "Policy Exception" flag; Travel Desk must request exception with justification requiring Corporate Admin approval.
- What happens when driver exceeds speed limit? Overspeeding alert sent to corporate and vendor with driver details and location.
- What happens when vendor is blacklisted? All linked corporates notified, vendor cannot receive new ride assignments.
- What happens when driver rejects ride assignment? System requires rejection reason, then triggers fallback allocation to next available driver; if no driver available, vendor escalation timer starts.
- What happens when multiple tickets remain unresolved for same entity? After >3 unresolved tickets in 7 days for same vendor/corporate, system auto-escalates to Level 3 (Head of Operations) with summary report.
- What happens when expense is added after invoice submission? System prevents edits; driver must request vendor to create correction invoice.
- What happens when configuration change breaks active workflows? System logs change with rollback capability; Corpora Admin can restore previous configuration state.

## Requirements *(mandatory)*

### Functional Requirements

**User Management & Access**
- **FR-001**: System MUST support role-based access control with distinct roles for Corporate Admin, Travel Desk, Accounts User, Vendor Admin, Fleet Manager, and Driver
- **FR-002**: System MUST enforce two-factor authentication for all dashboard users
- **FR-003**: System MUST maintain immutable audit logs of all user actions with user ID, timestamp, and IP address
- **FR-004**: System MUST auto-logout users after 24 hours of inactivity
- **FR-005**: System MUST enforce password policy of minimum 8 characters with at least 1 number and 1 special character
- **FR-075**: System MUST support SSO authentication for enterprise corporates
- **FR-076**: System MUST allow Corporate Admin to invite users via email or secure link
- **FR-077**: System MUST allow Corporate Admin to suspend/disable users instantly
- **FR-078**: System MUST support two-step verification (email + OTP) for user activation
- **FR-079**: System MUST support password reset functionality via email

**Ride Booking & Scheduling**
- **FR-006**: System MUST support ride types: Package (hourly), Point-to-Point, Group Ride, Shuttle Ride, and Special Purpose
- **FR-007**: System MUST allow scheduling rides up to 30 days in advance
- **FR-008**: System MUST support recurring ride templates for daily/weekly patterns
- **FR-009**: System MUST validate pickup/drop coordinates using integrated map services
- **FR-010**: System MUST prevent bookings where passenger count exceeds vehicle capacity
- **FR-011**: System MUST support tagging bookings to departments/cost centers for billing attribution
- **FR-052**: System MUST support bulk booking flow for multiple rides in single submission
- **FR-053**: System MUST support event/conference booking module grouping multiple bookings under one event ID
- **FR-054**: System MUST prevent overlapping bookings for same guest or vehicle
- **FR-080**: System MUST apply policy-based cancellation charges when bookings are cancelled
- **FR-081**: System MUST require cancellation reason when booking is cancelled
- **FR-082**: System MUST support rebooking/clone option to duplicate previous bookings
- **FR-083**: System MUST support identity-based booking with Govt ID for guests
- **FR-084**: System MUST support ride sub-types (One-Way, Round Trip, Intercity)
- **FR-085**: System MUST allow special instructions text field in booking form
- **FR-086**: System MUST allow attachment uploads (travel memo, itinerary) in bookings
- **FR-087**: System MUST lock ride data post-verification (viewable only, not editable)
- **FR-141**: System MUST support cost center/project code configuration per corporate with dropdown selection
- **FR-142**: System MUST validate attachment file types (PDF, JPG, PNG) and enforce size limit of 10MB per file

**Vendor & Allocation**
- **FR-012**: System MUST display only corporate-linked vendors in booking vendor dropdown
- **FR-013**: System MUST show vendor compliance status (Active/Warning/Suspended) during selection
- **FR-014**: System MUST support manual vendor selection by corporate users
- **FR-015**: System MUST auto-escalate if vendor does not assign driver within timeout (15 min on-demand, 30 min same-day, 2 hours advance)
- **FR-016**: System MUST allow corporates to link/unlink vendors from their account
- **FR-017**: System MUST support many-to-many relationship between vendors and corporates
- **FR-088**: System MUST display live vendor response status (Accepted/Rejected/Timeout)
- **FR-089**: System MUST display vendor fleet availability (active vehicles/drivers count)
- **FR-090**: System MUST display vendor SLA score with 30-day rolling calculation
- **FR-091**: System MUST display vendor last ride date indicator
- **FR-143**: System MUST display vendor health indicators with color-coded icons (green=Active, yellow=Warning, red=Suspended)
- **FR-144**: System MUST show vendor health tooltip on hover displaying driver count, vehicle count, verification rate, and compliance percentage
- **FR-187**: System MUST support manual or automated driver assignment by vendor for ride fulfillment
- **FR-188**: System MUST require rejection reason when vendor cannot fulfill ride request
- **FR-202**: System MUST define Region entity with attributes: name, city, operational zone coordinates, and geofence boundaries (PRD CLR-460-506)
- **FR-203**: System MUST support many-to-many relationship between Vendors and Regions (vendor can operate in multiple regions) (PRD CLR-460-506)
- **FR-204**: System MUST auto-detect pickup region from booking coordinates using geofencing/reverse geocoding (PRD CLR-460-506)
- **FR-205**: System MUST filter vendor dropdown to only show vendors operating in detected pickup region (PRD CLR-460-506)
- **FR-206**: System MUST display operating regions for each vendor in vendor selection UI (PRD CLR-460-506)
- **FR-207**: System MUST display vendor selection context UI showing: region coverage match (Full/Partial/None), vehicle class availability breakdown, and pricing summary (PRD CLR-507-520)
- **FR-208**: System MUST display "Vendor Assigned" status in booking lifecycle (distinct from "Driver Assigned") (PRD CLR-507-520)
- **FR-209**: System MUST send instant notification to vendor when booking is assigned to them (trigger: status change to "Vendor Assigned") (PRD CLR-507-520)
- **FR-210**: System MUST maintain dedicated vendor allocation audit log with fields: BookingID, UserID, VendorID, Timestamp, Region, ActionType (Assign/Reassign/Cancel/Escalate/Timeout/Fallback), SelectionReason (PRD CLR-610-622)
- **FR-211**: System MUST allow Corporate Admin and Corpora Admin to access vendor allocation audit logs for dispute resolution (PRD CLR-610-622)
- **FR-212**: System MUST display "Pending Allocation" metric (count of rides awaiting vendor/driver assignment) on operational dashboard (PRD CLR-547-583)
- **FR-213**: System MUST display "Fallback Rides" metric (count of rides fulfilled by Cab by Corpora) on operational dashboard (PRD CLR-547-583)
- **FR-214**: System MUST support dashboard filtering by Vendor, Region, and SLA Rating dimensions (PRD CLR-547-583)
- **FR-215**: System MUST calculate vendor SLA score using weighted components: On-time Arrival (40%), Ride Completion Rate (30%), Cancellation/No-show Rate (20%), Invoice Accuracy (10%), with score range 0-100 (PRD CLR-597-609)
- **FR-216**: System MUST display SLA component scores on vendor detail page (not just overall score) (PRD CLR-597-609)
- **FR-217**: System MUST display SLA trend indicator comparing 30/60/90 day performance history (PRD CLR-597-609)
- **FR-218**: System MUST categorize SLA scores: Excellent (≥90), Average (70-89), Poor (<70) (PRD CLR-597-609)

**OTP & Ride Verification**
- **FR-018**: System MUST generate unique OTPs for ride start and end verification
- **FR-019**: System MUST restrict OTP verification to within 100 meters of pickup/drop location (geofence)
- **FR-020**: System MUST allow OTP regeneration by Corporate Travel Desk, Vendor Fleet Manager, or Corpora Admin
- **FR-021**: System MUST invalidate previous OTP upon regeneration
- **FR-022**: System MUST support OTP emergency override with Corporate Admin approval and audit logging
- **FR-023**: OTPs MUST remain valid until ride ends or is cancelled (no expiry)

**GPS Tracking & Monitoring**
- **FR-024**: System MUST capture GPS position every 5-10 seconds during active rides
- **FR-025**: System MUST detect route deviation exceeding 500 meters OR 10% and trigger alerts
- **FR-026**: System MUST support offline mode in driver app with local data caching until connectivity restored
- **FR-027**: System MUST display live ride positions on map for corporate monitoring
- **FR-092**: System MUST support configurable overspeeding alerts per corporate policy
- **FR-093**: System MUST display ETA and current speed during live tracking
- **FR-094**: System MUST support multiple map layers (Street, Satellite, Traffic)
- **FR-095**: System MUST display live breadcrumb trail with timestamps
- **FR-096**: System MUST display "Driver Arrived" marker when within 100m of pickup
- **FR-097**: System MUST auto-generate support tickets from ride exceptions
- **FR-098**: System MUST display completed ride summary with actual vs planned route
- **FR-189**: System MUST auto-reroute navigation in driver app when deviation from planned path is detected
- **FR-190**: System MUST record route breadcrumb with timestamps for audit and billing verification
- **FR-251**: System MUST store complete GPS breadcrumb trail with timestamps for all rides and make available to Corpora Admin for dispute resolution review for minimum 90 days (PRD CLR-2774)

**SOS & Safety**
- **FR-028**: System MUST provide SOS button in driver app that triggers alerts to corporate, vendor, and Corpora support
- **FR-029**: System MUST send location updates every 3 seconds during active SOS until acknowledged (PRD CLR-2349)
- **FR-030**: System MUST maintain SOS event logs for minimum 1 year

**Billing & Invoicing**
- **FR-031**: System MUST auto-calculate ride fare from GPS-verified distance and duration
- **FR-032**: System MUST allow vendors to add expense line items (toll, parking, driver allowance, waiting charges, night charges) with receipt uploads
- **FR-033**: System MUST prevent vendor modification of system-calculated base fare
- **FR-034**: Corpora MUST review and approve vendor invoices before corporate billing
- **FR-035**: System MUST generate consolidated corporate invoices with Corpora platform fee added
- **FR-036**: System MUST track invoice status: Draft, Submitted, Under Review, Approved, Paid, Rejected
- **FR-037**: System MUST support dispute creation with evidence attachment and SLA-tracked resolution
- **FR-055**: System MUST calculate waiting charges when vehicle stationary beyond allowed wait time
- **FR-056**: System MUST apply night charges for rides between 23:00-05:00 per rate catalog
- **FR-099**: System MUST allow configurable billing cycles (daily/weekly/monthly)
- **FR-100**: System MUST allow configurable payment terms per vendor contract (T+7, T+30)
- **FR-101**: System MUST support FASTag API integration for auto-sync of toll expenses (Phase 2)
- **FR-102**: System MUST support ERP integration hooks (Tally, Zoho, SAP) (Phase 2)
- **FR-103**: System MUST store documents in AES-256 encrypted vault
- **FR-104**: System MUST store and cross-reference MSA, DPA, and billing agreements
- **FR-105**: System MUST support branded email templates with corporate branding
- **FR-193**: System MUST auto-populate ride fare data (distance, duration, rate) from GPS/time logs in invoice
- **FR-194**: System MUST log all Corpora billing team comments on invoices and display in vendor dashboard

**Compliance & Documents**
- **FR-038**: System MUST verify and track KYC documents for corporates (PAN, GST, MSA), vendors (incorporation, GST, bank details), drivers (license, ID, background check), and vehicles (RC, insurance, fitness, PUC)
- **FR-039**: System MUST auto-notify document expiry at 30, 15, and 7 days before expiry
- **FR-040**: System MUST suspend entities (driver/vehicle/vendor) upon document expiry until renewed
- **FR-041**: System MUST maintain document version history for 7-year retention
- **FR-178**: System MUST prevent ride assignment to drivers with expired documents (enforcement of Smart Alert)
- **FR-179**: System MUST prevent ride assignment to vehicles with expired Insurance/Fitness documents
- **FR-180**: System MUST auto-suspend vehicles upon document expiry (symmetric with driver suspension in FR-040)
- **FR-181**: System MUST allow export of driver master list (CSV/PDF) from vendor dashboard
- **FR-182**: System MUST allow vendors to download monthly compliance certificate summary

**Notifications**
- **FR-042**: System MUST deliver notifications via dashboard, email, SMS, and WhatsApp
- **FR-043**: System MUST send critical alerts (SOS, SLA breach, document expiry) to all channels simultaneously
- **FR-044**: All notifications MUST be mandatory (users cannot opt-out)
- **FR-170**: System MUST prioritize notification delivery: Dashboard first, then SMS/WhatsApp, then Email for non-critical alerts
- **FR-171**: System MUST send critical alerts (SOS, SLA breach, payment overdue) to ALL channels simultaneously without priority ordering
- **FR-172**: System SHOULD support Slack/MS Teams integration for Corpora Admin alerts (Phase 2)
- **FR-198**: System MUST support branded email templates with Corporate Name + Region for multi-corporate deployment
- **FR-199**: System MUST use short transactional SMS messages for urgent ride updates (driver assigned, arrival, etc.)

**Support & Escalation**
- **FR-045**: System MUST support ticket creation linked to ride, invoice, or compliance context
- **FR-046**: System MUST track SLA timers: acknowledge within 5 minutes, resolve within 4 hours (operational) or 24 hours (billing)
- **FR-047**: System MUST auto-escalate tickets based on SLA breach thresholds
- **FR-048**: Tickets MUST remain open until manually closed; reopening allowed within 48 hours
- **FR-138**: System MUST prompt for 1-5 star feedback rating after ticket closure
- **FR-139**: System MUST display support metrics dashboard (response time, resolution time, SLA %)
- **FR-140**: System MUST support configurable compliance rules per region/state
- **FR-173**: System MUST maintain time-stamped communication thread for each ticket with all messages logged
- **FR-174**: System MUST log system-generated messages in ticket thread (e.g., "Ticket reassigned to Vendor X", "SLA breached")
- **FR-175**: System MUST permanently retain all ticket communications in audit history for 7 years
- **FR-176**: System MUST support 3-level escalation matrix: Level 1 (Ops Manager) → Level 2 (Account Manager) → Level 3 (Head of Operations)
- **FR-177**: System MUST auto-escalate to Level 3 when repeated unresolved tickets exceed threshold (>3 tickets in 7 days for same vendor/corporate)
- **FR-183**: System MUST establish GPS as authoritative source of truth for distance calculation
- **FR-184**: System MUST support manual distance dispute review via support tickets when vendor raises concern. Corpora Admin decision is FINAL and BINDING on all parties (corporate, vendor, driver) (PRD CLR-2776)
- **FR-197**: System MUST support configurable support hours per corporate contract (business hours with optional extended support)

**Reporting & Analytics**
- **FR-106**: System MUST support custom report templates combining multiple datasets
- **FR-107**: System MUST generate Route Optimization Report (actual vs ideal distance)
- **FR-108**: System MUST generate Utilization Report by department/vehicle/region
- **FR-109**: System MUST generate Departmental Spend Report with cost distribution
- **FR-110**: System MUST generate Expense Breakdown Report (base fare, tolls, parking, night)
- **FR-111**: System MUST generate Payment Reconciliation Report (pending, cleared, overdue)
- **FR-112**: System MUST generate Dispute Report with resolution status
- **FR-113**: System MUST generate Aging Report for payments
- **FR-114**: System MUST generate Vendor Compliance Report (document validity)
- **FR-115**: System MUST generate Driver Verification Report (DL, background checks)
- **FR-116**: System MUST generate Vehicle Fitness Report (insurance, PUC expiry)
- **FR-117**: System MUST display SLA Heatmap visualization by city/region
- **FR-118**: System MUST display Vendor Ranking weighted by ride volume
- **FR-219**: System MUST generate Ride Summary Report showing all rides within selected period with columns: Booking ID, Passenger Name, Corporate, Vendor, Ride Type, Distance (KM), Duration (HH:MM), Start Time, End Time, Status (PRD CLR-1010-1045)
- **FR-220**: Ride Summary Report MUST support filters: Date Range, Status (Active/Completed/Cancelled), Vendor, Region, Vehicle Class (PRD CLR-1010-1045)
- **FR-221**: System MUST generate Ride Exception Report showing rides with SLA violations: Delayed Arrival, Cancellations, Route Deviations (>500m), No-shows, with deviation details and reason (PRD CLR-1010-1045)
- **FR-222**: System MUST generate Invoice Summary Report showing consolidated vendor invoices per billing cycle with columns: Invoice #, Vendor, Period, Total Amount, Approval Status, Corpora Commission, Net Amount (PRD CLR-1047-1082)
- **FR-223**: System MUST restrict Travel Desk role to operational reports only: Ride Summary, Route Optimization, Utilization, Exception Reports (PRD CLR-971-987)
- **FR-224**: System MUST restrict Accounts User role to financial reports only: Invoice Summary, Departmental Spend, Expense Breakdown, Payment Reconciliation, Dispute, Aging (PRD CLR-971-987)
- **FR-225**: System MUST grant Corporate Admin full access to all operational, financial, and compliance reports without restrictions (PRD CLR-971-987)
- **FR-226**: System MUST support report export in PDF, Excel (XLSX), and CSV formats (PRD CLR-1163-1170)
- **FR-227**: System MUST support dashboard KPI export to PDF/Excel for presentations (PRD CLR-1163-1170)
- **FR-228**: System MUST log all report exports with metadata: User ID, Timestamp, Report Type, Filters Applied, Export Format (PRD CLR-1163-1170)
- **FR-229**: System MUST generate SLA Summary by Vendor Report showing per-vendor metrics: Response SLA (acceptance time), Reporting SLA (on-time arrival %), Ride SLA (route adherence), Billing SLA (accuracy), No-show Rate (PRD CLR-1084-1130)
- **FR-230**: System MUST generate SLA Summary by Region Report showing regional performance aggregates across all vendors (PRD CLR-1084-1130)
- **FR-231**: System MUST display hover tooltips on chart data points showing detailed metrics (distance, cost, count, percentage) (PRD CLR-1172-1181)
- **FR-232**: System MUST support chart snapshot export as PNG/PDF for presentations (PRD CLR-1172-1181)

**Dashboard & UI**
- **FR-119**: System MUST provide widget-based customizable dashboard
- **FR-120**: System MUST display real-time operational snapshot (active rides, SLA breaches, SOS)
- **FR-121**: System MUST display financial overview panel (outstanding, due, disputed)
- **FR-122**: System MUST display vendor performance summary with color-coded badges
- **FR-123**: System MUST display spend & utilization trend graphs (daily/weekly/monthly toggle)
- **FR-124**: System MUST display alerts panel with recent notifications
- **FR-125**: System MUST provide quick actions toolbar (New Booking, View Invoices, etc.)
- **FR-126**: System MUST provide unified notification center with tabs and filtering
- **FR-127**: System MUST provide data visualization (pie charts, line graphs, bar charts)
- **FR-128**: System MUST display color-coded SLA compliance indicators
- **FR-129**: System MUST support dashboard auto-refresh via WebSocket every 30 seconds
- **FR-130**: System MUST support scheduled summary reports (daily/weekly/monthly email) (PRD CLR-1163-1170)
- **FR-145**: System MUST support customizable widget layout per user with add/remove/rearrange functionality
- **FR-146**: System MUST provide drill-down navigation from dashboard metric tiles to filtered detail views
- **FR-195**: System MUST display scheduled rides count for next 24 hours on operational dashboard
- **FR-196**: System MUST display active rides count with map view on dashboard

**Vendor Dashboard**
- **FR-131**: System MUST provide vendor analytics module (rides, earnings, SLA, rejection rate)
- **FR-132**: System MUST provide vendor payment dashboard with filters (corporate, status, date)
- **FR-133**: System MUST provide vendor compliance audit center with scores and alerts
- **FR-147**: System MUST support daily/shift-based driver-vehicle assignment binding with one-click functionality
- **FR-148**: System MUST allow flexible driver-vehicle reassignment per ride (not permanent binding)
- **FR-149**: System MUST maintain rate catalog change audit trail with before/after values and timestamps
- **FR-150**: System MUST require Corpora Admin approval before rate catalog changes become active
- **FR-151**: System MUST track and display vendor invoice rejection rate as a performance metric
- **FR-152**: System MUST generate vendor payment aging report showing pending payments by age buckets
- **FR-153**: System MUST display vendor compliance score trend by month as a historical chart
- **FR-233**: System MUST provide vendor dashboard with widgets for: Active Rides Queue, Pending Invoices, Compliance Alerts, Earnings Summary (daily/monthly), Fleet Status (PRD CLR-1959-2194)
- **FR-234**: System MUST provide vendor profile management UI allowing vendors to edit company details and upload/renew KYC documents (PRD CLR-1959-2194)
- **FR-235**: System MUST provide vendor driver management UI with forms for: Add Driver, Edit Driver Details, Upload Documents, View Compliance Status (PRD CLR-1959-2194)
- **FR-236**: System MUST provide vendor vehicle management UI with: Fleet list view, Vehicle status indicators (Active/Suspended/Expired), Document expiry warnings, Quick actions for document renewal (PRD CLR-2049-2067)
- **FR-237**: System MUST provide vendor rate catalog editor UI for creating/editing rate packages with: Package type selection (Hourly/Point-to-Point/Intercity), Base Fare, Extra KM rate, Extra Hour rate, Waiting Charges, Night Charges, per corporate (PRD CLR-2069-2086)
- **FR-238**: System MUST display vendor profile details (company name, compliance status, document verification dates, SLA score) to linked corporates in read-only mode (PRD CLR-2009-2026)
- **FR-239**: System MUST support driver standby pool status for drivers not currently assigned to vehicles, making them available for ad-hoc ride assignment (PRD CLR-2028-2047)
- **FR-240**: System MUST support optional document uploads: Police Verification for drivers, Vehicle photos and road tax proofs for vehicles, with same versioning and audit trail as mandatory documents (PRD CLR-2028-2067)

**Cab by Corpora Fallback**
- **FR-049**: System MUST allow manual selection of "Cab by Corpora" option at any time, with automatic fallback when no linked vendor available in region (PRD CLR-534-545)
- **FR-050**: Fallback rides MUST use Corpora's standard rates, not corporate's contracted rates
- **FR-051**: Corpora MUST settle with trusted vendor independently of corporate payment

**Corporate Travel Policy Enforcement**
- **FR-057**: System MUST store corporate travel policy document with version control and effective dates
- **FR-058**: System MUST enforce policy-based booking rules: allowed vehicle classes, booking lead time, expense limits per ride
- **FR-059**: System MUST enforce night travel restrictions (23:00-05:00) unless emergency flag enabled per policy
- **FR-060**: System MUST support policy exception workflow requiring Corporate Admin approval with audit logging
- **FR-061**: System MUST display compliance monitoring dashboard showing % rides compliant vs exception flagged
- **FR-069**: System MUST support gender-specific driver assignment policy for female guests when required by corporate policy

**Guest/Passenger Handling**
- **FR-062**: System MUST allow driver to mark guest no-show, triggering corporate billing per contract rules
- **FR-063**: System MUST allow passengers to rate driver (1-5 stars) post-ride via web link
- **FR-064**: System MUST aggregate driver ratings into monthly performance average visible to vendor
- **FR-191**: System MUST provide guest ride tracking via web link (no login required)
- **FR-192**: System MUST send ride details and OTP via SMS/WhatsApp/Email to guest

**Corpora Admin Configuration**
- **FR-065**: System MUST allow Corpora Admin to configure platform commission rates (flat or percentage) per corporate/vendor
- **FR-066**: System MUST allow Corpora Admin to configure penalty slabs for SLA breaches
- **FR-067**: System MUST allow Corpora Admin to configure regional settings (timezone, currency)
- **FR-068**: System MUST support admin override for rate corrections with approval workflow and audit logging
- **FR-070**: System MUST maintain rate catalog version history for audit when rates are modified
- **FR-163**: System MUST track entity status flow: Pending Verification → Verified → Active → Suspended → Blacklisted
- **FR-164**: System MUST support account manager assignment per corporate and vendor for relationship management
- **FR-165**: System MUST integrate GST/PAN validation APIs for automated KYC verification (Phase 2)
- **FR-166**: Corpora Admin MUST have bulk verification tools for processing multiple drivers/vehicles simultaneously
- **FR-167**: Corpora Admin MUST have batch document approval/rejection capability
- **FR-168**: System MUST support configuration change rollback to previous state
- **FR-169**: System MUST log all configuration changes with full audit trail and rollback capability
- **FR-185**: System MUST support regional/service coverage configuration per vendor during onboarding
- **FR-186**: System MUST support region-based data access restrictions for Corpora Admin users

**Driver App Requirements**
- **FR-071**: Driver App MUST support Android (≥8.0) and iOS (≥14) platforms
- **FR-072**: Driver App MUST work in offline/low-connectivity mode with local data caching and sync when online
- **FR-073**: Driver App MUST detect vehicle inactivity (stationary >15 mins) and trigger waiting time alerts
- **FR-074**: Driver App MUST require location permission "Always On" for GPS tracking during rides
- **FR-134**: System MUST prompt driver for night shift confirmation (23:00-05:00 rides)
- **FR-135**: System MUST detect and warn about auto-start restrictions and battery optimization
- **FR-136**: System MUST provide driver ride history and earnings dashboard
- **FR-137**: System MUST support blacklisting workflow (Suspended → Blacklisted status)
- **FR-154**: Driver App MUST support optional face recognition for enhanced two-factor authentication
- **FR-155**: Driver App MUST bind accepted rides to the specific device until ride completion or reassignment
- **FR-156**: Driver App MUST display driver profile synced from vendor dashboard as read-only
- **FR-157**: Driver App MUST require reason selection when driver rejects a ride assignment
- **FR-158**: System MUST trigger fallback allocation to another driver when a driver rejects assignment
- **FR-159**: System MUST geo-tag all expense entries with location coordinates and timestamp
- **FR-160**: System MUST lock expense edits after vendor submits invoice to Corpora
- **FR-161**: Driver App MUST allow SOS cancellation within 30 seconds of activation for accidental triggers
- **FR-162**: System MUST require Corpora support acknowledgment for SOS events after 30-second cancellation window
- **FR-200**: Driver App MUST provide configurable emergency contact numbers list (police, ambulance, etc.)
- **FR-201**: System MUST prompt additional confirmation for late-hour/night shift rides (safety checkpoint)
- **FR-241**: Driver App MUST mask passenger full name (display only first name + last initial) until OTP start verification is completed; full name visible during and after ride (PRD CLR-2257)
- **FR-242**: System MUST allow drivers to add expense entries during active ride or within 24 hours post-completion with categories: Parking, Toll, Fuel, Other (PRD CLR-2292-2308)
- **FR-243**: Driver App MUST require text justification when "Other" expense category is selected
- **FR-244**: Driver App MUST display ride assignment card with: Booking ID, Corporate Name, Masked Passenger Name, Pickup Location, Drop Location, Scheduled Time, Ride Type, Vehicle Class (PRD CLR-2257-2270)
- **FR-245**: Driver App MUST display performance metrics dashboard showing: On-time Arrival % (last 30 days), No-show Count, Average Feedback Rating (monthly), Expense Rejection %, Total Rides Completed (PRD CLR-2368-2381)
- **FR-246**: Driver App MUST display ride history with columns: Date, Booking ID, Corporate Name, Duration, Distance (KM), Base Fare, Add-on Charges, Total Fare, Payment Status (PRD CLR-2325-2336)
- **FR-247**: Driver App ride history MUST support filtering by: Date Range, Payment Status, Corporate Name (PRD CLR-2325-2336)
- **FR-248**: System MUST notify driver via in-app notification and SMS when vendor rejects an expense entry, including rejection reason and timestamp (PRD CLR-2358)
- **FR-249**: Driver App login MUST use registered mobile number as primary identifier with SMS OTP verification (PRD CLR-2235-2247)
- **FR-250**: Driver profile MUST sync from vendor dashboard to driver app as read-only with fields: Name, Photo, License Number, License Expiry, Verification Status, Assigned Vehicles (PRD CLR-2235-2247)

### Key Entities

- **Corporate**: Client organization that books transportation. Key attributes: company details, KYC documents, linked vendors, departments/cost centers, travel policy, user accounts (Admin, Travel Desk, Accounts).

- **Vendor**: Transport provider referred by corporates. Key attributes: company details, KYC documents, fleet (vehicles), drivers, rate catalogs per corporate, compliance status. Can serve multiple corporates.

- **Trusted Vendor**: Vendor in Corpora's fallback pool. Same attributes as Vendor but linked to Corpora rather than specific corporate.

- **Driver**: Person who executes rides. Key attributes: personal details, license, ID proof, verification status, assigned vendor(s), performance metrics. Can belong to multiple vendors.

- **Vehicle**: Transportation asset. Key attributes: type, number plate, capacity, fuel type, RC, insurance, fitness certificate, PUC, assigned vendor. Can belong to multiple vendors.

- **Booking/Ride**: Transportation request and its execution. Key attributes: corporate, vendor, driver, vehicle, passenger details, pickup/drop locations, ride type, package, timestamps, GPS trail, OTPs, status, expenses, fare calculation.

- **Invoice**: Financial document for ride billing. Key attributes: vendor invoice (per ride), corporate invoice (consolidated), line items, tax, status, dispute history.

- **Ticket**: Support request. Key attributes: type, linked entity (ride/invoice), description, priority, status, SLA timers, communication thread, resolution.

- **Region**: Geographic operational area for vendor service coverage. Key attributes: region_id, name, city, zone_coordinates (polygon), geofence_boundaries, is_active, created_at. Supports many-to-many relationship with vendors (PRD CLR-460-506).

- **Travel Policy**: Corporate travel rules document. Key attributes: version, effective date, vehicle class restrictions, booking lead time rules, night travel restrictions, expense limits, exception rules.

- **Rate Catalog**: Vendor-corporate pricing configuration. Key attributes: vendor, corporate, packages (hourly slabs), base fare, extra KM rate, extra hour rate, waiting charges, night charges, driver allowance rules.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete a ride booking in under 3 minutes from login to confirmation
- **SC-002**: 95% of ride start/end OTP verifications succeed on first attempt when user is within geofence
- **SC-003**: GPS-verified distance matches billing distance within 2% tolerance on 99% of rides
- **SC-004**: Vendors receive ride assignments within 30 seconds of corporate selection
- **SC-005**: Corporate users can view live ride position updates within 10 seconds of actual movement
- **SC-006**: SOS alerts reach all designated recipients within 15 seconds of trigger
- **SC-007**: Document expiry alerts are delivered at all three intervals (30, 15, 7 days) with 100% reliability
- **SC-008**: Invoice disputes are acknowledged within 5 minutes SLA 95% of the time
- **SC-009**: Support tickets are resolved within SLA 90% of the time
- **SC-010**: System supports 10,000 concurrent active rides without performance degradation
- **SC-011**: Platform achieves 50% reduction in billing disputes compared to previous manual processes (baseline to be established)
- **SC-012**: Vendor compliance rate (valid documents) maintained above 95% through automated alerts
- **SC-013**: Corporate users report ride visibility satisfaction above 4.5/5 in post-implementation survey

## Assumptions

1. **B2B Payment Model**: All payments are manual bank transfers/cheques between businesses. No payment gateway integration required in current scope.

2. **Web-Based Passenger Interface**: Passengers (guests/employees) interact via web links for ride tracking, not native mobile apps. They receive OTPs via SMS/WhatsApp/Email.

3. **Manual Vendor Selection**: Corporates manually select vendors for bookings. No automated vendor allocation algorithm in current scope.

4. **Single Geographic Region**: Initial deployment targets Indian market with INR currency and Indian compliance requirements (GST, Motor Vehicles Act).

5. **Notification Delivery**: SMS and WhatsApp delivery depends on third-party gateway providers. System logs delivery status but cannot guarantee receipt.

6. **GPS Accuracy**: GPS positioning accuracy assumed to be within 10m urban and 25m rural, subject to device and environmental conditions.

7. **Document Verification**: Initial document verification is manual by Corpora compliance team. OCR-based automation is enhancement scope.

8. **Driver Multi-Vendor Model**: Drivers and vehicles can belong to multiple vendors to support sub-vendor operating models common in Indian transport industry.

9. **Compliance Priority Elevation**: Compliance Management elevated from PRD Priority 3 to Specification Priority 1 because vendor fleet/driver verification is foundational to ride assignment safety. Cannot execute P1 ride booking without verified drivers/vehicles. This is a justified technical dependency elevation (PRD CLR-2834-2837).

## Dependencies

1. **Mapping Service**: Google Maps (primary) for geocoding, routing, and distance calculation. Most accurate coverage for India.

2. **SMS Gateway**: MSG91 for transactional SMS and OTP delivery. India-focused, cost-effective provider.

3. **WhatsApp Gateway**: WhatsApp Business API for ride notifications and alerts.

4. **Email Service**: AWS SES for transactional emails and reports delivery.

5. **File Storage**: AWS S3 for document storage (KYC, receipts, invoices) with AES-256 encryption.

6. **Government API Integration** (Phase 2): GST verification, PAN validation for automated KYC.

## Phase 2 Features (Deferred)

These features are documented in the PRD but deferred to Phase 2 after MVP launch:

1. AI-driven insights: Predictive ride volume forecasting, vendor efficiency predictions, anomaly detection, recommended vendor suggestions
2. Multi-currency support for global corporate expansion
3. OCR-based automated document verification (Phase 1 uses manual verification)
4. FASTag API integration for auto-sync of toll expenses (FR-101)
5. ERP integration hooks (Tally, Zoho, SAP) (FR-102)
6. Multi-language support for notifications

## Out of Scope

1. Native mobile apps for passengers/guests
2. Payment gateway integration
3. Automated vendor allocation algorithms
4. Real-time pricing/surge pricing
5. Public ride-sharing or consumer-facing features
6. Vehicle telematics hardware integration (uses driver phone GPS)
