import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export const TPCPurchaseDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Beli TPC Sekarang</Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>Aktivasi Akun</DialogTitle>
          </VisuallyHidden.Root>
          <DialogDescription>Instruksi pembayaran.</DialogDescription>
        </DialogHeader>

        {/* Isi form atau instruksi pembayaran Anda di bawah sini */}
        <div className="py-4">
           <p className="text-sm text-muted-foreground">Transfer ke Rekening: XXXX-XXXX</p>
           {/* Tombol Konfirmasi Bayar */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
