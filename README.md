# Desktop Todo Widget

A lightweight, always-visible desktop to-do list widget built with Electron.js. Stay productive with a beautiful, minimal interface that keeps your tasks visible while you work.

![Desktop Todo Widget](assets/screenshot.png)

## ✨ Features

### Core Features
- **Always-on-top widget** - Stays visible above all other windows
- **Quick task management** - Add, complete, and delete tasks instantly  
- **Persistent storage** - Tasks are saved locally and restored on startup
- **Draggable & resizable** - Position and size the widget to your liking
- **Frameless design** - Clean, modern interface with glass morphism effects
- **Theme switching** - Light and dark theme support
- **Keyboard shortcuts** - Ultra-fast task management with hotkeys

### UI/UX
- **Glass morphism design** - Transparent background with blur effects
- **Smooth animations** - Delightful micro-interactions
- **Responsive layout** - Scales gracefully when resized
- **Auto-focus input** - Ready to type when you activate the widget
- **Task completion tracking** - See when tasks were completed
- **Empty state guidance** - Helpful hints when no tasks exist

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/singharyan006/desktop-todo-widget.git
   cd desktop-todo-widget
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm start
   # or for development with DevTools
   npm run dev
   ```

4. **Build for production**
   ```bash
   # Build for Windows (current working setup)
   npm run build
   
   # Alternative builds (requires additional setup)
   npm run build:win    # Windows (using electron-builder)
   npm run build:mac    # macOS (using electron-builder)
   npm run build:linux  # Linux (using electron-builder)
   ```

5. **Run the built application**
   ```bash
   # After building, run the executable
   dist/desktop-todo-widget-win32-x64/desktop-todo-widget.exe
   ```

## 🎮 Usage

### Basic Operations
- **Add task**: Type in the input field and press Enter, or click the + button
- **Complete task**: Click the circle checkbox next to any task
- **Delete task**: Hover over a task and click the red trash icon
- **Clear completed**: Click "Clear completed" in the bottom bar when available

### Window Controls
- **Move window**: Drag from anywhere on the title bar
- **Resize window**: Drag from the resize handle (⋲) in the bottom right
- **Always on top**: Click the pin icon to toggle always-on-top behavior
- **Theme switching**: Click the moon icon to switch between light/dark themes
- **Minimize**: Click the minus icon
- **Close**: Click the X icon

### Keyboard Shortcuts
- `Enter` - Add new task (when input is focused)
- `Ctrl/Cmd + N` - Focus on input field
- `Ctrl/Cmd + T` - Toggle theme
- `Ctrl/Cmd + Shift + C` - Clear all completed tasks
- `Escape` - Clear input field or minimize window

## 🏗️ Architecture

### Project Structure
```
desktop-todo-widget/
├── src/
│   ├── main.js           # Electron main process
│   ├── preload.js        # Secure IPC bridge
│   └── renderer/
│       ├── index.html    # Main UI
│       └── app.js        # Frontend logic
├── assets/               # Icons and images
├── package.json          # Dependencies and build config
└── README.md
```

### Technology Stack
- **Electron.js** - Desktop app framework
- **TailwindCSS** - Utility-first CSS framework
- **electron-store** - Persistent data storage
- **electron-packager** - App packaging and distribution

### Key Components

1. **Main Process** (`src/main.js`)
   - Creates and manages the application window
   - Handles window controls (minimize, close, always-on-top)
   - Manages application lifecycle
   - Provides secure IPC communication

2. **Preload Script** (`src/preload.js`)
   - Secure bridge between main and renderer processes
   - Exposes limited APIs to the frontend
   - Follows Electron security best practices

3. **Renderer Process** (`src/renderer/`)
   - Contains the UI and application logic
   - Handles task CRUD operations
   - Manages themes and animations
   - Provides keyboard shortcuts

## 🎨 Customization

### Themes
The app supports light and dark themes. Theme preference is automatically saved and restored on startup.

### Window Behavior
- Default size: 320x480px
- Minimum size: 280x400px
- Always-on-top: Enabled by default
- Position: Remembered between sessions

### Styling
The UI uses TailwindCSS with custom glass morphism effects. You can customize colors, spacing, and animations by modifying the CSS in `index.html`.

## 🔧 Development

### Development Mode
```bash
npm run dev
```
This runs the app with developer tools enabled for debugging.

### Building
The app currently uses electron-packager for creating distributable packages:

- **Windows**: Creates portable application folder with .exe
- **macOS**: Can create .app bundle (requires additional setup)
- **Linux**: Can create executable (requires additional setup)

**Note**: The current setup is optimized for Windows development. For advanced packaging features like installers, auto-updates, or code signing, electron-builder is available but may require additional Windows permissions for symbolic link creation.

### Adding Features
1. **New IPC endpoints**: Add to `main.js` and `preload.js`
2. **UI changes**: Modify `index.html` and `app.js`
3. **Styling**: Update TailwindCSS classes in the HTML
4. **Storage**: Use the electron-store instance for persistence

## 🐛 Troubleshooting

### Common Issues

**App won't start**
- Ensure Node.js v16+ is installed
- Delete `node_modules` and run `npm install` again

**Build fails with symbolic link errors**
- This is a known issue with electron-builder on Windows
- Use `npm run build` (electron-packager) instead
- For electron-builder, run PowerShell as Administrator

**Window not visible**
- The window might be off-screen. Delete the config file to reset position
- Config location varies by OS (check electron-store documentation)

**Tasks not saving**
- Check file permissions in the user data directory
- Look for errors in the developer console (`npm run dev`)

**Always-on-top not working**
- This feature may not work properly in some Linux desktop environments
- Try toggling the setting off and on again

## 📋 Roadmap

### Planned Features
- [ ] System tray integration
- [ ] Auto-launch on system startup  
- [ ] Task categories/tags
- [ ] Cloud synchronization
- [ ] Task reminders/notifications
- [ ] Drag-and-drop task reordering
- [ ] Import/export functionality
- [ ] Multiple task lists
- [ ] Due dates and priorities
- [ ] Search and filtering

### Stretch Goals
- [ ] Plugin system
- [ ] Custom themes
- [ ] Collaboration features
- [ ] Mobile companion app
- [ ] Integration with task management services

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Styled with [TailwindCSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Storage powered by [electron-store](https://github.com/sindresorhus/electron-store)

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/desktop-todo-widget/issues) page
2. Create a new issue with detailed information
3. Join our [Discord community](https://discord.gg/your-invite) for live support

---

**Made with ❤️ for productivity enthusiasts**
