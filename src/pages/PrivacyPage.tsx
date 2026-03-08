import { Helmet } from "react-helmet-async";

const PrivacyPage = () => (
  <>
    <Helmet><title>Privacy Policy — Sohelix Tools</title></Helmet>
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Privacy Policy</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground space-y-4">
        <p>At Sohelix Tools, your privacy is our top priority. All tools run entirely in your browser — no files are uploaded to any server.</p>
        <h2 className="text-foreground font-semibold text-lg">Data Collection</h2>
        <p>We do not collect, store, or process any files you use with our tools. All processing happens locally on your device.</p>
        <h2 className="text-foreground font-semibold text-lg">Cookies</h2>
        <p>We may use cookies for theme preferences and analytics purposes only.</p>
        <h2 className="text-foreground font-semibold text-lg">Third-Party Services</h2>
        <p>We may use third-party analytics and advertising services. These services may collect anonymized usage data.</p>
      </div>
    </div>
  </>
);

export default PrivacyPage;
