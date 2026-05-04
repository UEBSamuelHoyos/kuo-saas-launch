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
import { Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  position: string;
  phone: string;
  acceptTerms: boolean;
}

const generateToken = () => {
  return crypto.randomUUID();
};

const ConsultationModal = ({ isOpen, onClose }: ConsultationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
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

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    if (!formData.name || !formData.email || !formData.company || !formData.position || !formData.phone) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Error",
        description: "Por favor ingresa un correo electrónico válido",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const token = generateToken();

    const { error } = await supabase.from("leads").insert([
      {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        position: formData.position,
        phone: formData.phone,
        token: token,
        confirmado: false,
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al guardar tus datos. Intenta de nuevo.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const emailRes = await fetch("http://localhost:3001/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        token: token,
      }),
    });

    if (!emailRes.ok) {
      toast({
        title: "Error",
        description: "Hubo un problema enviando el correo. Intenta de nuevo.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setFormData({
      name: "",
      email: "",
      company: "",
      position: "",
      phone: "",
      acceptTerms: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground">
            {isSuccess ? "¡Revisa tu correo!" : "Consultoría Gratuita"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSuccess
              ? "Te enviamos un correo para confirmar tu solicitud."
              : "Completa tus datos y recibe información detallada sobre cómo podemos ayudar a tu empresa."}
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-foreground font-medium">
                Enviamos un correo a
              </p>
              <p className="text-primary font-bold text-lg">
                {formData.email}
              </p>
              <p className="text-muted-foreground text-sm">
                Haz clic en el enlace del correo para confirmar tu cuenta, descargar tu PDF y agendar tu consultoría gratuita.
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={handleClose}
            >
              <Mail className="w-4 h-4 mr-2" />
              Entendido
            </Button>
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
              <Label htmlFor="email" className="text-foreground">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@empresa.com"
                value={formData.email}
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
                placeholder="+57 300 000 0000"
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
                  <Mail className="w-4 h-4" />
                  Solicitar consultoría gratuita
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