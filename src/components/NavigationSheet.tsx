import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetContent>
        <SheetHeader>
          {/* WAJIB ADA: Tambahkan ini untuk menghilangkan error merah */}
          <SheetTitle>Menu Navigasi</SheetTitle> 
          
          {/* DISARANKAN: Tambahkan ini untuk menghilangkan warning kuning */}
          <SheetDescription>
            Pilih menu untuk mengelola akun TPC Anda.
          </SheetDescription>
        </SheetHeader>
        
        {/* Isi menu Anda seperti Transparansi, Anti-Scam, dll */}
        <div className="grid gap-4 py-4">
          {/* ... items ... */}
        </div>
      </SheetContent>
    </Sheet>
  );
};
