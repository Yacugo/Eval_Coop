# Cooperative Evaluation System

A lightweight, modular web application for conducting peer evaluations in group projects.

## 📁 Project Structure

```
cooperative-evaluation-system/
├── index.html              # Main application file
├── css/
│   └── styles.css          # Custom styles
├── js/
│   ├── dataManager.js      # Data management module
│   └── app.js              # Main application logic
├── data/
│   ├── students.csv        # Student data (editable)
│   └── config.json         # Application configuration
└── README.md               # This file
```

## 🚀 Quick Start

1. **Configure the application:**
   - Edit `data/config.json` to set your email and preferences
   - Edit `data/students.csv` to add/remove students

2. **Open the application:**
   - Open `index.html` in a web browser
   - No server required - runs entirely in the browser

3. **Students complete evaluations:**
   - Select name from dropdown
   - Choose group members (3-5 people including themselves)
   - Rate each member and submit

4. **Submit results:**
   - Email directly to instructor (opens default email client)
   - Download CSV file for manual submission

## ⚙️ Configuration

### Student Data (`data/students.csv`)
```csv
id,name
4240150,Student Name One
4240151,Student Name Two
```

### Application Config (`data/config.json`)
```json
{
  "instructor": {
    "email": "professor@university.edu",
    "name": "Professor Name"
  },
  "evaluation": {
    "minGroupSize": 3,
    "maxGroupSize": 5,
    "allowMultipleSubmissions": false
  }
}
```

## 📊 Features

### For Students:
- ✅ Simple login with name selection
- ✅ Intuitive group member selection
- ✅ Clear rating scale (0-100 points)
- ✅ Optional comments for each evaluation
- ✅ Automatic email generation with CSV data
- ✅ Downloadable CSV results
- ✅ Prevents multiple submissions

### For Instructors:
- ✅ Export all evaluations to CSV
- ✅ View participation statistics
- ✅ Clear/reset data
- ✅ Easy configuration management
- ✅ Responsive design for all devices

## 📧 Email Submission

When students click "Email Results to Instructor":
1. Opens default email client
2. Pre-fills recipient, subject, and body
3. Includes CSV data in email body
4. Student just needs to click "Send"

## 🔒 Data Storage

- **Local Storage**: All data stored in browser's localStorage
- **No Server Required**: Completely client-side application
- **Privacy**: No data leaves the student's computer except via email
- **Persistence**: Data survives browser refresh/close

## 🛠️ Customization

### Adding/Removing Students
Edit `data/students.csv`:
```csv
id,name
NEW_ID,New Student Name
```

### Changing Rating Scale
Edit `data/config.json` - modify the `ratingScale` array:
```json
"ratingScale": [
  { "label": "Excellent", "value": 100, "color": "text-green-700" },
  { "label": "Good", "value": 75, "color": "text-blue-600" }
]
```

### Changing Group Size Limits
Edit `data/config.json`:
```json
"evaluation": {
  "minGroupSize": 2,
  "maxGroupSize": 6
}
```

## 📱 Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Internet Explorer (limited support)

## 🔧 Troubleshooting

### Students CSV not loading
- Check file path: `data/students.csv`
- Verify CSV format (id,name headers)
- Ensure no special characters in file path

### Email client not opening
- Verify instructor email in `data/config.json`
- Some browsers may block mailto links
- Student can copy CSV data manually

### Data not saving
- Check if browser allows localStorage
- Try in different browser
- Clear browser cache and try again

## 💡 Tips

1. **For Large Classes**: Split into multiple sessions or use batch processing
2. **For Online Classes**: Share the HTML file via LMS or cloud storage
3. **For Backup**: Students can download CSV files as backup
4. **For Analysis**: Combine all CSV files for statistical analysis

## 🔄 Version History

- **v1.0**: Initial modular release with email functionality
- **v0.9**: Monolithic version (deprecated)

## 📞 Support

For technical issues or questions:
1. Check this README first
2. Verify configuration files
3. Test in different browser
4. Contact your system administrator

## 📄 License

Free to use for educational purposes. Please retain attribution.
