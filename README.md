# Web Calculator Suite

A comprehensive web-based calculator suite that includes both a basic calculator and a material price calculator. This is the web version of the desktop calculator application with all the same features and functionality.

## Features

### Basic Calculator
- **Standard Operations**: Addition, subtraction, multiplication, division
- **Decimal Support**: Full decimal number support
- **Tax Calculation**: Built-in 15% tax calculation button
- **History Tracking**: Keeps track of the last 10 calculations
- **Keyboard Support**: Full keyboard and numpad support
- **Clear History**: Option to clear calculation history
- **Error Handling**: Proper error handling for invalid calculations

### Material Price Calculator
- **Dimension Input**: Width and height input in millimeters (mm)
- **Material Selection**: Dropdown selection from available materials
- **Real-time Calculation**: Automatic calculation as you type
- **Price Display**: Shows area in mm², price per m², and total price
- **Add to Total**: Add calculated items to a running total
- **Running Total**: Keep track of multiple items with subtotal, tax, and grand total
- **Tax Calculation**: Apply or remove 15% tax to the total
- **Clear All**: Clear individual items or entire total
- **PDF Export**: Save quotes as PDF with all items and totals
- **Material Management**: Add and remove custom materials
- **Calculation History**: Detailed history of all material calculations
- **Data Persistence**: All data saved to browser localStorage
- **Unit Conversion**: Automatically converts mm² to m² for price calculations

### Pre-loaded Materials
The calculator comes with the following materials pre-configured:
- Stickers (R320/m²)
- Chromodeck (R241.50/m²)
- ABS (R161.00/m²)
- Correx (R100/m²)
- UV Pro (R84.00/m²)
- Laminated (R280.00/m²)
- 3M (R1351/m²)
- Magnet (R600/m²)
- Reflective (R600/m²)
- Banner (R320/m²)
- Poster (R120/m²)

## How to Use

### Running the Application

1. **Simple Method**: 
   - Open `index.html` in any modern web browser
   - The application will work offline

2. **With Local Server** (recommended for development):
   ```bash
   # If you have Python installed
   python -m http.server 8000
   # Or with Python 3
   python3 -m http.server 8000
   
   # If you have Node.js installed
   npx http-server
   
   # Then open http://localhost:8000 in your browser
   ```

### Basic Calculator Usage

1. Click on "Basic Calculator" from the home screen
2. Use the number buttons or keyboard to input numbers
3. Click operators (+, -, *, /) or use keyboard
4. Press "=" or Enter to calculate
5. Use "Tax 15%" button to add 15% tax to current value
6. Use "C" or Escape to clear
7. View calculation history in the history panel

**Keyboard Shortcuts:**
- Numbers: `0-9` or numpad
- Operators: `+`, `-`, `*`, `/`
- Calculate: `Enter` or `=`
- Clear: `Escape`, `C`, or `Backspace`
- Decimal: `.`

### Material Calculator Usage

1. Click on "Material Price Calculator" from the home screen
2. Enter width and height in millimeters (mm)
3. Select a material from the dropdown
4. The price will automatically calculate (area shown in mm², converted to m² for pricing)
5. Click "Calculate Price" to add to history
6. **New Features:**
   - Click "Add to Total" to add the current calculation to a running total
   - Use "Apply 15% Tax" or "Remove Tax" to manage tax on the total
   - Click "Clear Total" to remove all items from the running total
   - Use "Save as PDF" to export the quote as a PDF document

**Adding New Materials:**
1. Scroll to "Material Management" section
2. Enter material name and price per m²
3. Optionally enter a multiplier
4. Click "Add Material"

**Removing Materials:**
1. In the "Remove Material" section
2. Select material from dropdown
3. Click "Remove Material"

## File Structure

```
web_calculator/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Technical Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Modern dark theme with gold accents
- **Local Storage**: All data persists between sessions
- **Error Handling**: Comprehensive error handling
- **Animations**: Smooth animations and transitions
- **Keyboard Support**: Full keyboard navigation support
- **Modern UI**: Clean, modern interface with glass-morphism effects
- **Unit Conversion**: Automatic conversion from mm² to m² for accurate pricing (1 m² = 1,000,000 mm²)

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

The application uses vanilla HTML, CSS, and JavaScript with no external dependencies (except for Font Awesome icons from CDN).

### Customization

**Adding New Features:**
- Edit `script.js` for functionality
- Edit `styles.css` for styling
- Edit `index.html` for structure

**Modifying Materials:**
- Default materials are defined in `script.js` in the `initializeMaterials()` function
- Users can add/remove materials through the UI
- Materials are saved to localStorage

## Data Storage

All user data is stored in the browser's localStorage:
- `materials`: Custom materials and their prices
- `basicHistory`: Basic calculator history
- `materialHistory`: Material calculation history

## Comparison with Desktop Version

This web version includes all features from the desktop Python/Tkinter version:

✅ Basic calculator with all operations  
✅ 15% tax calculation  
✅ Calculation history  
✅ Material price calculator  
✅ Custom material management  
✅ Dimension-based calculations  
✅ Data persistence  
✅ Modern UI with animations  
✅ Keyboard support  

**Additional Web Features:**
- Responsive design for mobile devices
- Modern web UI with smooth animations
- No installation required
- Cross-platform compatibility
- Easy sharing via URL

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please refer to the source code comments or create an issue in the project repository.
