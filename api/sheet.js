import { google } from 'googleapis';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const { inputText, translatedText, correctedText } = req.body;  // Include correctedText

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = '1yll37zQM-5va2uxSwHPLpoqsGDIFdEvtt9nEB8cBKuc'; 
    const range = 'Sheet1!A:C';  // Adjust the range to A:C to include a third column

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[inputText, translatedText, correctedText]],  // Add correctedText here
      },
    });

    res.status(200).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error('The API returned an error: ', error);
    res.status(500).json({ message: 'Failed to update the sheet', error: error.message });
  }
};

