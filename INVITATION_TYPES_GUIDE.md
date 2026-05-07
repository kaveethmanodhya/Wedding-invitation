# Invitation Types — Architecture Guide

> **Platform:** wedding-invitation-by-kodeX  
> **Last Updated:** April 2026  
> **Golden Rule:** The `settings` collection is **never modified**. All type-specific data lives in separate collections.

---

## Table of Contents

1. [How the Current System Works (Wedding & Engagement)](#1-how-the-current-system-works-wedding--engagement)
2. [Why This Architecture](#2-why-this-architecture)
3. [Birthday & General Invitations — Design Decisions](#3-birthday--general-invitations--design-decisions)
4. [Step-by-Step Implementation Plan](#4-step-by-step-implementation-plan)
   - [Step 1 — Extend the valid event types](#step-1--extend-the-valid-event-types)
   - [Step 2 — Add birthday labels](#step-2--add-birthday-labels)
   - [Step 3 — Add general labels](#step-3--add-general-labels)
   - [Step 4 — Create the birthday data API](#step-4--create-the-birthday-data-api)
   - [Step 5 — Create the general data API](#step-5--create-the-general-data-api)
   - [Step 6 — Update the admin dropdown](#step-6--update-the-admin-dropdown)
   - [Step 7 — Show conditional admin form sections](#step-7--show-conditional-admin-form-sections)
   - [Step 8 — Merge type-specific data in the config GET](#step-8--merge-type-specific-data-in-the-config-get)
   - [Step 9 — Update ClientHome to pass data to components](#step-9--update-clienthome-to-pass-data-to-components)
   - [Step 10 — Conditional rendering in components](#step-10--conditional-rendering-in-components)
5. [Database Collections Summary](#5-database-collections-summary)
6. [File Change Checklist](#6-file-change-checklist)

---

## 1. How the Current System Works (Wedding & Engagement)

### Data Flow

```
MongoDB
  ├── settings          ← primary invitation data (slug, couple, wedding, events, …)
  └── event_meta        ← { slug, eventType }   ← added per-slug, NEVER touches settings
```

When a visitor loads `/kasun-nimesha`:

```
app/[slug]/page.jsx
  → GET /api/config?slug=kasun-nimesha
      → db.settings.findOne({ slug })           // main config
      → db.event_meta.findOne({ slug })         // extra: eventType
      → merges: config.eventType = eventMeta?.eventType || 'wedding'
  → returns merged config to ClientHome
```

```
ClientHome.jsx
  → const labels = getLabels(config.eventType)  // lib/eventLabels.js
  → passes labels={labels} to every component
```

```
lib/eventLabels.js
  export const EVENT_LABELS = {
    wedding:    { heroEyebrow: 'Wedding Celebration', ... },
    engagement: { heroEyebrow: 'Engagement Celebration', ... },
  }
  export function getLabels(eventType) {
    return EVENT_LABELS[eventType] || EVENT_LABELS.wedding  // always safe
  }
```

Every component (Hero, Countdown, Timeline, CoverReveal, LayoutEight, LayoutTen, etc.) receives `labels` as a prop and does:

```jsx
<p>{labels.heroEyebrow || 'Wedding Celebration'}</p>
```

The fallback (`|| 'Wedding Celebration'`) ensures **zero breaking change** on invitations that existed before the system was added.

### Admin Panel

`app/admin/page.jsx` has a dropdown in the header:

```jsx
<select value={eventType} onChange={e => handleEventTypeSave(e.target.value)}>
  <option value="wedding">💍 Wedding</option>
  <option value="engagement">💌 Engagement</option>
</select>
```

`handleEventTypeSave` fires `PUT /api/event-type?slug=...` with `{ eventType }`, which **upserts** into `event_meta`. The `settings` document is never touched.

### API: event-type route

`app/api/event-type/route.js`:

- **GET** `/api/event-type?slug=XYZ` → returns `{ eventType: 'wedding' }` (defaults to wedding)
- **PUT** `/api/event-type?slug=XYZ` body `{ eventType }` → upserts into `event_meta`
- Validates against a hardcoded `VALID_EVENT_TYPES` array — **this is the only thing to update** when adding new types

---

## 2. Why This Architecture

| Concern | Decision |
|---|---|
| Existing `settings` documents must not change | All new metadata lives in separate collections |
| Default behaviour for old invitations | Every lookup falls back to `'wedding'` if no record exists |
| Adding new types should not touch old code paths | The label map + fallback pattern means new keys are invisible to old components |
| Birthday/general have **different data shapes** | They get their own collections (`birthdays`, `general`) rather than cramming into `settings` |

---

## 3. Birthday & General Invitations — Design Decisions

### What changes between types

| Feature | Wedding | Engagement | Birthday | General |
|---|---|---|---|---|
| Couple names shown | ✅ | ✅ | ❌ (single person or group) | ❌ (editable) |
| `wedding` date field | ✅ | ✅ | ❌ | ❌ |
| Story section language | Love story | Love story | Life milestone | Custom |
| RSVP message header | 💍 Wedding | 💌 Engagement | 🎂 Birthday | 📩 Invitation |
| Extra type-specific fields | — | — | age, theme colour, wish message | title, host name, venue, custom body text |

### Data stored per type

**Birthday** (`db.birthdays` collection):
```js
{
  slug: 'john-40th',         // links to settings
  celebrantName: 'John',
  age: 40,
  birthdayTheme: 'Tropical',
  wishMessage: 'Join us as we celebrate 40 amazing years!',
}
```

**General** (`db.general` collection):
```js
{
  slug: 'annual-gala-2026',  // links to settings
  eventTitle: 'Annual Gala Night',
  hostName: 'The KodeX Foundation',
  customBodyText: 'You are cordially invited to...',
  eventType2: 'Corporate',   // optional sub-type for display only
}
```

The `settings` document for both is reused **as-is** — it still stores all the common fields (heroImage, gallery, theme, RSVP, events, timeline, etc.). Only the type-specific text fields live in the new collections.

---

## 4. Step-by-Step Implementation Plan

---

### Step 1 — Extend the valid event types

**File:** `app/api/event-type/route.js`

Change:
```js
const VALID_EVENT_TYPES = ['wedding', 'engagement'];
```

To:
```js
const VALID_EVENT_TYPES = ['wedding', 'engagement', 'birthday', 'general'];
```

That is the only code gate for which types are accepted.

---

### Step 2 — Add birthday labels

**File:** `lib/eventLabels.js`

Add a `birthday` entry to `EVENT_LABELS`:

```js
birthday: {
  heroEyebrow: 'Birthday Celebration',
  heroHeading: 'Join the Celebration',
  heroFamiliesLine: 'Together with family and friends invite you to the birthday celebration',
  heroFamiliesIcal: 'Together with family and friends\\, invite you to the birthday celebration.',
  coupleRevealTagline: 'Is Turning {{age}}!',        // {{age}} replaced at render time (see Step 10)
  timelineEyebrow: 'The Big Day',
  timelineHeading: 'Birthday Schedule',
  countdownLabel: 'Counting down to the big day',
  countdownHeading: 'The Party Begins In',
  rsvpMessageHeader: '🎂 *Birthday Invitation Reply* 🎂',
  rsvpMessageHeaderAlt: '🎂 *Birthday RSVP* 🎂',
  storyFooter: 'Making Memories',
  storyHeading6: 'A Life Worth Celebrating',
  storyCaption7: 'Golden Moments',
  storySection: 'The Journey',
  coverRevealTagline: "You are invited to the birthday bash!",
  layout8JoinUs: 'Join us in celebrating',
  layout8EternalLabel: 'A Beautiful Journey',
  layout8GalleryLabel: 'Captured Memories',
},
```

---

### Step 3 — Add general labels

**File:** `lib/eventLabels.js`

Add a `general` entry to `EVENT_LABELS`:

```js
general: {
  heroEyebrow: 'Special Event',
  heroHeading: 'You Are Invited',
  heroFamiliesLine: 'We cordially invite you to this special occasion',
  heroFamiliesIcal: 'We cordially invite you to this special occasion.',
  coupleRevealTagline: 'Cordially Invites You',
  timelineEyebrow: 'Event Day',
  timelineHeading: 'Event Schedule',
  countdownLabel: 'Counting down to the event',
  countdownHeading: 'The Event Begins In',
  rsvpMessageHeader: '📩 *Event Invitation Reply* 📩',
  rsvpMessageHeaderAlt: '📩 *Event RSVP* 📩',
  storyFooter: 'We Hope to See You There',
  storyHeading6: 'About This Event',
  storyCaption7: 'Special Moments',
  storySection: 'Our Story',
  coverRevealTagline: "You have been invited!",
  layout8JoinUs: 'Join us for',
  layout8EternalLabel: 'An Unforgettable Evening',
  layout8GalleryLabel: 'Event Gallery',
},
```

---

### Step 4 — Create the birthday data API

**New file:** `app/api/birthday-data/route.js`

```js
import { NextResponse } from 'next/server';
import getMongoClientPromise from '@/lib/mongodb';

/**
 * GET /api/birthday-data?slug=XYZ
 * Returns birthday-specific fields for a slug.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
    }
    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');
    const doc = await db.collection('birthdays').findOne({ slug });
    if (!doc) {
      return NextResponse.json({ celebrantName: '', age: null, birthdayTheme: '', wishMessage: '' });
    }
    const { _id, ...data } = doc;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/birthday-data?slug=XYZ
 * Upserts birthday-specific data for a slug.
 * settings collection is never touched.
 */
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
    }
    const body = await request.json();
    // Whitelist only the allowed fields — never write arbitrary data
    const { celebrantName = '', age = null, birthdayTheme = '', wishMessage = '' } = body;

    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');
    await db.collection('birthdays').updateOne(
      { slug },
      { $set: { slug, celebrantName, age, birthdayTheme, wishMessage, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
```

---

### Step 5 — Create the general data API

**New file:** `app/api/general-data/route.js`

```js
import { NextResponse } from 'next/server';
import getMongoClientPromise from '@/lib/mongodb';

/**
 * GET /api/general-data?slug=XYZ
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
    }
    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');
    const doc = await db.collection('general').findOne({ slug });
    if (!doc) {
      return NextResponse.json({ eventTitle: '', hostName: '', customBodyText: '', eventType2: '' });
    }
    const { _id, ...data } = doc;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

/**
 * PUT /api/general-data?slug=XYZ
 */
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
    }
    const body = await request.json();
    const { eventTitle = '', hostName = '', customBodyText = '', eventType2 = '' } = body;

    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');
    await db.collection('general').updateOne(
      { slug },
      { $set: { slug, eventTitle, hostName, customBodyText, eventType2, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
```

---

### Step 6 — Update the admin dropdown

**File:** `app/admin/page.jsx`

Find the event type `<select>` element (currently around line 994) and add the two new options:

```jsx
<select value={eventType} onChange={e => handleEventTypeSave(e.target.value)} disabled={savingEventType}>
  <option value="wedding">💍 Wedding</option>
  <option value="engagement">💌 Engagement</option>
  <option value="birthday">🎂 Birthday</option>
  <option value="general">📩 General</option>
</select>
```

No other changes to `handleEventTypeSave` — it already calls `PUT /api/event-type` and the route now accepts all four types.

---

### Step 7 — Show conditional admin form sections

**File:** `app/admin/page.jsx`

When the admin selects `birthday` or `general`, the standard couple/wedding fields don't make sense. Add a conditional block below the event type selector that shows a type-specific `SectionCard`:

```jsx
{/* ── BIRTHDAY FIELDS ── only visible when eventType === 'birthday' */}
{eventType === 'birthday' && (
  <SectionCard title="Birthday Details" icon="🎂">
    <FieldGroup label="Celebrant Name">
      <input className={inputCls} value={birthdayData.celebrantName}
        onChange={e => setBirthdayData(d => ({ ...d, celebrantName: e.target.value }))} />
    </FieldGroup>
    <FieldGroup label="Age">
      <input type="number" className={inputCls} value={birthdayData.age || ''}
        onChange={e => setBirthdayData(d => ({ ...d, age: Number(e.target.value) }))} />
    </FieldGroup>
    <FieldGroup label="Party Theme">
      <input className={inputCls} value={birthdayData.birthdayTheme}
        onChange={e => setBirthdayData(d => ({ ...d, birthdayTheme: e.target.value }))} />
    </FieldGroup>
    <FieldGroup label="Wish Message" hint="Shown on the hero/cover">
      <textarea className={textareaCls} value={birthdayData.wishMessage}
        onChange={e => setBirthdayData(d => ({ ...d, wishMessage: e.target.value }))} />
    </FieldGroup>
    <div className="col-span-2">
      <button type="button" onClick={handleBirthdayDataSave}
        className="px-6 py-2 bg-[#C9956A] text-white rounded-lg text-sm font-bold">
        Save Birthday Details
      </button>
    </div>
  </SectionCard>
)}

{/* ── GENERAL EVENT FIELDS ── only visible when eventType === 'general' */}
{eventType === 'general' && (
  <SectionCard title="Event Details" icon="📩">
    <FieldGroup label="Event Title">
      <input className={inputCls} value={generalData.eventTitle}
        onChange={e => setGeneralData(d => ({ ...d, eventTitle: e.target.value }))} />
    </FieldGroup>
    <FieldGroup label="Host Name">
      <input className={inputCls} value={generalData.hostName}
        onChange={e => setGeneralData(d => ({ ...d, hostName: e.target.value }))} />
    </FieldGroup>
    <FieldGroup label="Custom Body Text" hint="Main invitation paragraph">
      <textarea className={textareaCls} value={generalData.customBodyText}
        onChange={e => setGeneralData(d => ({ ...d, customBodyText: e.target.value }))} />
    </FieldGroup>
    <FieldGroup label="Event Sub-type" hint="e.g. Corporate, Social, Religious">
      <input className={inputCls} value={generalData.eventType2}
        onChange={e => setGeneralData(d => ({ ...d, eventType2: e.target.value }))} />
    </FieldGroup>
    <div className="col-span-2">
      <button type="button" onClick={handleGeneralDataSave}
        className="px-6 py-2 bg-[#C9956A] text-white rounded-lg text-sm font-bold">
        Save Event Details
      </button>
    </div>
  </SectionCard>
)}
```

**Required new state in `AdminDashboard`:**

```js
const [birthdayData, setBirthdayData] = useState({ celebrantName: '', age: null, birthdayTheme: '', wishMessage: '' });
const [generalData, setGeneralData] = useState({ eventTitle: '', hostName: '', customBodyText: '', eventType2: '' });
```

**Load them alongside `loadConfig`:**

```js
// inside loadConfig(), after setting eventType:
if (data.eventType === 'birthday') {
  const bRes = await fetch(`/api/birthday-data?slug=${slug}`);
  const bData = await bRes.json();
  setBirthdayData(bData);
}
if (data.eventType === 'general') {
  const gRes = await fetch(`/api/general-data?slug=${slug}`);
  const gData = await gRes.json();
  setGeneralData(gData);
}
```

**Save handlers:**

```js
const handleBirthdayDataSave = async () => {
  const res = await fetch(`/api/birthday-data?slug=${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(birthdayData),
  });
  if (res.ok) showToast('success', 'Birthday details saved');
  else showToast('error', 'Failed to save birthday details');
};

const handleGeneralDataSave = async () => {
  const res = await fetch(`/api/general-data?slug=${slug}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(generalData),
  });
  if (res.ok) showToast('success', 'Event details saved');
  else showToast('error', 'Failed to save event details');
};
```

---

### Step 8 — Merge type-specific data in the config GET

**File:** `app/api/config/route.js`

In the `GET` handler, after the existing `event_meta` merge, add:

```js
// Existing merge (already done):
const eventMeta = await db.collection('event_meta').findOne({ slug: config.slug });
config.eventType = eventMeta?.eventType || 'wedding';

// New: merge birthday-specific data
if (config.eventType === 'birthday') {
  const bdDoc = await db.collection('birthdays').findOne({ slug: config.slug });
  if (bdDoc) {
    const { _id, slug: _s, ...bdData } = bdDoc;
    config.birthdayData = bdData;
  }
}

// New: merge general-specific data
if (config.eventType === 'general') {
  const genDoc = await db.collection('general').findOne({ slug: config.slug });
  if (genDoc) {
    const { _id, slug: _s, ...genData } = genDoc;
    config.generalData = genData;
  }
}
```

Now `ClientHome` receives `config.birthdayData` or `config.generalData` alongside the rest.

---

### Step 9 — Update ClientHome to pass data to components

**File:** `app/ClientHome.jsx`

The `labels` prop is already passed everywhere. For birthday/general, extract the extra data and pass it to the components that need to display it:

```jsx
// Already exists:
const labels = getLabels(config.eventType);

// Add:
const birthdayData = config.birthdayData || null;
const generalData = config.generalData || null;
```

Pass to components where the name/title will be displayed differently:

```jsx
<Hero config={config} isOpened={hasOpened} labels={labels} birthdayData={birthdayData} generalData={generalData} />
<CoverReveal config={config} onOpen={handleOpen} labels={labels} birthdayData={birthdayData} />
<CoupleReveal config={config} onOpen={handleOpen} labels={labels} birthdayData={birthdayData} />
```

---

### Step 10 — Conditional rendering in components

**Principle:** Components should not know about event types directly — they read from `labels` and the optional `birthdayData`/`generalData` props.

**Example — Hero.jsx:**

```jsx
// For birthday, replace the couple names display with celebrant name + age
{config.eventType === 'birthday' && birthdayData?.celebrantName ? (
  <h1>{birthdayData.celebrantName} <span>is turning {birthdayData.age}!</span></h1>
) : (
  <h1>{config.couple?.groom?.firstName} & {config.couple?.bride?.firstName}</h1>
)}
```

**Example — CoverReveal.jsx:**

```jsx
<p className="font-script text-2xl md:text-3xl text-[var(--colorPrimary)] mb-6">
  {config.eventType === 'birthday' && birthdayData?.wishMessage
    ? birthdayData.wishMessage
    : labels.coverRevealTagline || "We're getting married!"}
</p>
```

**Example — General invitation body text:**

In `StorySection.jsx` Layout4/6/7, replace the story paragraphs with `generalData.customBodyText` when `eventType === 'general'`:

```jsx
<p className="font-serif text-xl italic">
  {config.eventType === 'general' && generalData?.customBodyText
    ? generalData.customBodyText
    : story?.invitationText || ''}
</p>
```

---

## 5. Database Collections Summary

```
wedding_app (MongoDB database)
│
├── settings          ← NEVER MODIFIED — all existing invitation data lives here
│                        { slug, couple, wedding, events, gallery, theme, rsvp, … }
│
├── event_meta        ← EXISTING — eventType per slug
│                        { slug, eventType: 'wedding'|'engagement'|'birthday'|'general' }
│
├── birthdays         ← NEW — birthday-specific fields per slug
│                        { slug, celebrantName, age, birthdayTheme, wishMessage, updatedAt }
│
└── general           ← NEW — general event fields per slug
                         { slug, eventTitle, hostName, customBodyText, eventType2, updatedAt }
```

No indexes are required for an early-stage app, but for production add:

```js
db.birthdays.createIndex({ slug: 1 }, { unique: true });
db.general.createIndex({ slug: 1 }, { unique: true });
```

---

## 6. File Change Checklist

| File | Change | Priority |
|---|---|---|
| `app/api/event-type/route.js` | Add `'birthday'` and `'general'` to `VALID_EVENT_TYPES` | 🔴 Required first |
| `lib/eventLabels.js` | Add `birthday` and `general` label entries | 🔴 Required first |
| `app/api/birthday-data/route.js` | **Create new file** — GET/PUT for `birthdays` collection | 🔴 New file |
| `app/api/general-data/route.js` | **Create new file** — GET/PUT for `general` collection | 🔴 New file |
| `app/api/config/route.js` | Merge `birthdayData`/`generalData` into config response | 🟠 Before frontend |
| `app/admin/page.jsx` | Add 2 new `<option>` tags + state + conditional `SectionCard` forms + load/save handlers | 🟠 Admin UI |
| `app/ClientHome.jsx` | Extract `birthdayData`/`generalData` from config, pass to components | 🟡 After APIs |
| `app/components/Hero.jsx` | Conditional name display for birthday/general | 🟡 Per component |
| `app/components/CoverReveal.jsx` | Use `birthdayData.wishMessage` if present | 🟡 Per component |
| `app/components/CoupleReveal.jsx` | Show celebrant name for birthday | 🟡 Per component |
| `app/components/StorySection.jsx` | Use `generalData.customBodyText` if present | 🟡 Per component |

### Order to implement

```
1. event-type/route.js  — unlock the new types
2. eventLabels.js       — add the label strings
3. birthday-data/route.js + general-data/route.js  — new API files
4. api/config/route.js  — merge new collection data into config response
5. admin/page.jsx       — dropdown + forms to save/load the new data
6. ClientHome.jsx       — extract and pass new data props
7. Components           — use the new labels and data props one by one
```

---

> **Key rule to always remember:** `settings` documents are never touched.  
> All new per-slug metadata (event type, birthday data, general data) is stored in its own collection and merged at API response time. Old invitations get sensible defaults and are completely unaffected.
