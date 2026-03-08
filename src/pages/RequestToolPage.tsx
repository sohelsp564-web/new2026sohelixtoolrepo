import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const categories = ["Image Tools", "PDF Tools", "Text Tools", "Developer Tools", "SEO Tools", "Calculator Tools", "Utilities", "Other"];

const RequestToolPage = () => {
  const [toolName, setToolName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !description.trim()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    toast({ title: "Tool request submitted!", description: "Thank you for your suggestion. We'll review it soon." });
    setToolName("");
    setDescription("");
    setCategory("");
  };

  return (
    <>
      <Helmet>
        <title>Request a Tool — Sohelix Tools</title>
        <meta name="description" content="Suggest a new tool for Sohelix Tools. We'd love to hear your ideas!" />
        <link rel="canonical" href="https://sohelix.com/request-tool" />
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk' }}>Request a Tool</h1>
        <p className="text-muted-foreground mb-6">Have an idea for a tool? Let us know and we'll consider adding it!</p>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tool Name *</label>
              <Input placeholder="e.g. CSV to JSON Converter" value={toolName} onChange={e => setToolName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description *</label>
              <Textarea placeholder="Describe what the tool should do..." rows={5} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <Button className="w-full">Submit Request</Button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default RequestToolPage;
