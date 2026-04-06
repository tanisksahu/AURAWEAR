# Specification

## Summary
**Goal:** Build AURAWEAR, an AI-powered fashion platform MVP with a product catalog, style profiling, wardrobe optimization, trend radar, virtual try-on, and occasion-based outfit suggestions — all using rule-based simulation (no real AI/LLM).

**Planned changes:**

### Backend (Motoko)
- Product catalog data model (id, name, category, price in INR, description, sizes, colors, tags, imageUrl, stock, isTrending) with functions: `getAllProducts`, `getProductById`, `getProductsByCategory`, `searchProducts` (keyword/tag/price-range matching)
- Style Profile model per user (bodyMeasurements, stylePreferences, savedOutfits, trendAlerts) with functions: `createOrUpdateStyleProfile`, `getStyleProfile`, `saveOutfit`, `removeSavedOutfit`
- Wardrobe model per user (items with productId/name, category, color) with functions: `addWardrobeItem`, `removeWardrobeItem`, `getWardrobe`, `getWardrobeSuggestions` (gap-based recommendations + outfit groupings)
- Trend Radar model (productId, trendScore, trendTags, dateAdded) with functions: `getTrendingItems`, `getPersonalizedTrends(userId)`
- Seed data: 20+ realistic clothing products across Tops, Bottoms, Outerwear, Accessories, Footwear; price range ₹500–₹8000; 6–8 marked isTrending; diverse tags (streetwear, minimal, luxury, casual, formal)

### Frontend
- **Global theme:** Near-black background (#0A0A0A), electric gold/amber accent (#F5A623), Space Grotesk/Inter typography, glassmorphism cards, sticky dark navbar with AURAWEAR wordmark and links to all pages
- **Persistent cart:** Context-managed cart with drawer (item name, image, price, quantity controls, remove), INR total, cart icon with badge, and checkout confirmation screen
- **Homepage:** Full-viewport hero ("Meet Your AI Stylist" / "Your Style. Your Data. Your AI." / CTA), interactive AI demo preview (query input + 3 product cards), features section (Style Twin, Occasion Agent, Wardrobe Optimizer, Trend Radar, Virtual Try-On with icons/descriptions), social proof (3 testimonials + stats like "10,000+ Styles Generated")
- **AI Studio page:** Four tabs — Style Twin (measurements + preferences form, save to backend), Saved Outfits (grid with remove), AI Suggestions (personalized recommendations), Trend Alerts (personalized trending items)
- **Shop page:** "Ask AI" natural language search bar, responsive product card grid (image, name, ₹ price, category, sizes, Add to Cart), category filter sidebar, empty state
- **Wardrobe Optimizer page:** Add items by category/color, visual wardrobe grid, "Optimize My Wardrobe" button calling backend, suggested products cards, outfit combination groupings (5+)
- **Virtual Try-On page:** Static 3D avatar (React Three Fiber, rotatable), outfit display when product selected, size recommendation panel from profile measurements, simulated Returns Probability Score
- **Smart Occasion Agent page:** Free-text occasion input, keyword parsing to call `searchProducts`, display 3 Look Cards (top + bottom + footwear + accessory), INR total per look, "Add Full Look to Cart" button

**User-visible outcome:** Users can browse a styled fashion catalog, search with natural language queries, build a style profile, manage their wardrobe, explore trending items, visualize outfits on a 3D avatar, and get occasion-based outfit suggestions — all within a premium dark-gold themed interface.
