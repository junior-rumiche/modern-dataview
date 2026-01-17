"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { FileDropzone } from "./file-dropzone";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ArrowUpDown, FileSpreadsheet, LayoutPanelLeft, MoreVertical, Search, Settings2, BarChart3, PanelRightClose, PanelRightOpen, Download } from "lucide-react";
import { DataTable } from "./data-table";
import { ColumnDef } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { analyzeColumn, ColumnStats } from "@/lib/analytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from "sonner";

interface ViewerShellProps { }

export function ViewerShell({ }: ViewerShellProps) {
    const [data, setData] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [showStats, setShowStats] = useState(true);
    const [compactMode, setCompactMode] = useState(false);

    const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

    const columnStats = useMemo<ColumnStats | null>(() => {
        if (!selectedColumn || !data.length) return null;
        return analyzeColumn(data, selectedColumn);
    }, [data, selectedColumn]);

    const stats = useMemo(() => {
        if (!data.length) return null;
        return {
            rows: data.length,
            cols: columns.length,
            fileSize: "Unknown",
        }
    }, [data, columns]);

    useEffect(() => {
        const savedData = localStorage.getItem("modern_csv_data");
        const savedColumns = localStorage.getItem("modern_csv_columns");
        const savedName = localStorage.getItem("modern_csv_filename");
        const savedShowStats = localStorage.getItem("modern_csv_show_stats");

        if (savedData && savedColumns && savedName) {
            try {
                setData(JSON.parse(savedData));
                setColumns(JSON.parse(savedColumns));
                setFileName(savedName);
            } catch (e) {
                console.error("Failed to load saved data", e);
            }
        }

        if (savedShowStats !== null) {
            setShowStats(savedShowStats === "true");
        }
    }, []);

    const toggleStats = useCallback(() => {
        const newState = !showStats;
        setShowStats(newState);
        localStorage.setItem("modern_csv_show_stats", String(newState));
    }, [showStats]);



    const saveToStorage = (data: any[], cols: string[], name: string) => {
        try {
            localStorage.setItem("modern_csv_data", JSON.stringify(data));
            localStorage.setItem("modern_csv_columns", JSON.stringify(cols));
            localStorage.setItem("modern_csv_filename", name);
        } catch (e) {
            console.warn("Storage quota exceeded probably", e);
        }
    }

    const handleFileSelect = useCallback((file: File) => {
        setLoading(true);
        setFileName(file.name);

        if (file.name.endsWith(".csv")) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedData = results.data;
                    const meta = results.meta;
                    let fields = meta.fields || [];

                    if (fields.length === 0 && parsedData.length > 0) {
                        fields = Object.keys(parsedData[0] as object);
                    }

                    setData(parsedData as any[]);
                    setColumns(fields);
                    saveToStorage(parsedData as any[], fields, file.name);
                    setLoading(false);
                },
                error: (error) => {
                    console.error(error);
                    setLoading(false);
                }
            });
        } else if (file.name.endsWith(".xlsx")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

                if (jsonData.length > 0) {
                    const fields = Object.keys(jsonData[0] as object);
                    setData(jsonData as any[]);
                    setColumns(fields);
                    saveToStorage(jsonData as any[], fields, file.name);
                }
                setLoading(false);
            };
            reader.readAsBinaryString(file);
        }
    }, []);

    const resetViewer = () => {
        setData([]);
        setColumns([]);
        setFileName(null);
        localStorage.removeItem("modern_csv_data");
        localStorage.removeItem("modern_csv_columns");
        localStorage.removeItem("modern_csv_filename");
    };

    const updateData = useCallback((rowIndex: number, columnId: string, value: any) => {
        setData(old =>
            old.map((row, index) => {
                if (index === rowIndex) {
                    return {
                        ...old[rowIndex]!,
                        [columnId]: value,
                    };
                }
                return row;
            })
        );
    }, []);

    // Selection
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    const deleteSelectedRows = () => {
        const selectedIndices = Object.keys(rowSelection).map(Number);
        const indicesToDelete = new Set(selectedIndices);
        const newData = data.filter((_, index) => !indicesToDelete.has(index));
        setData(newData);
        setRowSelection({});
        toast.success(`Deleted ${selectedIndices.length} rows`);
    };

    const exportSelectedRows = (format: 'csv' | 'xlsx') => {
        const selectedIndices = Object.keys(rowSelection).map(Number);
        const selectedData = data.filter((_, index) => selectedIndices.includes(index));

        if (format === 'csv') {
            const csv = Papa.unparse(selectedData);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `selected_${fileName || "data"}.csv`);
            link.click();
        } else {
            const ws = XLSX.utils.json_to_sheet(selectedData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Selected");
            XLSX.writeFile(wb, `selected_${fileName || "data"}.xlsx`);
        }
        toast.success(`Exported ${selectedData.length} rows`);
    }

    const tableColumns = useMemo<ColumnDef<any>[]>(() => {
        const selectionColumn: ColumnDef<any> = {
            id: "select",
            header: ({ table }) => (
                <div className="px-1">
                    <input
                        type="checkbox"
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate" as any)}
                        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
                        className="accent-primary h-4 w-4 rounded border-gray-300 cursor-pointer"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <input
                        type="checkbox"
                        checked={row.getIsSelected()}
                        onChange={(e) => row.toggleSelected(!!e.target.checked)}
                        className="accent-primary h-4 w-4 rounded border-gray-300 cursor-pointer"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        };

        const dataCols = columns.map((col) => ({
            accessorKey: col,
            header: ({ column }: { column: any }) => {
                return (
                    <div className="flex items-center space-x-2 group">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                column.toggleSorting(column.getIsSorted() === "asc");
                                setSelectedColumn(col);
                                if (!showStats) {
                                    setShowStats(true);
                                    localStorage.setItem("modern_csv_show_stats", "true");
                                }
                            }}
                            className={`-ml-4 h-8 text-xs uppercase tracking-wider font-semibold hover:text-foreground ${selectedColumn === col ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                        >
                            {col}
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ${selectedColumn === col ? 'opacity-100 text-primary' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedColumn(col);
                                if (!showStats) {
                                    setShowStats(true);
                                    localStorage.setItem("modern_csv_show_stats", "true");
                                }
                            }}
                        >
                            <BarChart3 className="h-3 w-3" />
                        </Button>
                    </div>
                )
            },
            cell: ({ getValue, row, column, table }: any) => {
                const initialValue = getValue();
                const [value, setValue] = useState(initialValue);
                const [isEditing, setIsEditing] = useState(false);
                const columnId = column.id;

                useEffect(() => {
                    setValue(initialValue);
                }, [initialValue]);

                const onBlur = () => {
                    setIsEditing(false);
                    if (value !== initialValue) {
                        updateData(row.index, columnId, value);
                        toast.success(`Updated row ${row.index + 1}`, {
                            description: `${columnId} changed from "${initialValue}" to "${value}"`,
                            duration: 2000
                        });
                    }
                };

                if (isEditing) {
                    return (
                        <input
                            title="Editor"
                            value={value as string}
                            onChange={e => setValue(e.target.value)}
                            onBlur={onBlur}
                            autoFocus
                            className="w-full bg-background border rounded px-1 min-h-[1.5rem] focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") onBlur();
                            }}
                        />
                    )
                }

                return (
                    <div
                        className={`truncate max-w-[300px] cursor-pointer hover:bg-muted/50 rounded px-1 transition-colors min-h-[1.5rem] flex items-center ${compactMode ? 'py-0.5 text-xs' : 'py-2 text-sm'}`}
                        onClick={() => setIsEditing(true)}
                        title="Click to edit"
                    >
                        {value as React.ReactNode || <span className="text-muted-foreground/30 italic text-xs">empty</span>}
                    </div>
                );
            },
        }));

        return [selectionColumn, ...dataCols];
    }, [columns, compactMode, selectedColumn, updateData]);

    const exportToCSV = () => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `exported_${fileName || "data"}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToXLSX = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `exported_${fileName || "data"}.xlsx`);
    };

    const deduplicateRows = () => {
        const uniqueData = data.filter((row, index, self) =>
            index === self.findIndex((t) => (
                JSON.stringify(t) === JSON.stringify(row)
            ))
        );
        const removedCount = data.length - uniqueData.length;
        if (removedCount > 0) {
            setData(uniqueData);
            toast.success(`Removed ${removedCount} duplicate rows 🧹`);
        } else {
            toast.info("No duplicates found ✨");
        }
    };

    const [isJsonMode, setIsJsonMode] = useState(false);

    if (loading) {
        return (
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center space-y-6 bg-background/50 backdrop-blur-sm rounded-xl border">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <div className="absolute inset-0 h-12 w-12 border-t-2 border-primary/20 rounded-full" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold animate-pulse">Processing huge dataset...</h3>
                    <p className="text-muted-foreground text-sm">Parsing thousands of rows locally.</p>
                </div>
            </div>
        )
    }

    if (data.length > 0) {
        return (
            <div className="flex h-[calc(100vh-8rem)] w-full gap-4">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 bg-background rounded-2xl border shadow-sm overflow-hidden relative">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm z-10 sticky top-0 h-[72px]">
                        <AnimatePresence mode="wait">
                            {Object.keys(rowSelection).length > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="flex items-center gap-2 w-full"
                                    key="bulk-actions"
                                >
                                    <div className="flex items-center gap-2 mr-auto">
                                        <Badge variant="default" className="bg-primary text-primary-foreground">
                                            {Object.keys(rowSelection).length} selected
                                        </Badge>
                                        <Separator orientation="vertical" className="h-6" />
                                        <Button variant="destructive" size="sm" onClick={deleteSelectedRows} className="h-8 text-xs gap-1">
                                            <Trash2 className="w-3 h-3" />
                                            Delete
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => exportSelectedRows('csv')} className="h-8 text-xs gap-1">
                                            <FileSpreadsheet className="w-3 h-3" />
                                            Export CSV
                                        </Button>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setRowSelection({})} className="h-8 text-xs text-muted-foreground">
                                        Clear Selection
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="flex items-center justify-between w-full"
                                    key="normal-toolbar"
                                >
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                                            <FileSpreadsheet className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h2 className="font-semibold truncate text-sm sm:text-base">{fileName}</h2>
                                            <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span>{stats?.rows.toLocaleString()} rows</span>
                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                <span>{stats?.cols} cols</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {/* Tools Menu */}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={deduplicateRows}
                                            className="h-9 hidden sm:flex gap-2"
                                            title="Remove identified duplicates"
                                        >
                                            <Settings2 className="w-4 h-4" />
                                            <span className="sr-only sm:not-sr-only">Dedup</span>
                                        </Button>

                                        <div className="hidden md:flex items-center bg-secondary/50 rounded-lg p-1 border">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsJsonMode(false)}
                                                className={`h-8 px-3 text-xs gap-2 ${!isJsonMode ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                                            >
                                                <LayoutPanelLeft className="w-3 h-3" />
                                                Table
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setIsJsonMode(true)}
                                                className={`h-8 px-3 text-xs gap-2 ${isJsonMode ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                                            >
                                                <div className="font-mono text-[10px]">{`{}`}</div>
                                                JSON
                                            </Button>
                                        </div>


                                        <Button variant="outline" size="icon" className="h-9 w-9" onClick={resetViewer}>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-9 w-9 ${showStats ? 'bg-secondary' : ''}`}
                                            onClick={toggleStats}
                                            title={showStats ? "Hide Insights" : "Show Insights"}
                                        >
                                            <PanelRightOpen className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Table Area or JSON View */}
                    <div className="flex-1 overflow-auto bg-card/30 relative">
                        {isJsonMode ? (
                            <div className="absolute inset-0 p-4">
                                <div className="h-full w-full rounded-lg border bg-zinc-950 p-4 overflow-auto font-mono text-xs text-zinc-50 shadow-inner">
                                    <pre>{JSON.stringify(data, null, 2)}</pre>
                                </div>
                            </div>
                        ) : (
                            <DataTable
                                columns={tableColumns}
                                data={data}
                                compact={compactMode}
                                rowSelection={rowSelection}
                                setRowSelection={setRowSelection}
                            />
                        )}
                    </div>
                </div>

                {/* Right Sidebar (Stats & Actions) */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: showStats ? 320 : 0, opacity: showStats ? 1 : 0 }}
                    className="hidden md:flex flex-col gap-4 shrink-0 overflow-hidden"
                >

                    <div className="bg-background border rounded-2xl shadow-sm h-full flex flex-col overflow-hidden w-[320px]">
                        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                            <h3 className="font-semibold flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-primary" />
                                Data Insights
                            </h3>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowStats(false)}>
                                <PanelRightClose className="w-3 h-3" />
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-6">
                                {/* Auto-Analysis Section */}
                                {selectedColumn ? (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Column Analysis</p>
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-lg truncate" title={selectedColumn}>{selectedColumn}</h4>
                                                <Badge variant="secondary" className="uppercase text-[10px]">{columnStats?.type}</Badge>
                                            </div>
                                        </div>

                                        {/* Key Metrics Grid */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="bg-card border rounded-lg p-2.5 space-y-1">
                                                <span className="text-[10px] text-muted-foreground uppercase">Unique</span>
                                                <p className="font-mono font-medium">{columnStats?.uniqueCount.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-card border rounded-lg p-2.5 space-y-1">
                                                <span className="text-[10px] text-muted-foreground uppercase">Empty</span>
                                                <p className="font-mono font-medium text-destructive">{columnStats?.emptyCount.toLocaleString()}</p>
                                            </div>
                                            {columnStats?.numericStats && (
                                                <>
                                                    <div className="bg-card border rounded-lg p-2.5 space-y-1 col-span-2">
                                                        <div className="flex justify-between items-baseline">
                                                            <span className="text-[10px] text-muted-foreground uppercase">Sum</span>
                                                            <p className="font-mono font-medium text-primary">{columnStats.numericStats.sum.toLocaleString()}</p>
                                                        </div>
                                                        <div className="flex justify-between items-baseline">
                                                            <span className="text-[10px] text-muted-foreground uppercase">Avg</span>
                                                            <p className="font-mono font-medium">{columnStats.numericStats.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="bg-card border rounded-lg p-2.5 space-y-1">
                                                        <span className="text-[10px] text-muted-foreground uppercase">Min</span>
                                                        <p className="font-mono font-medium">{columnStats.numericStats.min.toLocaleString()}</p>
                                                    </div>
                                                    <div className="bg-card border rounded-lg p-2.5 space-y-1">
                                                        <span className="text-[10px] text-muted-foreground uppercase">Max</span>
                                                        <p className="font-mono font-medium">{columnStats.numericStats.max.toLocaleString()}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Chart */}
                                        <div className="space-y-2">
                                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                Distribution <span className="text-[10px] opacity-70">(Top {columnStats?.topValues.length})</span>
                                            </p>
                                            <div className="h-[180px] w-full border rounded-lg bg-card/50 p-2">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={columnStats?.topValues}>
                                                        <XAxis
                                                            dataKey="value"
                                                            fontSize={10}
                                                            tickLine={false}
                                                            axisLine={false}
                                                            interval={0}
                                                            angle={-45}
                                                            textAnchor="end"
                                                            height={40}
                                                            stroke="var(--muted-foreground)"
                                                        />
                                                        <Tooltip
                                                            contentStyle={{
                                                                borderRadius: '8px',
                                                                fontSize: '12px',
                                                                backgroundColor: 'var(--popover)',
                                                                borderColor: 'var(--border)',
                                                                color: 'var(--popover-foreground)',
                                                                boxShadow: 'var(--shadow-sm)'
                                                            }}
                                                            itemStyle={{ color: 'var(--foreground)' }}
                                                            labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}
                                                            cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                                                        />
                                                        <Bar
                                                            dataKey="count"
                                                            fill="var(--primary)"
                                                            radius={[4, 4, 0, 0]}
                                                            animationDuration={1000}
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl h-[300px]">
                                        <BarChart3 className="w-10 h-10 mb-3 opacity-20" />
                                        <p className="text-sm font-medium">Select a column header</p>
                                        <p className="text-xs opacity-70 mt-1">Click on any column header in the table to view detailed statistics and charts.</p>
                                    </div>
                                )}

                                <Separator />

                                {/* Export Section */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Export Data</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" className="h-16 flex flex-col gap-1 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all" onClick={exportToCSV}>
                                            <FileSpreadsheet className="w-5 h-5" />
                                            <span className="text-xs">CSV</span>
                                        </Button>
                                        <Button variant="outline" className="h-16 flex flex-col gap-1 hover:border-green-500 hover:bg-green-500/5 hover:text-green-600 transition-all" onClick={exportToXLSX}>
                                            <FileSpreadsheet className="w-5 h-5" />
                                            <span className="text-xs">Excel</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] animate-in fade-in duration-500">
            <div className="w-full max-w-2xl px-4">
                <FileDropzone onFileSelect={handleFileSelect} />
                <div className="mt-8 text-center space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">Supported Formats</p>
                    <div className="flex justify-center gap-4">
                        <Badge variant="outline" className="px-3 py-1">.CSV</Badge>
                        <Badge variant="outline" className="px-3 py-1">.XLSX</Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
