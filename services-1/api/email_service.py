import os

import resend


class EmailDeliveryError(Exception):
    pass


def send_password_reset_email(email: str, reset_url: str):
    api_key = os.getenv("RESEND_API_KEY")

    if not api_key:
        raise EmailDeliveryError("El servicio de correo no está disponible.")

    resend.api_key = api_key
    sender = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")
    payload = {
        "from": sender,
        "to": [email],
        "subject": "Restablece tu contraseña",
        "text": (
            "Recibimos una solicitud para restablecer tu contraseña. "
            f"Abre este enlace antes de 30 minutos: {reset_url}\n\n"
            "Si no solicitaste este cambio, puedes ignorar este correo."
        ),
        "html": (
            '<div style="font-family:Arial,sans-serif;line-height:1.6;'
            'max-width:560px;margin:0 auto;padding:24px;color:#17212b">'
            '<h1 style="font-size:24px">Restablece tu contraseña</h1>'
            '<p>Recibimos una solicitud para cambiar la contraseña de tu cuenta.</p>'
            f'<p style="margin:28px 0"><a href="{reset_url}" '
            'style="display:inline-block;background:#087e75;color:#fff;'
            'padding:14px 22px;text-decoration:none;border-radius:4px;'
            'font-weight:700">Crear nueva contraseña</a></p>'
            '<p>El enlace caduca en 30 minutos. Si el botón no funciona, '
            f'<a href="{reset_url}">abre este enlace</a>.</p>'
            '<p>Si no solicitaste este cambio, puedes ignorar este correo.</p>'
            '</div>'
        ),
    }
    try:
        resend.Emails.send(payload)
    except Exception:
        raise EmailDeliveryError("No se pudo enviar el correo.") from None