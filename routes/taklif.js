router.post('/send-email', async (req, res) => {
    const { email } = req.body;
    try {
      // PostgreSQL veritabanından kullanıcıyı sorgula
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
      }
  
      const user = result.rows[0];
      const {  password } = user;
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
        subject: 'Parolanızı alın',
        text: `sizning parolingiz: ${password}`,
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
  });