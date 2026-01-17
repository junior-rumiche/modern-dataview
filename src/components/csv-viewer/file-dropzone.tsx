"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, AlertCircle, FileType } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface FileDropzoneProps {
    onFileSelect: (file: File) => void;
}

export function FileDropzone({ onFileSelect }: FileDropzoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const validateFile = (file: File) => {
        if (file.size > 10 * 1024 * 1024) {
            setError("File exceeds 10MB limit.");
            return false;
        }
        const navName = file.name.toLowerCase();
        if (!navName.endsWith(".csv") && !navName.endsWith(".xlsx")) {
            setError("Only .csv and .xlsx files are allowed");
            return false;
        }
        setError(null);
        return true;
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                onFileSelect(file);
            }
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                onFileSelect(file);
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
                className={cn(
                    "relative rounded-[2.5rem] border-2 border-dashed transition-all duration-500 ease-out flex flex-col items-center justify-center text-center p-16 gap-8 overflow-hidden group",
                    isDragging
                        ? "border-primary bg-primary/5 scale-[1.02] shadow-2xl shadow-primary/20"
                        : "border-border/40 bg-card/30 hover:border-primary/30 hover:bg-card/50",
                    error ? "border-destructive/50" : ""
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent animate-spin-slow" style={{ animationDuration: '20s' }} />
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-purple-500/10 via-transparent to-transparent opacity-50" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-6">
                    <motion.div
                        animate={{ scale: isDragging ? 1.1 : 1, rotate: isDragging ? 5 : 0 }}
                        className="p-8 rounded-3xl bg-background shadow-xl ring-1 ring-black/5 dark:ring-white/10 relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl" />
                        <Upload className={cn("w-12 h-12 transition-colors", isDragging ? "text-primary" : "text-foreground")} />
                    </motion.div>

                    <div className="space-y-2 max-w-md">
                        <h3 className="text-3xl font-bold tracking-tight">Drop your data here</h3>
                        <p className="text-muted-foreground text-lg">
                            Support for <span className="font-semibold text-foreground">.CSV</span> and <span className="font-semibold text-foreground">.XLSX</span>
                        </p>
                    </div>

                    <div className="mt-4">
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
                            onChange={handleFileInput}
                        />
                        <Button
                            size="lg"
                            className="h-12 px-8 rounded-full font-medium text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                            onClick={() => document.getElementById("file-upload")?.click()}
                        >
                            Browse Files
                        </Button>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center text-destructive text-sm font-medium bg-destructive/10 px-4 py-3 rounded-xl mt-4"
                            >
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="absolute bottom-6 flex items-center gap-6 text-xs font-medium text-muted-foreground/60 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><FileSpreadsheet className="w-3.5 h-3.5" /> Max 10MB</span>
                    <span className="flex items-center gap-1.5"><FileType className="w-3.5 h-3.5" /> Local Processing</span>
                </div>
            </motion.div>
        </div>
    );
}
