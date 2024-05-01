import { google } from 'googleapis';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const { inputText, translatedText, correctedText, isCorrection } = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    const spreadsheetId = 'your_spreadsheet_id'; 
    const range = 'Sheet1!A:D';

    // Decide whether it's an initial entry or a correction based on 'isCorrection' flag
    const values = isCorrection ? 
      [[inputText, translatedText, correctedText, "Correction"]] :
      [[inputText, translatedText, "", "Initial"]];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: { values: values },
    });

    res.status(200).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error('The API returned an error: ', error);
    res.status(500).json({ message: 'Failed to update the sheet', error: error.message });
  }
};
