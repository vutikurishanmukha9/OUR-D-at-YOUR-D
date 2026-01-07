import { useState, useEffect } from 'react';
import { Search, Pill, Activity, AlertTriangle, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { medicinesApi } from '@/services/api';
import { CatalogMedicine } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function MedicinesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [medicines, setMedicines] = useState<CatalogMedicine[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedMedicine, setSelectedMedicine] = useState<CatalogMedicine | null>(null);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setCurrentPage(1); // Reset to page 1 on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchMedicines();
    }, [debouncedQuery, currentPage]);

    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const response = await medicinesApi.search(debouncedQuery, currentPage);
            if (response.success && response.data) {
                setMedicines(response.data.medicines);
                setTotalPages(response.data.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch medicines", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <Pill className="h-8 w-8" />
                        Medicine Catalog
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Search for medicines, view compositions, and check side effects.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 max-w-2xl bg-card rounded-lg shadow-sm border">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    className="pl-10 h-12 text-lg border-0 focus-visible:ring-0 bg-transparent"
                    placeholder="Search medicines by name (e.g., Dolo, Paracetamol)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="h-48">
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <>
                    {medicines.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {medicines.map((medicine) => (
                                <Card
                                    key={medicine._id}
                                    className="hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-primary/50 hover:border-l-primary group bg-card/50 backdrop-blur-sm"
                                    onClick={() => setSelectedMedicine(medicine)}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:scale-[1.02] transition-transform origin-left">
                                                {medicine.name}
                                            </CardTitle>
                                            {medicine.price > 0 && (
                                                <Badge variant="secondary" className="font-mono">
                                                    ₹{medicine.price.toFixed(2)}
                                                </Badge>
                                            )}
                                        </div>
                                        <CardDescription className="line-clamp-1">
                                            {medicine.manufacturer}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 text-sm">
                                            {medicine.composition && (
                                                <div className="flex items-start gap-2 text-muted-foreground">
                                                    <Activity className="h-4 w-4 mt-0.5 shrink-0" />
                                                    <span className="line-clamp-2">{medicine.composition}</span>
                                                </div>
                                            )}
                                            {medicine.packSize && (
                                                <Badge variant="outline" className="text-xs">
                                                    {medicine.packSize}
                                                </Badge>
                                            )}
                                            {medicine.isDiscontinued && (
                                                <Badge variant="destructive" className="ml-2 text-xs">
                                                    Discontinued
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                            <Pill className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <h3 className="text-xl font-medium mb-1">No medicines found</h3>
                            <p>Try searching for a different medicine name.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Medicine Details Dialog */}
            <Dialog open={!!selectedMedicine} onOpenChange={(open) => !open && setSelectedMedicine(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Pill className="h-6 w-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl">{selectedMedicine?.name}</DialogTitle>
                                <DialogDescription className="text-base font-medium text-primary">
                                    {selectedMedicine?.manufacturer}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedMedicine && (
                        <div className="space-y-6">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Price</span>
                                    <div className="text-lg font-mono font-bold text-primary mt-1">₹{selectedMedicine.price?.toFixed(2)}</div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pack Size</span>
                                    <div className="text-lg font-medium mt-1">{selectedMedicine.packSize || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80 border-b pb-2">
                                    <Activity className="h-4 w-4 text-secondary" />
                                    Composition
                                </h4>
                                <p className="text-sm leading-relaxed bg-secondary/5 p-3 rounded-md border border-secondary/10">
                                    {selectedMedicine.composition || 'Not available'}
                                </p>
                            </div>

                            {selectedMedicine.description && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80 border-b pb-2">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        Description
                                    </h4>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {selectedMedicine.description}
                                    </p>
                                </div>
                            )}

                            {selectedMedicine.sideEffects && selectedMedicine.sideEffects.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80 border-b pb-2">
                                        <AlertTriangle className="h-4 w-4 text-destructive" />
                                        Side Effects
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMedicine.sideEffects.map((effect, idx) => (
                                            <Badge key={idx} variant="destructive" className="font-normal opacity-90">
                                                {effect}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedMedicine.isDiscontinued && (
                                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span className="font-semibold text-sm">This medicine has been discontinued. Please consult a doctor for alternatives.</span>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
