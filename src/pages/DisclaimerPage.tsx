import { Helmet } from "react-helmet-async";

const DisclaimerPage = () => (
  <>
    <Helmet>
      <title>Disclaimer — Sohelix Tools</title>
      <meta name="description" content="Disclaimer for Sohelix Tools. Read about limitations and responsibilities." />
      <link rel="canonical" href="https://sohelix.com/disclaimer" />
    </Helmet>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Disclaimer</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
        <p>The tools and results provided on Sohelix Tools are for informational purposes only.</p>

        <h2 className="text-foreground font-semibold text-lg">No Guarantees</h2>
        <p>While we strive for accuracy, Sohelix Tools does not guarantee the accuracy, reliability, or completeness of any tool output. Results may vary depending on input data and browser capabilities.</p>

        <h2 className="text-foreground font-semibold text-lg">Use at Your Own Risk</h2>
        <p>Users use all tools at their own risk. Sohelix Tools is not liable for any damages, losses, or issues arising from the use of our tools or reliance on their output.</p>

        <h2 className="text-foreground font-semibold text-lg">Verification</h2>
        <p>Users are responsible for verifying the output of any tool before using it in production, critical, or professional applications.</p>

        <h2 className="text-foreground font-semibold text-lg">Contact</h2>
        <p>If you have concerns, please reach out to us at <a href="mailto:sohel.contact@gmail.com" className="text-primary hover:underline">sohel.contact@gmail.com</a>.</p>
      </div>
    </div>
  </>
);

export default DisclaimerPage;
