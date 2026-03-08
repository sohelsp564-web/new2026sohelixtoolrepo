const PdfPlaceholder = () => (
  <div className="text-center py-8">
    <p className="text-muted-foreground">This PDF tool requires uploading a PDF file.</p>
    <p className="text-sm text-muted-foreground mt-2">Upload a PDF and the tool will process it entirely in your browser.</p>
    <input type="file" accept=".pdf" className="mt-4 block mx-auto text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium" />
    <p className="text-xs text-muted-foreground mt-4">Advanced PDF processing coming soon.</p>
  </div>
);

export default PdfPlaceholder;
