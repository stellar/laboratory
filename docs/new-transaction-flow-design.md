# Stellar Lab Transaction Flow Consolidation - Design Document

**Author**: Jeesun Kim **Date**: January 27, 2026  
**Status**: Draft  
**Target**: Q1 2026

---

## 1. Overview & Goals

### Current Problem

Stellar Lab currently separates transaction workflows across four distinct
pages:

1. Build Transaction
2. Sign Transaction
3. Simulate Transaction (for smart contracts)
4. Submit Transaction

This multi-page approach creates friction in the user experience:

- Users must navigate between pages, losing context
- Increased cognitive load tracking progress across pages
- Higher abandonment rates due to navigation overhead
- Difficulty understanding the overall transaction flow

### Proposed Solution

Consolidate all four pages into a single unified page with four distinct
sections, creating a streamlined, cohesive transaction workflow.

### Success Metrics

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
- Implement session storage for state management
- Maintain URL sharing capability for transactions
- Preserve backward compatibility with existing shared URLs
- Section-to-section navigation and validation
- Error handling across all sections

**Out of Scope for Phase 1:**

- Soroban authorization flow (moved to Phase 2)
- Major UI redesign beyond consolidation
- Changes to underlying transaction/signing logic

### Phase 2 (Future) - Enhanced Features

**Planned:**

- Soroban authorization support in simulate step
- When simulation returns authorization requirements, surface them to user
- UI for reviewing/approving auth entries
- Seamless integration between simulate and submit sections

---

## 3. User Experience

### Current Flow (4 Pages)

```
[Build Transaction Page]
    ↓ (navigate)
[Sign Transaction Page]
    ↓ (navigate)
[Simulate Transaction Page]
    ↓ (navigate)
[Submit Transaction Page]
```

**Pain points:**

- Context switching between pages
- Manual navigation required
- URL state management across pages
- No clear progress indication

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

### Section Navigation Strategy

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
User Input → Session Storage → Section Components
                    ↓
            Serialize on Share
                    ↓
               URL Params
```

### 4.2 State Management

#### Problem Statement

Consolidating four pages into one would result in excessively long URLs
containing multiple XDR strings (build params, unsigned XDR, signed XDR,
simulation results). This hits browser URL length limits and creates poor UX.
We've experienced similar issues on other Stellar Lab pages.

#### Session Storage Strategy

**What Gets Stored:**

```javascript
sessionStorage: {
  // Transaction data
  buildParams: {...},           // Form inputs for building transaction
  unsignedXdr: "AAAAA...",      // Built transaction XDR
  signedXdr: "BBBBB...",        // Signed transaction XDR
  simulationResult: {...},      // Smart contract simulation response
  submitResult: {...},          // Submission response

  // UI state
  activeSection: 2,             // Current section (0-3)
  completedSections: [0, 1],   // Which sections are complete

  // Metadata
  timestamp: 1234567890,        // For expiry handling
  version: "1.0"                // Schema version for migrations
}
```

**Lifecycle:**

- **Initialize**: On page load, check for URL params → hydrate session storage
- **Update**: On section completion, persist relevant data
- **Clear**: On page unload, or explicit "New Transaction" action
- **Timeout**: Consider auto-clear after inactivity (TBD)

**Session Storage Benefits:**

1. **Performance**: Parse XDR once, work with JS objects
2. **Clean URLs**: No massive query strings during work-in-progress
3. **Rich state**: Store UI state not suitable for URLs (validation errors,
   intermediate results)
4. **Complex data**: Handle large simulation results without URL bloat

#### URL Sharing Implementation

**Serialization Strategy:**

- User clicks "Share Transaction" button
- Serialize current section state to URL query parameters
- Include minimum data needed to restore state:
  - Current XDR (appropriate to section)
  - Active section identifier
  - Critical build params if in build section

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
3. Hydrate session storage with parsed data
4. Navigate to specified section
5. Mark previous sections as "completed" (if valid)

**Backward Compatibility:**

- Existing shared URLs from old 4-page system continue to work
- Redirect old URLs to new consolidated page with appropriate query params
- Map old page routes to new section identifiers:
  - `/build` → `?section=build`
  - `/sign` → `?section=sign`
  - `/simulate` → `?section=simulate`
  - `/submit` → `?section=submit`

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

### 4.4 Phase 2 Preview: Soroban Authorization

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

_(Detailed design to be completed in Phase 2 planning)_

---

## 5. Migration & Rollout

### Deployment Strategy

**Option A: Direct Cutover (Recommended)**

- Deploy new consolidated page
- Implement redirects from old page URLs
- Single release, clean migration

**Option B: Gradual Rollout**

- Run both old and new flows simultaneously
- Feature flag to toggle between experiences
- Collect feedback before full migration
- More complex, requires maintaining two codebases

**Recommendation**: Option A with careful testing and clear user communication.

### Backward Compatibility

**Existing Shared URLs:** All existing shared URLs must continue to work:

```
Old URL: https://lab.stellar.org/sign?xdr=AAAAA...
Redirect: https://lab.stellar.org/transaction?section=sign&xdr=AAAAA...
```

**Implementation:**

- Server-side redirects for old page routes
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
progression?

**Options:**

- A) Strict linear: Must complete sections in order
- B) Flexible: Can jump to any section, but validation prevents submission
- C) Hybrid: Can jump forward if previous sections complete, but can skip
  simulate

**Recommendation**: TBD - need product input

### Session Storage Timeout

**Question**: Should session storage auto-clear after inactivity? If so, what
timeout?

**Considerations:**

- User leaves tab open overnight
- User switches to research/documentation
- Balance between data persistence and privacy/memory

**Recommendation**: TBD - gather user feedback

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
shown/required?

**Options:**

- A) Always show, make it optional
- B) Auto-detect smart contract invocations and show conditionally
- C) User toggles simulation on/off

**Recommendation**: TBD - depends on technical feasibility of auto-detection

### Error Recovery

**Question**: What happens if session storage is unavailable (private browsing,
disabled)?

**Fallback Strategy:**

- Detect session storage availability on page load
- Fall back to in-memory state (lost on refresh)
- Show warning to user about limitations
- Or: Block usage and show error message

**Recommendation**: TBD

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

**Week 1-2: Design & Planning**

- Finalize design decisions (open questions)
- Create detailed mockups/wireframes
- Technical spike on session storage implementation
- Review and approve this design doc

**Week 3-4: Development - Core Structure**

- Implement single-page layout
- Build section component structure
- Progress stepper UI component
- Section navigation logic

**Week 5-6: Development - State Management**

- Session storage implementation
- URL serialization/deserialization
- Deep link handling
- Backward compatibility redirects

**Week 7-8: Development - Section Logic**

- Migrate build section logic
- Migrate sign section logic
- Migrate simulate section logic
- Migrate submit section logic

**Week 9-10: Testing & Refinement**

- Comprehensive testing (manual + automated)
- Bug fixes
- Performance optimization
- Accessibility audit

**Week 11-12: Launch Preparation**

- Staging environment testing
- User documentation updates
- Internal training/demos
- Phased rollout plan

**Week 13: Launch**

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
- Browser session storage API support

### Risks & Mitigation

| Risk                                             | Impact | Probability | Mitigation                                         |
| ------------------------------------------------ | ------ | ----------- | -------------------------------------------------- |
| Browser URL length limits still hit              | High   | Low         | Implement smart truncation, compress data          |
| Session storage unavailable in some browsers     | Medium | Low         | Implement fallback strategy                        |
| Backward compatibility breaks existing workflows | High   | Medium      | Comprehensive testing, gradual rollout             |
| User confusion with new interface                | Medium | Medium      | Clear documentation, tutorial/onboarding           |
| Performance issues with large transactions       | Medium | Low         | Optimize parsing, lazy loading                     |
| Phase 1 scope creep delays Q1 delivery           | High   | Medium      | Strict scope control, push enhancements to Phase 2 |

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
- [Future updates to be logged here]

---

## Sign-off

**Product**: **\*\*\*\***\_**\*\*\*\*** Date: **\_\_\_**  
**Engineering Lead**: **\*\*\*\***\_**\*\*\*\*** Date: **\_\_\_**  
**Design**: **\*\*\*\***\_**\*\*\*\*** Date: **\_\_\_**  
**QA**: **\*\*\*\***\_**\*\*\*\*** Date: **\_\_\_**
