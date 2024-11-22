import nodemailer from 'nodemailer'

export const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'an865090@gmail.com',
            pass: 'hsffmdkltibqcjfm'
        }
    })
    await transporter.sendMail({
        to,
        from:"'<e-commerce>'an865090@gmail.com",
        subject,
        html
    })
}