import { lazy, Suspense } from "react";

const ImageCompressorTool = lazy(() => import("./ImageCompressorTool"));
const ImageResizerTool = lazy(() => import("./ImageResizerTool"));
const ImageCropperTool = lazy(() => import("./ImageCropperTool"));
const ImageConverterTool = lazy(() => import("./ImageConverterTool"));
const ImageToBase64Tool = lazy(() => import("./ImageToBase64Tool"));
const Base64ToImageTool = lazy(() => import("./Base64ToImageTool"));
const ColorPickerTool = lazy(() => import("./ColorPickerTool"));
const ImagesToPdfTool = lazy(() => import("./ImagesToPdfTool"));
const ImageWatermarkTool = lazy(() => import("./ImageWatermarkTool"));
const ImageBlurTool = lazy(() => import("./ImageBlurTool"));
const ImageRotateTool = lazy(() => import("./ImageRotateTool"));
const ImageFlipTool = lazy(() => import("./ImageFlipTool"));
const PdfToJpgTool = lazy(() => import("./PdfToJpgTool"));
const PdfPageCounterTool = lazy(() => import("./PdfPageCounterTool"));
const PdfMetadataViewerTool = lazy(() => import("./PdfMetadataViewerTool"));
const PdfReaderTool = lazy(() => import("./PdfReaderTool"));
const PdfPageRotatorTool = lazy(() => import("./PdfPageRotatorTool"));
const WordCounterTool = lazy(() => import("./WordCounterTool"));
const CharacterCounterTool = lazy(() => import("./CharacterCounterTool"));
const TextCaseConverterTool = lazy(() => import("./TextCaseConverterTool"));
const RemoveDuplicatesTool = lazy(() => import("./RemoveDuplicatesTool"));
const TextSorterTool = lazy(() => import("./TextSorterTool"));
const LoremIpsumTool = lazy(() => import("./LoremIpsumTool"));
const RandomTextTool = lazy(() => import("./RandomTextTool"));
const TextCompareTool = lazy(() => import("./TextCompareTool"));
const TextReverseTool = lazy(() => import("./TextReverseTool"));
const RemoveExtraSpacesTool = lazy(() => import("./RemoveExtraSpacesTool"));
const RandomWordGeneratorTool = lazy(() => import("./RandomWordGeneratorTool"));
const TextToSlugTool = lazy(() => import("./TextToSlugTool"));
const JsonFormatterTool = lazy(() => import("./JsonFormatterTool"));
const JsonValidatorTool = lazy(() => import("./JsonValidatorTool"));
const Base64EncoderTool = lazy(() => import("./Base64EncoderTool"));
const Base64DecoderTool = lazy(() => import("./Base64DecoderTool"));
const UrlEncoderTool = lazy(() => import("./UrlEncoderTool"));
const UrlDecoderTool = lazy(() => import("./UrlDecoderTool"));
const UuidGeneratorTool = lazy(() => import("./UuidGeneratorTool"));
const RegexTesterTool = lazy(() => import("./RegexTesterTool"));
const CsvToJsonTool = lazy(() => import("./CsvToJsonTool"));
const JsonToCsvTool = lazy(() => import("./JsonToCsvTool"));
const HtmlMinifierTool = lazy(() => import("./HtmlMinifierTool"));
const CssMinifierTool = lazy(() => import("./CssMinifierTool"));
const JsMinifierTool = lazy(() => import("./JsMinifierTool"));
const ColorCodeConverterTool = lazy(() => import("./ColorCodeConverterTool"));
const MetaTagGeneratorTool = lazy(() => import("./MetaTagGeneratorTool"));
const RobotsTxtTool = lazy(() => import("./RobotsTxtTool"));
const SitemapTool = lazy(() => import("./SitemapTool"));
const SlugGeneratorTool = lazy(() => import("./SlugGeneratorTool"));
const SerpPreviewTool = lazy(() => import("./SerpPreviewTool"));
const QrCodeTool = lazy(() => import("./QrCodeTool"));
const PasswordGeneratorTool = lazy(() => import("./PasswordGeneratorTool"));
const RandomNumberTool = lazy(() => import("./RandomNumberTool"));
const TimestampTool = lazy(() => import("./TimestampTool"));
const DiceRollerTool = lazy(() => import("./DiceRollerTool"));
const CoinFlipTool = lazy(() => import("./CoinFlipTool"));
const RandomPickerTool = lazy(() => import("./RandomPickerTool"));
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
const AverageCalculatorTool = lazy(() => import("./AverageCalculatorTool"));
const PercentageIncreaseTool = lazy(() => import("./PercentageIncreaseTool"));
const PercentageDecreaseTool = lazy(() => import("./PercentageDecreaseTool"));

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
  "image-watermark": ImageWatermarkTool,
  "image-blur": ImageBlurTool,
  "image-rotate": ImageRotateTool,
  "image-flip": ImageFlipTool,
  "pdf-to-jpg": PdfToJpgTool,
  "pdf-page-counter": PdfPageCounterTool,
  "pdf-metadata-viewer": PdfMetadataViewerTool,
  "pdf-reader": PdfReaderTool,
  "pdf-page-rotator": PdfPageRotatorTool,
  "word-counter": WordCounterTool,
  "character-counter": CharacterCounterTool,
  "text-case-converter": TextCaseConverterTool,
  "remove-duplicate-lines": RemoveDuplicatesTool,
  "text-sorter": TextSorterTool,
  "lorem-ipsum-generator": LoremIpsumTool,
  "random-text-generator": RandomTextTool,
  "text-compare": TextCompareTool,
  "text-reverse": TextReverseTool,
  "remove-extra-spaces": RemoveExtraSpacesTool,
  "random-word-generator": RandomWordGeneratorTool,
  "text-to-slug": TextToSlugTool,
  "json-formatter": JsonFormatterTool,
  "json-validator": JsonValidatorTool,
  "base64-encoder": Base64EncoderTool,
  "base64-decoder": Base64DecoderTool,
  "url-encoder": UrlEncoderTool,
  "url-decoder": UrlDecoderTool,
  "uuid-generator": UuidGeneratorTool,
  "regex-tester": RegexTesterTool,
  "csv-to-json": CsvToJsonTool,
  "json-to-csv": JsonToCsvTool,
  "html-minifier": HtmlMinifierTool,
  "css-minifier": CssMinifierTool,
  "js-minifier": JsMinifierTool,
  "color-code-converter": ColorCodeConverterTool,
  "meta-tag-generator": MetaTagGeneratorTool,
  "robots-txt-generator": RobotsTxtTool,
  "sitemap-xml-generator": SitemapTool,
  "slug-generator": SlugGeneratorTool,
  "serp-preview-tool": SerpPreviewTool,
  "qr-code-generator": QrCodeTool,
  "password-generator": PasswordGeneratorTool,
  "random-number-generator": RandomNumberTool,
  "timestamp-converter": TimestampTool,
  "dice-roller": DiceRollerTool,
  "coin-flip": CoinFlipTool,
  "random-picker": RandomPickerTool,
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
  "average-calculator": AverageCalculatorTool,
  "percentage-increase-calculator": PercentageIncreaseTool,
  "percentage-decrease-calculator": PercentageDecreaseTool,
};

const ToolLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-2 border-muted" />
      <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
    <p className="text-sm font-medium text-muted-foreground">Loading Tool...</p>
  </div>
);

const ToolInterface = ({ slug }: { slug: string }) => {
  const Component = toolMap[slug];
  if (!Component) return <p className="text-muted-foreground">Tool interface coming soon.</p>;
  return (
    <Suspense fallback={<ToolLoadingFallback />}>
      <Component />
    </Suspense>
  );
};

export default ToolInterface;
