import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '481wealthmanager@gmail.com',
    pass: 'teqs hhtzl bbxh xxfb'
  }
});

export async function send2FACode(to, code) {
  await transporter.sendMail({
    from: '"XYZ Investment Platform" <481wealthmanager@gmail.com>',
    to,
    subject: 'Your 2FA Code',
    text: `Your verification code is: ${code}`,
  });
}
