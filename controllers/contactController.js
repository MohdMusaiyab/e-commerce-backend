import nodemailer from "nodemailer";
const  contactController = async (req, res) => {
  try {
    const{name,email,message}=req.body;
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'sarina.konopelski46@ethereal.email',
            pass: 'HxKXHStASr9bt4xZYy'
        }
    });
    let info = await transporter.sendMail({
      from: `${name} <${email}>`, // sender address
      to: `${process.env.EMAIL_USER}`, // list of receivers
      subject: "Regarding E commerce App", // Subject line
      text: message, // plain text body
      html: `${message}`, // html body
    });
    res.status(200).json({
      success: true,
      message: "Message Sent",
    });
    
  } catch (error) {
    res.status(500).send({
      success: false,
    })
  }
};

export default contactController;