GLOBAL PAGODA INTER-DEPARTMENTAL SYSTEM
Functional & Technical Specification (v1.0)
1. SYSTEM PURPOSE (NON-NEGOTIABLE)
This system manages multi-trust, multi-department operations at Global Pagoda with strict auditability, role-based control, and incremental extensibility.

The system must not:

Break existing workflows

Reset data

Rename entities casually

Bypass approval chains

Merge trust data incorrectly

All changes are additive or controlled refactors only.

2. ORGANIZATIONAL STRUCTURE (ROOT CONSTRAINT)
2.1 Trusts (TOP LEVEL — HARD BOUNDARIES)
Global Pagoda Trust

SVCT – Samyak Vaniya Charitable Trust

Dhammapatana Vipassana Center Trust

VRI Trust

Rule:
Every record (request, purchase, bill, asset, inventory) MUST be tagged to exactly one trust.

Cross-trust visibility is read-only unless explicitly allowed.

2.2 Departments by Trust
Global Pagoda Trust
Reception

IT

Public Relations

Museum

Security

Transport

Maintenance

Housekeeping

SVCT
Dhammale (Guest House)

Kitchen / Food Court

Souvenir Shop

Dhammapatana Trust
Course Operations

Course Accommodation

Course Kitchen

Course Maintenance Coordination

VRI Trust
PALA (Archival)

Pali (Teaching)

VRI Data Center (Devices & Dispatch)

VRI PR

3. ROLE MODEL (ENFORCED)
Roles
Department User

Department Admin

Purchase Manager – Pagoda

Purchase Manager – Souvenir

Store Manager – Pagoda Store

Store Manager – Souvenir Store

Security User

Accounts User

Trustee

Super Admin

Rule:
Permissions are role-based, not user-based.
Every action must be traceable to (user → role → department → trust).

4. PURCHASE SYSTEM (CRITICAL MODULE)
4.1 Purchase Separation
There are two logical purchase systems:

Pagoda Purchase

Serves all non-souvenir departments

Souvenir Purchase

Serves Souvenir Shop only

Staff may overlap.
Data, approvals, and inventory must NOT overlap.

4.2 Stores
Pagoda Store

Electrical, plumbing, maintenance items

Souvenir Store

Sale inventory only

Rule:
No item can be issued directly to a department without:

Purchase → Security Gate Pass → Store Entry → Store Issue
4.3 Purchase Workflow (STRICT)
Department raises request

Purchase Manager collects 3–4 quotations

Quotations visible to department (read + comment)

Approval logic:

Below threshold → Purchase Manager

Above threshold OR escalated → Trustee

Accounts informed

Item purchased

Security gate pass created

Store entry logged

Item issued to department

Bill closed by Accounts

4.4 Approval Threshold
Default: ₹15,000

Configurable

Only Super Admin can change

Every change is:

Logged

Time-stamped

Requires reason

Purchase Manager may escalate any request regardless of amount.

5. INVENTORY & ASSETS
Inventory Locations
Reception (stationery, medicines)

Pagoda Store

Souvenir Store

VRI Data Center (devices)

Assets (first-class entities)
Rooms

ACs

CCTV

Servers

Tablets / Phones

Vehicles

Each asset must have:

Unique ID

Trust ownership

Maintenance history

Status lifecycle

6. TICKETING SYSTEM
Used by:

Maintenance

IT

Housekeeping

Transport

Tickets have:

Priority

SLA

Linked asset (if applicable)

Trust & department tagging

Emergency tickets may bypass purchase but must be logged.

7. ACCOMMODATION (DHAMMALE + DHAMMAPATANA)
Dhammale Room Types
Dormitory (₹1200, no booking)

Deluxe (₹3300, +₹1000 mattress)

Super Deluxe (₹6500, +₹1000 mattress)

Staff/Seva rooms (free, restricted)

Room lifecycle:

Vacant → Occupied → Cleaning → Maintenance → Blocked
Revenue flows to SVCT only.

8. NON-FUNCTIONAL RULES (MANDATORY)
No hard deletion of records

Status-based lifecycle only

All approvals digital

Full audit trail

Backward compatibility required

Existing APIs must not be broken

Migrations must be non-destructive

