# 📁 nginx-fancyindex-theme-shadcn - Elevate your file directory visual style

[![Download Theme](https://img.shields.io/badge/Download-Theme-blue)](https://github.com/zeli4650/nginx-fancyindex-theme-shadcn)

This project provides a clean, modern interface for your web server directory listings. It helps users navigate your files with a layout inspired by the shadcn design system. You gain a professional look that improves readability and user interaction for any web directory.

## 🛠 Prerequisites

You need a working installation of Nginx on your Windows machine to use this theme. This project assumes you have the standard Nginx FancyIndex module enabled. If you have not set up Nginx, download the official Nginx files first and ensure the server runs on your local machine or web host.

## 📥 Getting the Files

Visit the project page to download the latest version of the theme files. You can find the source code and style assets directly through the link below.

[Download the theme files here](https://github.com/zeli4650/nginx-fancyindex-theme-shadcn)

Click the green "Code" button on the GitHub page and select "Download ZIP" to save the theme to your computer.

## ⚙️ Installation Steps

Follow these steps to apply the theme to your Nginx setup.

1. Locate your Nginx folder on your Windows computer. This is usually in the C drive under a folder named nginx.
2. Open the downloaded ZIP file.
3. Extract the contents inside the ZIP file into a new folder named `theme` within your Nginx HTML directory. Usually, this path is `C:\nginx\html\theme`.
4. Ensure the files like `header.html`, `footer.html`, and the style files reside in that folder.

## 📝 Configuring Nginx

Nginx requires instructions to use these new files. You must edit the configuration file to activate the theme.

1. Navigate to the `conf` folder inside your Nginx directory.
2. Open the file named `nginx.conf` using a standard text editor like Notepad.
3. Find the `location` block where you want to show the file index.
4. Add the following lines inside that block:

```nginx
fancyindex on;
fancyindex_header "/theme/header.html";
fancyindex_footer "/theme/footer.html";
fancyindex_ignore "theme";
```

The `fancyindex_ignore` line hides the theme folder itself from showing up in your list of files. This keeps your directory clean.

## 🔄 Applying Changes

After you save the `nginx.conf` file, you must restart Nginx for the changes to take effect.

1. Open your Command Prompt. You can find this by typing "cmd" in the Windows search bar.
2. Navigate to your Nginx folder by typing `cd C:\nginx`.
3. Stop the current Nginx process by typing `nginx -s stop` and pressing Enter.
4. Start Nginx again by typing `nginx` and pressing Enter.

Now, open your web browser and navigate to the address where you serve your files. You will see the new shadcn-inspired layout instead of the default text list.

## 🎨 Design Features

The theme focuses on clarity and simplicity. It uses a neutral color palette that works well on high-resolution screens. 

*   **Readable Lists:** The layout increases spacing between file names to prevent accidental clicks.
*   **Icon Support:** It includes icons for common file types to help users identify documents, images, and folders at a glance.
*   **Responsive Width:** The design adjusts to the width of the browser window. It remains legible on desktops, tablets, and phones.
*   **Minimalist Header:** The header provides a clear path of where you are in the directory structure.

## 📂 Troubleshooting

If the files do not look correct or the server shows an error, check these common points.

- **Check Paths:** Make sure the paths in `nginx.conf` point exactly to the files you extracted. If `header.html` is in `C:\nginx\html\theme\header.html`, your configuration must reflect that correctly as `/theme/header.html`.
- **File Permissions:** Ensure the Nginx service has permission to read the files in the theme folder. On Windows, right-click the folder, go to Properties, then Security, and ensure your system has "Read" access.
- **Restart Server:** Nginx does not automatically see changes in the configuration file. You must run the stop and start commands every time you change the settings.
- **Clear Browser Cache:** Sometimes browsers save the old design. Press `Ctrl + F5` in your web browser while viewing your directory to force it to load the new theme files.

## 💻 Technical Background

This theme works specifically with the `ngx-fancyindex` module. This module creates a built-in table of files for any directory on your server. By default, Nginx shows a plain, unstyled list. This theme replaces the default HTML template with a structured design that uses modern cascading style sheets. 

The theme structure relies on standard HTML tags. You can open `header.html` and `footer.html` in a text editor to change the text or links. Keep the existing class names to ensure the styles continue to work as expected. 

The design follows the principles of the shadcn-ui movement. This means it uses subtle borders, clean typography, and a font stack that emphasizes neutral aesthetic values. It removes clutter by hiding system files and focusing on the content you place in your server folders. 

This installation method works on all modern versions of Windows. It does not require special software or complicated database setups. It is a front-end change that improves the output of your existing web server.