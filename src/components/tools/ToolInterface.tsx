import { lazy, Suspense } from "react";

const ImageCompressorTool = lazy(() => import("./ImageCompressorTool"));
const ImageResizerTool = lazy(() => import("./ImageResizerTool"));
const ImageCropperTool = lazy(() => import("./ImageCropperTool"));
const ImageConverterTool = lazy(() => import("./ImageConverterTool"));
const ImageToBase64Tool = lazy(() => import("./ImageToBase64Tool"));
const Base64ToImageTool = lazy(() => import("./Base64ToImageTool"));
const ColorPickerTool = lazy(() => import("./ColorPickerTool"));
const ImagesToPdfTool = lazy(() => import("./ImagesToPdfTool"));
const WordCounterTool = lazy(() => import("./WordCounterTool"));
const CharacterCounterTool = lazy(() => import("./CharacterCounterTool"));
const TextCaseConverterTool = lazy(() => import("./TextCaseConverterTool"));
const RemoveDuplicatesTool = lazy(() => import("./RemoveDuplicatesTool"));
const TextSorterTool = lazy(() => import("./TextSorterTool"));
const LoremIpsumTool = lazy(() => import("./LoremIpsumTool"));
const RandomTextTool = lazy(() => import("./RandomTextTool"));
const JsonFormatterTool = lazy(() => import("./JsonFormatterTool"));
const JsonValidatorTool = lazy(() => import("./JsonValidatorTool"));
const Base64EncoderTool = lazy(() => import("./Base64EncoderTool"));
const Base64DecoderTool = lazy(() => import("./Base64DecoderTool"));
const UrlEncoderTool = lazy(() => import("./UrlEncoderTool"));
const UrlDecoderTool = lazy(() => import("./UrlDecoderTool"));
const UuidGeneratorTool = lazy(() => import("./UuidGeneratorTool"));
const RegexTesterTool = lazy(() => import("./RegexTesterTool"));
const MetaTagGeneratorTool = lazy(() => import("./MetaTagGeneratorTool"));
const RobotsTxtTool = lazy(() => import("./RobotsTxtTool"));
const SitemapTool = lazy(() => import("./SitemapTool"));
const SlugGeneratorTool = lazy(() => import("./SlugGeneratorTool"));
const SerpPreviewTool = lazy(() => import("./SerpPreviewTool"));
const QrCodeTool = lazy(() => import("./QrCodeTool"));
const PasswordGeneratorTool = lazy(() => import("./PasswordGeneratorTool"));
const RandomNumberTool = lazy(() => import("./RandomNumberTool"));
const TimestampTool = lazy(() => import("./TimestampTool"));
const AgeCalculatorTool = lazy(() => import("./AgeCalculatorTool"));
const BmiCalculatorTool = lazy(() => import("./BmiCalculatorTool"));
const PercentageCalculatorTool = lazy(() => import("./PercentageCalculatorTool"));
const LoanEmiTool = lazy(() => import("./LoanEmiTool"));
const InterestCalculatorTool = lazy(() => import("./InterestCalculatorTool"));
const DiscountCalculatorTool = lazy(() => import("./DiscountCalculatorTool"));
const DateDifferenceTool = lazy(() => import("./DateDifferenceTool"));
const TimeDurationTool = lazy(() => import("./TimeDurationTool"));
const ProfitMarginTool = lazy(() => import("./ProfitMarginTool"));
const TipCalculatorTool = lazy(() => import("./TipCalculatorTool"));
const PdfPlaceholder = lazy(() => import("./PdfPlaceholder"));

const toolMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  "image-compressor": ImageCompressorTool,
  "image-resizer": ImageResizerTool,
  "image-cropper": ImageCropperTool,
  "png-to-jpg": ImageConverterTool,
  "jpg-to-png": ImageConverterTool,
  "webp-to-jpg": ImageConverterTool,
  "jpg-to-webp": ImageConverterTool,
  "image-to-base64": ImageToBase64Tool,
  "base64-to-image": Base64ToImageTool,
  "image-color-picker": ColorPickerTool,
  "images-to-pdf": ImagesToPdfTool,
  "pdf-to-jpg": PdfPlaceholder,
  "pdf-page-counter": PdfPlaceholder,
  "pdf-metadata-viewer": PdfPlaceholder,
  "pdf-reader": PdfPlaceholder,
  "pdf-page-rotator": PdfPlaceholder,
  "word-counter": WordCounterTool,
  "character-counter": CharacterCounterTool,
  "text-case-converter": TextCaseConverterTool,
  "remove-duplicate-lines": RemoveDuplicatesTool,
  "text-sorter": TextSorterTool,
  "lorem-ipsum-generator": LoremIpsumTool,
  "random-text-generator": RandomTextTool,
  "json-formatter": JsonFormatterTool,
  "json-validator": JsonValidatorTool,
  "base64-encoder": Base64EncoderTool,
  "base64-decoder": Base64DecoderTool,
  "url-encoder": UrlEncoderTool,
  "url-decoder": UrlDecoderTool,
  "uuid-generator": UuidGeneratorTool,
  "regex-tester": RegexTesterTool,
  "meta-tag-generator": MetaTagGeneratorTool,
  "robots-txt-generator": RobotsTxtTool,
  "sitemap-xml-generator": SitemapTool,
  "slug-generator": SlugGeneratorTool,
  "serp-preview-tool": SerpPreviewTool,
  "qr-code-generator": QrCodeTool,
  "password-generator": PasswordGeneratorTool,
  "random-number-generator": RandomNumberTool,
  "timestamp-converter": TimestampTool,
  "age-calculator": AgeCalculatorTool,
  "bmi-calculator": BmiCalculatorTool,
  "percentage-calculator": PercentageCalculatorTool,
  "loan-emi-calculator": LoanEmiTool,
  "interest-calculator": InterestCalculatorTool,
  "discount-calculator": DiscountCalculatorTool,
  "date-difference-calculator": DateDifferenceTool,
  "time-duration-calculator": TimeDurationTool,
  "profit-margin-calculator": ProfitMarginTool,
  "tip-calculator": TipCalculatorTool,
};

const ToolInterface = ({ slug }: { slug: string }) => {
  const Component = toolMap[slug];
  if (!Component) return <p className="text-muted-foreground">Tool interface coming soon.</p>;
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12 text-muted-foreground">Loading tool...</div>}>
      <Component />
    </Suspense>
  );
};

export default ToolInterface;
