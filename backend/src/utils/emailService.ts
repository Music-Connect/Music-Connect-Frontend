import nodemailer from "nodemailer";

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "587");
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

console.log("[EMAIL] Config loaded:", {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  userSet: !!EMAIL_USER,
  passwordSet: !!EMAIL_PASSWORD,
});

// Create transporter
const createTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn(
      "[EMAIL] Email credentials not configured. Emails will not be sent.",
    );
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
};

const transporter = createTransporter();

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
): Promise<boolean> => {
  if (!transporter) {
    console.log(
      `[EMAIL] Skipping email send (not configured). Reset token: ${resetToken}`,
    );
    return false;
  }

  const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"Music Connect" <${EMAIL_FROM}>`,
    to: email,
    subject: "Recuperação de Senha - Music Connect",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperação de Senha</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎵 Music Connect</h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Recuperação de Senha</h2>
                      <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                        Você solicitou a recuperação de senha da sua conta Music Connect.
                      </p>
                      <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                        Clique no botão abaixo para redefinir sua senha:
                      </p>
                      
                      <!-- Button -->
                      <table role="presentation" style="margin: 0 auto;">
                        <tr>
                          <td style="border-radius: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <a href="${resetUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">
                              Redefinir Senha
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                        Ou copie e cole este link no seu navegador:
                      </p>
                      <p style="margin: 10px 0; padding: 12px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all; font-size: 14px; color: #667eea;">
                        ${resetUrl}
                      </p>
                      
                      <p style="margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                        ⏱️ Este link expira em <strong>1 hora</strong>.
                      </p>
                      
                      <p style="margin: 20px 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                        Se você não solicitou a recuperação de senha, ignore este email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        © ${new Date().getFullYear()} Music Connect. Todos os direitos reservados.
                      </p>
                      <p style="margin: 10px 0 0; color: #999999; font-size: 12px;">
                        Conectando artistas e contratantes
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Recuperação de Senha - Music Connect

Você solicitou a recuperação de senha da sua conta Music Connect.

Clique no link abaixo para redefinir sua senha:
${resetUrl}

Este link expira em 1 hora.

Se você não solicitou a recuperação de senha, ignore este email.

---
© ${new Date().getFullYear()} Music Connect
Conectando artistas e contratantes
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Password reset email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[EMAIL] Error sending password reset email:", error);
    return false;
  }
};

/**
 * Send email verification email
 */
export const sendEmailVerificationEmail = async (
  email: string,
  verificationToken: string,
): Promise<boolean> => {
  if (!transporter) {
    console.log(
      `[EMAIL] Skipping email send (not configured). Verification token: ${verificationToken}`,
    );
    return false;
  }

  const verificationUrl = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"Music Connect" <${EMAIL_FROM}>`,
    to: email,
    subject: "Verificacao de Email - Music Connect",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificacao de Email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">🎵 Music Connect</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">Verificacao de Email</h2>
                      <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.5;">
                        Confirme seu email para ativar sua conta no Music Connect.
                      </p>
                      <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.5;">
                        Clique no botao abaixo para verificar seu email:
                      </p>
                      <table role="presentation" style="margin: 0 auto;">
                        <tr>
                          <td style="border-radius: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                            <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">
                              Verificar Email
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                        Ou copie e cole este link no seu navegador:
                      </p>
                      <p style="margin: 10px 0; padding: 12px; background-color: #f8f9fa; border-radius: 4px; word-break: break-all; font-size: 14px; color: #667eea;">
                        ${verificationUrl}
                      </p>
                      <p style="margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                        ⏱️ Este link expira em <strong>24 horas</strong>.
                      </p>
                      <p style="margin: 20px 0 0; color: #999999; font-size: 14px; line-height: 1.5;">
                        Se voce nao criou uma conta, ignore este email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                      <p style="margin: 0; color: #999999; font-size: 12px;">
                        © ${new Date().getFullYear()} Music Connect. Todos os direitos reservados.
                      </p>
                      <p style="margin: 10px 0 0; color: #999999; font-size: 12px;">
                        Conectando artistas e contratantes
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Verificacao de Email - Music Connect

Confirme seu email para ativar sua conta no Music Connect.

Clique no link abaixo para verificar seu email:
${verificationUrl}

Este link expira em 24 horas.

Se voce nao criou uma conta, ignore este email.

---
© ${new Date().getFullYear()} Music Connect
Conectando artistas e contratantes
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Email verification sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[EMAIL] Error sending verification email:", error);
    return false;
  }
};

/**
 * Verify email configuration
 */
export const verifyEmailConfig = async (): Promise<boolean> => {
  if (!transporter) {
    return false;
  }

  try {
    await transporter.verify();
    console.log("[EMAIL] Email service is ready");
    return true;
  } catch (error) {
    console.error("[EMAIL] Email service verification failed:", error);
    return false;
  }
};
