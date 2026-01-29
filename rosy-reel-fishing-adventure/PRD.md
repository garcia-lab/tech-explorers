# Fishing Game PRD

A relaxing click-based fishing game where players cast their line, catch pink fish, and build their fishing business through strategic bait purchases.

**Experience Qualities**:
1. **Relaxing** - Calm, meditative gameplay with satisfying click interactions
2. **Rewarding** - Clear progression through fish collection and money accumulation  
3. **Engaging** - Strategic bait selection creates meaningful choices

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple interconnected systems (fishing, inventory, shop) with persistent state management

## Essential Features

**Fishing Mechanics**
- Functionality: Click to drop line, click again to reel in with chance to catch fish
- Purpose: Core gameplay loop that's satisfying and skill-based
- Trigger: Mouse click on fishing area
- Progression: Click → Line drops → Wait → Click → Reel in → Catch/Miss → Repeat
- Success criteria: Smooth animation, clear feedback, variable catch rates based on bait

**Fish Inventory**
- Functionality: Display caught fish count with ability to sell for money
- Purpose: Shows progress and enables economic gameplay
- Trigger: Catching fish automatically adds to inventory
- Progression: Catch fish → View in inventory → Sell for coins → Buy better bait
- Success criteria: Persistent storage, clear count display, satisfying sell action

**Bait Shop**
- Functionality: Three tiers of bait with increasing cost, size, and effectiveness
- Purpose: Strategic progression system and money sink
- Trigger: Click shop button to browse bait options
- Progression: Earn money → Browse shop → Purchase bait → Improved catch rates
- Success criteria: Clear pricing, visual bait differences, noticeable gameplay impact

**Money System**
- Functionality: Currency earned from selling fish, spent on bait
- Purpose: Economic progression that ties all systems together
- Trigger: Selling fish or buying bait
- Progression: Catch → Sell → Earn → Spend → Better equipment → More fish
- Success criteria: Balanced economy, persistent storage, clear transactions

## Edge Case Handling

**Empty States**: When no fish caught, show encouraging empty inventory message
**Insufficient Funds**: Disable expensive bait with clear pricing feedback
**Rapid Clicking**: Prevent line casting while already fishing
**Mobile Touch**: Large touch targets for comfortable mobile fishing
**No Bait Selected**: Default basic bait always available

## Design Direction
The design should feel peaceful and whimsical like a cozy fishing cabin, with soft colors and gentle animations that create a meditative atmosphere rather than frantic action.

## Color Selection
Analogous color scheme centered around calming blues and greens with pink accents for the fish.

- **Primary Color**: Deep Ocean Blue (oklch(0.45 0.15 240)) - Communicates tranquility and depth
- **Secondary Colors**: Seafoam Green (oklch(0.7 0.1 180)) for UI elements, Sandy Beige (oklch(0.8 0.05 60)) for backgrounds
- **Accent Color**: Coral Pink (oklch(0.7 0.15 20)) for fish and rewards, creating warmth and excitement
- **Foreground/Background Pairings**: 
  - Background (Deep Blue): White text (oklch(1 0 0)) - Ratio 8.2:1 ✓
  - Card (Seafoam): Deep Blue text (oklch(0.2 0.1 240)) - Ratio 7.1:1 ✓
  - Primary (Ocean Blue): White text (oklch(1 0 0)) - Ratio 6.8:1 ✓
  - Accent (Coral Pink): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓

## Font Selection
Clean, rounded sans-serif typography that feels friendly and approachable, like a casual mobile game interface.

- **Typographic Hierarchy**: 
  - H1 (Game Title): Inter Bold/32px/tight spacing
  - H2 (Section Headers): Inter SemiBold/24px/normal spacing
  - Body (UI Text): Inter Regular/16px/relaxed spacing
  - Small (Stats): Inter Medium/14px/tight spacing

## Animations
Gentle, organic animations that mimic water movement and fishing motions, creating immersion without distraction.

- **Purposeful Meaning**: Smooth line casting and fish jumping reinforce the peaceful fishing theme
- **Hierarchy of Movement**: Fishing line gets primary animation focus, UI elements use subtle hover states

## Component Selection

- **Components**: Card for inventory/shop panels, Button for actions, Badge for fish counts, Progress for fishing status
- **Customizations**: Custom fishing pond component with SVG water animation, animated fishing line with CSS transforms
- **States**: Buttons show casting/reeling states, inventory updates with catch animations, shop items show affordability
- **Icon Selection**: Fish icons for inventory, coin icons for currency, shopping bag for store access
- **Spacing**: Generous padding (p-6) for relaxed feel, consistent gaps (gap-4) between elements
- **Mobile**: Single column layout with large touch targets, condensed shop on mobile screens