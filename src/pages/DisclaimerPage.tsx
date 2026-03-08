import { Helmet } from "react-helmet-async";

const DisclaimerPage = () => (
  <>
    <Helmet><title>Disclaimer — Sohelix Tools</title></Helmet>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Disclaimer</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
        <p>The tools provided on Sohelix Tools are offered "as is" without any warranties. We strive for accuracy but cannot guarantee perfect results in all cases.</p>
        <p>Users are responsible for verifying the output of any tool before using it in production or critical applications.</p>
        <p>Sohelix Tools is not liable for any damages arising from the use of our tools.</p>
      </div>
    </div>
  </>
);

export default DisclaimerPage;
