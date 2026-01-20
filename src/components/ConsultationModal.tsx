import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Download, CheckCircle2 } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  company: string;
  position: string;
  phone: string;
  acceptTerms: boolean;
}

const ConsultationModal = ({ isOpen, onClose }: ConsultationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    company: "",
    position: "",
    phone: "",
    acceptTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }));
  };

  const generatePDF = () => {
    // Create a simple text-based PDF content
    const pdfContent = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 500 >>
stream
BT
/F1 24 Tf
50 700 Td
(KUO - Optimizacion de Inventario) Tj
0 -40 Td
/F1 14 Tf
(Gracias por tu interes en nuestros servicios, ${formData.name}!) Tj
0 -30 Td
(Empresa: ${formData.company}) Tj
0 -25 Td
(Cargo: ${formData.position}) Tj
0 -40 Td
/F1 12 Tf
(Nuestros Servicios:) Tj
0 -25 Td
(- Reduccion de inventario hasta 30%) Tj
0 -20 Td
(- Analisis predictivo con IA) Tj
0 -20 Td
(- Optimizacion de cadena de suministro) Tj
0 -20 Td
(- Consultoria especializada) Tj
0 -40 Td
(Contacto: info@kuo.com) Tj
0 -20 Td
(Web: www.kuo.com) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000266 00000 n
0000000817 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
896
%%EOF
    `;

    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "KUO-Informacion-Servicios.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      toast({
        title: "Error",
        description: "Debes aceptar los términos y condiciones",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.company || !formData.position || !formData.phone) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate and download PDF
    generatePDF();

    setIsSubmitting(false);
    setIsSuccess(true);

    toast({
      title: "¡Éxito!",
      description: "Tu PDF se está descargando. Pronto recibirás un correo con más información.",
    });

    // Reset after a delay
    setTimeout(() => {
      setIsSuccess(false);
      setFormData({
        name: "",
        company: "",
        position: "",
        phone: "",
        acceptTerms: false,
      });
      onClose();
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">
            {isSuccess ? "¡Gracias por tu interés!" : "Consultoría Gratuita"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSuccess
              ? "Tu PDF se ha descargado. Revisa tu correo para más información."
              : "Completa tus datos y recibe información detallada sobre cómo podemos ayudar a tu empresa."}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <p className="text-center text-muted-foreground">
              Nuestro equipo se pondrá en contacto contigo pronto.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Nombre completo</Label>
              <Input
                id="name"
                name="name"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-foreground">Nombre de la empresa</Label>
              <Input
                id="company"
                name="company"
                placeholder="Nombre de tu empresa"
                value={formData.company}
                onChange={handleInputChange}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-foreground">Cargo en la empresa</Label>
              <Input
                id="position"
                name="position"
                placeholder="Tu cargo"
                value={formData.position}
                onChange={handleInputChange}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={handleCheckboxChange}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                Acepto los términos y condiciones y autorizo el tratamiento de mis datos personales.
              </Label>
            </div>

            <Button
              type="submit"
              variant="cta"
              size="lg"
              className="w-full mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                  Procesando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Solicitar y Descargar PDF
                </span>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;
