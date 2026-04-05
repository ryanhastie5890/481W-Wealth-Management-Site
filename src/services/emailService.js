import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '481wealthmanager2fa@gmail.com',
    pass: 'lvkn clte jyps uzpx'
  }
});

export async function send2FACode(to, code) {
  await transporter.sendMail({
    from: '"Wealth Management" <481wealthmanager2fa@gmail.com>',
    to,
    subject: 'Your 2FA Code',
    text: `Your verification code is: ${code}`,
  });
}