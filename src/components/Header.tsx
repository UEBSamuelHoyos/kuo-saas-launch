import kuoLogo from "@/assets/kuo-logo.jpeg";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onOpenModal: () => void;
}

const Header = ({ onOpenModal }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={kuoLogo} 
            alt="Kuo Logo" 
            className="h-12 w-12 rounded-full object-cover"
          />
          <span className="font-display text-2xl font-bold text-foreground">
            KUO
          </span>
        </div>
        
        <Button 
          onClick={onOpenModal}
          variant="cta"
          size="lg"
          className="animate-pulse-glow"
        >
          Consultoría Gratis
        </Button>
      </div>
    </header>
  );
};

export default Header;
