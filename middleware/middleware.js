


const jwt =require('jsonwebtoken')





const validateJWT = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    let result;
    if (authorizationHeader) {
      const token = req.header('authorization').split(' ')[1]; // Bearer <token>
     
      try {
        // Verify makes sure that the token hasn't expired and has been issued by us.
        result = jwt.verify(token, "secretKey");
        // Let's pass back the decoded token to the request object.
        req.user = result;
        // Call next to pass execution to the subsequent middleware.
        next();
      } catch (err) {
        // Throw an error just in case anything goes wrong with verification.
        throw new Error(err);
      }
    } else {
      result = { 
        error: `Authentication error. Token required.`,
        status: 401
      };
      res.status(401).send(result);
    }
  }
  
const send_mesage_email= async (message,email)=>{
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }

    const user = result.rows[0];
    // E-posta gönderme işlemini gerçekleştirin
 const transporter = nodemailer.createTransport({
      pool: true,
     service: "gmail",
     auth: {
        user: "uzdub.group@gmail.com",
        pass: 'fbcgnvqfbmocflcm',
     },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    },
    });
    const mailOptions = {
      from: 'uzdub.group@gmail.com',
      to: email,
      subject: 'Zakaz',
      text: `message: ${message}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(400).json(error)
      } else {
      res.status(200).json(info)
      }
    });
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({err:error.message});
  }
}
const send_message_sms = async (message,phone)=>{

} 
  module.exports={validateJWT,send_mesage_email}