export interface Tool {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  icon: string;
  howToUse: string[];
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
  isPopular?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  { name: "Image Tools", slug: "image-tools", description: "Compress, resize, convert and edit images", icon: "Image" },
  { name: "PDF Tools", slug: "pdf-tools", description: "Convert, view and manage PDF files", icon: "FileText" },
  { name: "Text Tools", slug: "text-tools", description: "Count words, convert text and more", icon: "Type" },
  { name: "Developer Tools", slug: "developer-tools", description: "JSON, Base64, UUID and more dev utilities", icon: "Code" },
  { name: "SEO Tools", slug: "seo-tools", description: "Meta tags, sitemaps and SEO utilities", icon: "Search" },
  { name: "Calculator Tools", slug: "calculator-tools", description: "Math, finance and everyday calculators", icon: "Calculator" },
  { name: "Utilities", slug: "utilities", description: "QR codes, passwords and handy utilities", icon: "Wrench" },
];

export const tools: Tool[] = [
  // IMAGE TOOLS
  { name: "Image Compressor", slug: "image-compressor", category: "Image Tools", categorySlug: "image-tools", description: "Compress images online for free without losing quality.", icon: "ImageDown", howToUse: ["Upload your image", "Choose compression level", "Download optimized image"], faqs: [{ q: "Is this tool free?", a: "Yes, completely free." }, { q: "Does it upload files?", a: "No. Everything runs locally in your browser." }], relatedSlugs: ["image-resizer", "image-cropper", "png-to-jpg"], isPopular: true, isTrending: true },
  { name: "Image Resizer", slug: "image-resizer", category: "Image Tools", categorySlug: "image-tools", description: "Resize images to any dimension instantly.", icon: "Maximize", howToUse: ["Upload your image", "Enter desired dimensions", "Download resized image"], faqs: [{ q: "Is this tool free?", a: "Yes, completely free." }, { q: "Does it upload files?", a: "No. Everything runs locally." }], relatedSlugs: ["image-compressor", "image-cropper", "png-to-jpg"], isPopular: true },
  { name: "Image Cropper", slug: "image-cropper", category: "Image Tools", categorySlug: "image-tools", description: "Crop images to any size online.", icon: "Crop", howToUse: ["Upload your image", "Select crop area", "Download cropped image"], faqs: [{ q: "Is this tool free?", a: "Yes, completely free." }], relatedSlugs: ["image-resizer", "image-compressor", "jpg-to-png"] },
  { name: "PNG to JPG Converter", slug: "png-to-jpg", category: "Image Tools", categorySlug: "image-tools", description: "Convert PNG images to JPG format instantly.", icon: "ArrowRightLeft", howToUse: ["Upload a PNG image", "Click convert", "Download the JPG file"], faqs: [{ q: "Is this tool free?", a: "Yes." }], relatedSlugs: ["jpg-to-png", "webp-to-jpg", "image-compressor"], isPopular: true, isTrending: true },
  { name: "JPG to PNG Converter", slug: "jpg-to-png", category: "Image Tools", categorySlug: "image-tools", description: "Convert JPG images to PNG format with transparency support.", icon: "ArrowRightLeft", howToUse: ["Upload a JPG image", "Click convert", "Download the PNG file"], faqs: [{ q: "Will it support transparency?", a: "Yes, PNG supports transparency." }], relatedSlugs: ["png-to-jpg", "webp-to-jpg", "image-compressor"] },
  { name: "WebP to JPG Converter", slug: "webp-to-jpg", category: "Image Tools", categorySlug: "image-tools", description: "Convert WebP images to JPG format.", icon: "ArrowRightLeft", howToUse: ["Upload a WebP image", "Click convert", "Download JPG"], faqs: [{ q: "Is this tool free?", a: "Yes." }], relatedSlugs: ["jpg-to-webp", "png-to-jpg", "image-compressor"] },
  { name: "JPG to WebP Converter", slug: "jpg-to-webp", category: "Image Tools", categorySlug: "image-tools", description: "Convert JPG images to WebP for better web performance.", icon: "ArrowRightLeft", howToUse: ["Upload a JPG image", "Click convert", "Download WebP"], faqs: [{ q: "Why use WebP?", a: "WebP offers better compression for the web." }], relatedSlugs: ["webp-to-jpg", "png-to-jpg", "image-compressor"] },
  { name: "Image to Base64", slug: "image-to-base64", category: "Image Tools", categorySlug: "image-tools", description: "Convert images to Base64 encoded strings.", icon: "Binary", howToUse: ["Upload an image", "Copy the Base64 string", "Use it in your code"], faqs: [{ q: "What is Base64?", a: "A text encoding format for binary data." }], relatedSlugs: ["base64-to-image", "base64-encoder", "image-compressor"] },
  { name: "Base64 to Image", slug: "base64-to-image", category: "Image Tools", categorySlug: "image-tools", description: "Convert Base64 strings back to images.", icon: "Image", howToUse: ["Paste Base64 string", "Preview the image", "Download it"], faqs: [{ q: "Is this tool free?", a: "Yes." }], relatedSlugs: ["image-to-base64", "base64-decoder", "image-compressor"] },
  { name: "Image Color Picker", slug: "image-color-picker", category: "Image Tools", categorySlug: "image-tools", description: "Pick any color from an uploaded image.", icon: "Pipette", howToUse: ["Upload an image", "Click on any pixel", "Copy the color value"], faqs: [{ q: "What formats are supported?", a: "HEX, RGB, and HSL." }], relatedSlugs: ["image-compressor", "image-resizer", "image-cropper"], isNew: true },

  // PDF TOOLS
  { name: "Images to PDF", slug: "images-to-pdf", category: "PDF Tools", categorySlug: "pdf-tools", description: "Combine multiple images into a single PDF.", icon: "FileImage", howToUse: ["Upload images", "Arrange order", "Download PDF"], faqs: [{ q: "How many images?", a: "As many as you want." }], relatedSlugs: ["pdf-to-jpg", "pdf-page-counter", "pdf-reader"], isTrending: true },
  { name: "PDF to JPG", slug: "pdf-to-jpg", category: "PDF Tools", categorySlug: "pdf-tools", description: "Convert PDF pages to JPG images.", icon: "FileImage", howToUse: ["Upload a PDF", "Select pages", "Download JPG images"], faqs: [{ q: "Is quality preserved?", a: "Yes, high quality output." }], relatedSlugs: ["images-to-pdf", "pdf-reader", "pdf-page-counter"] },
  { name: "PDF Page Counter", slug: "pdf-page-counter", category: "PDF Tools", categorySlug: "pdf-tools", description: "Count pages in a PDF file instantly.", icon: "Hash", howToUse: ["Upload a PDF", "See page count", "View details"], faqs: [{ q: "Is it accurate?", a: "Yes, 100% accurate." }], relatedSlugs: ["pdf-metadata-viewer", "pdf-reader", "images-to-pdf"] },
  { name: "PDF Metadata Viewer", slug: "pdf-metadata-viewer", category: "PDF Tools", categorySlug: "pdf-tools", description: "View metadata of PDF files.", icon: "Info", howToUse: ["Upload a PDF", "View metadata", "Copy details"], faqs: [{ q: "What metadata is shown?", a: "Author, title, creation date, etc." }], relatedSlugs: ["pdf-page-counter", "pdf-reader", "images-to-pdf"] },
  { name: "PDF Reader", slug: "pdf-reader", category: "PDF Tools", categorySlug: "pdf-tools", description: "Read PDF files directly in your browser.", icon: "BookOpen", howToUse: ["Upload a PDF", "Read in browser", "Navigate pages"], faqs: [{ q: "Is it free?", a: "Yes." }], relatedSlugs: ["pdf-page-counter", "pdf-metadata-viewer", "images-to-pdf"], isNew: true },
  { name: "PDF Page Rotator", slug: "pdf-page-rotator", category: "PDF Tools", categorySlug: "pdf-tools", description: "Rotate PDF pages easily.", icon: "RotateCw", howToUse: ["Upload a PDF", "Select rotation", "Download rotated PDF"], faqs: [{ q: "Can I rotate individual pages?", a: "Yes." }], relatedSlugs: ["pdf-reader", "pdf-page-counter", "images-to-pdf"] },

  // TEXT TOOLS
  { name: "Word Counter", slug: "word-counter", category: "Text Tools", categorySlug: "text-tools", description: "Count words, characters, sentences and paragraphs.", icon: "Hash", howToUse: ["Type or paste text", "See real-time counts", "Copy results"], faqs: [{ q: "Is this tool free?", a: "Yes." }], relatedSlugs: ["character-counter", "text-case-converter", "remove-duplicate-lines"], isPopular: true },
  { name: "Character Counter", slug: "character-counter", category: "Text Tools", categorySlug: "text-tools", description: "Count characters with and without spaces.", icon: "ALargeSmall", howToUse: ["Type or paste text", "See character count", "Track limits"], faqs: [{ q: "Does it count spaces?", a: "It shows both with and without spaces." }], relatedSlugs: ["word-counter", "text-case-converter", "text-sorter"] },
  { name: "Text Case Converter", slug: "text-case-converter", category: "Text Tools", categorySlug: "text-tools", description: "Convert text to uppercase, lowercase, title case and more.", icon: "CaseSensitive", howToUse: ["Paste your text", "Choose case type", "Copy converted text"], faqs: [{ q: "What cases are supported?", a: "Upper, lower, title, sentence, and more." }], relatedSlugs: ["word-counter", "character-counter", "text-sorter"] },
  { name: "Remove Duplicate Lines", slug: "remove-duplicate-lines", category: "Text Tools", categorySlug: "text-tools", description: "Remove duplicate lines from text.", icon: "ListX", howToUse: ["Paste your text", "Click remove duplicates", "Copy clean text"], faqs: [{ q: "Is it case-sensitive?", a: "You can toggle case sensitivity." }], relatedSlugs: ["text-sorter", "word-counter", "text-case-converter"] },
  { name: "Text Sorter", slug: "text-sorter", category: "Text Tools", categorySlug: "text-tools", description: "Sort lines of text alphabetically or numerically.", icon: "ArrowDownAZ", howToUse: ["Paste lines of text", "Choose sort order", "Copy sorted text"], faqs: [{ q: "Can I sort numerically?", a: "Yes." }], relatedSlugs: ["remove-duplicate-lines", "word-counter", "text-case-converter"] },
  { name: "Lorem Ipsum Generator", slug: "lorem-ipsum-generator", category: "Text Tools", categorySlug: "text-tools", description: "Generate placeholder Lorem Ipsum text.", icon: "FileText", howToUse: ["Choose paragraphs count", "Generate text", "Copy to clipboard"], faqs: [{ q: "What is Lorem Ipsum?", a: "Standard placeholder text used in design." }], relatedSlugs: ["random-text-generator", "word-counter", "character-counter"], isNew: true },
  { name: "Random Text Generator", slug: "random-text-generator", category: "Text Tools", categorySlug: "text-tools", description: "Generate random text strings.", icon: "Shuffle", howToUse: ["Set length and options", "Generate text", "Copy result"], faqs: [{ q: "Is it truly random?", a: "Yes, using browser crypto API." }], relatedSlugs: ["lorem-ipsum-generator", "password-generator", "uuid-generator"] },

  // DEVELOPER TOOLS
  { name: "JSON Formatter", slug: "json-formatter", category: "Developer Tools", categorySlug: "developer-tools", description: "Format and beautify JSON data.", icon: "Braces", howToUse: ["Paste JSON data", "Click format", "Copy formatted JSON"], faqs: [{ q: "Does it validate JSON?", a: "Yes, it shows errors too." }], relatedSlugs: ["json-validator", "base64-encoder", "url-encoder"], isPopular: true, isTrending: true },
  { name: "JSON Validator", slug: "json-validator", category: "Developer Tools", categorySlug: "developer-tools", description: "Validate JSON data and find errors.", icon: "CheckCircle", howToUse: ["Paste JSON", "See validation result", "Fix errors"], faqs: [{ q: "What errors does it detect?", a: "Syntax errors, missing brackets, etc." }], relatedSlugs: ["json-formatter", "base64-encoder", "regex-tester"] },
  { name: "Base64 Encoder", slug: "base64-encoder", category: "Developer Tools", categorySlug: "developer-tools", description: "Encode text to Base64 format.", icon: "Lock", howToUse: ["Enter text", "Click encode", "Copy Base64 result"], faqs: [{ q: "Is Base64 encryption?", a: "No, it's encoding, not encryption." }], relatedSlugs: ["base64-decoder", "url-encoder", "json-formatter"] },
  { name: "Base64 Decoder", slug: "base64-decoder", category: "Developer Tools", categorySlug: "developer-tools", description: "Decode Base64 strings to text.", icon: "Unlock", howToUse: ["Paste Base64 string", "Click decode", "Copy decoded text"], faqs: [{ q: "Is it free?", a: "Yes." }], relatedSlugs: ["base64-encoder", "url-decoder", "json-formatter"] },
  { name: "URL Encoder", slug: "url-encoder", category: "Developer Tools", categorySlug: "developer-tools", description: "Encode URLs for safe transmission.", icon: "Link", howToUse: ["Enter URL or text", "Click encode", "Copy encoded URL"], faqs: [{ q: "When do I need this?", a: "When passing special characters in URLs." }], relatedSlugs: ["url-decoder", "base64-encoder", "slug-generator"] },
  { name: "URL Decoder", slug: "url-decoder", category: "Developer Tools", categorySlug: "developer-tools", description: "Decode encoded URLs back to readable text.", icon: "Unlink", howToUse: ["Paste encoded URL", "Click decode", "Copy decoded URL"], faqs: [{ q: "Is it free?", a: "Yes." }], relatedSlugs: ["url-encoder", "base64-decoder", "json-formatter"] },
  { name: "UUID Generator", slug: "uuid-generator", category: "Developer Tools", categorySlug: "developer-tools", description: "Generate random UUIDs (v4).", icon: "Fingerprint", howToUse: ["Click generate", "Copy UUID", "Generate more"], faqs: [{ q: "Are they unique?", a: "Yes, statistically guaranteed unique." }], relatedSlugs: ["password-generator", "random-number-generator", "json-formatter"], isNew: true },
  { name: "Regex Tester", slug: "regex-tester", category: "Developer Tools", categorySlug: "developer-tools", description: "Test and debug regular expressions.", icon: "Regex", howToUse: ["Enter regex pattern", "Enter test string", "See matches highlighted"], faqs: [{ q: "What flavors are supported?", a: "JavaScript regex flavor." }], relatedSlugs: ["json-validator", "json-formatter", "base64-encoder"] },

  // SEO TOOLS
  { name: "Meta Tag Generator", slug: "meta-tag-generator", category: "SEO Tools", categorySlug: "seo-tools", description: "Generate HTML meta tags for SEO.", icon: "Tags", howToUse: ["Enter page details", "Generate meta tags", "Copy HTML code"], faqs: [{ q: "What tags are included?", a: "Title, description, OG, Twitter cards." }], relatedSlugs: ["robots-txt-generator", "sitemap-xml-generator", "serp-preview-tool"], isPopular: true },
  { name: "Robots.txt Generator", slug: "robots-txt-generator", category: "SEO Tools", categorySlug: "seo-tools", description: "Generate robots.txt file for your website.", icon: "Bot", howToUse: ["Configure rules", "Generate file", "Download or copy"], faqs: [{ q: "What is robots.txt?", a: "A file that tells search engines what to crawl." }], relatedSlugs: ["sitemap-xml-generator", "meta-tag-generator", "slug-generator"] },
  { name: "Sitemap XML Generator", slug: "sitemap-xml-generator", category: "SEO Tools", categorySlug: "seo-tools", description: "Generate XML sitemaps for your website.", icon: "Map", howToUse: ["Add URLs", "Configure options", "Download sitemap"], faqs: [{ q: "What is a sitemap?", a: "An XML file listing all pages for search engines." }], relatedSlugs: ["robots-txt-generator", "meta-tag-generator", "slug-generator"] },
  { name: "Slug Generator", slug: "slug-generator", category: "SEO Tools", categorySlug: "seo-tools", description: "Generate URL-friendly slugs from text.", icon: "Link2", howToUse: ["Enter text", "Get slug", "Copy it"], faqs: [{ q: "What is a slug?", a: "A URL-friendly version of a title." }], relatedSlugs: ["meta-tag-generator", "url-encoder", "serp-preview-tool"] },
  { name: "SERP Preview Tool", slug: "serp-preview-tool", category: "SEO Tools", categorySlug: "seo-tools", description: "Preview how your page appears in Google search results.", icon: "Eye", howToUse: ["Enter title and description", "See preview", "Optimize for SEO"], faqs: [{ q: "Is it accurate?", a: "It closely mimics Google's display." }], relatedSlugs: ["meta-tag-generator", "slug-generator", "robots-txt-generator"], isNew: true },

  // UTILITIES
  { name: "QR Code Generator", slug: "qr-code-generator", category: "Utilities", categorySlug: "utilities", description: "Generate QR codes for any text or URL.", icon: "QrCode", howToUse: ["Enter text or URL", "Generate QR code", "Download image"], faqs: [{ q: "What formats?", a: "PNG download." }], relatedSlugs: ["password-generator", "random-number-generator", "uuid-generator"], isPopular: true, isTrending: true },
  { name: "Password Generator", slug: "password-generator", category: "Utilities", categorySlug: "utilities", description: "Generate strong random passwords.", icon: "KeyRound", howToUse: ["Set length and options", "Generate password", "Copy to clipboard"], faqs: [{ q: "Are they secure?", a: "Yes, generated using crypto API." }], relatedSlugs: ["qr-code-generator", "uuid-generator", "random-number-generator"], isPopular: true },
  { name: "Random Number Generator", slug: "random-number-generator", category: "Utilities", categorySlug: "utilities", description: "Generate random numbers within a range.", icon: "Dices", howToUse: ["Set min and max", "Click generate", "Use the number"], faqs: [{ q: "Is it truly random?", a: "Yes, using crypto API." }], relatedSlugs: ["password-generator", "uuid-generator", "qr-code-generator"] },
  { name: "Timestamp Converter", slug: "timestamp-converter", category: "Utilities", categorySlug: "utilities", description: "Convert Unix timestamps to human-readable dates.", icon: "Clock", howToUse: ["Enter a timestamp", "See converted date", "Copy result"], faqs: [{ q: "What formats?", a: "Unix seconds and milliseconds." }], relatedSlugs: ["date-difference-calculator", "random-number-generator", "uuid-generator"], isNew: true },

  // CALCULATOR TOOLS
  { name: "Age Calculator", slug: "age-calculator", category: "Calculator Tools", categorySlug: "calculator-tools", description: "Calculate your exact age in years, months and days.", icon: "Calendar", howToUse: ["Enter birth date", "See your age", "View breakdown"], faqs: [{ q: "Is it accurate?", a: "Yes, down to the day." }], relatedSlugs: ["bmi-calculator", "date-difference-calculator", "percentage-calculator"] },
  { name: "BMI Calculator", slug: "bmi-calculator", category: "Calculator Tools", categorySlug: "calculator-tools", description: "Calculate your Body Mass Index.", icon: "Activity", howToUse: ["Enter weight and height", "See BMI result", "View category"], faqs: [{ q: "What is BMI?", a: "Body Mass Index measures body fat based on weight and height." }], relatedSlugs: ["age-calculator", "percentage-calculator", "tip-calculator"], isTrending: true },
  { name: "Percentage Calculator", slug: "percentage-calculator", category: "Calculator Tools", categorySlug: "calculator-tools", description: "Calculate percentages easily.", icon: "Percent", howToUse: ["Enter values", "See percentage", "Copy result"], faqs: [{ q: "Is it free?", a: "Yes." }], relatedSlugs: ["discount-calculator", "profit-margin-calculator", "tip-calculator"] },
  { name: "Loan EMI Calculator", slug: "loan-emi-calculator", category: "Calculator Tools", categorySlug: "calculator-tools", description: "Calculate monthly loan EMI payments.", icon: "Landmark", howToUse: ["Enter loan details", "See EMI breakdown", "View schedule"], faqs: [{ q: "What is EMI?", a: "Equated Monthly Installment." }], relatedSlugs: ["interest-calculator", "percentage-calculator", "discount-calculator"] },
  { name: "Interest Calculator", slug: "interest-calculator", category: "Calculator Tools", categorySlug: "calculator-tools", description: "Calculate simple and compound interest.", icon: "TrendingUp", howToUse: ["Enter principal and rate", "Choose type", "See result"], faqs: [{ q: "Simple vs compound?", a: "Compound interest earns interest on interest." }], relatedSlugs: ["loan-emi-calculator", "percentage-calculator", "profit-margin-calculator"] },
  { name: "Discount Calculator", slug: "discount-calculator", category: "Calculator Tools", categorySlug: "calculator-tools", description: "Calculate discount amounts and final prices.", icon: "BadgePercent", howToUse: ["Enter price and discount", "See savings", "Copy result"], faqs: [{ q: "Is it free?", a: "Yes." }], relatedSlugs: ["percentage-calculator", "tip-calculator", "profit-margin-calculator"] },
  { name: "Date Difference Calculator", slug: "date-difference-calculator", category: "Calculator Tools", categorySlug: "calculator-tools", description: "Calculate days between two dates.", icon: "CalendarDays", howToUse: ["Enter two dates", "See difference", "View breakdown"], faqs: [{ q: "Does it count weekends?", a: "Yes, all days are counted." }], relatedSlugs: ["age-calculator", "time-duration-calculator", "timestamp-converter"] },
  { name: "Time Duration Calculator", slug: "time-duration-calculator", category: "Calculator Tools", categorySlug: "calculator-tools", description: "Calculate duration between two times.", icon: "Timer", howToUse: ["Enter start and end time", "See duration", "Copy result"], faqs: [{ q: "Is it free?", a: "Yes." }], relatedSlugs: ["date-difference-calculator", "age-calculator", "timestamp-converter"] },
  { name: "Profit Margin Calculator", slug: "profit-margin-calculator", category: "Calculator Tools", categorySlug: "calculator-tools", description: "Calculate profit margins and markups.", icon: "DollarSign", howToUse: ["Enter cost and revenue", "See margins", "Copy results"], faqs: [{ q: "Margin vs markup?", a: "Margin is based on selling price, markup on cost." }], relatedSlugs: ["percentage-calculator", "discount-calculator", "tip-calculator"] },
  { name: "Tip Calculator", slug: "tip-calculator", category: "Calculator Tools", categorySlug: "calculator-tools", description: "Calculate tips and split bills.", icon: "Receipt", howToUse: ["Enter bill amount", "Choose tip percentage", "Split if needed"], faqs: [{ q: "Can I split the bill?", a: "Yes, between any number of people." }], relatedSlugs: ["percentage-calculator", "discount-calculator", "profit-margin-calculator"] },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return tools.filter(t => t.categorySlug === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}

export function getRelatedTools(tool: Tool): Tool[] {
  return tool.relatedSlugs.map(s => tools.find(t => t.slug === s)).filter(Boolean) as Tool[];
}

export function searchTools(query: string): Tool[] {
  const q = query.toLowerCase();
  return tools.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
}
