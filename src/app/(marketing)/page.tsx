"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileSpreadsheet, Zap, Shield, Sparkles, Database, BarChart3, Lock, CheckCircle2, ChevronRight, Laptop } from "lucide-react";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";
import { AccordionItem } from "@/components/ui/accordion-item";

export default function LandingPage() {
  const features = [
    {
      title: "Instant Parsing",
      description: "Proprietary engine parses 10MB+ CSV files in under 2 seconds.",
      icon: Zap,
      className: "md:col-span-2 bg-gradient-to-br from-primary/5 to-primary/10",
    },
    {
      title: "100% Private",
      description: "Data never leaves your device. Local browser processing only.",
      icon: Lock,
      className: "md:col-span-1 bg-card",
    },
    {
      title: "Excel Compatible",
      description: "Native .xlsx support. No conversion needed.",
      icon: FileSpreadsheet,
      className: "md:col-span-1 bg-card",
    },
    {
      title: "Smart Filtering",
      description: "SQL-like filtering power accessible to everyone.",
      icon: Database,
      className: "md:col-span-2 bg-card",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <Link className="flex items-center justify-center group" href="#">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <span className="ml-3 text-lg font-bold tracking-tight">Modern DataView</span>
          </Link>
          <nav className="flex items-center gap-6 sm:gap-8">
            <Link className="hidden md:block text-sm font-medium hover:text-primary transition-colors" href="#features">Features</Link>
            <Link className="hidden md:block text-sm font-medium hover:text-primary transition-colors" href="#faq">FAQ</Link>
            <ModeToggle />
            <Link href="/viewer">
              <Button variant="default" size="sm" className="hidden sm:inline-flex rounded-full px-6">
                Launch App
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
          {/* Background Grids */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-[100px] opacity-40 dark:opacity-20 pointer-events-none" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-purple-500 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-primary/20 bg-background/50 px-4 py-1.5 text-sm font-medium text-foreground backdrop-blur-xl mb-8 shadow-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              v1.0 Now Available • Free Forever
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 mb-8 pb-2"
            >
              Data analysis <br />
              <span className="text-primary/90">simplified.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-2xl text-muted-foreground md:text-xl leading-relaxed mb-10"
            >
              The professional <strong>CSV & Excel Viewer</strong> that runs entirely in your browser.
              Edit, filter, and export millions of cells instantly. No sign-up required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center"
            >
              <Link href="/viewer">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                  Start Analyzing <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Hero Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              className="mt-20 w-full relative"
            >
              <div className="absolute -inset-1 rounded-[1.5rem] bg-gradient-to-r from-primary to-purple-600 opacity-30 blur-2xl" />
              <div className="relative rounded-2xl border bg-background/50 p-2 backdrop-blur-sm shadow-2xl overflow-hidden ring-1 ring-white/10">
                <div className="rounded-xl border bg-card/90 aspect-[16/9] flex items-center justify-center relative overflow-hidden group">
                  {/* Abstract UI representation */}
                  <div className="w-full h-full p-6 flex flex-col gap-4">
                    <div className="h-8 w-1/3 bg-muted rounded-md animate-pulse" />
                    <div className="flex-1 w-full bg-muted/20 rounded-lg border grid grid-cols-4 gap-4 p-4 overflow-hidden">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="h-4 bg-muted/40 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-background/10 backdrop-blur-[1px]">
                    <div className="bg-background/90 p-6 rounded-2xl border shadow-xl flex flex-col items-center">
                      <FileSpreadsheet className="w-12 h-12 text-primary mb-3" />
                      <span className="font-semibold">Drag & Drop Ready</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>



        {/* Bento Grid Features */}
        <section id="features" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-4">Engineered for performance</h2>
              <p className="text-xl text-muted-foreground">Everything you need to analyze large datasets without slowing down your browser.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`group relative overflow-hidden rounded-3xl border p-8 hover:shadow-lg transition-all duration-300 ${feature.className}`}
                >
                  <div className="absolute top-0 right-0 p-24 bg-gradient-to-br from-foreground/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="mb-6 inline-flex p-3 rounded-2xl bg-background border shadow-sm w-fit group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-muted/30 border-t">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-16 md:text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-4">Simplicity by design</h2>
              <p className="text-xl text-muted-foreground">Three steps to actionable insights.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />
              {[
                { step: "01", title: "Upload", desc: "Drag your .csv or .xlsx file." },
                { step: "02", title: "Analyze", desc: "Filter, sort, and edit instantly." },
                { step: "03", title: "Export", desc: "Download as clean Excel or CSV." }
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center text-center bg-background/50 backdrop-blur-sm p-6 rounded-2xl border shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-6 shadow-lg shadow-primary/20">
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6">Who uses Modern DataView?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  From data scientists to marketing managers, professionals trust us to handle their sensitive data without the cloud overhead.
                </p>
                <div className="space-y-6">
                  {[
                    { title: "Data Analysts", desc: "Quickly inspect large datasets before importing to DBs." },
                    { title: "Marketers", desc: "Clean email lists and campaign data in seconds." },
                    { title: "Developers", desc: "Check JSON exports converted to CSV instantly." }
                  ].map((uc, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
                      <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <h4 className="font-bold">{uc.title}</h4>
                        <p className="text-sm text-muted-foreground">{uc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-3xl -z-10 rounded-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 translate-y-8">
                    <div className="p-6 bg-card border rounded-2xl shadow-xl">
                      <BarChart3 className="h-8 w-8 text-blue-500 mb-4" />
                      <div className="h-2 w-12 bg-muted rounded mb-2" />
                      <div className="h-16 w-full bg-blue-500/10 rounded-lg" />
                    </div>
                    <div className="p-6 bg-card border rounded-2xl shadow-xl">
                      <Laptop className="h-8 w-8 text-purple-500 mb-4" />
                      <div className="h-2 w-16 bg-muted rounded mb-2" />
                      <div className="h-16 w-full bg-purple-500/10 rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-6 bg-card border rounded-2xl shadow-xl">
                      <Database className="h-8 w-8 text-green-500 mb-4" />
                      <div className="h-2 w-12 bg-muted rounded mb-2" />
                      <div className="h-16 w-full bg-green-500/10 rounded-lg" />
                    </div>
                    <div className="p-6 bg-primary text-primary-foreground border-primary rounded-2xl shadow-xl flex flex-col justify-center items-center text-center">
                      <span className="text-4xl font-bold mb-1">10k+</span>
                      <span className="text-xs opacity-80">Daily Users</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-muted/20 border-t">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Common questions about security and features.</p>
            </div>
            <div className="bg-background rounded-2xl border shadow-sm p-6 md:p-8">
              <div className="space-y-2">
                <AccordionItem question="Is my data really private?" answer="Yes. We use 100% client-side processing. Your file is read by your browser using JavaScript and never uploaded to any server. You can even use the app offline." />
                <AccordionItem question="What is the file size limit?" answer="We recommend files up to 10MB for optimal performance. Larger files may work depending on your computer's RAM, but might be slower." />
                <AccordionItem question="Can I convert Excel to CSV?" answer="Absolutely. Just drop your .xlsx file and click 'Export CSV' in the toolbar." />
                <AccordionItem question="Is it free?" answer="Yes, Modern DataView is completely free to use for personal and commercial purposes." />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto bg-background p-8 md:p-12 rounded-3xl border shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to analyze your data?</h2>
              <p className="text-lg text-muted-foreground mb-8">No login, no installation, no fees. Just fast data viewing.</p>
              <Link href="/viewer">
                <Button size="lg" className="h-14 px-10 text-lg rounded-full w-full sm:w-auto shadow-xl hover:scale-105 transition-transform">
                  Open Viewer Now <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-10 border-t bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left text-sm text-muted-foreground">
          <p>© 2026 Modern DataView. developed by <a href="https://github.com/junior-rumiche" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-primary transition-colors">Junior Rumiche</a>.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="https://github.com/junior-rumiche" className="hover:text-foreground transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
