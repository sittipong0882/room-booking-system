const { google } = require('googleapis');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// การใช้ Google API
const oauth2Client = new google.auth.OAuth2(
  '939457423757-7j063hjd2lv9pa7fbvrjc1lejki799m6.apps.googleusercontent.com',
  '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',
  'http://localhost:3003/#'
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// ใส่ข้อมูลของการจองห้อง
app.post('/book', bodyParser.json(), (req, res) => {
  const { name, date, startTime, endTime, items } = req.body;

  const event = {
    summary: `จองห้อง - ${name}`,
    description: `ผู้จอง: ${name}, อุปกรณ์: ${items.join(', ')}`,
    start: {
      dateTime: new Date(`${date}T${startTime}:00`),
      timeZone: 'Asia/Bangkok',
    },
    end: {
      dateTime: new Date(`${date}T${endTime}:00`),
      timeZone: 'Asia/Bangkok',
    },
    attendees: [], // คุณสามารถเพิ่มอีเมลของผู้ที่เกี่ยวข้องได้
  };

  // สร้างกิจกรรมใหม่ใน Google Calendar
  calendar.events.insert(
    {
      calendarId: 'primary',
      resource: event,
    },
    (err, event) => {
      if (err) {
        return res.status(400).send('Error creating event');
      }
      res.status(200).send(`Event created: ${event.htmlLink}`);
    }
  );
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
