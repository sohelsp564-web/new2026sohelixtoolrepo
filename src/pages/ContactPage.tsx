import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "Thank you for reaching out. We'll get back to you soon." });
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <>
      <Helmet>
        <title>Contact — Sohelix Tools</title>
        <meta name="description" content="Contact the Sohelix Tools team. Reach out for questions, feedback, or suggestions." />
        <link rel="canonical" href="https://sohelix.com/contact" />
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>Contact Us</h1>
        <div className="flex items-center gap-2 text-muted-foreground mb-6">
          <Mail className="h-4 w-4" />
          <a href="mailto:sohel.contact@gmail.com" className="hover:text-primary transition-colors">sohel.contact@gmail.com</a>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name *</label>
              <Input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email *</label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Subject</label>
              <Input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Message *</label>
              <Textarea placeholder="Your message..." rows={5} value={message} onChange={e => setMessage(e.target.value)} />
            </div>
            <Button className="w-full">Send Message</Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ContactPage;
