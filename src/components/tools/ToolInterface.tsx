import { lazy, Suspense, Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

// ErrorBoundary for catching render errors in lazy-loaded tools
class ToolErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ToolErrorBoundary] Render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="text-sm font-medium text-muted-foreground">
            Something went wrong loading this tool.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Graceful lazy-load wrapper: catches network/import failures
function safeLazy(importFn: () => Promise<{ default: React.ComponentType }>) {
  return lazy(() =>
    importFn().catch((err) => {
      console.error("[ToolInterface] Failed to load module:", err);
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
            <p className="text-sm font-medium text-muted-foreground">
              Failed to load this tool. Please check your connection and try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reload page
            </Button>
          </div>
        ),
      };
    })
  );
}

const ImageCompressorTool = safeLazy(() => import("./ImageCompressorTool"));
const ImageResizerTool = safeLazy(() => import("./ImageResizerTool"));
const ImageCropperTool = safeLazy(() => import("./ImageCropperTool"));
const ImageConverterTool = safeLazy(() => import("./ImageConverterTool"));
const ImageToBase64Tool = safeLazy(() => import("./ImageToBase64Tool"));
const Base64ToImageTool = safeLazy(() => import("./Base64ToImageTool"));
const ColorPickerTool = safeLazy(() => import("./ColorPickerTool"));
const ImagesToPdfTool = safeLazy(() => import("./ImagesToPdfTool"));
const ImageWatermarkTool = safeLazy(() => import("./ImageWatermarkTool"));
const ImageBlurTool = safeLazy(() => import("./ImageBlurTool"));
const ImageRotateTool = safeLazy(() => import("./ImageRotateTool"));
const ImageFlipTool = safeLazy(() => import("./ImageFlipTool"));
const PdfToJpgTool = safeLazy(() => import("./PdfToJpgTool"));
const MergePdfTool = safeLazy(() => import("./MergePdfTool"));
const SplitPdfTool = safeLazy(() => import("./SplitPdfTool"));
const PdfPageCounterTool = safeLazy(() => import("./PdfPageCounterTool"));
const PdfMetadataViewerTool = safeLazy(() => import("./PdfMetadataViewerTool"));
const PdfReaderTool = safeLazy(() => import("./PdfReaderTool"));
const PdfPageRotatorTool = safeLazy(() => import("./PdfPageRotatorTool"));
const ImageToTextTool = safeLazy(() => import("./ImageToTextTool"));
const ImageToExcelWordTool = safeLazy(() => import("./ImageToExcelWordTool"));
const FaviconGeneratorTool = safeLazy(() => import("./FaviconGeneratorTool"));
const ColorPaletteGeneratorTool = safeLazy(() => import("./ColorPaletteGeneratorTool"));
const WordCounterTool = safeLazy(() => import("./WordCounterTool"));
const CharacterCounterTool = safeLazy(() => import("./CharacterCounterTool"));
const TextCaseConverterTool = safeLazy(() => import("./TextCaseConverterTool"));
const RemoveDuplicatesTool = safeLazy(() => import("./RemoveDuplicatesTool"));
const TextSorterTool = safeLazy(() => import("./TextSorterTool"));
const LoremIpsumTool = safeLazy(() => import("./LoremIpsumTool"));
const RandomTextTool = safeLazy(() => import("./RandomTextTool"));
const TextCompareTool = safeLazy(() => import("./TextCompareTool"));
const TextReverseTool = safeLazy(() => import("./TextReverseTool"));
const RemoveExtraSpacesTool = safeLazy(() => import("./RemoveExtraSpacesTool"));
const RandomWordGeneratorTool = safeLazy(() => import("./RandomWordGeneratorTool"));
const TextToSlugTool = safeLazy(() => import("./TextToSlugTool"));
const JsonFormatterTool = safeLazy(() => import("./JsonFormatterTool"));
const JsonValidatorTool = safeLazy(() => import("./JsonValidatorTool"));
const Base64EncoderTool = safeLazy(() => import("./Base64EncoderTool"));
const Base64DecoderTool = safeLazy(() => import("./Base64DecoderTool"));
const UrlEncoderTool = safeLazy(() => import("./UrlEncoderTool"));
const UrlDecoderTool = safeLazy(() => import("./UrlDecoderTool"));
const UuidGeneratorTool = safeLazy(() => import("./UuidGeneratorTool"));
const RegexTesterTool = safeLazy(() => import("./RegexTesterTool"));
const CsvToJsonTool = safeLazy(() => import("./CsvToJsonTool"));
const JsonToCsvTool = safeLazy(() => import("./JsonToCsvTool"));
const HtmlMinifierTool = safeLazy(() => import("./HtmlMinifierTool"));
const CssMinifierTool = safeLazy(() => import("./CssMinifierTool"));
const JsMinifierTool = safeLazy(() => import("./JsMinifierTool"));
const ColorCodeConverterTool = safeLazy(() => import("./ColorCodeConverterTool"));
const MetaTagGeneratorTool = safeLazy(() => import("./MetaTagGeneratorTool"));
const RobotsTxtTool = safeLazy(() => import("./RobotsTxtTool"));
const SitemapTool = safeLazy(() => import("./SitemapTool"));
const SlugGeneratorTool = safeLazy(() => import("./SlugGeneratorTool"));
const SerpPreviewTool = safeLazy(() => import("./SerpPreviewTool"));
const QrCodeTool = safeLazy(() => import("./QrCodeTool"));
const PasswordGeneratorTool = safeLazy(() => import("./PasswordGeneratorTool"));
const RandomNumberTool = safeLazy(() => import("./RandomNumberTool"));
const TimestampTool = safeLazy(() => import("./TimestampTool"));
const DiceRollerTool = safeLazy(() => import("./DiceRollerTool"));
const CoinFlipTool = safeLazy(() => import("./CoinFlipTool"));
const RandomPickerTool = safeLazy(() => import("./RandomPickerTool"));
const AgeCalculatorTool = safeLazy(() => import("./AgeCalculatorTool"));
const AgeDifferenceTool = safeLazy(() => import("./AgeDifferenceTool"));
const BmiCalculatorTool = safeLazy(() => import("./BmiCalculatorTool"));
const PercentageCalculatorTool = safeLazy(() => import("./PercentageCalculatorTool"));
const LoanEmiTool = safeLazy(() => import("./LoanEmiTool"));
const InterestCalculatorTool = safeLazy(() => import("./InterestCalculatorTool"));
const DiscountCalculatorTool = safeLazy(() => import("./DiscountCalculatorTool"));
const DateDifferenceTool = safeLazy(() => import("./DateDifferenceTool"));
const TimeDurationTool = safeLazy(() => import("./TimeDurationTool"));
const ProfitMarginTool = safeLazy(() => import("./ProfitMarginTool"));
const TipCalculatorTool = safeLazy(() => import("./TipCalculatorTool"));
const AverageCalculatorTool = safeLazy(() => import("./AverageCalculatorTool"));
const PercentageIncreaseTool = safeLazy(() => import("./PercentageIncreaseTool"));
const PercentageDecreaseTool = safeLazy(() => import("./PercentageDecreaseTool"));
const CurrencyConverterTool = safeLazy(() => import("./CurrencyConverterTool"));
const DenominationCalculatorTool = safeLazy(() => import("./DenominationCalculatorTool"));
const SipCalculatorTool = safeLazy(() => import("./SipCalculatorTool"));
const InflationCalculatorTool = safeLazy(() => import("./InflationCalculatorTool"));

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
  "merge-pdf": MergePdfTool,
  "split-pdf": SplitPdfTool,
  "pdf-page-counter": PdfPageCounterTool,
  "pdf-metadata-viewer": PdfMetadataViewerTool,
  "pdf-reader": PdfReaderTool,
  "pdf-page-rotator": PdfPageRotatorTool,
  "image-to-text": ImageToTextTool,
  "image-to-excel-word": ImageToExcelWordTool,
  "favicon-generator": FaviconGeneratorTool,
  "color-palette-generator": ColorPaletteGeneratorTool,
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
  // Age Difference Calculator (separate component with 2 DOB inputs)
  "age-difference-calculator": AgeDifferenceTool,
  // Programmatic SEO — BMI Calculator variants
  "body-mass-index-calculator": BmiCalculatorTool,
  "bmi-for-men": BmiCalculatorTool,
  "bmi-for-women": BmiCalculatorTool,
  "bmi-for-kids": BmiCalculatorTool,
  // Programmatic SEO — Loan Calculator variants
  "mortgage-calculator": LoanEmiTool,
  "personal-loan-calculator": LoanEmiTool,
  "car-loan-calculator": LoanEmiTool,
  "emi-calculator": LoanEmiTool,
  // Finance Tools
  "currency-converter": CurrencyConverterTool,
  "denomination-calculator": DenominationCalculatorTool,
  "sip-calculator": SipCalculatorTool,
  "inflation-calculator": InflationCalculatorTool,
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

  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(`[ToolInterface] No module mapped for slug: "${slug}"`);
    }
    return <p className="text-muted-foreground">Tool interface coming soon.</p>;
  }

  return (
    <ToolErrorBoundary>
      <Suspense fallback={<ToolLoadingFallback />}>
        <Component />
      </Suspense>
    </ToolErrorBoundary>
  );
};

export default ToolInterface;
