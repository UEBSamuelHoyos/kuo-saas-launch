const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "samuelhoyosa@gmail.com",
    pass: "pyov oyca ozgu qvrd",
  },
});

app.get("/download-pdf", (req, res) => {
  const filePath = path.join(__dirname, "pdfs", "KUO-Guia.pdf");
  res.download(filePath, "KUO-Como-Reducir-Inventario.pdf");
});

app.post("/send-email", async (req, res) => {
  const { name, email, company, token } = req.body;

  try {
    await transporter.sendMail({
      from: '"KUO" <samuelhoyosa@gmail.com>',
      to: email,
      subject: "Confirma tu correo para descargar tu PDF — KUO",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0f1a;color:#ffffff;padding:40px;border-radius:12px;">
          <h1 style="font-size:24px;margin-bottom:8px;">Hola, ${name} 👋</h1>
          <p style="color:#a0a0b0;font-size:15px;">Gracias por tu interés en KUO.</p>
          <div style="background:#1a1a2e;border-radius:8px;padding:24px;margin:24px 0;">
            <p style="margin:0;font-size:15px;line-height:1.7;">
              Recibimos tu solicitud de consultoría para <strong>${company}</strong>.<br/><br/>
              Haz clic en el botón de abajo para confirmar tu correo, descargar tu PDF y agendar tu consultoría gratuita.
            </p>
          </div>
          <a href="http://localhost:8080/confirmar?token=${token}"
             style="display:inline-block;background:#e91e8c;color:white;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;margin:16px 0;">
            Confirmar correo y descargar PDF →
          </a>
          <p style="color:#606070;font-size:12px;margin-top:32px;">
            Si no solicitaste esto ignora este correo.<br/>
            KUO · samuelhoyosa@gmail.com
          </p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error enviando correo de confirmacion:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/send-calendly", async (req, res) => {
  const { name, email } = req.body;

  try {
    await transporter.sendMail({
      from: '"KUO" <samuelhoyosa@gmail.com>',
      to: email,
      subject: "Agenda tu consultoría gratuita — KUO",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f0f1a;color:#ffffff;padding:40px;border-radius:12px;">
          <h1 style="font-size:24px;margin-bottom:8px;">¡Tu PDF ya está descargado! 🎉</h1>
          <p style="color:#a0a0b0;font-size:15px;">Ahora agenda tu consultoría gratuita.</p>
          <div style="background:#1a1a2e;border-radius:8px;padding:24px;margin:24px 0;">
            <p style="margin:0;font-size:15px;line-height:1.7;">
              Hola ${name}, elige el horario que mejor te quede y en esa llamada aterrizamos todo con los datos reales de tu empresa.
            </p>
          </div>
          <a href="https://calendly.com/samuelhoyosa?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}"
             style="display:inline-block;background:#e91e8c;color:white;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;margin:16px 0;">
            Agendar mi consultoría gratuita →
          </a>
          <p style="color:#606070;font-size:12px;margin-top:32px;">
            KUO · samuelhoyosa@gmail.com
          </p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error enviando correo de calendly:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("Servidor corriendo en http://localhost:3001");
});