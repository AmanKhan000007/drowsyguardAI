# DrowsyGuard AI - Drowsiness Detection System

A comprehensive AI-powered drowsiness detection system that monitors alertness in real-time using computer vision and facial landmark detection.

## Features

- **Real-time Detection**: Uses MediaPipe Face Mesh for accurate facial landmark detection
- **Eye Aspect Ratio (EAR) Analysis**: Calculates drowsiness based on eye closure patterns
- **Smart Alerts**: Customizable audio and visual alerts when drowsiness is detected
- **Analytics Dashboard**: Comprehensive insights and session tracking
- **Privacy-First**: All processing happens locally - no data leaves your device
- **Customizable Settings**: Adjust thresholds, sensitivity, and alert preferences
- **Data Export**: Export session logs and analytics for further analysis

## Installation

### Prerequisites

- Python 3.7 or higher
- Modern web browser with camera support
- Camera/webcam

### Setup

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/drowsyguard-ai.git
cd drowsyguard-ai
\`\`\`

2. Install Python dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Run the application:
\`\`\`bash
python app.py
\`\`\`

4. Open your browser and navigate to `http://localhost:5000`

## Usage

### Getting Started

1. **Home Page**: Overview of features and system capabilities
2. **Dashboard**: Main detection interface with live camera feed
3. **Analytics**: View session history and drowsiness patterns
4. **Settings**: Customize detection parameters and preferences
5. **About**: Technical details and FAQ

### Detection Process

1. Click "Start Detection" on the dashboard
2. Allow camera permissions when prompted
3. Position yourself in front of the camera
4. The system will begin monitoring your eye movements
5. Alerts will trigger when drowsiness is detected

### Calibration

- Use the "Calibrate" button to personalize the system
- Keep eyes open normally for 10 seconds during calibration
- The system will adjust thresholds based on your eye characteristics

## Technical Details

### Detection Algorithm

The system uses the Eye Aspect Ratio (EAR) method:

\`\`\`
EAR = (|p2-p6| + |p3-p5|) / (2|p1-p4|)
\`\`\`

Where p1-p6 are facial landmarks around the eye.

### Key Components

- **MediaPipe Face Mesh**: 468 facial landmark detection
- **Real-time Processing**: 30 FPS analysis with 50ms response time
- **Adaptive Thresholds**: Customizable sensitivity settings
- **Multi-modal Alerts**: Audio, visual, and vibration notifications

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## API Endpoints

### Sessions
- `POST /api/sessions` - Save session data
- `GET /api/sessions` - Retrieve session history

### Analytics
- `GET /api/analytics` - Get analytics summary and trends

## Configuration

### Detection Settings
- **Alert Threshold**: Time before triggering alert (1-10 seconds)
- **EAR Threshold**: Eye closure sensitivity (0.15-0.30)
- **Sensitivity**: Preset configurations (Low/Medium/High)

### Alert Settings
- **Volume**: Alert sound volume (0-100%)
- **Type**: Beep, voice, or music alerts
- **Modalities**: Sound, visual, vibration options

### Camera Settings
- **Resolution**: 640x480, 1280x720, 1920x1080
- **Frame Rate**: 15, 30, or 60 FPS
- **Display Options**: Face mesh overlay, mirror mode

## Privacy & Security

- **Local Processing**: All video analysis happens on your device
- **No Data Transmission**: Camera feed never leaves your computer
- **Optional Analytics**: Anonymous usage statistics (opt-in)
- **Data Control**: Full control over data storage and export

## Use Cases

- **Commercial Drivers**: Long-haul trucking and delivery
- **Remote Workers**: Extended computer work sessions
- **Students**: Online learning and study sessions
- **Healthcare Workers**: Long shift monitoring
- **Industrial Workers**: Heavy machinery operation safety

## Troubleshooting

### Common Issues

1. **Camera not detected**
   - Check browser permissions
   - Ensure camera is not in use by other applications
   - Try refreshing the page

2. **Poor detection accuracy**
   - Improve lighting conditions
   - Position camera at eye level
   - Remove reflective glasses if possible
   - Run calibration process

3. **False alerts**
   - Adjust EAR threshold in settings
   - Use calibration feature
   - Check for proper camera positioning

### Performance Optimization

- Use adequate lighting
- Close unnecessary browser tabs
- Ensure stable internet connection for initial loading
- Use recommended camera resolution settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@drowsyguard.ai
- GitHub Issues: [Create an issue](https://github.com/yourusername/drowsyguard-ai/issues)
- Documentation: [Wiki](https://github.com/yourusername/drowsyguard-ai/wiki)

## Acknowledgments

- MediaPipe team for facial landmark detection
- Chart.js for data visualization
- Tailwind CSS for styling
- Flask for backend framework

## Version History

- **v1.0.0**: Initial release with core detection features
- **v1.1.0**: Added analytics dashboard and data export
- **v1.2.0**: Enhanced settings and calibration system
- **v1.3.0**: Improved accuracy and performance optimizations
