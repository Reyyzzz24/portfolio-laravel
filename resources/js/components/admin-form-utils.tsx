import React, { useState, useEffect } from 'react';
import { ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

// 1. Ambil manifes peta ikon resmi dari Lucide (berupa fungsi import asinkronus)
import dynamicIconImports from 'lucide-react/dynamicIconImports';

export const fieldClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50';

// 1. Input Teks
export function TextInput({
    label,
    value,
    onChange,
    error,
    type = 'text',
    disabled = false 
}: {
    label: string;
    value: string | number | null;
    onChange: (v: string) => void;
    error?: string;
    type?: 'text' | 'number';
    disabled?: boolean; // Tambahkan properti ini
}) {
    return (
        <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <input
                type={type}
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled} // Terapkan properti disabled
                className={`${fieldClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
        </label>
    );
}

// 2. Textarea
export function TextArea({ label, value, onChange, error, rows = 3 }: { label: string; value: string | null; onChange: (v: string) => void; error?: string; rows?: number }) {
    return (
        <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <textarea rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={fieldClass} />
            {error && <p className="text-xs text-red-600">{error}</p>}
        </label>
    );
}

// 3. Upload Gambar
export function ImageUploadInput({ label, value, onChange, error }: { label: string; value: string | File | null; onChange: (file: File) => void; error?: string }) {
    const [preview, setPreview] = useState<string | null>(typeof value === 'string' ? value : null);
    return (
        <div className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <div className="flex items-center gap-4 rounded-md border p-3 bg-background shadow-xs">
                {preview ? <img src={preview} alt="Preview" className="h-16 w-28 rounded-md object-cover border" /> : (
                    <div className="flex h-16 w-28 items-center justify-center rounded-md border border-dashed bg-muted text-muted-foreground">
                        <ImagePlus className="h-6 w-6" />
                    </div>
                )}
                <label className="cursor-pointer rounded-md bg-secondary px-3 py-2 text-xs font-medium hover:bg-secondary/80">
                    Choose File
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) { onChange(file); setPreview(URL.createObjectURL(file)); }
                    }} />
                </label>
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}

// 4. Color Picker
export function ColorPickerInput({ label, value, onChange, error }: { label: string; value: string; onChange: (color: string) => void; error?: string }) {
    const formatToHex = (colorVal: string): string => {
        if (!colorVal) return '#3b82f6';
        if (colorVal.startsWith('#')) return colorVal;
        const colorMap: Record<string, string> = { blue: '#3b82f6', green: '#22c55e', purple: '#a855f7', red: '#ef4444', yellow: '#eab308' };
        return colorMap[colorVal.toLowerCase()] || '#3b82f6';
    };
    return (
        <label className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <input type="color" value={formatToHex(value)} onChange={(e) => onChange(e.target.value)} className="h-9 w-12 cursor-pointer rounded-md border p-0 bg-background" />
                <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className={`${fieldClass} font-mono`} placeholder="#ffffff" />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </label>
    );
}

// 2. Kumpulkan semua kunci nama ikon (format kebab-case dari manifest Lucide)
const iconNames = Object.keys(dynamicIconImports);

// 3. Buat Komponen Pembantu LazyIcon Menggunakan React.lazy (Kompatibel Penuh dengan Vite / Inertia)
export function LazyIcon({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
    if (!name) return null;

    // Normalisasi penulisan PascalCase ke kebab-case (misal: 'ArrowRight' menjadi 'arrow-right')
    const kebabName = name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase() as keyof typeof dynamicIconImports;

    const loadIcon = dynamicIconImports[kebabName];

    // Jika nama ikon salah atau tidak terdaftar di pustaka Lucide
    if (!loadIcon) {
        return <span className="text-xs text-muted-foreground">?</span>;
    }

    // Use client-only dynamic import to avoid Suspense + SSR mismatch.
    // Server renders a placeholder <span>, and the client will replace it after loading the icon.
    const isServer = typeof window === 'undefined';

    const [IconComponent, setIconComponent] = useState<React.ComponentType<any> | null>(null);

    useEffect(() => {
        let mounted = true;
        // loadIcon returns a function that returns a Promise resolving to the module
        loadIcon()
            .then((mod: any) => {
                const Loaded = mod?.default || mod;
                if (mounted) setIconComponent(() => Loaded);
            })
            .catch(() => {
                // ignore load errors; keep placeholder
            });

        return () => {
            mounted = false;
        };
    }, [kebabName]);

    // While on server or while icon not yet loaded on client, render the same placeholder
    if (isServer || !IconComponent) {
        return <span className={className} style={style} aria-hidden />;
    }

    const Component = IconComponent as any;
    return <Component className={className} style={style} />;
}

// 5. Komponen Utama Icon Picker
export function LucideIconPicker({ label, value, onChange, error, color }: { label: string; value: string; onChange: (iconName: string) => void; error?: string; color?: string }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    // Saring daftar berdasarkan input pencarian, batasi maksimal 40 item demi stabilitas performa DOM
    const filteredIconNames = iconNames
        .filter(name => name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 40);

    return (
        <div className="block space-y-1">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <Popover open={open} onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) setSearch("");
            }}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between font-normal bg-background">
                        <div className="flex items-center gap-2 overflow-hidden">
                            {value ? (
                                <LazyIcon name={value} className="h-4 w-4 flex-shrink-0" style={{ color: color || 'currentColor' }} />
                            ) : (
                                <span className="text-muted-foreground text-xs">Select icon...</span>
                            )}
                            <span className="truncate text-sm">{value || "None"}</span>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search icon (e.g. code, user)..."
                            value={search}
                            onValueChange={setSearch}
                        />
                        <CommandList>
                            {filteredIconNames.length === 0 && (
                                <CommandEmpty>No icon found.</CommandEmpty>
                            )}
                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                                {filteredIconNames.map((kebabName) => {
                                    // Konversi kembali dari format 'kebab-case' ke 'PascalCase' sebelum disimpan menuju database
                                    const pascalCaseName = kebabName
                                        .split('-')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join('');

                                    return (
                                        <CommandItem
                                            key={kebabName}
                                            value={kebabName}
                                            onSelect={() => {
                                                onChange(pascalCaseName);
                                                setOpen(false);
                                                setSearch("");
                                            }}
                                        >
                                            <div className="flex items-center gap-3 w-full cursor-pointer">
                                                <LazyIcon name={kebabName} className="h-4 w-4 flex-shrink-0" />
                                                <span className="capitalize text-xs">{kebabName.replace(/-/g, ' ')}</span>
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}