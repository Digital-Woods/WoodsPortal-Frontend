# WoodsPortal Frontend Customization Guide


This codebase is designed to extend the capabilities of HubSpot’s membership portal using React, enabling a fully customizable, single-page application (SPA) experience. It integrates seamlessly with **WoodsPortal**—our hosted, enterprise-level membership portal for HubSpot—offering unlimited customization potential.

For feature requests, feel free to reach out at [dev@digitalwoods.io](mailto:dev@digitalwoods.io).

---

## 📂 High-Level Folder Structure

- **js/**: The main folder housing all frontend code.
  - **components/**: Contains reusable UI components that define the portal's interface.
  - **data/**: Likely holds data files for various configurations and content.
  - **pages/**: Contains different pages and views, segmented by function or feature.
  - **state/**: Manages stateful logic or configuration settings across the portal.
  - **utils/**: Utility functions supporting various operations throughout the portal.

## 📁 components/ Breakdown

The `components` folder has subfolders with categorized JavaScript files, each serving different functionalities:

- **SiteLayout/**: Manages the overall layout, including components like `Breadcrumb`, `Drawer`, `HeaderLayout`, `PrivateRoute`, and `PublicRoute`.
- **ApiDetails.js**: Displays data from the Admin Panel.
- **ModuleDetails.js**: Manages membership data from `membership-data.module`.
- **Recoil.js**: Manages global states across components using the Recoil state management library.
- **TnstackQuery.js**: Manages data fetching, caching, and server-state synchronization with TanStack Query for high-performance or frequently updated data.

### 📂 UI/ Folder Breakdown

The `UI` folder is divided into subfolders like `checkboxes`, `files`, and `profile`, containing individual UI components:

#### checkboxes/
- **CustomCheckbox.js**: A customized checkbox styled to fit the portal’s design.

#### files/
- **ActionDropdown.js**: A dropdown menu for file actions like rename, delete, and download.
- **CreateFolderDialog.js**: A dialog for creating new folders.
- **FileBreadcrumb.js**: Breadcrumb navigation for files.
- **FileDetailsModal.js**: Displays detailed information about a selected file.
- **FileTable.js**: Lists files in a table format.
- **FileUpload.js**: Handles file uploads.
- **FolderUpload.js**: Handles folder uploads.
- **ModuleFileTable.js**: Displays data from `membership-data.module`.

#### profile/
- **ChangePassword.js**: Form for changing passwords.
- **ProfileCard.js**: Displays user profile information in a card format.
- **ProfileUpdate.js**: Form for updating profile details.

### Individual Components

Common components used throughout the portal:
- **Accordion.js**: Expandable sections for organizing content.
- **ActivityLog.js**: Logs user actions.
- **Alerts.js**: Shows alert messages (success, error, warning).
- **Button.js**: Main button component with customizable styles.
- **DashboardTable.js**: Displays data in table format for quick views and summaries.
- **Dialog.js**: A generic modal component.
- **Form.js**: General-purpose form component.
- **Logo.js**: Displays the portal's logo.
- **Pagination.js**: Pagination for lists or tables.
- **Select.js**: Dropdown selection component.
- **Tabs.js**: Organizes content into tabs without page navigation.
- **ThemeSwitcher.js**: Toggle for switching themes.
- **Tooltip.js**: Shows hints or explanations on hover.

## 📁 data/

- **fakeData.js**, **hubSpotData.js**: Likely hold setup data, including configurations for HubSpot integrations.

## 📁 pages/

- **auth/**: Manages login and registration views.
- **user/**: Contains user-specific pages for profile and settings.
- **Details/**: Components for detail views, such as `Details.js`, `DetailAssociations.js`, `DetailMasterCard.js`.
- **DynamicComponent.js**: Renders content dynamically based on context.
- **Notification.js**: Manages user notifications.

## 📁 state/

Handles application-wide state management for user sessions, themes, and settings.

## 📁 utils/

Helper functions for data formatting, API handling, and other utility functions used across multiple components.

## 🌐 Other Files

- **App.js**: Main entry point where all components are imported and rendered.
- **MainLayout.js**: Default layout for the application.
- **tailwind.config.js**: Configures Tailwind CSS with custom styles and colors.

## Important Note on Component and Library Imports

All components and libraries are organized in specific HTML files:

- **Component Imports**: Managed in `templates/partials/react/components.html`.
- **Library Imports**: Managed in `templates/partials/react/libraries.html` for CSS and JavaScript libraries.

## Tips for Customizing Styles in Woods Portal

To style the Woods Portal, you have multiple options:

- **Using Tailwind CSS Classes**: Customize component appearance quickly with Tailwind’s utility classes.
- **Adding Custom CSS**: For detailed control, add custom styles in `css/global.css`.
- **Adding New Components**: Link new components in `child/child.js` and style them in `child/child.css`.

By following this guide, you can effectively customize the Woods Portal to align with your project requirements. Enjoy building with WoodsPortal!


This project is tested with BrowserStack.

