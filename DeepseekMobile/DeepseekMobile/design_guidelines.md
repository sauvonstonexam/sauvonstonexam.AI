# Design Guidelines: SauvonsTonExam AI

## App Overview
A React Native (Expo) mobile application with DeepSeek-inspired UI for AI-powered educational assistance, featuring token-based chat, Supabase backend, NotchPay payments, and admin management.

## Authentication & Onboarding

### Authentication Flow
**Auth Required** - User accounts with Supabase Auth
- Implement email/password authentication via Supabase
- Include swipeable welcome/mockup screens before auth (3-4 screens)
- Signup and login screens with clean, modern forms
- Post-authentication profile setup flow

### Onboarding Sequence
1. **Welcome Screens**: Swipeable mockup screens introducing the app
2. **Authentication**: Signup/Login with Supabase
3. **Profile Questions** (required before accessing app):
   - Student Profile information
   - Class selection (dropdown/picker)
   - "How did you hear about us?" (multi-option select)
4. **Paywall Screen**: Present payment options before main access
5. **Main Chat**: Entry point after setup completion

## Navigation Architecture

### Root Navigation: Stack-Only
The app uses a linear stack navigation pattern:
- Onboarding Stack → Auth Stack → Profile Setup Stack → Paywall → Main App
- Main app is a single chat screen with top navigation bar
- Settings and admin panels are modal overlays

### Screen Stack Structure
1. Welcome/Onboarding (swipeable)
2. Auth (Signup/Login)
3. Profile Setup
4. Paywall
5. Main Chat (primary screen)
6. Profile Modal
7. Settings Modal (admin-only)
8. Embedded Website Modal

## Screen Specifications

### 1. Welcome/Onboarding Screens
- **Purpose**: Introduce app features
- **Layout**: Full-screen swipeable cards
- **Components**: 3-4 screens with hero images, headlines, and pagination dots
- **Navigation**: "Next" button, "Skip" option, final screen with "Get Started" CTA

### 2. Authentication Screens
- **Purpose**: User signup and login
- **Layout**: 
  - Centered form with app logo at top
  - Email and password fields
  - Primary action button (Sign Up / Log In)
  - Toggle between signup/login modes
- **Safe Area**: Top inset = insets.top + Spacing.xl, Bottom inset = insets.bottom + Spacing.xl

### 3. Profile Setup Screens
- **Purpose**: Collect user information
- **Layout**: 
  - Scrollable form with progress indicator at top
  - Question fields with dropdowns/pickers
  - "Continue" button at bottom
- **Components**: Dropdown selectors, text inputs
- **Safe Area**: Bottom inset = insets.bottom + Spacing.xl for submit button

### 4. Paywall Screen
- **Purpose**: Present subscription options
- **Layout**:
  - Dark blue/purple gradient background
  - Rounded card container with pricing details
  - Feature comparison list
  - Two prominent action buttons
- **Components**:
  - Pricing card with features list
  - "Try for Free (10 tokens/day)" button (secondary style)
  - "Unlock Unlimited Access" button (primary style, gradient)
  - Secure payment badge icons at bottom
  - Terms/privacy links (small text)

### 5. Main Chat Screen
- **Purpose**: AI chat interface with DeepSeek-inspired design
- **Layout**:
  - **Custom Top Navigation Bar** (NOT default header):
    - Left: App logo (tappable) → opens embedded website modal
    - Center: Token counter with icon
    - Right: Canadian leaf icon → opens browser to ecolecanadienne.ca
    - Right: Profile icon → opens profile menu
    - Admin: Settings gear icon (visible only if is_admin = true)
  - **Main Content**: Scrollable chat message list
  - **Bottom**: Fixed message input bar with send button
- **Message Bubble Design**:
  - User messages: Right-aligned, primary color bubble
  - AI messages: Left-aligned, secondary color bubble with:
    - Binary images ABOVE text (full-width within bubble)
    - Text content centered and cleanly formatted
    - Favicon icon to the RIGHT of bubble (tappable → opens source URL)
    - YouTube iframe embed AT THE BOTTOM of message
  - Loading indicator while AI generates response
- **Components**: Chat bubbles, image viewers with auto-resize, YouTube WebView iframes, message input with token validation
- **Safe Area**: Top inset = 0 (custom header), Bottom inset = insets.bottom + Spacing.xl for input bar

### 6. Profile Modal
- **Purpose**: User profile management and logout
- **Layout**: Modal overlay (half-screen or full-screen modal)
- **Components**:
  - Profile information display
  - Subscription status badge
  - Logout button (destructive style)

### 7. Admin Settings Modal (Conditional)
- **Purpose**: Admin-only configuration panel
- **Visibility**: Only shown if user.is_admin = true
- **Layout**: Full-screen modal with sections:
  - (A) **Webhook Settings**:
    - Chat webhook URL (text input)
    - Headers (JSON text area)
    - Body template (JSON text area)
    - Save button
  - (B) **Payment Parameters**:
    - NotchPay Public Key (secure text input)
    - NotchPay Private Key (secure text input)
    - Test Mode toggle
    - Callback URL (text input)
    - Webhook Secret (secure text input)
  - (C) **General Parameters**:
    - Editable list of key-value credentials
    - Each credential has: name, value, send_to_chat_webhook checkbox, send_to_payment_webhook checkbox
    - Add/Edit/Delete actions
  - (D) **App Embedded Website URL**:
    - URL text input for internal iframe
- **Components**: Sectioned form with collapsible headers, text inputs, secure inputs, toggles, JSON text areas
- **Safe Area**: Standard modal insets

### 8. Embedded Website Modal
- **Purpose**: Display website in-app
- **Layout**: Full-screen modal with WebView
- **Components**: WebView iframe, close button (X) in top-right corner
- **Safe Area**: Top inset = insets.top + Spacing.sm for close button

## Design System

### Color Palette
- **Primary Theme**: Dark blue/purple gradient (DeepSeek-inspired)
  - Primary: Deep purple (#6366F1 or similar)
  - Secondary: Dark blue (#1E40AF or similar)
  - Background: Dark navy/black (#0F172A or similar)
- **Accents**:
  - Success/Active: Bright cyan or teal
  - Warning: Amber for low tokens
  - Error: Red for blocking actions
- **Chat Bubbles**:
  - User: Primary gradient (purple-blue)
  - AI: Dark gray/charcoal (#2D3748)
- **Text**:
  - Primary: White/off-white (#F8FAFC)
  - Secondary: Light gray (#94A3B8)

### Typography
- **Headers**: Bold, 18-24pt
- **Body**: Regular, 14-16pt
- **Chat Messages**: 15pt, easy to read
- **Small Text** (tokens, timestamps): 12pt, secondary color

### Visual Design
- **Icons**: Use Feather icons from @expo/vector-icons for:
  - Token counter (award or star icon)
  - Canadian leaf (custom asset or maple-leaf)
  - Profile (user icon)
  - Settings (settings/gear icon)
  - Send message (send/arrow icon)
- **Favicon Icons**: Random selection from app assets (NOT URLs) for source links
- **Shadows**: Minimal use
  - Floating input bar: shadowOffset: {width: 0, height: -2}, shadowOpacity: 0.10, shadowRadius: 8
  - Chat bubbles: No shadow, rely on background contrast
- **Rounded Corners**: 
  - Chat bubbles: 16-20px radius
  - Buttons: 12px radius
  - Cards (paywall): 20px radius
- **Images in Chat**: 
  - Display binary images above text within AI bubble
  - Auto-resize with max-width: 100% of bubble
  - Pinch-to-zoom optional
  - Rounded corners: 8px

### Component Specifications

#### Token Counter (Top Navigation)
- Position: Center or center-left of top bar
- Design: Icon + number badge
- States:
  - Normal: Default color when tokens > 20
  - Warning: Amber color when tokens ≤ 20
  - Critical: Red color when tokens = 0
- Badge should be prominent and always visible

#### Message Input Bar
- Fixed at bottom with safe area inset
- Components: Text input field + Send button
- Send button disabled when:
  - Input is empty
  - Tokens exhausted (show alert: "No tokens remaining")
- Visual feedback: Subtle shadow above, blur background behind

#### Loading Indicator
- Display while waiting for AI response
- Position: As typing indicator in chat (three animated dots)
- Color: Secondary text color

#### Payment Buttons (Paywall)
- **Free Button**: 
  - Outlined style with border
  - Text: "Try for Free (10 tokens/day)"
  - Secondary action appearance
- **Paid Button**:
  - Gradient background (primary colors)
  - Text: "Unlock Unlimited Access"
  - Primary action appearance with shine/glow effect
- Both buttons: Full-width, 50-56pt height, prominent tap feedback

#### Admin-Only Elements
- Settings icon in top navigation: ONLY visible if is_admin = true
- No admin features visible to regular users
- Admin sections clearly labeled in settings modal

## Interaction Design

### Chat Interactions
- **Sending Message**: Tap send → show loading → display AI response smoothly
- **Tapping Favicon**: Opens source URL in browser
- **Tapping Images**: Optional zoom modal or pinch-to-zoom
- **YouTube Embeds**: Inline playback within chat

### Token Depletion
- Block message sending when tokens = 0
- Show alert: "You've used all your tokens. Upgrade to continue."
- Provide link/button to paywall from alert

### Navigation Gestures
- Swipe between onboarding screens
- Pull to dismiss modals (profile, settings, embedded website)

### Visual Feedback
- All touchable elements: opacity change (0.7) on press
- Buttons: Scale animation (0.95) on press
- Links/icons: Highlight color on press

## Accessibility Requirements

- **Text Contrast**: Ensure WCAG AA compliance (4.5:1 for body text on dark backgrounds)
- **Touch Targets**: Minimum 44x44pt for all interactive elements
- **Screen Reader Support**: Label all icons and buttons with descriptive text
- **Form Fields**: Clear labels, error states with descriptive messages
- **Token Counter**: Announce remaining tokens to screen readers

## Critical Assets

1. **App Logo**: Custom logo for top navigation (transparent background)
2. **Canadian Leaf Icon**: Custom or Feather icon replacement
3. **Favicon Collection**: 5-10 diverse favicon icons for source links (education-themed)
4. **Onboarding Illustrations**: 3-4 hero images for welcome screens (AI/education themed)
5. **Secure Payment Badge**: Trust icons (lock, shield) for paywall

**Note**: All assets should match dark blue/purple theme with modern, professional aesthetic aligned with educational AI context.