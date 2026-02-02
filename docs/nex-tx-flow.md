# Stellar Lab Transaction Flow Consolidation - Design Document

**Author**: Jeesun Kim **Date**: January 27, 2026  
**Status**: Draft  
**Target**: Q1 2026

---

## 1. Overview & Goals

### Issue Ticket

- Aristedes Ticket: [Link to internal ticketing system]

### Current Problem

Stellar Lab currently separates transaction workflows across four distinct
pages:

1. Build Transaction
2. Sign Transaction
3. Simulate Transaction (for smart contracts)
4. Submit Transaction

This multi-page approach creates friction in the user experience:

- Users must navigate between pages, losing context
- Difficulty understanding the overall transaction flow

### Proposed Solution

Consolidate all four pages into a single unified page with four distinct
sections, creating a streamlined, cohesive transaction workflow.

### Success Metrics (TODO: mention Aristedes issue)

- **Reduced time-to-submit**: Measure average time from starting a transaction
  to submission
- **Lower abandonment rate**: Track drop-off between stages
- **Improved user satisfaction**: Post-implementation feedback surveys
- **Maintained functionality**: All existing features (including URL sharing)
  continue to work

---

## 2. Scope

### Phase 1 (Q1 2026) - Core Consolidation

**In Scope:**

- Consolidate four pages into single-page, multi-section interface
- Implement Zustand persist middleware with session storage for state
  persistence
- Maintain URL sharing capability for transactions (current URL-based approach)
- Preserve backward compatibility with existing shared URLs
- Section-to-section navigation and validation
- Error handling across all sections

**Out of Scope for Phase 1:**

- Soroban authorization flow (moved to Phase 2)
- Backend short-link service for sharing

### Phase 2 (Future) - Enhanced Features

**Planned:**

- Soroban authorization support in simulate step
- When simulation returns authorization requirements, surface them to user
- UI for reviewing/approving auth entries
- Seamless integration between simulate and submit sections

---

## 3. User Experience

### Proposed Flow (1 Page, 4 Sections)

```
┌─────────────────────────────────────────┐
│  Transaction Workflow                    │
├─────────────────────────────────────────┤
│  ① Build → ② Sign → ③ Simulate → ④ Submit │
├─────────────────────────────────────────┤
│                                          │
│  [Active Section Content]                │
│                                          │
│  [Continue Button]                       │
│                                          │
└─────────────────────────────────────────┘
```

### Section Navigation Strategy (TODO: Check MK's design)

**Progressive Disclosure Approach:**

- Sections unlock sequentially as previous sections complete
- Users can navigate back to edit previous sections
- Clear visual indicators for completed/active/locked sections
- Validation occurs before proceeding to next section

**UI Components:**

- **Stepper/Progress indicator**: Shows current position in flow
- **Section headers**: Collapsible/expandable for completed sections
- **Action buttons**: "Continue", "Back", "Share Transaction"
- **Validation feedback**: Inline errors, success states

### URL Sharing Behavior

**Working State** (clean URL while user works):

```
https://lab.stellar.org/transaction
```

**Sharing State** (user clicks "Share" button):

```
https://lab.stellar.org/transaction?xdr=AAAAA...&section=sign
```

**Deep Link Behavior**:

- User receives shared URL with query parameters
- Page loads and hydrates session storage from URL params
- User lands on specified section with pre-filled data
- Can continue workflow from that point

---

## 4. Technical Design

### 4.1 Architecture Overview

**Component Structure:**

```
TransactionWorkflowPage
├── ProgressStepper
├── BuildSection
├── SignSection
├── SimulateSection
├── SubmitSection
└── ShareButton
```

**State Flow:**

```
User Input → Zustand Store (in-memory) → React Components
                    ↕ (automatic sync via persist middleware)
              Session Storage
                    ↓
        Survives page refresh within tab

When sharing:
Zustand Store → Serialize to URL params → Shareable link

When receiving shared link:
URL params → Parse → Update Zustand Store → Persist middleware auto-saves
```

### 4.2 State Management

#### Current State Management Challenge

Stellar Lab currently uses Zustand for in-memory state management. However,
Zustand alone loses all state on page refresh, which creates a poor user
experience - users lose their work if they accidentally refresh the page or
navigate away.

#### Solution: Zustand Persist with Session Storage

**Implementation**: Use Zustand's built-in `persist` middleware with session
storage as the backend.

**How it works:**

```javascript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useTransactionStore = create(
  persist(
    (set) => ({
      // Transaction data
      buildParams: {},
      unsignedXdr: null,
      signedXdr: null,
      simulationResult: null,
      submitResult: null,

      // UI state
      activeSection: 0,
      completedSections: [],

      // Actions
      setBuildParams: (params) => set({ buildParams: params }),
      setUnsignedXdr: (xdr) => set({ unsignedXdr: xdr }),
      // ... other setters
    }),
    {
      name: "transaction-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
```

**State Structure in Session Storage:**

```javascript
sessionStorage['transaction-storage']: {
  state: {
    // Transaction data
    buildParams: {...},           // Form inputs for building transaction
    unsignedXdr: "AAAAA...",      // Built transaction XDR
    signedXdr: "BBBBB...",        // Signed transaction XDR
    simulationResult: {...},      // Smart contract simulation response
    submitResult: {...},          // Submission response

    // UI state
    activeSection: 2,             // Current section (0-3)
    completedSections: [0, 1],   // Which sections are complete
  },
  version: 0  // Zustand persist version for schema migrations
}
```

**Lifecycle:**

- **Initialize**: On page load, Zustand persist automatically restores from
  session storage
- **Update**: On every state change, Zustand persist automatically saves to
  session storage
- **URL Deep Links**: Parse URL params → update Zustand store → persist
  middleware auto-saves
- **Clear**: On explicit "New Transaction" action or when user closes tab

**Benefits:**

1. **Persistence**: State survives page refreshes within the same browser tab
2. **Automatic synchronization**: No custom session storage code needed
3. **Tab-scoped**: Each browser tab maintains independent state
4. **Clean implementation**: Zustand handles all save/restore logic
5. **Rich state**: Can store complex objects, UI state, validation errors
6. **Performance**: Parse XDR once, work with JS objects in memory

#### URL Sharing Implementation

**Current Approach (Phase 1)**

For Phase 1, we'll maintain the current URL-based sharing mechanism used in
Stellar Lab today. This provides transaction sharing functionality without
requiring backend infrastructure.

**Serialization Strategy:**

- User clicks "Share Transaction" button
- Serialize current section state to URL query parameters
- Include minimum data needed to restore state:
  - Current XDR (appropriate to section)
  - Active section identifier
  - Critical build params if in build section
- Copy shareable URL to clipboard

**Example URLs:**

```
Build section:
?section=build&network=testnet&source=GABC...

Sign section:
?section=sign&xdr=AAAAA...

Simulate section:
?section=simulate&xdr=BBBBB...

Submit section:
?section=submit&xdr=BBBBB...
```

**Deep Link Handling:**

1. Parse URL query parameters on page load
2. Validate parameters
3. Update Zustand store with parsed data (persist middleware auto-saves to
   session storage)
4. Navigate to specified section
5. Mark previous sections as "completed" (if valid)

**Known Limitation:**

Very large transactions (e.g., with many operations or extensive smart contract
data) may exceed browser URL length limits (~2000 characters in some browsers).
This is a rare edge case that affects the current Stellar Lab pages as well.

**Mitigation strategies:**

- Most transactions will fit within URL limits
- Document this limitation in user-facing docs
- Consider backend short-link service in future phase (see Future Enhancements
  below)

**Backward Compatibility:**

- Existing shared URLs from old 4-page system continue to work
- Redirect old URLs to new consolidated page with appropriate query params
- Map old page routes to new section identifiers:
  - `/build` → `?section=build`
  - `/sign` → `?section=sign`
  - `/simulate` → `?section=simulate`
  - `/submit` → `?section=submit`

**Future Enhancement: Backend Short Links**

A potential future improvement would be to implement a backend service that
generates short, shareable links for transactions of any size:

```
User clicks "Share" → POST state to backend → Receive short ID → Generate link
https://lab.stellar.org/tx/abc123
```

This would:

- Eliminate URL length constraints completely
- Enable additional features (expiration, analytics, edit history)
- Require backend infrastructure and data storage

This enhancement is out of scope for Phase 1 but may be considered for Phase 2
or later based on user feedback and frequency of URL length issues.

### 4.3 Section Transitions

**Validation Requirements:**

Each section must validate before allowing progression:

**Build Section:**

- All required fields completed
- Valid account addresses
- Valid amounts/sequences
- Network selected

**Sign Section:**

- At least one signature added
- Valid signature(s) for the transaction
- XDR successfully signed

**Simulate Section:**

- Smart contract invocation successful (or skippable if not applicable)
- Simulation response received

**Submit Section:**

- Final confirmation from user
- Network connection available

**Error Handling:**

- Inline validation errors displayed immediately
- Section cannot be marked "complete" if validation fails
- User can navigate back to fix errors
- Clear error messages with actionable guidance

**Success States:**

- Visual checkmark on completed sections
- Success messages for key actions (signed, simulated, submitted)
- Transaction hash/result displayed on successful submission

### 4.4 Phase 2 Preview: Soroban Authorization (@TODO MK DESIGN + VIBE CODE)

**Integration Point:** Between Simulate and Submit sections, conditionally show
authorization step.

**Flow:**

```
Simulate → [Auth Required?] → Yes → Review/Approve Auth → Submit
                           ↓
                          No → Submit
```

**Technical Considerations:**

- Session storage will need to store auth entries
- UI for displaying required authorizations
- Mechanism to add auth to transaction envelope
- Validation that all required auths are satisfied

---

## 5. Migration & Rollout

### Deployment Strategy

**Option A: Direct Cutover (Recommended)**

- Deploy new consolidated page
- Implement redirects from old page URLs
- Single release, clean migration

**Recommendation**: Option A with careful testing and clear user communication.

### Backward Compatibility (@TODO)

**Existing Shared URLs:** All existing shared URLs must continue to work:

```
Old URL: https://lab.stellar.org/sign?xdr=AAAAA...
Redirect: https://lab.stellar.org/transaction?section=sign&xdr=AAAAA...
```

**Implementation:**

- Server-side redirects for old page routes (@TODO see if possible on nextjs;
  nice to have)
- Or client-side route mapping in new page
- Preserve all query parameters
- Add section identifier based on old route

### Testing Strategy

**Critical Test Cases:**

- Fresh transaction flow (build → sign → simulate → submit)
- Deep links to each section with valid XDR
- Navigation backward/forward between sections
- Error states in each section
- Session storage persistence across page refresh
- URL sharing functionality
- Backward compatibility with old URLs
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile responsiveness

---

## 6. Open Questions & Decisions Needed

### Navigation Behavior

**Question**: Can users skip sections or must they follow strict linear
progression? (@TODO see MK design - import xdr should enable skipping)

**Options:**

- A) Strict linear: Must complete sections in order
- B) Flexible: Can jump to any section, but validation prevents submission
- C) Hybrid: Can jump forward if previous sections complete, but can skip
  simulate

**Recommendation**: TBD - need product input

### Analytics & Tracking

**Question**: What events should we track to measure success?

**Proposed Events:**

- `transaction_flow_started`
- `section_completed` (with section name)
- `section_error` (with error type)
- `transaction_shared` (with section)
- `transaction_submitted`
- `flow_abandoned` (with last active section)

**Recommendation**: Implement comprehensive event tracking from day 1

### Smart Contract Detection

**Question**: How do we determine if simulation section should be
shown/required? (@TODO ALWAYS SHOW but after signature is tricky)

**Options:**

- A) Always show, make it optional
- B) Auto-detect smart contract invocations and show conditionally
- C) User toggles simulation on/off

**Recommendation**: TBD - depends on technical feasibility of auto-detection

### Error Recovery

**Question**: What happens if session storage is unavailable (private browsing,
disabled, or full)?

**Zustand Persist Fallback:**

Zustand's persist middleware gracefully handles session storage failures by
falling back to in-memory state only. The application continues to work, but
state won't persist across refreshes.

**Fallback Strategy:**

- Detect session storage availability on page load
- If unavailable, Zustand persist silently falls back to memory-only state
- Show warning banner to user: "Your transaction won't be saved if you refresh
  the page"
- All functionality works normally, just without persistence
- User can still share via URL

**Implementation:**

```javascript
const useTransactionStore = create(
  persist(
    (set) => ({
      /* state */
    }),
    {
      name: "transaction-storage",
      storage: createJSONStorage(() => sessionStorage),
      // Zustand handles storage failures automatically
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.warn("Failed to load from session storage:", error);
          // Show warning banner to user
        }
      },
    },
  ),
);
```

**Recommendation**: Implement warning banner for degraded experience, but don't
block usage

---

## 7. Success Criteria

### Launch Criteria (Must-Have)

- ✅ All four sections functional in single page
- ✅ Session storage implementation complete
- ✅ URL sharing works (generate and consume)
- ✅ Backward compatibility with old URLs
- ✅ All critical test cases pass
- ✅ No regressions in existing functionality
- ✅ Mobile responsive design

### Success Metrics (Post-Launch)

**Week 1:**

- No critical bugs reported
- < 5% error rate in transaction submissions
- Successful URL sharing (track share button clicks)

**Month 1:**

- 20% reduction in average time-to-submit (baseline TBD)
- 15% reduction in abandonment rate between stages
- Positive user feedback (>70% satisfaction in surveys)

**Month 3:**

- Majority of users adopt new flow
- Old page URLs fully deprecated
- Ready to begin Phase 2 (Soroban auth)

---

## 8. Timeline & Milestones

### Q1 2026 (Phase 1)

**Week 1: Design & Planning**

- Finalize design decisions (open questions)
- Create detailed mockups/wireframes
- Technical spike on session storage implementation
- Review and approve this design doc

**Week 2: Development - Core Structure**

- Implement single-page layout
- Build section component structure
- Progress stepper UI component
- Section navigation logic

**Week 2: Development - State Management**

- Implement Zustand persist middleware with session storage
- URL serialization/deserialization for sharing
- Deep link handling (URL params → Zustand store)
- Backward compatibility redirects

**Week 3: Development - Section Logic**

- Migrate build section logic
- Migrate sign section logic
- Migrate simulate section logic
- Migrate submit section logic

**Week 3: Testing & Refinement**

- Comprehensive testing (manual + automated)
- Bug fixes
- Performance optimization
- Accessibility audit

**Week 4: Launch Preparation**

- Staging environment testing
- User documentation updates
- Internal training/demos
- Phased rollout plan

**Week 5: Launch**

- Deploy to production
- Monitor metrics and errors
- Quick response to issues
- Collect user feedback

---

## 9. Dependencies & Risks

### Dependencies

- Existing transaction building/signing/submitting logic
- Current XDR parsing utilities
- Stellar SDK compatibility
- Zustand state management library (already in use)
- Zustand persist middleware (`zustand/middleware`)
- Browser session storage API support

### Risks & Mitigation

| Risk                                                                                        | Impact | Probability | Mitigation                                                                        |
| ------------------------------------------------------------------------------------------- | ------ | ----------- | --------------------------------------------------------------------------------- |
| URL length limits for very large transactions (@TODO CHECK SAMPLE SIZE WITH ALL 4 SECTIONS) | Low    | Low         | Rare edge case; document limitation; consider backend short links in future phase |
| Session storage unavailable in some browsers                                                | Medium | Low         | Implement fallback strategy (see Open Questions)                                  |
| Backward compatibility breaks existing workflows                                            | High   | Medium      | Comprehensive testing, gradual rollout                                            |
| User confusion with new interface                                                           | Medium | Medium      | Clear documentation, tutorial/onboarding                                          |
| Performance issues with large transactions                                                  | Medium | Low         | Optimize parsing, lazy loading                                                    |
| Phase 1 scope creep delays Q1 delivery                                                      | High   | Medium      | Strict scope control, push enhancements to Phase 2                                |

---

## 10. Appendix

### Related Documentation

- Stellar Lab current architecture: [Link TBD]
- Transaction XDR specification: [Link to Stellar docs]
- Session storage browser compatibility: [MDN reference]

### References

- Current Stellar Lab: https://lab.stellar.org/
- Stellar SDK Documentation: [Link]
- Smart Contract Simulation API: [Link]

### Change Log

- 2026-01-27: Initial draft created
- 2026-01-31: Clarified state management approach
  - Specified use of Zustand's persist middleware with session storage
  - Separated persistence concerns (session storage) from sharing concerns (URL
    params)
  - Documented known URL length limitation for very large transactions
  - Noted backend short-link service as future enhancement (out of scope for
    Phase 1)
- 2026-02-02: Clarification with Iveta on Session Storage

---

Length of Build, Simulate, and Submit TX
- 