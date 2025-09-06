import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-display">Payment Required</DialogTitle>
          <DialogDescription>
            Complete your payment to proceed with the order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Image */}
          <div className="flex justify-center">
            <img 
              src="/qr.jpeg" 
              alt="Payment QR Code"
              className="max-w-full h-auto rounded-lg shadow-md"
              style={{ maxHeight: '300px' }}
            />
          </div>

          {/* Payment Message */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-primary">
              No time, thought of adding stripe, till then pay 50rs for efforts
            </p>
            <p className="text-sm text-muted-foreground">
              Scan the QR code above to complete your payment
            </p>
          </div>

          {/* Close Button */}
          <Button 
            onClick={onClose}
            className="w-full gradient-primary text-primary-foreground border-0 hover:opacity-90"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};