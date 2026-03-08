import { Helmet } from "react-helmet-async";

const PrivacyPage = () => (
  <>
    <Helmet>
      <title>Privacy Policy — Sohelix Tools</title>
      <meta name="description" content="Privacy Policy for Sohelix Tools. Learn how we protect your data and privacy." />
      <link rel="canonical" href="https://sohelix.com/privacy-policy" />
    </Helmet>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Privacy Policy</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
        <p>At Sohelix Tools, your privacy is our top priority. We are committed to protecting your personal information and being transparent about how our website works.</p>

        <h2 className="text-foreground font-semibold text-lg">How Our Tools Work</h2>
        <p>All tools on Sohelix Tools run entirely in your browser. No files are uploaded to any server. All processing happens locally on your device, ensuring your data never leaves your control.</p>

        <h2 className="text-foreground font-semibold text-lg">Data Collection</h2>
        <p>We do not collect, store, or process any files or data you use with our tools. Your documents, images, and text remain on your device at all times.</p>

        <h2 className="text-foreground font-semibold text-lg">Cookies</h2>
        <p>We may use cookies for theme preferences, analytics, and advertising services. These cookies help us understand how visitors use our website and may be used by third-party advertising partners to serve relevant ads.</p>

        <h2 className="text-foreground font-semibold text-lg">Third-Party Services</h2>
        <p>We may use third-party analytics and advertising services (such as Google Analytics and Google AdSense). These services may collect anonymized usage data through cookies. Please refer to their respective privacy policies for more information.</p>

        <h2 className="text-foreground font-semibold text-lg">Contact</h2>
        <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:sohel.contact@gmail.com" className="text-primary hover:underline">sohel.contact@gmail.com</a>.</p>
      </div>
    </div>
  </>
);

export default PrivacyPage;
