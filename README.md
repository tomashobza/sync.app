# ITU Projekt

## Autoři
- Anastasia Butok
- Tomáš Hobza
- Nikita Koliada

Vytvořeno pro předmět ITU, FIT VUT, 2023

## O Projektu
Tento projekt je webová aplikace vyvinutá v SvelteKit, která integruje služby Firebase pro autentizaci, databázi a hosting.

## Instalace

### Předpoklady
- Node.js (verze 14 nebo novější)
- npm
- Git

### Instalace závislostí
V podadresáři `client`.
```
npm install
```

### Spuštění aplikace v režimu vývoje
V podadresáři `client`.
```
npm run dev
```
Navštivte `http://localhost:5173` v prohlížeči.

> Varování, projekt využívá skutečný backend. Klíč přidám pouze, abych umožnil testování, ovšem výrazně omezím počet požadavků abych zabránil zneužití.

### Build pro produkční nasazení
```
npm run build
```

### Spuštění produkční verze
```
npm run start
```

## Využité Knihovny a Licencování

### SvelteKit
- Web framework pro vývoj aplikací
- Licence: [MIT License](https://github.com/sveltejs/kit/blob/master/LICENSE)

### Firebase
- Backend služba od Google, využívaná pro autentizaci, databázi a hosting
- Licence: [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

### Další Závislosti
Uvedené v souboru `package.json`

## Podpora
Pro podporu nebo dotazy ohledně projektu kontaktujte některého z autorů.

## Licence
Tento projekt je licencován pod [MIT License](https://opensource.org/licenses/MIT).