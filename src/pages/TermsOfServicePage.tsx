import { Helmet } from "react-helmet-async";

const TermsOfServicePage = () => (
  <>
    <Helmet>
      <title>Terms of Service — Sohelix Tools</title>
      <meta name="description" content="Terms of Service for Sohelix Tools. Read our terms for using our free online tools." />
      <link rel="canonical" href="https://sohelix.com/terms-of-service" />
    </Helmet>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Terms of Service</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
        <p>Welcome to Sohelix Tools. By using our website and tools, you agree to the following terms and conditions.</p>

        <h2 className="text-foreground font-semibold text-lg">General Use</h2>
        <p>The tools provided on Sohelix Tools are intended for general informational and personal use. You may use the tools freely for any lawful purpose.</p>

        <h2 className="text-foreground font-semibold text-lg">No Warranties</h2>
        <p>All tools are provided "as is" without any warranties, express or implied. Sohelix Tools does not guarantee the accuracy, reliability, or completeness of any tool output.</p>

        <h2 className="text-foreground font-semibold text-lg">Limitation of Liability</h2>
        <p>Sohelix Tools is not responsible for any damages, losses, or issues arising from the use of our tools. Users are responsible for verifying any output before using it in critical or production applications.</p>

        <h2 className="text-foreground font-semibold text-lg">Modifications</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the website constitutes acceptance of the updated terms.</p>

        <h2 className="text-foreground font-semibold text-lg">Contact</h2>
        <p>If you have questions about these terms, please contact us at <a href="mailto:sohel.contact@gmail.com" className="text-primary hover:underline">sohel.contact@gmail.com</a>.</p>
      </div>
    </div>
  </>
);

export default TermsOfServicePage;
