import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ContactPage = () => (
  <>
    <Helmet>
      <title>Contact — Sohelix Tools</title>
      <meta name="description" content="Contact the Sohelix Tools team." />
    </Helmet>
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <h1 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Space Grotesk' }}>Contact Us</h1>
      <Card className="p-6">
        <form onSubmit={e => e.preventDefault()} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Name</label>
            <Input placeholder="Your name" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Message</label>
            <Textarea placeholder="Your message..." rows={5} />
          </div>
          <Button className="w-full">Send Message</Button>
        </form>
      </Card>
    </div>
  </>
);

export default ContactPage;
