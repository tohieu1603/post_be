import mongoose, { Schema, Document, Types } from 'mongoose';
import {
  ContentBlock,
  markdownToBlocks,
  extractTocFromBlocks,
  countWordsInBlocks,
  estimateReadingTimeFromBlocks,
} from '../utils/content-blocks.util';

// === Content Structure Types ===
export interface TocItem {
  id: string;
  text: string;
  level: number; // 2-6
  anchor: string;
}

export interface ImageBlock {
  url: string;
  alt: string;
  caption?: string;
  // SEO & Link
  link?: string;          // Backlink - wrap image in <a>
  title?: string;         // Title attribute for tooltip
  // Responsive
  width?: number;
  height?: number;
  srcset?: string;        // srcset for responsive images
  sizes?: string;         // sizes attribute
  // Performance
  loading?: 'lazy' | 'eager';
  // Source info
  source?: string;        // Credit/source của ảnh
  sourceUrl?: string;     // Link tới nguồn gốc
}

export interface ReviewBlock {
  provider: string;
  rating: number; // 0-5
  summary?: string;
  pros: string[];
  cons: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TableBlock {
  headers: string[];
  rows: string[][];
}

export interface ListBlock {
  type: 'ordered' | 'unordered';
  items: string[];
}

export interface LinkBlock {
  url: string;
  text: string;
  target?: '_blank' | '_self';
  rel?: string;              // nofollow, sponsored, ugc
  style?: 'inline' | 'button' | 'card';
}

export interface EmbedBlock {
  url: string;
  provider?: string;         // youtube, twitter, tiktok, facebook, codepen, etc.
  html?: string;             // raw embed HTML
  width?: number;
  height?: number;
  caption?: string;
}

export interface VideoBlock {
  url: string;
  poster?: string;           // thumbnail
  caption?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  muted?: boolean;
}

export interface AudioBlock {
  url: string;
  title?: string;
  caption?: string;
  duration?: number;         // seconds
}

export interface CalloutBlock {
  type: 'info' | 'warning' | 'error' | 'success' | 'tip' | 'note';
  title?: string;
  content: string;
}

export interface ButtonBlock {
  text: string;
  url: string;
  style?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  target?: '_blank' | '_self';
  icon?: string;
}

export interface AccordionItem {
  title: string;
  content: string;
}

export interface AccordionBlock {
  items: AccordionItem[];
}

export interface FileBlock {
  url: string;
  filename: string;
  size?: number;             // bytes
  mimeType?: string;
}

export interface GalleryBlock {
  images: ImageBlock[];
  layout?: 'grid' | 'masonry' | 'slider' | 'carousel';
  columns?: number;
}

export interface MapBlock {
  lat: number;
  lng: number;
  zoom?: number;
  caption?: string;
  embedUrl?: string;         // Google Maps embed URL
}

export interface SocialBlock {
  platform: 'twitter' | 'facebook' | 'instagram' | 'tiktok' | 'linkedin' | 'youtube';
  postId: string;
  url: string;
  html?: string;
}

// === NEW ADVANCED BLOCKS ===

export interface TimelineItem {
  date: string;
  title: string;
  content: string;
  icon?: string;
  color?: string;
}

export interface TimelineBlock {
  items: TimelineItem[];
  layout?: 'vertical' | 'horizontal';
}

export interface StepItem {
  title: string;
  content: string;
  icon?: string;
}

export interface StepsBlock {
  items: StepItem[];
  layout?: 'vertical' | 'horizontal' | 'numbered';
}

export interface TabItem {
  label: string;
  content: string;
  icon?: string;
}

export interface TabsBlock {
  items: TabItem[];
  style?: 'default' | 'pills' | 'underline';
}

export interface ComparisonColumn {
  title: string;
  image?: string;
  features: Record<string, string>;  // feature name → value
  price?: string;
  cta?: { text: string; url: string };
  highlighted?: boolean;
}

export interface ComparisonBlock {
  columns: ComparisonColumn[];
  features: string[];               // ordered feature list
}

export interface PricingTier {
  name: string;
  price: string;
  period?: string;                  // /tháng, /năm
  description?: string;
  features: string[];
  cta: { text: string; url: string };
  highlighted?: boolean;
  badge?: string;                   // "Popular", "Best value"
}

export interface PricingBlock {
  tiers: PricingTier[];
}

export interface TestimonialBlock {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating?: number;                  // 1-5
}

export interface StatItem {
  value: string;                    // "500+", "99.9%", "$2.8B"
  label: string;
  icon?: string;
  color?: string;
}

export interface StatsBlock {
  items: StatItem[];
  layout?: 'row' | 'grid';
  columns?: number;
}

export interface ProfileBlock {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  social?: { platform: string; url: string }[];
}

export interface TeamBlock {
  members: ProfileBlock[];
  layout?: 'grid' | 'list';
  columns?: number;
}

export interface ProgressItem {
  label: string;
  value: number;                    // 0-100
  color?: string;
}

export interface ProgressBlock {
  items: ProgressItem[];
  showValue?: boolean;
}

export interface ColumnsBlock {
  columns: { content: string; width?: number }[];
  gap?: number;
}

export interface AlertBlock {
  type: 'info' | 'warning' | 'error' | 'success' | 'announcement';
  title?: string;
  content: string;
  dismissible?: boolean;
  icon?: string;
  cta?: { text: string; url: string };
}

export interface BookmarkBlock {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

export interface ToggleBlock {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

export interface CountdownBlock {
  targetDate: string;               // ISO date
  title?: string;
  expiredText?: string;
}

export interface BadgeGroupBlock {
  badges: { text: string; color?: string; icon?: string; url?: string }[];
}

export interface SeparatorBlock {
  style?: 'solid' | 'dashed' | 'dotted' | 'gradient' | 'icon';
  icon?: string;
  text?: string;                    // centered text on separator
}

export interface TocBlock {
  title?: string;
  maxLevel?: number;
}

// === CONTENT & MEDIA BLOCKS ===

export interface CarouselItem {
  type: 'image' | 'card' | 'text';
  image?: string;
  title?: string;
  content?: string;
  cta?: { text: string; url: string };
}

export interface CarouselBlock {
  items: CarouselItem[];
  autoplay?: boolean;
  interval?: number;                // ms
  showDots?: boolean;
  showArrows?: boolean;
}

export interface BeforeAfterBlock {
  before: { image: string; label?: string };
  after: { image: string; label?: string };
  orientation?: 'horizontal' | 'vertical';
}

export interface HotspotPoint {
  x: number;                        // % from left
  y: number;                        // % from top
  label: string;
  content: string;
}

export interface HotspotBlock {
  image: string;
  alt?: string;
  points: HotspotPoint[];
}

export interface LottieBlock {
  src: string;                      // .json or URL
  loop?: boolean;
  autoplay?: boolean;
  width?: number;
  height?: number;
  caption?: string;
}

export interface PdfBlock {
  url: string;
  title?: string;
  pages?: string;                   // "1-5" or "all"
  height?: number;
}

export interface Model3DBlock {
  url: string;                      // .glb, .gltf
  poster?: string;
  alt?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
}

// === INTERACTIVE BLOCKS ===

export interface PollOption {
  text: string;
  votes?: number;
}

export interface PollBlock {
  question: string;
  options: PollOption[];
  multiSelect?: boolean;
  showResults?: boolean;
  endDate?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizBlock {
  title?: string;
  questions: QuizQuestion[];
  showScore?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio';
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export interface FormBlock {
  title?: string;
  fields: FormField[];
  submitText?: string;
  submitUrl?: string;               // API endpoint
  successMessage?: string;
}

export interface CalculatorField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'slider';
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: number }[];
  defaultValue?: number;
}

export interface CalculatorBlock {
  title?: string;
  fields: CalculatorField[];
  formula: string;                  // e.g. "price * quantity * (1 - discount/100)"
  resultLabel?: string;
  resultPrefix?: string;            // "$", "₫"
  resultSuffix?: string;
}

export interface RatingBlock {
  label?: string;
  maxStars?: number;                // default 5
  allowHalf?: boolean;
  defaultValue?: number;
}

export interface ReactionBlock {
  reactions: { emoji: string; label?: string; count?: number }[];
}

// === DATA & VISUALIZATION ===

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface ChartBlock {
  type: 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'area';
  title?: string;
  labels: string[];
  datasets: ChartDataset[];
  showLegend?: boolean;
  height?: number;
}

export interface KanbanColumn {
  title: string;
  items: { title: string; description?: string; color?: string }[];
}

export interface KanbanBlock {
  columns: KanbanColumn[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: { type: 'added' | 'changed' | 'fixed' | 'removed' | 'security'; text: string }[];
}

export interface ChangelogBlock {
  entries: ChangelogEntry[];
}

export interface ApiResponseBlock {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url?: string;
  statusCode?: number;
  body: string;                     // JSON string
  language?: string;
}

// === COMMERCE BLOCKS ===

export interface ProductCardBlock {
  name: string;
  image?: string;
  price: string;
  originalPrice?: string;           // strikethrough
  rating?: number;
  badge?: string;                   // "Sale", "New"
  description?: string;
  cta: { text: string; url: string };
}

export interface CouponBlock {
  code: string;
  description?: string;
  discount?: string;                // "20%", "$50"
  expiresAt?: string;
  backgroundColor?: string;
}

export interface AffiliateBlock {
  title: string;
  image?: string;
  description?: string;
  price?: string;
  url: string;
  platform?: string;                // Amazon, Shopee, Lazada
  disclosure?: string;              // "Affiliate link"
}

// === LAYOUT BLOCKS ===

export interface HeroBlock {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  cta?: { text: string; url: string; style?: string };
  secondaryCta?: { text: string; url: string };
  align?: 'left' | 'center' | 'right';
  height?: string;                  // "50vh", "400px"
  overlay?: number;                 // opacity 0-1
}

export interface BannerBlock {
  image?: string;
  title?: string;
  content?: string;
  url?: string;
  backgroundColor?: string;
  textColor?: string;
  position?: 'top' | 'inline' | 'sticky';
  closable?: boolean;
}

export interface SpacerBlock {
  height: number;                   // px
}

export interface ContainerBlock {
  content: string;                  // HTML content inside
  backgroundColor?: string;
  borderColor?: string;
  borderRadius?: number;
  padding?: number;
  maxWidth?: string;
}

export type ContentBlockType =
  | 'heading' | 'paragraph' | 'image' | 'review' | 'faq' | 'table' | 'list'
  | 'quote' | 'code' | 'html'
  | 'link' | 'embed' | 'video' | 'audio'
  | 'callout' | 'button' | 'accordion' | 'divider'
  | 'file' | 'gallery' | 'map' | 'social'
  // advanced layout
  | 'timeline' | 'steps' | 'tabs' | 'columns'
  // commerce & comparison
  | 'comparison' | 'pricing' | 'product-card' | 'coupon' | 'affiliate'
  // social proof
  | 'testimonial' | 'stats' | 'team' | 'progress'
  // utility
  | 'alert' | 'bookmark' | 'toggle' | 'countdown' | 'badges' | 'separator' | 'toc'
  // content & media
  | 'carousel' | 'before-after' | 'hotspot' | 'lottie' | 'pdf' | '3d-model'
  // interactive
  | 'poll' | 'quiz' | 'form' | 'calculator' | 'rating' | 'reaction'
  // data & visualization
  | 'chart' | 'kanban' | 'changelog' | 'api-response'
  // layout
  | 'hero' | 'banner' | 'spacer' | 'container';

// === FULL CUSTOM BLOCK STYLING — VIP PRO ===

export interface BlockSpacing {
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number | 'auto';
  marginRight?: number | 'auto';
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

export interface BlockBackground {
  type?: 'color' | 'gradient' | 'image' | 'video' | 'pattern';
  color?: string;
  gradient?: string;                // "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  image?: string;                   // URL
  imageSize?: 'cover' | 'contain' | 'auto' | string;
  imagePosition?: string;           // "center", "top left"
  imageRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  imageFixed?: boolean;             // parallax effect
  videoUrl?: string;
  videoLoop?: boolean;
  pattern?: 'dots' | 'lines' | 'grid' | 'zigzag' | 'waves' | 'noise';
  patternColor?: string;
  patternOpacity?: number;          // 0-1
  overlay?: string;                 // "rgba(0,0,0,0.5)"
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';
}

export interface BlockBorder {
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'none';
  color?: string;
  radius?: number | string;         // 8 or "8px 16px 8px 16px" or "50%"
  // individual sides
  top?: { width?: number; style?: string; color?: string };
  right?: { width?: number; style?: string; color?: string };
  bottom?: { width?: number; style?: string; color?: string };
  left?: { width?: number; style?: string; color?: string };
}

export interface BlockShadow {
  preset?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner' | 'glow';
  custom?: string;                  // "0 4px 6px rgba(0,0,0,0.1)"
  color?: string;
  glowColor?: string;               // neon glow effect
}

export interface BlockTypography {
  fontFamily?: string;              // "Inter", "Playfair Display", "monospace"
  fontSize?: number | string;       // 16 or "1.25rem" or "clamp(1rem, 2vw, 2rem)"
  fontWeight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  fontStyle?: 'normal' | 'italic';
  lineHeight?: number | string;     // 1.5 or "1.75"
  letterSpacing?: number | string;  // 0.5 or "0.05em"
  wordSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
  textShadow?: string;              // "2px 2px 4px rgba(0,0,0,0.5)"
  color?: string;
  // gradient text
  gradientText?: string;            // "linear-gradient(90deg, #ff6b6b, #feca57)"
  // truncate
  maxLines?: number;                // line-clamp
  // columns
  textColumns?: number;
  columnGap?: string;
}

export interface BlockLayout {
  display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-flex' | 'inline-grid' | 'none';
  // flex
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number | string;
  // grid
  gridCols?: number | string;       // 3 or "1fr 2fr 1fr"
  gridRows?: string;
  gridGap?: string;
  // size
  width?: string;                   // "100%", "800px", "50vw"
  maxWidth?: string;
  minWidth?: string;
  height?: string;
  maxHeight?: string;
  minHeight?: string;
  // overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  // position
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: number;
  // float
  float?: 'none' | 'left' | 'right';
}

export interface BlockAnimation {
  // entrance animation
  entrance?: 'none' | 'fade-in' | 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right'
    | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right'
    | 'zoom-in' | 'zoom-out' | 'flip-x' | 'flip-y'
    | 'bounce' | 'rotate' | 'swing' | 'rubber-band'
    | 'blur-in' | 'scale-up' | 'scale-down'
    | 'typewriter' | 'reveal-left' | 'reveal-right';
  entranceDuration?: number;        // ms
  entranceDelay?: number;           // ms
  entranceEasing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring' | 'bounce';
  // loop animation
  loop?: 'none' | 'pulse' | 'float' | 'shake' | 'spin' | 'ping' | 'wiggle' | 'breathe' | 'glow' | 'rainbow';
  loopDuration?: number;
  // scroll animation
  scrollTrigger?: boolean;          // trigger on scroll into view
  scrollParallax?: number;          // parallax speed factor
  scrollProgress?: boolean;         // animate based on scroll position
  // hover animation
  hoverEffect?: 'none' | 'lift' | 'grow' | 'shrink' | 'glow' | 'shadow' | 'tilt-3d' | 'blur-bg' | 'color-shift' | 'underline-grow' | 'border-draw';
  hoverScale?: number;              // 1.05
  hoverRotate?: number;             // degrees
  hoverBrightness?: number;         // 1.1
  // transition
  transitionDuration?: number;      // ms
  transitionEasing?: string;
  // click animation
  clickEffect?: 'none' | 'ripple' | 'shrink' | 'pulse';
}

export interface BlockTransform {
  rotate?: number;                  // degrees
  rotateX?: number;
  rotateY?: number;
  scale?: number;                   // 1 = normal
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;
  translateX?: string;              // "10px", "5%"
  translateY?: string;
  perspective?: string;             // "1000px" for 3D
  transformOrigin?: string;         // "center", "top left"
}

export interface BlockFilter {
  blur?: number;                    // px
  brightness?: number;              // 1 = normal
  contrast?: number;
  grayscale?: number;               // 0-1
  sepia?: number;                   // 0-1
  saturate?: number;                // 1 = normal
  hueRotate?: number;               // degrees
  invert?: number;                  // 0-1
  opacity?: number;                 // 0-1
  dropShadow?: string;              // "4px 4px 8px rgba(0,0,0,0.3)"
  // backdrop filters (glass effect)
  backdropBlur?: number;
  backdropBrightness?: number;
  backdropSaturate?: number;
}

export interface BlockImage {
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;          // "center", "top", "50% 25%"
  aspectRatio?: string;             // "16/9", "4/3", "1/1"
  mask?: 'none' | 'circle' | 'rounded' | 'hexagon' | 'diamond' | 'blob' | 'wave';
  hoverZoom?: boolean;
  hoverZoomScale?: number;          // 1.1
  kenBurns?: boolean;               // slow zoom effect
  grayscaleToColor?: boolean;       // grayscale → color on hover
  clipPath?: string;                // "polygon(...)", "circle(...)"
}

export interface BlockResponsive {
  hideOnMobile?: boolean;           // < 640px
  hideOnTablet?: boolean;           // 640-1024px
  hideOnDesktop?: boolean;          // > 1024px
  // mobile overrides
  mobileTextAlign?: 'left' | 'center' | 'right';
  mobileFontSize?: string;
  mobileFlexDirection?: 'row' | 'column';
  mobileGridCols?: number;
  mobilePadding?: string;
  mobileMargin?: string;
  mobileOrder?: number;             // flex order
  // tablet overrides
  tabletGridCols?: number;
  tabletFlexDirection?: 'row' | 'column';
}

export interface BlockInteraction {
  cursor?: 'default' | 'pointer' | 'grab' | 'crosshair' | 'text' | 'not-allowed' | 'zoom-in';
  pointerEvents?: 'auto' | 'none';
  userSelect?: 'auto' | 'none' | 'text' | 'all';
  // tooltip
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  // click action
  onClick?: 'none' | 'link' | 'modal' | 'scroll-to' | 'copy' | 'toggle';
  onClickValue?: string;            // URL, element ID, text to copy
  // accessibility
  ariaLabel?: string;
  ariaRole?: string;
  tabIndex?: number;
}

export interface BlockCondition {
  showIf?: string;                  // condition expression
  hideIf?: string;
  scheduleStart?: string;           // ISO date — show after
  scheduleEnd?: string;             // ISO date — hide after
  geoTarget?: string[];             // country codes ["VN", "US"]
  deviceTarget?: ('mobile' | 'tablet' | 'desktop')[];
  abTest?: { variant: string; percentage: number };
}

// Combined style interface
export interface BlockStyle {
  spacing?: BlockSpacing;
  background?: BlockBackground;
  border?: BlockBorder;
  shadow?: BlockShadow;
  typography?: BlockTypography;
  layout?: BlockLayout;
  animation?: BlockAnimation;
  transform?: BlockTransform;
  filter?: BlockFilter;
  imageStyle?: BlockImage;
  responsive?: BlockResponsive;
  interaction?: BlockInteraction;
  condition?: BlockCondition;
  // quick shortcuts (backwards compatible)
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  // raw overrides
  className?: string;
  cssOverride?: string;
  tailwindClasses?: string;         // "bg-gradient-to-r from-purple-500 to-pink-500"
}

export interface ContentSection {
  id: string;
  type: ContentBlockType;
  order: number;
  // custom styling per block
  style?: BlockStyle;
  // heading
  level?: number;
  text?: string;
  anchor?: string;
  // paragraph, quote, code, html
  content?: string;
  language?: string;
  // media
  image?: ImageBlock;
  video?: VideoBlock;
  audio?: AudioBlock;
  gallery?: GalleryBlock;
  // structured
  review?: ReviewBlock;
  faqs?: FaqItem[];
  table?: TableBlock;
  list?: ListBlock;
  accordion?: AccordionBlock;
  // interactive
  link?: LinkBlock;
  embed?: EmbedBlock;
  button?: ButtonBlock;
  callout?: CalloutBlock;
  file?: FileBlock;
  map?: MapBlock;
  social?: SocialBlock;
  // advanced layout
  timeline?: TimelineBlock;
  steps?: StepsBlock;
  tabs?: TabsBlock;
  columns?: ColumnsBlock;
  // commerce & comparison
  comparison?: ComparisonBlock;
  pricing?: PricingBlock;
  // social proof
  testimonial?: TestimonialBlock;
  stats?: StatsBlock;
  team?: TeamBlock;
  progressBar?: ProgressBlock;
  // utility
  alert?: AlertBlock;
  bookmark?: BookmarkBlock;
  toggle?: ToggleBlock;
  countdown?: CountdownBlock;
  badgeGroup?: BadgeGroupBlock;
  separator?: SeparatorBlock;
  tocConfig?: TocBlock;
  // content & media
  carousel?: CarouselBlock;
  beforeAfter?: BeforeAfterBlock;
  hotspot?: HotspotBlock;
  lottie?: LottieBlock;
  pdf?: PdfBlock;
  model3d?: Model3DBlock;
  // interactive
  poll?: PollBlock;
  quiz?: QuizBlock;
  form?: FormBlock;
  calculator?: CalculatorBlock;
  ratingConfig?: RatingBlock;
  reaction?: ReactionBlock;
  // data & visualization
  chart?: ChartBlock;
  kanban?: KanbanBlock;
  changelog?: ChangelogBlock;
  apiResponse?: ApiResponseBlock;
  // commerce
  productCard?: ProductCardBlock;
  coupon?: CouponBlock;
  affiliate?: AffiliateBlock;
  // layout
  hero?: HeroBlock;
  banner?: BannerBlock;
  spacer?: SpacerBlock;
  container?: ContainerBlock;
  // quote extras
  cite?: string;
  citeUrl?: string;
  // generic
  url?: string;
  alt?: string;
  caption?: string;
}

export interface ContentStructure {
  toc: TocItem[];
  wordCount: number;
  readingTime: number;
}

export type PostStatus = 'draft' | 'published' | 'archived';
export type ArticleType = 'news' | 'opinion' | 'analysis' | 'factcheck' | 'liveblog' | 'explainer' | 'comparison';

export interface ArticleSource {
  name: string;
  url: string;
}

export interface ArticleEntity {
  name: string;
  type: string;
  wikidataId?: string;
}

export interface ArticleClaim {
  claim: string;
  rating: number;
  source?: string;
}

export interface LiveBlogUpdate {
  headline: string;
  body: string;
  time: string;
}

export interface ArticleExtras {
  entities?: ArticleEntity[];
  claims?: ArticleClaim[];
  liveblogUpdates?: LiveBlogUpdate[];
}

export interface IPost extends Document {
  _id: Types.ObjectId;
  // CMS Integration
  externalId: string | null;         // ID from external CMS for webhook sync
  articleType: ArticleType;          // news | opinion | analysis | factcheck | liveblog | explainer
  language: string;                  // vi | en
  // Basic Fields
  title: string;
  subtitle: string | null;  // Tiêu đề phụ
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  // Image Metadata (SEO)
  imageAlt: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  imageCaption: string | null;
  // Category
  categoryId: Types.ObjectId;
  category?: { _id: Types.ObjectId; name: string; slug: string } | null; // populated virtual
  // Status & Publishing
  status: PostStatus;
  publishedAt: Date | null;
  viewCount: number;
  // Author & Tags
  author: string | null;           // Legacy: author name string
  authorId: Types.ObjectId | null; // New: reference to Author model
  tags: string[] | null;
  tagsRelation: Types.ObjectId[];
  // SEO - Basic Meta
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;
  // SEO - Open Graph
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  // SEO - Twitter Card
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  // SEO - Advanced
  robots: string | null;          // index,follow | noindex,follow | etc.
  newsKeywords: string | null;    // Google News keywords (deprecated but still used)
  isEvergreen: boolean;           // Bài không có tính thời sự
  // Advanced Options
  isFeatured: boolean;
  allowComments: boolean;
  readingTime: number | null;
  template: string | null;
  customFields: Record<string, any> | null;
  // Trending & Social
  isTrending: boolean;            // Đánh dấu bài trending (thủ công hoặc tự động)
  trendingRank: number | null;    // Thứ hạng trending (1-10, null nếu không trending)
  trendingAt: Date | null;        // Thời điểm vào trending
  shareCount: number;             // Tổng số lượt share
  likeCount: number;              // Tổng số lượt like
  commentCount: number;           // Tổng số comment
  // Content Structure - Auto-generated from content
  contentStructure: ContentStructure | null;
  // Content Blocks - Block-based JSON content (Notion-style)
  contentBlocks: ContentBlock[] | null;
  // FAQ - Separate field for easy access
  faq: FaqItem[] | null;
  // Webhook/CMS fields
  isBreaking: boolean;               // Tin nóng → ưu tiên index
  translationOf: Types.ObjectId | null; // Ref to original post (for i18n)
  relatedIds: string[];              // External IDs of related articles
  sources: ArticleSource[];          // Citation sources [{name, url}]
  extras: ArticleExtras | null;      // entities, claims, liveblog_updates
  wordCount: number | null;          // Word count from CMS
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    // CMS Integration
    externalId: { type: String, maxlength: 255 },
    articleType: { type: String, enum: ['news', 'opinion', 'analysis', 'factcheck', 'liveblog', 'explainer', 'comparison'], default: 'news' },
    language: { type: String, default: 'vi', maxlength: 10 },
    // Basic Fields
    title: { type: String, required: true, maxlength: 500 },
    subtitle: { type: String, default: null, maxlength: 500 },
    slug: { type: String, required: true, unique: true, maxlength: 500 },
    excerpt: { type: String, default: null },
    content: { type: String, required: true },
    coverImage: { type: String, default: null, maxlength: 1000 },
    // Image Metadata (SEO)
    imageAlt: { type: String, default: null, maxlength: 500 },
    imageWidth: { type: Number, default: null },
    imageHeight: { type: Number, default: null },
    imageCaption: { type: String, default: null, maxlength: 500 },
    // Category
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    // Status & Publishing
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    publishedAt: { type: Date, default: null },
    viewCount: { type: Number, default: 0 },
    // Author & Tags
    author: { type: String, default: null, maxlength: 255 },
    authorId: { type: Schema.Types.ObjectId, ref: 'Author', default: null },
    tags: [{ type: String }],
    tagsRelation: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    // SEO - Basic Meta
    metaTitle: { type: String, default: null, maxlength: 255 },
    metaDescription: { type: String, default: null, maxlength: 500 },
    metaKeywords: { type: String, default: null, maxlength: 500 },
    canonicalUrl: { type: String, default: null, maxlength: 1000 },
    // SEO - Open Graph
    ogTitle: { type: String, default: null, maxlength: 255 },
    ogDescription: { type: String, default: null, maxlength: 500 },
    ogImage: { type: String, default: null, maxlength: 1000 },
    // SEO - Twitter Card
    twitterTitle: { type: String, default: null, maxlength: 255 },
    twitterDescription: { type: String, default: null, maxlength: 500 },
    twitterImage: { type: String, default: null, maxlength: 1000 },
    // SEO - Advanced
    robots: { type: String, default: 'index,follow', maxlength: 100 },
    newsKeywords: { type: String, default: null, maxlength: 500 },
    isEvergreen: { type: Boolean, default: false },
    // Advanced Options
    isFeatured: { type: Boolean, default: false },
    allowComments: { type: Boolean, default: true },
    readingTime: { type: Number, default: null },
    template: { type: String, default: null, maxlength: 100 },
    customFields: { type: Schema.Types.Mixed, default: null },
    // Trending & Social
    isTrending: { type: Boolean, default: false },
    trendingRank: { type: Number, default: null, min: 1, max: 10 },
    trendingAt: { type: Date, default: null },
    shareCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    // Content Structure - Auto-generated from content
    contentStructure: {
      type: {
        toc: [{
          id: { type: String, required: true },
          text: { type: String, required: true },
          level: { type: Number, required: true },
          anchor: { type: String, required: true },
        }],
        wordCount: { type: Number },
        readingTime: { type: Number },
      },
      default: null,
    },
    // Content Blocks - Block-based JSON content (Notion-style)
    contentBlocks: { type: Schema.Types.Mixed, default: null },
    // FAQ - Array of question/answer pairs
    faq: [{
      question: { type: String, required: true },
      answer: { type: String, required: true },
    }],
    // Webhook/CMS fields
    isBreaking: { type: Boolean, default: false },
    translationOf: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
    relatedIds: [{ type: String }],
    sources: [{
      name: { type: String, required: true },
      url: { type: String, required: true },
    }],
    extras: { type: Schema.Types.Mixed, default: null },
    wordCount: { type: Number, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for category
postSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

// Virtual for author (E-E-A-T)
postSchema.virtual('authorInfo', {
  ref: 'Author',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true,
});

// Pre-save middleware: auto-set publishedAt and generate contentStructure/contentBlocks
postSchema.pre('save', function (next) {
  // If status is 'published' and publishedAt is not set, set it to now
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Use contentBlocks if provided, otherwise generate from content
  let blocks = this.contentBlocks;

  // Only generate from content if contentBlocks is not provided or empty
  if (!blocks || (Array.isArray(blocks) && blocks.length === 0)) {
    if (this.content) {
      blocks = markdownToBlocks(this.content);
      this.contentBlocks = blocks;
    }
  }

  // Generate contentStructure from blocks (either provided or generated)
  if (blocks && Array.isArray(blocks) && blocks.length > 0) {
    const toc = extractTocFromBlocks(blocks);
    const wordCount = countWordsInBlocks(blocks);
    const readingTime = estimateReadingTimeFromBlocks(blocks);

    this.contentStructure = { toc, wordCount, readingTime };
    this.readingTime = readingTime;
  } else if (this.content) {
    // Fallback: generate from content if blocks still empty
    const fallbackBlocks = markdownToBlocks(this.content);
    const toc = extractTocFromBlocks(fallbackBlocks);
    const wordCount = countWordsInBlocks(fallbackBlocks);
    const readingTime = estimateReadingTimeFromBlocks(fallbackBlocks);

    this.contentStructure = { toc, wordCount, readingTime };
    this.readingTime = readingTime;
  }

  next();
});

// Pre-update middleware: handle findOneAndUpdate, updateOne, etc.
postSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function (next) {
  const update = this.getUpdate() as any;
  if (update) {
    // Handle $set operator for publishedAt
    if (update.$set?.status === 'published' && !update.$set?.publishedAt) {
      update.$set.publishedAt = new Date();
    }
    // Handle direct update for publishedAt
    if (update.status === 'published' && !update.publishedAt) {
      update.publishedAt = new Date();
    }

    // Get contentBlocks from update if provided
    const providedBlocks = update.$set?.contentBlocks || update.contentBlocks;
    const content = update.$set?.content || update.content;

    // Use provided contentBlocks, or generate from content if not provided
    let blocks = providedBlocks;
    if (!blocks || (Array.isArray(blocks) && blocks.length === 0)) {
      if (content) {
        blocks = markdownToBlocks(content);
      }
    }

    // Generate contentStructure from blocks
    if (blocks && Array.isArray(blocks) && blocks.length > 0) {
      const toc = extractTocFromBlocks(blocks);
      const wordCount = countWordsInBlocks(blocks);
      const readingTime = estimateReadingTimeFromBlocks(blocks);
      const contentStructure = { toc, wordCount, readingTime };

      if (update.$set) {
        update.$set.contentBlocks = blocks;
        update.$set.contentStructure = contentStructure;
        update.$set.readingTime = readingTime;
      } else {
        update.contentBlocks = blocks;
        update.contentStructure = contentStructure;
        update.readingTime = readingTime;
      }
    } else if (content) {
      // Fallback: generate from content if blocks still empty
      const fallbackBlocks = markdownToBlocks(content);
      const toc = extractTocFromBlocks(fallbackBlocks);
      const wordCount = countWordsInBlocks(fallbackBlocks);
      const readingTime = estimateReadingTimeFromBlocks(fallbackBlocks);
      const contentStructure = { toc, wordCount, readingTime };

      if (update.$set) {
        update.$set.contentBlocks = fallbackBlocks;
        update.$set.contentStructure = contentStructure;
        update.$set.readingTime = readingTime;
      } else {
        update.contentBlocks = fallbackBlocks;
        update.contentStructure = contentStructure;
        update.readingTime = readingTime;
      }
    }
  }
  next();
});

// Indexes (slug already indexed via unique: true)
postSchema.index({ externalId: 1 }, { unique: true, sparse: true });
postSchema.index({ articleType: 1 });
postSchema.index({ language: 1 });
postSchema.index({ translationOf: 1 }, { sparse: true });
postSchema.index({ isBreaking: 1 });
postSchema.index({ status: 1 });
postSchema.index({ categoryId: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ isFeatured: 1 });
postSchema.index({ authorId: 1 });
postSchema.index({ isEvergreen: 1 });
postSchema.index({ isTrending: 1, trendingRank: 1 });
postSchema.index({ viewCount: -1 }); // For trending queries
postSchema.index({ shareCount: -1 });
postSchema.index({ title: 'text', content: 'text' }, { language_override: 'textSearchLang' });

export const Post = mongoose.model<IPost>('Post', postSchema);
