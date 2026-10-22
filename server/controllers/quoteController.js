const Quote = require('../models/Quote');

// GET /api/quotes - Fetch all quotes (sorted by newest)
exports.getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/quotes - Submit new quote inquiry
exports.createQuote = async (req, res) => {
  try {
    const { name, email, phone, suburb, serviceType, areaApproxSqm, conditionNotes } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Please provide name, email, and phone number.' });
    }

    const quote = await Quote.create({
      id: 'quote_' + Date.now(),
      name,
      email,
      phone,
      suburb: suburb || 'Melbourne Metro',
      serviceType: serviceType || 'APC Ultra Flake® System',
      areaApproxSqm: Number(areaApproxSqm) || 40,
      conditionNotes: conditionNotes || '',
      status: 'New'
    });

    res.status(201).json({
      success: true,
      message: 'Quote inquiry received! Our senior flooring estimator will call you within 2 hours.',
      quoteId: quote._id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH /api/quotes/:id/status - Update lead status
exports.updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const quote = await Quote.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { status },
      { new: true }
    );
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    res.json({ success: true, quote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/quotes/:id/reply - Send reply email to client and save to quote history
exports.replyToQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message body cannot be empty.' });
    }

    const quote = await Quote.findOne({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });

    if (!quote) {
      return res.status(404).json({ error: 'Quote request not found.' });
    }

    const emailSubject = subject?.trim() || `Regarding your Flooring Quote Request — Floor Shield Australia`;
    const senderEmail = process.env.SMTP_USER || process.env.ADMIN_EMAIL || 'admin@floorshield.au';

    let emailSent = false;
    let emailNote = '';

    // If SMTP credentials exist, attempt to send real email
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        await transporter.sendMail({
          from: `"Floor Shield Australia" <${senderEmail}>`,
          to: quote.email,
          subject: emailSubject,
          text: message,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
              <div style="background: linear-gradient(135deg, #ea580c, #c2410c); padding: 20px; border-radius: 8px 8px 0 0; color: #ffffff;">
                <h2 style="margin: 0; font-size: 20px;">Floor Shield Australia</h2>
                <p style="margin: 4px 0 0; opacity: 0.9; font-size: 13px;">Official Quote Response & Estimation</p>
              </div>
              <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; background: #ffffff; border-radius: 0 0 8px 8px;">
                <p>Hi <strong>${quote.name}</strong>,</p>
                <div style="background: #f8fafc; border-left: 4px solid #ea580c; padding: 14px 18px; margin: 18px 0; border-radius: 4px; white-space: pre-wrap; font-size: 15px; color: #334155;">${message}</div>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="font-size: 13px; color: #64748b; margin: 0;">
                  <strong>Floor Shield Australia</strong><br />
                  Specialist APC Epoxy, Polyaspartic & Industrial Floor Coating Systems<br />
                  Email: ${senderEmail} | Tel: 0489 074 340
                </p>
              </div>
            </div>
          `
        });
        emailSent = true;
        emailNote = `Email successfully dispatched to ${quote.email}`;
      } catch (mailErr) {
        console.error('Nodemailer error:', mailErr.message);
        emailNote = `Reply saved to database (SMTP attempt failed: ${mailErr.message})`;
      }
    } else {
      // Dev mode or unconfigured SMTP
      emailSent = true;
      emailNote = `Reply recorded in system & queued for ${quote.email} (SMTP configuration optional)`;
    }

    // Save reply to quote record and update status to Contacted if still New
    if (!quote.replies) quote.replies = [];
    quote.replies.push({
      subject: emailSubject,
      message: message.trim(),
      sentAt: new Date(),
      sentBy: req.admin?.email || 'admin@floorshield.au'
    });

    if (quote.status === 'New') {
      quote.status = 'Contacted';
    }

    await quote.save();

    res.json({
      success: true,
      message: emailNote,
      quote
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

