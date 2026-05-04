import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Confirmar = () => {
  const [searchParams] = useSearchParams();
  const [estado, setEstado] = useState<"cargando" | "exito" | "error">("cargando");

  useEffect(() => {
    const confirmar = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setEstado("error");
        return;
      }

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("token", token)
        .eq("confirmado", false)
        .single();

      if (error || !data) {
        setEstado("error");
        return;
      }

      const { error: updateError } = await supabase
        .from("leads")
        .update({ confirmado: true })
        .eq("token", token);

      if (updateError) {
        setEstado("error");
        return;
      }

      downloadPDF();

      await fetch("http://localhost:3001/send-calendly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
        }),
      });

      setEstado("exito");
    };

    confirmar();
  }, []);

  const downloadPDF = () => {
    window.location.href = "http://localhost:3001/download-pdf";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
      {estado === "cargando" && (
        <div style={{ textAlign: "center", color: "#ffffff" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>Verificando tu correo...</div>
          <div style={{ color: "#a0a0b0" }}>Por favor espera un momento.</div>
        </div>
      )}
      {estado === "exito" && (
        <div style={{ textAlign: "center", color: "#ffffff", maxWidth: "500px", padding: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>¡Correo confirmado!</h1>
          <p style={{ color: "#a0a0b0", marginBottom: "24px" }}>
            Tu PDF se está descargando. Revisa tu correo — te enviamos el link para agendar tu consultoría gratuita.
          </p>
          <a href="/" style={{ display: "inline-block", background: "#e91e8c", color: "white", padding: "14px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>
            Volver a KUO
          </a>
        </div>
      )}
      {estado === "error" && (
        <div style={{ textAlign: "center", color: "#ffffff", maxWidth: "500px", padding: "40px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Link inválido</h1>
          <p style={{ color: "#a0a0b0", marginBottom: "24px" }}>
            Este link ya fue usado o no es válido. Vuelve a la página y solicita el PDF de nuevo.
          </p>
          <a href="/" style={{ display: "inline-block", background: "#e91e8c", color: "white", padding: "14px 28px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>
            Volver a KUO
          </a>
        </div>
      )}
    </div>
  );
};

export default Confirmar;