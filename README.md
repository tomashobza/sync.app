#  <img src="docs/vut-logo.webp" style="display: inline-block; height: 1.5rem; width: 1.5rem; object-fit: cover;"> ITU Projekt / ITU Project

## 👥 Autoři / Authors
- [Anastasia Butok](xbutok00@vutbr.cz)
- [Tomáš Hobza](xhobza03@vutbr.cz)
- [Nikita Koliada](xkolia00@vutbr.cz)

Vytvořeno pro předmět ITU, FIT VUT, 2023 / Created for the ITU course, FIT VUT, 2023

## 📘 O Projektu / About the Project
Tento projekt je webová aplikace vyvinutá v SvelteKit, která integruje služby Firebase pro autentizaci, databázi a hosting. / This project is a web application developed in SvelteKit, integrating Firebase services for authentication, database, and hosting.

## 🛠 Instalace / Installation

### 📋 Předpoklady / Prerequisites
- Node.js (verze 14 nebo novější) / Node.js (version 14 or newer)
- npm
- Git

### 🔧 Instalace závislostí / Dependency Installation
V podadresáři `client` / In the `client` subdirectory.
```
npm install
```

### 🚀 Spuštění aplikace v režimu vývoje / Running the App in Development Mode
V podadresáři `client` / In the `client` subdirectory.
```
npm run dev
```
Navštivte `http://localhost:5173` v prohlížeči / Visit `http://localhost:5173` in your browser.

> Varování, projekt <s>využívá skutečný backend</s>. Klíč přidám pouze, abych umožnil testování, ovšem výrazně omezím počet požadavků abych zabránil zneužití. / Warning, the project uses a real backend. I will only add the key to enable testing, but will significantly limit the number of requests to prevent misuse.

### 🏗 Build pro produkční nasazení / Build for Production Deployment
```
npm run build
```

### 🌐 Spuštění produkční verze / Running the Production Version
```
npm run start
```

## 📚 Využité Knihovny a Licencování / Used Libraries and Licensing

### SvelteKit
- Web framework pro vývoj aplikací / Web framework for application development
- Licence: [MIT License](https://github.com/sveltejs/kit/blob/master/LICENSE)

### Firebase
- Backend služba od Google, využívaná pro autentizaci, databázi a hosting / Backend service from Google, used for authentication, database, and hosting
- Licence: [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

### 📦 Další Závislosti / Other Dependencies
Uvedené v souboru `package.json` / Listed in the `package.json` file

## 🤝 Podpora / Support
Pro podporu nebo dotazy ohledně projektu kontaktujte některého z autorů. / For support or inquiries about the project, contact any of the authors.

## ©️ Licence
Tento projekt je licencován pod [MIT License](https://opensource.org/licenses/MIT). / This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
