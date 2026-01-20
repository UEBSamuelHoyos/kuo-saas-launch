import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingDown, Clock, BarChart3 } from "lucide-react";

interface HeroProps {
  onOpenModal: () => void;
}

const Hero = ({ onOpenModal }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero glow-effect overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kuo-purple/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-kuo-pink/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="container mx-auto px-6 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm animate-fade-in">
            <TrendingDown className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Optimización de Inventario con IA</span>
          </div>

          {/* Main Title */}
          <h1 
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            Reducimos tu nivel de inventario hasta un{' '}
            <span className="text-gradient">30%</span>{' '}
            en menos de un año
          </h1>

          {/* Description */}
          <p 
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            Transforma la gestión de tu inventario con nuestra tecnología de punta. 
            Reducimos costos, optimizamos procesos y maximizamos la eficiencia de tu cadena de suministro.
          </p>

          {/* Features row */}
          <div 
            className="flex flex-wrap justify-center gap-6 py-4 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5 text-primary" />
              <span>Resultados en 12 meses</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Análisis predictivo</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="w-5 h-5 text-primary" />
              <span>Reducción garantizada</span>
            </div>
          </div>

          {/* CTA Button */}
          <div 
            className="pt-4 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <Button 
              onClick={onOpenModal}
              variant="cta"
              size="xl"
              className="group"
            >
              Solicita tu Consultoría Gratis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Sin compromisos • Análisis personalizado • 100% gratuito
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
