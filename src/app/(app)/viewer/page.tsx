import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ViewerShell } from "@/components/csv-viewer/shell";
import { ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function ViewerPage() {
    return (
        <div className="flex flex-col h-screen w-full bg-background">
            {/* Header simple para el visor */}
            <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Modern DataView</h1>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <Button variant="outline" size="sm" disabled>
                        Feedback
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-hidden p-4 md:p-6 bg-muted/10">
                <ViewerShell />
            </main>
        </div>
    );
}
